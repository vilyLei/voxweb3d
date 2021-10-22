
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";

import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import IRendererScene from "../../vox/scene/IRendererScene";
import RendererScene from "../../vox/scene/RendererScene";

import CameraDragController from "../../voxeditor/control/CameraDragController";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import Vector3D from "../../vox/math/Vector3D";
import CameraViewRay from "../../vox/view/CameraViewRay";
import { OrthoUIScene } from "../../vox/ui/OrthoUIScene";

export class EngineBase {

    constructor() { }

    private m_sceneList: IRendererScene[] = [];
    
    readonly texLoader: ImageTextureLoader = null;
    readonly rscene: RendererScene = null;
    readonly uiScene: OrthoUIScene = null;

    readonly stageDragCtrl: CameraDragController = new CameraDragController();
    readonly cameraZoomController: CameraZoomController = new CameraZoomController();
    cameraCtrlEnabled: boolean = true;

    readonly viewRay: CameraViewRay = new CameraViewRay();

    initialize(param: RendererParam = null, renderProcessTotal: number = 3): void {

        if (this.rscene == null) {

            if(param == null) {
                param = new RendererParam();
                param.setAttriAntialias(!RendererDevice.IsMobileWeb());
                param.setCamPosition(1800.0, 1800.0, 1800.0);
                param.setCamProject(45, 20.0, 7000.0);
            }

            let rscene: RendererScene;
            rscene = new RendererScene();
            rscene.initialize(param, renderProcessTotal);
            rscene.updateCamera();

            let selfT: any = this;
            selfT.rscene = rscene;
            selfT.texLoader = new ImageTextureLoader(this.rscene.textureBlock);

            this.viewRay.bindCameraAndStage(this.rscene.getCamera(), this.rscene.getStage3D());
            this.viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

            selfT.uiScene = new OrthoUIScene();
            this.uiScene.initialize( this.rscene );

            this.rscene.enableMouseEvent(true);
            this.cameraZoomController.bindCamera(this.rscene.getCamera());
            this.cameraZoomController.initialize(this.rscene.getStage3D());
            this.stageDragCtrl.initialize(this.rscene.getStage3D(), this.rscene.getCamera());
            this.cameraZoomController.setLookAtCtrlEnabled(false);

            this.m_sceneList.push(this.rscene);
            this.m_sceneList.push(this.uiScene);

        }
    }
    appendRendererScene(): void {

    }

    run(): void {

        if(this.cameraCtrlEnabled) {
            this.stageDragCtrl.runWithYAxis();
            this.cameraZoomController.run(null, 30.0);
        }

        let pickFlag: boolean = true;
        let list = this.m_sceneList;
        let i: number = list.length - 2;

        let scene: IRendererScene = list[i+1];
        scene.runBegin(true, true);
        scene.update(false, true);
        pickFlag = scene.isRayPickSelected();

        for(; i >= 0; --i) {
            scene = list[i];
            scene.runBegin(false, true);
            scene.update(false, !pickFlag);
            pickFlag = pickFlag || this.rscene.isRayPickSelected();
        }
        /////////////////////////////////////////////////////// ---- mouseTest end.


        /////////////////////////////////////////////////////// ---- rendering begin.
        for(i = 0; i < list.length; ++i) {
            scene = list[i];
            scene.renderBegin(true);
            scene.run(false);
            scene.runEnd();
        }
    }


}

export default EngineBase;