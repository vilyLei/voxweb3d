
import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDeviece from "../vox/render/RendererDeviece";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import RendererSubScene from "../vox/scene/RendererSubScene";
import DefaultPBRUI from "./mana/DefaultPBRUI";
import DebugFlag from "../vox/debug/DebugFlag";
import PBRScene from "./mana/PBRScene";
import StencilOutline from "../renderingtoy/mcase/outline/StencilOutline";

export class DemoPBR {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_ruisc: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_stencilOutline: StencilOutline = new StencilOutline();
    private m_uiModule: DefaultPBRUI = new DefaultPBRUI();
    
    private m_pbrScene: PBRScene;

    initialize(): void {
        console.log("DemoPBR::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(1500.0, 1500.0, 2000.0);
            rparam.setCamProject(45, 50.0, 10000.0)
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 4);
            this.m_rscene.updateCamera();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);
            this.m_stencilOutline.initialize(this.m_rscene);
            this.m_stencilOutline.setRGB3f(1.0, 0.0, 1.0);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize("rstatus", 300);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(700.0);
            //  this.m_rscene.addEntity(axis, 1);


            this.m_rscene.setClearRGBColor3f(0.2, 0.2, 0.2);

            this.m_uiModule.initialize(this.m_rscene, this.m_texLoader, true);
            this.m_ruisc = this.m_uiModule.ruisc;
            this.m_uiModule.close();

            this.m_pbrScene = new PBRScene();
            this.m_pbrScene.initialize(this.m_rscene, this.m_texLoader, this.m_uiModule);

        }
    }

    private m_runFlag: boolean = true;
    private mouseDown(evt: any): void {
        this.m_runFlag = true;
        DebugFlag.Flag_0 = 1;
    }
    private mouseUp(evt: any): void {
    }
    private update(): void {

        this.m_statusDisp.update(true);
        this.m_pbrScene.update();
    }
    run(): void {
        /*
        if(this.m_runFlag) {
            this.m_runFlag = false;
        }
        else {
            return;
        }
        //*/

        this.update();
        if (this.m_ruisc != null) {

            let stage = this.m_ruisc.getStage3D();
            this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        }
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        //  // current rendering strategy
        //  this.m_rscene.run(true);
        //  if(this.m_ruisc != null) this.m_ruisc.run( true );
        //  DebugFlag.Flag_0 = 0;
        //  return;

        this.renderBegin();

        this.render();

        DebugFlag.Flag_0 = 0;
    }
    private renderBegin(): void {
        let pickFlag: boolean = true;
        if (this.m_ruisc != null) {
            this.m_ruisc.runBegin(true, true);
            this.m_ruisc.update(false, true);
            pickFlag = this.m_ruisc.isRayPickSelected();
        }
        let uiFlag: boolean = this.m_uiModule.isOpen();
        this.m_rscene.runBegin(false);
        // 如果ui panel 打开, 则 this.m_rscene 鼠标事件不会检测到3d物体
        this.m_rscene.setRayTestEanbled(uiFlag);
        this.m_rscene.update(false, !pickFlag);
    }
    private render(): void {

        this.m_rscene.renderBegin();

        this.m_pbrScene.render();

        // ------------------------------------- draw outline begin
        if (this.m_uiModule.isOpen() && this.m_uiModule.getParamEntity() != null) {
            this.m_stencilOutline.setTarget(this.m_uiModule.getParamEntity().entity);
            this.m_stencilOutline.startup();
        }
        else {
            this.m_stencilOutline.quit();
        }
        this.m_stencilOutline.drawBegin();

        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runAt(2);
        this.m_stencilOutline.draw();
        // ------------------------------------- draw outline end

        this.m_rscene.runEnd();

        // render ui
        if (this.m_ruisc != null) {
            this.m_ruisc.renderBegin();
            this.m_ruisc.run(false);
            this.m_ruisc.runEnd();
        }
    }
}
export default DemoPBR;