
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import { ViewerCoSApp } from "../../../demo/coViewer/ViewerCoSApp";
import { TransUI } from "../../../edit/demo/edit/ui/TransUI";
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import { NormalEntityGroup } from "./NormalEntityGroup";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";
import { DropModelFileController } from "./DropModelFileController";
import { NormalEntityNode } from "./NormalEntityNode";
import { BoxLine3D } from "../../../edit/entity/BoxLine3D";

class NormalEntityScene {

	private m_uiscene: ICoUIScene = null;
	private m_vcoapp: ViewerCoSApp;
	private m_dropController = new DropModelFileController();

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

		let canvas = (this.rscene as any).getCanvas() as HTMLCanvasElement;

		this.m_dropController.initialize(canvas, this);
	}
	resetScene(): void {

	}
	loadModels(urls: string[], typeNS: string): void {
		if (urls != null && urls.length > 0) {
			for (let i = 0; i < urls.length; ++i) {
				this.loadModel(urls[i], typeNS);
			}
		}
	}
	isDropEnabled(): boolean {
		return true;
	}
	initFileLoad(files: any[]): void {
		console.log("initFileLoad(), files.length: ", files.length);
		let flag: number = 1;
		if (files.length > 0) {
			let name: string = "";
			let urls: string[] = [];
			for (let i = 0; i < files.length; i++) {
				if (i == 0) name = files[i].name;
				const urlObj = window.URL.createObjectURL(files[i]);
				urls.push(urlObj);
			}

			if (name != "") {
				name.toLocaleLowerCase();
				let typeNS = "";
				if (name.indexOf(".ctm") > 1) {
					typeNS = "ctm";
				} else if (name.indexOf(".fbx") > 1) {
					typeNS = "fbx";
				} else if (name.indexOf(".obj") > 1) {
					typeNS = "obj";
				} else {
					flag = 31;
				}
				if (flag == 1) {
					let sc = this;
					sc.resetScene();
					sc.loadModels(urls, typeNS);
				}
			} else {
				flag = 31;
			}
		} else {
			flag = 31;
		}
		this.m_dropController.alertShow(flag);
	}
	private initModel(): void {

		let baseUrl: string = "static/private/";
		let url = baseUrl + "obj/base.obj";
		url = baseUrl + "obj/base4.obj";
		// url = "static/assets/obj/apple_01.obj";
		// url = "static/private/fbx/handbag_err.fbx";
		// url = "static/private/fbx/hat_hasNormal.fbx";
		// url = "static/private/fbx/hat_hasNotNormal.fbx";
		url = "static/private/ctm/errorNormal.ctm";
		console.log("initModel() init...");
		this.loadModel(url);
	}

	private loadModel(url: string, typeNS: string = ""): void {
		console.log("loadModel, url: ", url);

		let ns = typeNS;
		if (typeNS == "") {
			let k0 = url.lastIndexOf(".") + 1;
			let k1 = url.lastIndexOf("?");
			ns = k1 < 0 ? url.slice(k0) : url.slice(k0, k1);
		}
		ns = ns.toLocaleLowerCase();

		let type = CoDataFormat.OBJ;
		switch (ns) {
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

		console.log("XXXXXX createEntityFromUnit, unit: ", unit);

		let entities: ITransformEntity[] = [];
		let len = unit.data.models.length;
		let group = this.nodeGroup;
		group.reset();
		let nodes: NormalEntityNode[] = [];
		for (let i = 0; i < len; ++i) {
			const node = group.addEntityWithModel(unit.data.models[i]);
			if (node != null) {
				nodes.push(node);
				this.m_entities.push(node.entity);
				entities.push(node.entity);
			}
		}
		group.updateLayout(false);

		// let sc = this.rscene;
		for (let i = 0; i < nodes.length; ++i) {
			nodes[i].createNormalLine();
		}
		// for (let i = 0; i < len; ++i) {
		// 	let entity = this.m_entities[i];
		// 	let bounds = entity.getGlobalBounds();
		// 	let boxLine = new BoxLine3D();
		// 	boxLine.initializeWithAABB(sc, 0, bounds);
		// }

		this.transUI.getRecoder().save(entities);
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
