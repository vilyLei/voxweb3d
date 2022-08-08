import IRendererScene from "../../../vox/scene/IRendererScene";
import CameraDragController from "../../../voxeditor/control/CameraDragController";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";

import IVector3D from "../../../vox/math/IVector3D";
// import CameraViewRay from "../../../vox/view/CameraViewRay";

class MouseInteraction {

    private m_rscene: IRendererScene = null;

    readonly stageDragCtrl: CameraDragController = new CameraDragController();
    readonly cameraZoomController: CameraZoomController = new CameraZoomController();
    zoomLookAtPosition: IVector3D = null;
    zoomMinDistance: number = 30;
    // readonly viewRay: CameraViewRay = new CameraViewRay();

    constructor() { }

    /**
     * 是否启用摄像机用户控制
     */
    cameraCtrlEnabled: boolean = true;

    initialize(rscene: IRendererScene): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;

            // this.viewRay.bindCameraAndStage(rscene.getCamera(), rscene.getStage3D());
            // this.viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

            rscene.enableMouseEvent(true);
            this.stageDragCtrl.initialize(rscene.getStage3D(), rscene.getCamera());
            this.cameraZoomController.bindCamera(rscene.getCamera());
            this.cameraZoomController.initialize(rscene.getStage3D());
            this.cameraZoomController.setLookAtCtrlEnabled(false);
        }
    }

    run(): void {

        if (this.cameraCtrlEnabled) {
            this.cameraZoomController.run( this.zoomLookAtPosition, this.zoomMinDistance );
            this.stageDragCtrl.runWithYAxis();
        }
    }
}

export { MouseInteraction };
