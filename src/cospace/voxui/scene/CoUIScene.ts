
import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";

import { IUIEntity } from "../entity/IUIEntity";
import { ICoUIScene } from "./ICoUIScene";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoTexture } from "../../voxtexture/ICoTexture";
declare var CoTexture: ICoTexture;

class CoUIScene implements ICoUIScene {
	private m_crscene: ICoRendererScene;
	private m_rstage: IRenderStage3D;
	readonly rscene: IRendererScene;
	readonly texAtlas: ICanvasTexAtlas = null;
	constructor() {
	}
	initialize(crscene: ICoRendererScene = null): void {
		if (this.m_crscene == null) {
			this.m_crscene = crscene != null ? crscene : CoRScene.getRendererScene();
			crscene = this.m_crscene;
			let stage = this.m_crscene.getStage3D();

			crscene.addEventListener(CoRScene.EventBase.RESIZE, this, this.resize);
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
			t.texAtlas = CoTexture.createCanvasTexAtlas();
			this.texAtlas.initialize(crscene, 1024, 1024, CoMaterial.createColor4(1.0,1.0,1.0,0.0), true);

			this.m_rstage = stage;
			let uicamera = this.rscene.getCamera();
			uicamera.translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
			uicamera.update();
		}
	}
	addEntity(entity: IUIEntity): void {
		this.rscene.addEntity(entity.getREntity());
	}
	removeEntity(entity: IUIEntity): void {
		this.rscene.removeEntity(entity.getREntity());
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