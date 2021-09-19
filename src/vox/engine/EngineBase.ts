
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";

import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";

import CameraDragController from "../../voxeditor/control/CameraDragController";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";
import Vector3D from "../../vox/math/Vector3D";
import CameraViewRay from "../../vox/view/CameraViewRay";
import { OrthoUIScene } from "../../vox/ui/OrthoUIScene";

export class EngineBase {

    constructor() { }

    readonly texLoader: ImageTextureLoader = null;
    readonly rscene: RendererScene = new RendererScene();
    readonly uiScene: OrthoUIScene = new OrthoUIScene();

    private m_stageDragCtrl: CameraDragController = new CameraDragController();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    viewRay: CameraViewRay = new CameraViewRay();

    initialize(): void {

        console.log("EngineBase::initialize()......");

        if (this.rscene == null) {

            //DivLog.SetDebugEnabled( true );
            //RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            //RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            rparam.setCamProject(45, 20.0, 7000.0);
            let scene: RendererScene;
            scene = new RendererScene();
            scene.initialize(rparam, 3);
            scene.updateCamera();

            let selfT: any = this;
            selfT.texLoader = new ImageTextureLoader(this.rscene.textureBlock);

            //this.rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            //this.rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);

            this.viewRay.bindCameraAndStage(this.rscene.getCamera(), this.rscene.getStage3D());
            this.viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

            this.uiScene.initialize( this.rscene );

            this.rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.rscene.getCamera());
            this.m_cameraZoomController.initialize(this.rscene.getStage3D());
            this.m_stageDragCtrl.initialize(this.rscene.getStage3D(), this.rscene.getCamera());
            this.m_cameraZoomController.setLookAtCtrlEnabled(false);

        }
    }

    run(): void {
        
        this.m_stageDragCtrl.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);

        let pickFlag: boolean = true;
        
        this.uiScene.runBegin(true, true);
        this.uiScene.update(false, true);
        pickFlag = this.uiScene.isRayPickSelected();

        this.rscene.runBegin(false);
        this.rscene.update(false, !pickFlag);
        pickFlag = pickFlag || this.rscene.isRayPickSelected();

        /////////////////////////////////////////////////////// ---- mouseTest end.


        /////////////////////////////////////////////////////// ---- rendering begin.
        this.rscene.renderBegin();
        this.rscene.run(false);
        this.rscene.runEnd();

        this.uiScene.renderBegin();
        this.uiScene.run(false);
        this.uiScene.runEnd();        
    }


}

export default EngineBase;