
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import { ViewerCoSApp } from "../../../demo/coViewer/ViewerCoSApp";
import { TransUI } from "../../../edit/demo/edit/ui/TransUI";
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import { NormalEntityGroup } from "./NormalEntityGroup";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";

class NormalEntityScene {

	private m_uiscene: ICoUIScene = null;	
	private m_vcoapp: ViewerCoSApp;

	ctrPanel: NormalCtrlPanel;
	rscene: IRendererScene;
	transUI: TransUI;
	readonly nodeGroup = new NormalEntityGroup();

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
		this.nodeGroup.rsc = this.rscene;
		this.nodeGroup.transUI = this.transUI;
		this.nodeGroup.initialize();
	}
	private initModel(): void {

		let baseUrl: string = "static/private/";
		let url = baseUrl + "obj/base.obj";
		url = baseUrl + "obj/base4.obj";
		url = "static/assets/obj/apple_01.obj";
		// url = baseUrl + "ctm/errorNormal.ctm";
		console.log("initModel() init...");
		this.loadModel( url );
	}
	
	private loadModel(url: string): void {
		let k0 = url.lastIndexOf(".") + 1;
		let k1 = url.lastIndexOf("?");
		let ns = k1 < 0 ? url.slice(k0) : url.slice(k0, k1);
		ns = ns.toLocaleLowerCase();
		let type = CoDataFormat.OBJ;
		switch(ns) {
			case "obj":
				type = CoDataFormat.OBJ;
				break;
			case "fbx":
				type = CoDataFormat.FBX;
				break;
			case "drc":
				type = CoDataFormat.Draco;
				break;
			case "ctm":
				type = CoDataFormat.CTM;
				break;
			default:
				break;
		}
		console.log("NNNNNNNNNNSS: ", ns, type);
		this.loadGeomModel(url, type);
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
	private m_entities: ITransformEntity[] = [];
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {

		let len = unit.data.models.length;
		for (let i = 0; i < len; ++i) {
			let entity = this.nodeGroup.addEntityWithModel( unit.data.models[i] );
			this.m_entities.push(entity);
		}
		this.transUI.getRecoder().save(this.m_entities);
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
