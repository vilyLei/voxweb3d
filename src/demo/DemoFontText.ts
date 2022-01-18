
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";

import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import H5FontSystem from "../vox/text/H5FontSys";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import TextBillboard3DEntity from "../vox/text/TextBillboard3DEntity";
import { TextureBlock } from "../vox/texture/TextureBlock";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

import { EntityDispQueue } from "./base/EntityDispQueue";
import CameraBase from "../vox/view/CameraBase";

export class DemoFontText {
    constructor() {
    }
    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_texBlock: TextureBlock;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_equeue: EntityDispQueue = new EntityDispQueue();

    private m_fpsTextBill: TextBillboard3DEntity = null;
    private m_textBill: TextBillboard3DEntity = null;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoFontText::initialize()......");
        if (this.m_rcontext == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            this.m_statusDisp.initialize();
            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(500.0, 500.0, 500.0);
            this.m_renderer = new RendererInstance();
            let stage3D: Stage3D = new Stage3D(this.m_renderer.getRCUid(), document);
            this.m_renderer.__$setStage3D(stage3D);
            this.m_renderer.initialize(rparam, new CameraBase());
            this.m_renderer.appendProcess();
            this.m_renderer.appendProcess();
            this.m_renderer.appendProcess();
            this.m_rcontext = this.m_renderer.getRendererContext();

            H5FontSystem.GetInstance().setRenderProxy(this.m_renderer.getRenderProxy());
            H5FontSystem.GetInstance().initialize("fontTex", 18, 512, 512, true, true);

            this.m_texBlock = new TextureBlock();
            this.m_texBlock.setRenderer(this.m_renderer.getRenderProxy());
            this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
            stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);


            let paxis: Axis3DEntity = new Axis3DEntity();
            paxis.initialize(300.0);
            this.m_renderer.addEntity(paxis, 0);

            let textBill: TextBillboard3DEntity = new TextBillboard3DEntity();
            //textBill.alignLeftCenter();
            textBill.alignCenter();
            textBill.initialize("嗨");
            textBill.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            textBill.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            this.m_renderer.addEntity(textBill, 1);
            this.m_textBill = textBill;

            textBill = new TextBillboard3DEntity();
            textBill.initialize("哇塞");
            textBill.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            this.m_renderer.addEntity(textBill);

            this.m_fpsTextBill = new TextBillboard3DEntity();
            this.m_fpsTextBill.initialize(this.m_statusDisp.getFPSStr());
            this.m_fpsTextBill.setRGB3f(Math.random() + 0.1, Math.random() + 0.1, Math.random() + 0.1);
            //this.m_fpsTextBill.setRGB3f(0.0,1.0,1.0);
            this.m_fpsTextBill.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            this.m_renderer.addEntity(this.m_fpsTextBill);
            this.m_fpsTextBill.__$setRenderProxy(this.m_renderer.getRenderProxy());

        }
    }
    mouseDownListener(evt: any): void {
        this.m_textBill.setText("事情要做好" + "." + Math.round(Math.random() * 100));
        this.m_textBill.updateMeshToGpu(this.m_renderer.getRenderProxy());
        this.m_textBill.update();
    }
    private m_delayTime: number = 40;
    run(): void {
        if (this.m_delayTime < 0) {
            if (this.m_fpsTextBill != null) {
                this.m_fpsTextBill.setRGB3f(Math.random() + 0.1, Math.random() + 0.1, Math.random() + 0.1);
                this.m_fpsTextBill.setText(this.m_statusDisp.getFPSStr() + "." + Math.round(Math.random() * 100));
                this.m_fpsTextBill.updateMeshToGpu();
                this.m_fpsTextBill.update();
            }
            this.m_delayTime = 40.0;
        }
        this.m_delayTime--;

        this.m_equeue.run();
        this.m_statusDisp.update();

        this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
        this.m_rcontext.renderBegin();

        this.m_renderer.update();
        this.m_renderer.run();

        this.m_rcontext.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_rcontext.updateCamera();
    }
}
export default DemoFontText;