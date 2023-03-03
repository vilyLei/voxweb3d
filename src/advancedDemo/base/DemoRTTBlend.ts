
import RendererDevice from "../../vox/render/RendererDevice";
import Color4 from "../../vox/material/Color4";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import RendererParam from "../../vox/scene/RendererParam";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import RendererScene from "../../vox/scene/RendererScene";
import MouseEvent from "../../vox/event/MouseEvent";

import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import ScreenAlignPlaneEntity from "../../vox/entity/ScreenAlignPlaneEntity";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import IMouseEvent from "../../vox/event/IMouseEvent";

export class DemoRTTBlend {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_rct: IRendererInstanceContext = null;
    private m_bill0: Billboard3DEntity = null;
    private m_bill1: Billboard3DEntity = null;
    getImageTexByUrl(pns: string): TextureProxy {
        let tex = this.m_texLoader.getImageTexByUrl("static/assets/" + pns);
        tex.mipmapEnabled = true;
        return tex;
    }
    initialize(): void {
        console.log("DemoRTTBlend::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;

            let rparam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(2500.0, 2500.0, 2500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 6);
            this.m_rscene.setRendererProcessParam(1, true, true);
            this.m_rscene.updateCamera();
            this.m_rct = this.m_rscene.getRendererContext();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
			new MouseInteraction().initialize( this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay( this.m_rscene, true);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            //RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);

            let tex0: TextureProxy = this.getImageTexByUrl("default.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("broken_iron.jpg");
            //let tex2:TextureProxy = this.getImageTexByUrl("flare_core_03.jpg");
            // let tex2: TextureProxy = this.getImageTexByUrl("cloud01.png");
            let tex2: TextureProxy = this.getImageTexByUrl("Effects_Textures_106-1.png");

            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(200.0);
            // this.m_rscene.addEntity(axis);

            let bill: Billboard3DEntity;

            bill = new Billboard3DEntity();
            bill.initialize(900.0, 900.0, [tex2]);
            bill.setRenderStateByName("ADD01");
            bill.setRGB3f(0.3, 0.0, 0.0);
            bill.setXYZ(-300.0, 0.0, 0.0);
            this.m_rscene.addEntity(bill, 0);
            this.m_bill0 = bill;

            bill = new Billboard3DEntity();
            bill.initialize(900.0, 900.0, [tex2]);
            bill.setRenderStateByName("ADD01");
            bill.setRGB3f(0.0, 0.0, 0.3);
            bill.setXYZ(300.0, 0.0, 0.0);
            this.m_rscene.addEntity(bill, 1);
            this.m_bill1 = bill;

            // return;
            const texBlock = this.m_rscene.textureBlock;
            //  let size:number = 700.0;
            //  let rttTexBox:Box3DEntity = new Box3DEntity();
            //  rttTexBox.initialize(new Vector3D(-size,-size,-size),new Vector3D(size,size,size),[this.m_rscene.textureBlock.getRTTTextureAt(3)]);
            //  this.m_rscene.addEntity(rttTexBox,3);
            let scrP = new ScreenAlignPlaneEntity();
            //scrP.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
            scrP.setRenderStateByName("ADD01");//this.m_rscene.textureBlock.g
            scrP.initialize(-1.0, -1.0, 2.0, 2.0, [texBlock.getRTTTextureAt(3)]);
            this.m_rscene.addEntity(scrP, 3);

            let dstP0 = new ScreenAlignPlaneEntity();
            dstP0.setRenderStateByName("ADD01");
            dstP0.initialize(-1.0, -1.0, 2.0, 2.0, [texBlock.getRTTTextureAt(0)]);
            this.m_rscene.addEntity(dstP0, 4);
            let dstP1 = new ScreenAlignPlaneEntity();
            dstP1.setRenderStateByName("ADD01");
            dstP1.initialize(-1.0, -1.0, 2.0, 2.0, [texBlock.getRTTTextureAt(1)]);
            this.m_rscene.addEntity(dstP1, 4);
        }
    }
    private m_bgColor = new Color4(0.0, 0.3, 0.1);
    mouseDownListener(evt: IMouseEvent): void {
        this.m_bgColor.setRGB3f(0.4 * Math.random(), 0.4 * Math.random(), 0.4 * Math.random());
    }

    // run(): void {
    //     this.m_rscene.run();
    // }
    run(): void {
        
        const texBlock = this.m_rscene.textureBlock;

        this.m_rscene.runBegin();
        this.m_rscene.update();
        // --------------------------------------------- rtt begin
        this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
        //
        this.m_rct.synFBOSizeWithViewport();
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);

        //  this.m_rct.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(3), true, false, 0);
        //  this.m_rct.useFBO(true, true, false);
        //  this.m_rscene.runAt(0);
        //  this.m_rscene.runAt(1);

        this.m_bill0.setXYZ(-300.0, 0.0, 0.0).update();
        this.m_bill1.setXYZ(300.0, 0.0, 0.0).update();

        //  this.m_rct.setRenderToTexture(texBlock.getRTTTextureAt(0), true, false, 0);
        //  this.m_rct.useFBO(true, true, false);
        //  this.m_rscene.runAt(0);
        //  this.m_rct.setRenderToTexture(texBlock.getRTTTextureAt(1), true, false, 0);
        //  this.m_rct.useFBO(true, true, false);
        //  this.m_rscene.runAt(1);
        ///*
        let total = 10;
        for (let i = 0; i < total; ++i) {

            this.m_bill0.setXYZ(-300.0, 0.0, i * 60.0).update();
            this.m_bill1.setXYZ(300.0, 0.0, i * 60.0).update();
            this.m_rct.setRenderToTexture(texBlock.getRTTTextureAt(0), true, false, 0);
            this.m_rct.useFBO(true, true, false);
            this.m_rscene.runAt(0);
            this.m_rct.setRenderToTexture(texBlock.getRTTTextureAt(1), true, false, 0);
            this.m_rct.useFBO(true, true, false);
            this.m_rscene.runAt(1);

            this.m_rct.setRenderToTexture(texBlock.getRTTTextureAt(3), true, false, 0);
            this.m_rct.useFBO(i < 1, false, false);
            this.m_rscene.runAt(4);
            this.m_rscene.runAt(5);
        }
        //*/
        // --------------------------------------------- rtt end

        this.m_rscene.setClearRGBAColor4f(0.7, 0.9, 0.7, 1.0);
        this.m_rscene.setRenderToBackBuffer();
        this.m_rscene.runAt(3);
        this.m_rscene.runEnd();
    }
}
export default DemoRTTBlend;