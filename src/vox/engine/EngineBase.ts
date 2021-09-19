
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
    readonly rscene: RendererScene = null;//new RendererScene();
    readonly uiScene: OrthoUIScene = new OrthoUIScene();

    stageDragCtrl: CameraDragController = new CameraDragController();
    cameraZoomController: CameraZoomController = new CameraZoomController();

    viewRay: CameraViewRay = new CameraViewRay();

    initialize(param: RendererParam = null): void {

        console.log("EngineBase::initialize()......");

        if (this.rscene == null) {

            if(param == null) {
                param = new RendererParam();
                param.setAttriAntialias(!RendererDevice.IsMobileWeb());
                param.setCamPosition(1800.0, 1800.0, 1800.0);
                param.setCamProject(45, 20.0, 7000.0);
            }

            let rscene: RendererScene;
            rscene = new RendererScene();
            rscene.initialize(param, 3);
            rscene.updateCamera();

            let selfT: any = this;
            selfT.rscene = rscene;
            selfT.texLoader = new ImageTextureLoader(this.rscene.textureBlock);

            this.viewRay.bindCameraAndStage(this.rscene.getCamera(), this.rscene.getStage3D());
            this.viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

            this.uiScene.initialize( this.rscene );

            this.rscene.enableMouseEvent(true);
            this.cameraZoomController.bindCamera(this.rscene.getCamera());
            this.cameraZoomController.initialize(this.rscene.getStage3D());
            this.stageDragCtrl.initialize(this.rscene.getStage3D(), this.rscene.getCamera());
            this.cameraZoomController.setLookAtCtrlEnabled(false);

        }
    }

    run(): void {
        
        this.stageDragCtrl.runWithYAxis();
        this.cameraZoomController.run(null, 30.0);

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