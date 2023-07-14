import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { CoNormalMaterial } from "../../voxengine/material/CoNormalMaterial";
import ViewerMaterialCtx from "../coViewer/ViewerMaterialCtx";
import { ViewerCoSApp } from "./ViewerCoSApp";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

import IRenderNode from "../../../vox/scene/IRenderNode";
import IOcclusionPostOutline from "../../../renderingtoy/mcase/outline/IOcclusionPostOutline";
import { IOccPostOutlineModule } from "../../renderEffect/outline/IOccPostOutlineModule";

import { CoModelTeamLoader } from "../../../cospace/app/common/CoModelTeamLoader";
import { CoEntityLayouter2 } from "../../../cospace/app/common/CoEntityLayouter2";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";

declare var CoRScene: ICoRScene;
declare var OccPostOutlineModule: IOccPostOutlineModule;
class ModelData {
	models: CoGeomDataType[];
	transforms: Float32Array[];
	constructor() {}
}
class ViewerSceneNode implements IRenderNode {

	private m_rscene: IRendererScene;
	private m_vmctx: ViewerMaterialCtx;
	private m_postOutline: IOcclusionPostOutline = null;

	private m_modelLoader = new CoModelTeamLoader();
	protected m_layouter = new CoEntityLayouter2();
	private m_models: ModelData[] = [];

	constructor(rscene: IRendererScene, vmctx: ViewerMaterialCtx) {

		this.m_rscene = rscene;
		this.m_vmctx = vmctx;

		let url = "static/cospace/renderEffect/occPostOutline/OccPostOutlineModule.umd.js";

		new ModuleLoader(1)
			.setCallback((): void => {
				this.m_postOutline = OccPostOutlineModule.create();
				this.initOutline();
			})
			.load(url);
	}

	private initOutline(): void {
		if(this.m_postOutline) {
			this.m_postOutline.initialize(this.m_rscene, 1, [0]);
			this.m_postOutline.setFBOSizeScaleRatio(0.5);
			this.m_postOutline.setRGB3f(0.0, 2.0, 0.0);
			this.m_postOutline.setOutlineDensity(2.5);
			this.m_postOutline.setOcclusionDensity(0.2);
		}
	}

	private m_materialEanbled = false;
	applyMaterial(): ViewerSceneNode {
		this.m_materialEanbled = true;
		this.initScene();
		return this;
	}
	loadGeomModels(urls: string[]): ViewerSceneNode {
		if (this.m_modelLoader == null) {
			this.m_modelLoader = new CoModelTeamLoader();
		}
		const loader = this.m_modelLoader;
		console.log("loadGeomModels(), urls: ", urls);
		loader.load(urls, (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			for (let i = 0; i < models.length; ++i) {
				let md = new ModelData();
				md.models = models;
				md.transforms = transforms;
				this.m_models.push(md);
			}
			this.initScene();
		});
		return this;
	}
	private initScene(): void {
		if (this.m_models.length > 0 && this.m_materialEanbled) {
			this.m_layouter.layoutReset();
			for (let i = 0; i < this.m_models.length; ++i) {
				let model = this.m_models[i];
				let models = model.models;
				let transforms = model.transforms;
				this.createEntity(models[i], transforms != null ? transforms[i] : null, 1.0);
			}
			this.m_layouter.layoutUpdate(200);
			this.buildEnvBox();
		}
	}

	private createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 1.0, url = ""): ITransformEntity {
		// let rst = CoRenderer.RendererState;
		const MouseEvent = CoRScene.MouseEvent;
		// let entity: ITransformEntity;
		// entity = CoRScene.createDisplayEntityFromModel(model, new CoNormalMaterial().build().material);
		let material: IRenderMaterial;// = new CoNormalMaterial().build().material;

		let flag: boolean = this.m_vmctx.isMCTXEnabled();
		if (flag) {
			material = this.m_vmctx.pbrModule.createMaterial(true);
			material.initializeByCodeBuf(true);
			// entity = CoRScene.createDisplayEntityFromModel(model, m);
		} else {
			material = new CoNormalMaterial().build().material;
			// entity = CoRScene.createDisplayEntityFromModel(model, new CoNormalMaterial().build().material);
		}

		let mesh = CoRScene.createDataMeshFromModel(model, material);
		let entity = CoRScene.createMouseEventEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_rscene.addEntity(entity);

		entity.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);

		this.m_layouter.layoutAppendItem(entity, CoRScene.createMat4(transform));
		return entity;
	}
	private buildBGBox(): void {

		let rscene = this.m_rscene;

		let material = this.m_vmctx.pbrModule.createMaterial(true);

		let scale = 700.0;
		let boxEntity = rscene.entityBlock.createEntity();
		boxEntity.setMaterial(material);
		boxEntity.copyMeshFrom(rscene.entityBlock.unitBox);
		boxEntity.setScaleXYZ(scale, scale * 0.05, scale);
		boxEntity.setXYZ(0, -200, 0);
		rscene.addEntity(boxEntity);
	}
	private buildEnvBox(): void {

		const MaterialPipeType = CoRScene.MaterialPipeType;
		const mctx = this.m_vmctx.getMaterialCtx();
		let renderingState = this.m_rscene.getRenderProxy().renderingState;
		let rscene = this.m_rscene;
		let material = CoRScene.createDefaultMaterial();
		material.pipeTypes = [MaterialPipeType.FOG_EXP2];
		material.setMaterialPipeline(mctx.pipeline);
		material.setTextureList([mctx.getTextureByUrl("static/assets/box.jpg")]);
		material.initializeByCodeBuf(true);

		let scale: number = 3000.0;
		let entity = rscene.entityBlock.createEntity();
		entity.setRenderState(renderingState.FRONT_CULLFACE_NORMAL_STATE);
		entity.setMaterial(material);
		entity.copyMeshFrom(rscene.entityBlock.unitBox);
		entity.setScaleXYZ(scale, scale, scale);
		rscene.addEntity(entity, 1);
	}
	private mouseOverTargetListener(evt: any): void {
		console.log("mouseOverTargetListener() mouse over...");
		if (this.m_postOutline != null) {
			if (evt.target != null) {
				this.m_postOutline.setRGB3f(0.0, 1.0, 0.0);
				let targets: IRenderEntity[] = [evt.target];
				this.m_postOutline.setTargetList(targets);
			}
		}
	}
	private mouseOutTargetListener(evt: any): void {
		console.log("mouseOutTargetListener() mouse out...");
		if (this.m_postOutline != null) {
			this.m_postOutline.setTargetList(null);
		}
	}

	render(): void {
		if (this.m_postOutline != null) {
			// console.log("post outline renderNode render() ...");
			this.m_postOutline.drawBegin();
			this.m_postOutline.draw();
			this.m_postOutline.drawEnd();
		}
	}
}

export { ViewerSceneNode }
