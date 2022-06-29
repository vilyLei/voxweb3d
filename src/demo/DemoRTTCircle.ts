
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import RendererState from "../vox/render/RendererState";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import RttCircleMaterial from "../demo/material/RttCircleMaterial";

export class DemoRTTCircle {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_rttCirM: RttCircleMaterial = null;
    //
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoRTTCircle::initialize()......");
        if (this.m_rcontext == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(500.0, 500.0, 500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            this.m_statusDisp.initialize();

            let bg: ScreenFixedAlignPlaneEntity = new ScreenFixedAlignPlaneEntity();
            bg.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            bg.initialize(-1.0, -1.0, 2.0, 2.0, [tex0]);
            bg.setUVScale(8, 8);
            bg.setRGB3f(0.2, 0.1, 0.2);
            this.m_rscene.addEntity(bg);
            // add common 3d display entity
            var plane: Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
            this.m_rscene.addEntity(plane, 1);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis, 1);

            let box: Box3DEntity = new Box3DEntity();
            box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            this.m_rscene.addEntity(box, 1);
            //// add rtt texture 3d display entity
            //let boxRtt:Box3DEntity = new Box3DEntity();
            //boxRtt.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[this.m_rscene.textureBlock.getRTTTextureAt(0)]);
            //this.m_rscene.addEntity(boxRtt, 1);
            let rttCirM: RttCircleMaterial = new RttCircleMaterial();
            this.m_rttCirM = rttCirM;
            rttCirM.setRaius(100.0);
            rttCirM.setPosXY(500.0, 300.0);
            //let dpr:number = RendererDevice.GetDevicePixelRatio();
            //rttCirM.setStageSize(this.m_rscene.getStage3D().stageWidth * dpr, this.m_rscene.getStage3D().stageHeight * dpr);
            rttCirM.setStageSize(this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);
            let scrPlane: Plane3DEntity = new Plane3DEntity();
            scrPlane.setMaterial(rttCirM);
            scrPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            //scrPlane.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
            scrPlane.initializeXOY(-1.0, -1.0, 2.0, 2.0, [this.m_rscene.textureBlock.getRTTTextureAt(0)]);
            this.m_rscene.addEntity(scrPlane, 2);
        }
    }
    private m_boo: boolean = false;
    private m_fixPos: Vector3D = new Vector3D();
    private m_currPos: Vector3D = new Vector3D();
    private m_offsetPv: Vector3D = new Vector3D();
    private m_mousePv: Vector3D = new Vector3D();
    private m_mousePrePv: Vector3D = new Vector3D();
    private m_mouseDelay: number = -1;
    private m_alpha: number = 1.0;
    run(): void {
        this.m_mousePv.x = this.m_rscene.getStage3D().mouseX;
        this.m_mousePv.y = this.m_rscene.getStage3D().mouseY;
        this.m_rttCirM.setPosXY(this.m_mousePv.x, this.m_mousePv.y);
        let pcontext: RendererInstanceContext = this.m_rcontext;
        // show fps status
        this.m_statusDisp.update();

        this.m_rscene.setClearRGBColor3f(0.2, 0.3, 0.0);
        // render begin
        this.m_rscene.runBegin();
        //
        if (this.m_boo) {
            //this.m_rscene.getCamera().setPosition( this.m_fixPos );
            this.m_rscene.getCamera().translation(this.m_fixPos);
            this.m_rscene.getCamera().update();
            let k: number = 0.7;
            this.m_offsetPv.x = k * (this.m_rscene.getStage3D().mouseX - this.m_rscene.getStage3D().stageHalfWidth);
            this.m_offsetPv.y = k * (this.m_rscene.getStage3D().mouseY - this.m_rscene.getStage3D().stageHalfHeight);
            this.m_offsetPv.z = 0.0;
            this.m_offsetPv.w = 1.0;

            this.m_rscene.getCamera().getViewInvMatrix().transformVector3Self(this.m_offsetPv);

            this.m_rscene.getCamera().translation(this.m_offsetPv);
            this.m_rscene.getCamera().update();

            this.m_mousePrePv.subtractBy(this.m_mousePv);

            if (this.m_mousePrePv.getLengthSquared() > 3.0) {
                this.m_alpha = 0.4;
                this.m_rttCirM.setAlpha(this.m_alpha);
                this.m_mouseDelay = 45;
            }
            this.m_mousePrePv.copyFrom(this.m_mousePv);
        }
        else {
            this.m_boo = true;
            this.m_fixPos.copyFrom(this.m_rscene.getCamera().getPosition());
        }
        if (this.m_mouseDelay > 0) {
            this.m_mouseDelay--;
            if (this.m_mouseDelay == 0) {
                //console.log("XXXX this.m_mouseDelay: "+this.m_mouseDelay);
                this.m_mouseDelay = -1;
            }
        }
        else {
            if (this.m_alpha < 1.0) {
                this.m_alpha += 0.01;
                if (this.m_alpha > 1.0) {
                    this.m_alpha = 1.0;
                }
            }
            this.m_rttCirM.setAlpha(this.m_alpha);
        }
        // run logic program
        this.m_rscene.update();
        // --------------------------------------------- rtt begin
        pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
        pcontext.synFBOSizeWithViewport();
        pcontext.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(0), true, false, 0);
        pcontext.useFBO(true, true, false);
        this.m_rscene.getCamera().forward(+380);

        this.m_rscene.getCamera().update();
        // to be rendering in framebuffer
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        // --------------------------------------------- rtt end
        pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
        pcontext.setRenderToBackBuffer();

        this.m_rscene.getCamera().translation(this.m_fixPos);
        this.m_rscene.getCamera().update();
        this.m_rscene.getCamera().forward(-380);
        this.m_rscene.getCamera().update();
        // to be rendering in backbuffer
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runAt(2);
        // render end
        this.m_rscene.runEnd();

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoRTTCircle;