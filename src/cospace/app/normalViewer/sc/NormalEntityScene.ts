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
import { NormalEntityManager } from "./NormalEntityManager";
import { BoxLine3D } from "../../../edit/entity/BoxLine3D";
import { NormalExampleGroup } from "./NormalExampleGroup";

class NormalEntityScene {

	private m_uiscene: ICoUIScene = null;
	private m_vcoapp: ViewerCoSApp;
	private m_dropController = new DropModelFileController();
	private m_groups: NormalEntityGroup[] = [];

	ctrPanel: NormalCtrlPanel;
	rscene: IRendererScene;
	transUI: TransUI;
	
	readonly entityManager: NormalEntityManager = new NormalEntityManager();
	readonly exampleGroup: NormalExampleGroup = new NormalExampleGroup();
	constructor(uiscene: ICoUIScene, vcoapp: ViewerCoSApp) {
		this.m_uiscene = uiscene;
		this.m_vcoapp = vcoapp;
	}

	getUIScene(): ICoUIScene {
		return this.m_uiscene;
	}

	initialize(rscene: IRendererScene): void {
		this.rscene = rscene;

		this.entityManager.ctrPanel = this.ctrPanel;
		this.entityManager.transUI = this.transUI;
		this.entityManager.rsc = rscene;
		this.entityManager.initialize();

		this.init();

		this.entityManager.rsc = rscene;
		// for test
		// this.initModel();
		this.exampleGroup.entityManager = this.entityManager;
		this.exampleGroup.initialize(rscene, this.transUI);

		let canvas = (this.rscene as any).getCanvas() as HTMLCanvasElement;
		this.m_dropController.initialize(canvas, this);
	}
	resetScene(): void {
	}
	private initModel(): void {
		let baseUrl: string = "static/private/";
		let url = baseUrl + "obj/base.obj";
		url = baseUrl + "obj/base4.obj";
		url = baseUrl + "fbx/base4.fbx";
		// url = "static/private/fbx/base3.fbx";
		// url = "static/assets/obj/apple_01.obj";
		// url = "static/private/fbx/handbag_err.fbx";
		// url = "static/private/fbx/hat_hasNormal.fbx";
		// url = "static/private/fbx/hat_hasNotNormal.fbx";
		// url = "static/private/ctm/errorNormal.ctm";
		console.log("initModel() init...");
		this.loadModels([url])
	}
	private loadModels(urls: string[], typeNS: string = ""): void {
		
		let group = new NormalEntityGroup(this.m_vcoapp);
		group.rsc = this.rscene;
		group.uiscene = this.m_uiscene;
		group.transUI = this.transUI;
		group.ctrPanel = this.ctrPanel;
		group.entityManager = this.entityManager;
		group.loadModels(urls, typeNS);
		this.m_groups.push(group);

		this.transUI.deselect();
		this.exampleGroup.setEnabled(false);
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
				} else if (name.indexOf(".drc") > 1) {
					typeNS = "drc";
				} else {
					flag = 31;
				}
				if (flag == 1) {
					let sc = this;
					// sc.resetScene();
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
		this.entityManager.destroy();
	}
	update(): void {
	}
}
export { NormalEntityScene };
