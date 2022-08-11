import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { CoNormalMaterial } from "../../voxengine/material/CoNormalMaterial";
import ViewerMaterialCtx from "../coViewer/ViewerMaterialCtx";
import { ViewerCoSApp } from "./ViewerCoSApp";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

import ICoRenderNode from "../../voxengine/scene/ICoRenderNode";
import IOcclusionPostOutline from "../../../renderingtoy/mcase/outline/IOcclusionPostOutline";
import { IOccPostOutlineModule } from "../../renderEffect/outline/IOccPostOutlineModule";

import { ModuleLoader } from "../../modules/loaders/ModuleLoader";

declare var CoRScene: ICoRScene;
declare var OccPostOutlineModule: IOccPostOutlineModule;

class ViewerSceneNode implements ICoRenderNode {

	private m_rscene: ICoRendererScene;
	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;
	private m_objUnits: CoGeomDataUnit[] = [];
	private m_postOutline: IOcclusionPostOutline;

	private m_scale: number = 1.0;

	constructor(rscene: ICoRendererScene, vmctx: ViewerMaterialCtx, vcoapp: ViewerCoSApp) {
		this.m_rscene = rscene;
		this.m_vmctx = vmctx;
		this.m_vcoapp = vcoapp;

		
		let url = "static/cospace/renderEffect/occPostOutline/OccPostOutlineModule.umd.js";

		new ModuleLoader(1)
			.setCallback((): void => {
				this.m_postOutline = OccPostOutlineModule.create();
				this.initOutline();
			})
			.load(url);
	}
	
	private initOutline(): void {
		this.m_postOutline.initialize(this.m_rscene, 1, [0]);
		this.m_postOutline.setFBOSizeScaleRatio(0.5);
		this.m_postOutline.setRGB3f(0.0, 2.0, 0.0);
		this.m_postOutline.setOutlineDensity(2.5);
		this.m_postOutline.setOcclusionDensity(0.2);
	}
	setScale(scale: number): ViewerSceneNode {
		this.m_scale = scale;
		return this;
	}
	applyMaterial(): ViewerSceneNode {

		let flag: boolean = this.m_vmctx.isMCTXEnabled();
		if (flag) {
			console.log("XXXXXXXXXXXX applyMaterial(), this.m_objUnits.length: ",this.m_objUnits.length);
			for (let i: number = 0; i < this.m_objUnits.length; ++i) {
				let unit = this.m_objUnits.pop();
				this.createEntityFromUnit(unit, 0);
			}
			this.buildBGBox();
			this.buildEnvBox();
		}
		return this;
	}

	loadGeomModel(url: string, format: CoDataFormat): ViewerSceneNode {
		let ins = this.m_vcoapp.coappIns;
		if (ins != null) {

			ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					let flag: boolean = this.m_vmctx.isMCTXEnabled();
					console.log("XXXXXXXXXXXX loadGeomModel(), parsing finish obj model, data: ", unit.data, ", XXXBBB flag: ",flag);

					if (flag) {
						this.createEntityFromUnit(unit, status);
					} else {
						this.m_objUnits.push(unit);
					}
				},
				true
			);
		}
		return this;
	}
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {

		let len = unit.data.models.length;
		let m_scale = this.m_scale;

		for (let i: number = 0; i < len; ++i) {
			let entity = this.createEntity(unit.data.models[i]);
			entity.setScaleXYZ(m_scale, m_scale, m_scale);
		}
	}
	private createEntity2(model: CoGeomDataType): ITransformEntity {
		// let rst = CoRenderer.RendererState;

		let entity: ITransformEntity;
		let flag: boolean = this.m_vmctx.isMCTXEnabled();
		if (flag) {
			let m = this.m_vmctx.pbrModule.createMaterial(true);
			m.initializeByCodeBuf(true);
			entity = CoRScene.createDisplayEntityFromModel(model, m);
		} else {
			entity = CoRScene.createDisplayEntityFromModel(model, new CoNormalMaterial().build().material);
		}

		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_rscene.addEntity(entity);

		// const MouseEvent = CoRScene.MouseEvent;

		return entity;
	}
	
	private createEntity(model: CoGeomDataType): ITransformEntity {
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
		console.log("mouseOverTargetListener() mouse out...");
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
