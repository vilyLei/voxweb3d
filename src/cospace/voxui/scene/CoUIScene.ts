
import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";

import { ICoRScene } from "../../voxengine/ICoRScene";
import EventBase from "../../../vox/event/EventBase";
declare var CoRScene: ICoRScene;

class CoUIScene {
	private m_crscene: ICoRendererScene;
	private m_rstage: IRenderStage3D;
	readonly rscene: IRendererScene;
	constructor() {
	}
	initialize(crscene: ICoRendererScene = null): void {
		if (this.m_crscene == null) {
			this.m_crscene = crscene != null ? crscene : CoRScene.getRendererScene();
			crscene = this.m_crscene;
			let stage = this.m_crscene.getStage3D();

			crscene.addEventListener(EventBase.RESIZE, this, this.resize);
			let rparam = CoRScene.createRendererSceneParam();
			rparam.cameraPerspectiveEnabled = false;
			rparam.setAttriAlpha(false);
			rparam.setCamProject(45.0, 0.1, 3000.0);
			rparam.setCamPosition(0.0, 0.0, 1500.0);

			// let subScene: RendererSubScene = null;
			let subScene = crscene.createSubScene(rparam, 3, true);
			// subScene.initialize(rparam);
			subScene.enableMouseEvent(true);
			let t: any = this;
			t.rscene = subScene;
			
			this.m_rstage = stage;
			let uicamera = this.rscene.getCamera();
			uicamera.translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
			uicamera.update();
		}
	}
	private resize(evt: any): void {
		console.log("CoUIScene::resize()...");
		let stage = this.m_rstage;
		let uicamera = this.rscene.getCamera();
		uicamera.translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
		uicamera.update();
	}
	run(): void {
		if(this.rscene != null) {
			this.rscene.run();
		}
	}
}

export { CoUIScene };
