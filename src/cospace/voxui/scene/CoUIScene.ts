
import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";

import { IUIEntity } from "../entity/IUIEntity";
import { ICoUIScene } from "./ICoUIScene";
import { IPromptSystem } from "../system/IPromptSystem";
import { ITipsSystem } from "../system/ITipsSystem";
import {IUIConfig} from "../system/IUIConfig";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoTexture } from "../../voxtexture/ICoTexture";
import { UILayout } from "../layout/UILayout";
import IAABB2D from "../../../vox/geom/IAABB2D";
declare var CoTexture: ICoTexture;

class CoUIScene implements ICoUIScene {
	private m_crscene: IRendererScene;
	private m_rstage: IRenderStage3D;
	private m_stageRect: IAABB2D;
	
	readonly rscene: IRendererScene;
	readonly texAtlas: ICanvasTexAtlas = null;
	readonly transparentTexAtlas: ICanvasTexAtlas = null;
	readonly layout = new UILayout();

	prompt: IPromptSystem = null;
	tips: ITipsSystem = null;
	uiConfig: IUIConfig = null;

	texAtlasNearestFilter = true;
	constructor() {
	}
	/**
	 * @param crscene the default value is null
	 * @param atlasSize the default value is 1024
	 * @param renderProcessesTotal the default value is 3
	 */
	initialize(crscene: IRendererScene = null, atlasSize: number = 1024, renderProcessesTotal: number = 3): void {
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

			let subScene = crscene.createSubScene(rparam, renderProcessesTotal, true);
			subScene.enableMouseEvent(true);
			let t: any = this;
			t.rscene = subScene;
			let t0 = t.texAtlas = CoTexture.createCanvasTexAtlas();
			let t1 = t.transparentTexAtlas = CoTexture.createCanvasTexAtlas();

			t0.initialize(crscene, atlasSize, atlasSize, CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0), false, this.texAtlasNearestFilter);
			t0.getTexture().premultiplyAlpha = false;
			t1.initialize(crscene, atlasSize, atlasSize, CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0), true, this.texAtlasNearestFilter);
			t1.getTexture().premultiplyAlpha = true;

			this.m_rstage = stage;
			let uicamera = this.rscene.getCamera();
			uicamera.translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
			uicamera.update();
			let st = this.getStage();
			this.m_stageRect = CoMath.createAABB2D(0, 0, st.stageWidth, st.stageHeight);
			this.layout.initialize(this.m_stageRect);
		}
	}
	
	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): ICoUIScene {
		this.m_rstage.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
		return this;
	}
	removeEventListener(type: number, listener: any, func: (evt: any) => void): ICoUIScene {
		this.m_rstage.removeEventListener(type, listener, func);
		return this;
	}
	getStage(): IRenderStage3D {
		return this.rscene.getStage3D();
	}
	addEntity(entity: IUIEntity, processid: number = 0): void {
		if (entity != null) {
			entity.__$setScene( this );
			entity.update();
			let container = entity.getRContainer();
			if (container != null) {
				this.rscene.addContainer(container, processid);
			}
			let ls = entity.getREntities();
			for (let i = 0; i < ls.length; ++i) {
				this.rscene.addEntity(ls[i], processid, true);
			}
		}
	}
	removeEntity(entity: IUIEntity): void {
		if (entity != null) {
			let sc = this.rscene;
			let container = entity.getRContainer();
			if (container != null) {
				sc.removeContainer(container);
			}
			let ls = entity.getREntities();
			for (let i = 0; i < ls.length; ++i) {
				sc.removeEntity(ls[i]);
			}
			entity.__$setScene( null );
		}
	}
	getRect(): IAABB2D {
		return this.m_stageRect;
	}
	private resize(evt: any): void {
		
		let st = this.m_rstage;
		let uicamera = this.rscene.getCamera();
		uicamera.translationXYZ(st.stageHalfWidth, st.stageHalfHeight, 1500.0);
		uicamera.update();

		this.m_stageRect.setTo(0, 0, st.stageWidth, st.stageHeight);
		this.layout.update( this.m_stageRect );
	}
	run(): void {
		if (this.rscene != null) {
			this.rscene.run();
		}
	}
}

export { CoUIScene };
