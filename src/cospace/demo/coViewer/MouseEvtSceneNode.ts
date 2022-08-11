import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IMouseEventEntity from "../../../vox/entity/IMouseEventEntity";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { CoNormalMaterial } from "../../voxengine/material/CoNormalMaterial";
import { ViewerCoSApp } from "./ViewerCoSApp";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

declare var CoRScene: ICoRScene;

class MouseEvtSceneNode {

	private m_rscene: ICoRendererScene;
	private m_vcoapp: ViewerCoSApp;

	private m_scale: number = 1.0;

	constructor(rscene: ICoRendererScene, vcoapp: ViewerCoSApp) {
		this.m_rscene = rscene;
		this.m_vcoapp = vcoapp;
	}
	setScale(scale: number): MouseEvtSceneNode {
		this.m_scale = scale;
		return this;
	}
	// applyMaterial(): MouseEvtSceneNode {

	// 	let flag: boolean = this.m_vmctx.isMCTXEnabled();
	// 	if (flag) {
	// 		console.log("XXXXXXXXXXXX applyMaterial(), this.m_objUnits.length: ",this.m_objUnits.length);
	// 		for (let i: number = 0; i < this.m_objUnits.length; ++i) {
	// 			let unit = this.m_objUnits.pop();
	// 			this.createEntityFromUnit(unit, 0);
	// 		}
	// 	}
	// 	return this;
	// }

	loadGeomModel(url: string, format: CoDataFormat): MouseEvtSceneNode {
		let ins = this.m_vcoapp.coappIns;
		if (ins != null) {

			ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					this.createEntityFromUnit(unit, status);
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
	private createEntity(model: CoGeomDataType): ITransformEntity {
		// let rst = CoRenderer.RendererState;
		const MouseEvent = CoRScene.MouseEvent;
		// let entity: ITransformEntity;
		// entity = CoRScene.createDisplayEntityFromModel(model, new CoNormalMaterial().build().material);
		let material = new CoNormalMaterial().build().material;
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

    private mouseOverTargetListener(evt: any): void {
        console.log("mouseOverTargetListener() mouse out...");
    }
    private mouseOutTargetListener(evt: any): void {
        console.log("mouseOutTargetListener() mouse out...");
        // this.m_postOutline.setTargetList( null );
    }
}

export { MouseEvtSceneNode }
