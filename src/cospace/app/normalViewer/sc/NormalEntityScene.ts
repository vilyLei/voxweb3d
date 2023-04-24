import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { CoDataModule } from "../../../app/common/CoDataModule";
import { NVTransUI } from "../ui/NVTransUI";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import { NormalEntityGroup } from "./NormalEntityGroup";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";
import { NormalEntityManager } from "./NormalEntityManager";
import { NormalExampleGroup } from "./NormalExampleGroup";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "../../../../tool/base/DropFileController";
import IRenderEntity from "../../../../vox/render/IRenderEntity";

class NormalEntityScene {

	private m_uiscene: ICoUIScene = null;
	private m_coapp: CoDataModule;
	private m_dropController = new DropFileController();
	private m_groups: NormalEntityGroup[] = [];

	ctrPanel: NormalCtrlPanel;
	rscene: IRendererScene;
	transUI: NVTransUI;

	readonly entityManager = new NormalEntityManager();
	readonly exampleGroup = new NormalExampleGroup();
	constructor(uiscene: ICoUIScene, vcoapp: CoDataModule) {
		this.m_uiscene = uiscene;
		this.m_coapp = vcoapp;
	}

	getUIScene(): ICoUIScene {
		return this.m_uiscene;
	}

	openDir(): void {
		const input = document.createElement("input");
		input.type = "file";
		// input.accept = "image/png, image/jpeg";
		input.addEventListener("change", () => {
			let files = Array.from(input.files);
			this.m_dropController.initFilesLoad(files);
		});
		input.click();
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
		this.m_dropController.initialize(document.body, this);
	}
	resetScene(): void {
	}
	private initModel(): void {
		let baseUrl: string = "static/private/";
		let url = baseUrl + "obj/base.obj";
		url = baseUrl + "obj/base4.obj";
		url = baseUrl + "fbx/base4.fbx";
		url = baseUrl + "fbx/hat_ok.fbx";
		// url = "static/private/fbx/base3.fbx";
		// url = "static/assets/obj/apple_01.obj";
		// url = "static/private/fbx/handbag_err.fbx";
		// url = "static/private/fbx/hat_hasNormal.fbx";
		// url = "static/private/fbx/hat_hasNotNormal.fbx";
		// url = "static/private/ctm/errorNormal.ctm";
		console.log("initModel() init...");
		this.loadModels([url])
	}
	private loadModels(urls: string[], typeList: string[] = null): void {

		let group = new NormalEntityGroup(this.m_coapp);
		group.rsc = this.rscene;
		group.uiscene = this.m_uiscene;
		group.transUI = this.transUI;
		group.ctrPanel = this.ctrPanel;
		group.entityManager = this.entityManager;
		group.loadModels(urls, typeList);
		this.m_groups.push(group);

		this.transUI.deselect();
		this.exampleGroup.setEnabled(false);
	}
	getAllEntities(): IRenderEntity[] {
		let gs = this.m_groups;
		let entities: IRenderEntity[] = [];
		for(let i = 0; i < gs.length; ++i) {
			entities = entities.concat(gs[i].getAllEntities());
		}
		entities = entities.concat(this.exampleGroup.getAllEntities());
		return entities;
	}
	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		console.log("initFileLoad(), files: ", files);
		let urls: string[] = [];
		let types: string[] = [];
		for (let i = 0; i < files.length; ++i) {
			if (files[i].resType == DropFileController.Geometry_Model_File) {
				// console.log("files[i]: ", files[i].url, files[i].type);
				// this.loadModels(urls, typeNS);
				// this.loadedRes(files[i].url, files[i].name);
				// break;
				urls.push(files[i].url);
				types.push(files[i].type);
			}
		}
		if(urls.length > 0) {
			this.loadModels(urls, types);
		}
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
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
