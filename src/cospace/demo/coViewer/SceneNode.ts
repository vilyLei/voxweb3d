import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import { ICoDisplayEntity } from "../../voxengine/entity/ICoDisplayEntity";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { CoNormalMaterial } from "../../voxengine/material/CoNormalMaterial";
import ViewerMaterialCtx from "../coViewer/ViewerMaterialCtx";
import { ViewerCoSApp } from "./ViewerCoSApp";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

declare var CoRScene: ICoRScene;
/**
 * cospace renderer
 */
class SceneNode {

	private m_rscene: ICoRendererScene;
	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;
	private m_objUnits: CoGeomDataUnit[] = [];

	private m_scale: number = 1.0;

	constructor(rscene: ICoRendererScene, vmctx: ViewerMaterialCtx, vcoapp: ViewerCoSApp) {
		this.m_rscene = rscene;
		this.m_vmctx = vmctx;
		this.m_vcoapp = vcoapp;
	}
	setScale(scale: number): SceneNode {
		this.m_scale = scale;
		return this;
	}
	applyMaterial(): SceneNode {

		let flag: boolean = this.m_vmctx.isMCTXEnabled();
		if(flag) {
			for (let i: number = 0; i < this.m_objUnits.length; ++i) {
				let unit = this.m_objUnits.pop();
				this.createEntityFromUnit(unit, 0);
			}
		}
		return this;
	}

	loadGeomModel(url: string, format: CoDataFormat): SceneNode {
		let ins = this.m_vcoapp.coappIns;
		if (ins != null) {

			ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					console.log("parsing finish obj model, data: ", unit.data);

					let flag: boolean = this.m_vmctx.isMCTXEnabled();
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
	private createEntity(model: CoGeomDataType): ICoDisplayEntity {
		// let rst = CoRenderer.RendererState;

		let flag: boolean = this.m_vmctx.isMCTXEnabled();
		let entity: ICoDisplayEntity;
		if (flag) {
			let m = this.m_vmctx.pbrModule.createMaterial(true);
			m.initializeByCodeBuf(true);
			entity = CoRScene.createDisplayEntityFromModel(model, m);
		} else {
			entity = CoRScene.createDisplayEntityFromModel(model, new CoNormalMaterial().build().material);
		}

		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_rscene.addEntity(entity);
		return entity;
	}
}

export { SceneNode }