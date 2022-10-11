import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ICoUI } from "../../../voxui/ICoUI";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import { ViewerCoSApp } from "../../../demo/coViewer/ViewerCoSApp";
import { TransUI } from "../../../edit/demo/edit/ui/TransUI";
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import IColorMaterial from "../../../../vox/material/mcase/IColorMaterial";

declare var CoUI: ICoUI;

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalEntityScene {

	private m_uiscene: ICoUIScene = null;	
	private m_vcoapp: ViewerCoSApp;

	rscene: IRendererScene;
	transUI: TransUI;
	constructor(uiscene: ICoUIScene, vcoapp: ViewerCoSApp) {
		this.m_uiscene = uiscene;
		this.m_vcoapp = vcoapp;
		
	}

	getUIScene(): ICoUIScene {
		return this.m_uiscene;
	}

	initialize(): void {
		
		this.init();
		this.initModel();
	}
	private m_scale = 20.0;
	private initModel(): void {

		// this.m_viewer.open();

		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";
		console.log("initModel() init...");
		this.loadGeomModel(url, CoDataFormat.OBJ);
	}

	private loadGeomModel(url: string, format: CoDataFormat): void {
		
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
	}
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {

		let len = unit.data.models.length;
		let m_scale = this.m_scale;
		for (let i = 0; i < len; ++i) {
			let entity = this.createEntity(unit.data.models[i]);
			entity.setScaleXYZ(m_scale, m_scale, m_scale);
		}

		// this.m_recoder.save(this.m_entities);
		this.transUI.getRecoder().save(this.m_entities);
	}
	private m_entities: ITransformEntity[] = [];
	private createEntity(model: CoGeomDataType): ITransformEntity {
		// let rst = CoRenderer.RendererState;

		const MouseEvent = CoRScene.MouseEvent;
		// let material = new CoNormalMaterial().build().material;
		let material = CoRScene.createDefaultMaterial(true);
		material.initializeByCodeBuf(false);
		material.setRGB3f(0.7, 0.7, 0.7);

		let mesh = CoRScene.createDataMeshFromModel(model, material);
		let cv = mesh.bounds.center.clone();
		let vs = model.vertices;
		let tot = vs.length;
		for (let i = 0; i < tot;) {
			vs[i++] -= cv.x;
			vs[i++] -= cv.y;
			vs[i++] -= cv.z;
		}
		cv.scaleBy(this.m_scale);
		mesh = CoRScene.createDataMeshFromModel(model, material);
		let entity = CoRScene.createMouseEventEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setPosition(cv);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		
		this.rscene.addEntity(entity);

		entity.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpTargetListener);

		this.m_entities.push(entity);
		return entity;
	}

	private mouseOverTargetListener(evt: any): void {
		console.log("mouseOverTargetListener()..., evt.target: ", evt.target);
		let entity = evt.target as ITransformEntity;
		let material = entity.getMaterial() as IColorMaterial;
		material.setRGB3f(0.8, 0.8, 0.8);
	}
	private mouseOutTargetListener(evt: any): void {
		console.log("mouseOutTargetListener()..., evt.target: ", evt.target);
		let entity = evt.target as ITransformEntity;
		let material = entity.getMaterial() as IColorMaterial;
		material.setRGB3f(0.7, 0.7, 0.7);
	}
	private mouseDownTargetListener(evt: any): void {
		console.log("mouseDownTargetListener()..., evt.target: ", evt.target);
		let entity = evt.target as ITransformEntity;
		// this.selectEntities([entity]);
		this.transUI.selectEntities([entity]);
	}
	private mouseUpTargetListener(evt: any): void {
		console.log("mouseUpTargetListener() mouse up...");
		// if (this.m_transCtr != null) {
		// 	this.m_transCtr.enable(this.m_ctrlType);
		// }
	}

	protected init(): void {
	}
	open(): void {
	}
	isOpen(): boolean {
		return true;
	}
	close(): void {
	}
	
	destroy(): void {
	}
	update(): void {
	}
}
export { NormalEntityScene };
