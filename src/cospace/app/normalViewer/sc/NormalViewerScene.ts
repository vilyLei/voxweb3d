import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ICoUI } from "../../../voxui/ICoUI";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";
import { NormalEntityScene } from "./NormalEntityScene";
import { CoDataModule } from "../../../app/common/CoDataModule";
import { NormalEntityManager } from "./NormalEntityManager";
import { NVTransUI } from "../ui/NVTransUI";

declare var CoUI: ICoUI;

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalViewerScene {

	private m_uiscene: ICoUIScene = null;
	private m_ctrPanel: NormalCtrlPanel = null;
	private m_transUI: NVTransUI = null;
	private m_entityManager: NormalEntityManager;
	entityScene: NormalEntityScene;
	private m_coapp: CoDataModule;

	constructor() { }

	getUIScene(): ICoUIScene {
		return this.m_uiscene;
	}

	initialize(uiscene: ICoUIScene, coapp: CoDataModule, transUI: NVTransUI): void {

		if (this.m_uiscene == null) {
			this.m_uiscene = uiscene;
			this.m_coapp = coapp;
			this.m_transUI = transUI;

			this.entityScene = new NormalEntityScene(uiscene, coapp);
			this.m_entityManager = this.entityScene.entityManager;
			this.initUI();
			this.entityScene.transUI = transUI;

		}
	}
	protected initUI(): void {

		let panel = new NormalCtrlPanel();
		panel.initialize(this.m_uiscene, 0, 310, 390, 90, 50);
		panel.setBGColor(CoMaterial.createColor4(0.2, 0.2, 0.2));
		
		panel.addEventListener(CoRScene.SelectionEvent.SELECT, this, this.selectDisplay);
		panel.addEventListener(CoRScene.ProgressDataEvent.PROGRESS, this, this.normalScale);

		this.m_ctrPanel = panel;
		this.entityScene.ctrPanel = panel;
	}
	private selectDisplay(evt: any): void {

		console.log("NormalViewerScene::selectDisplay(), evt.uuid: ", evt.uuid);
		let mana = this.m_entityManager;
		let uuid = evt.uuid;
		switch (uuid) {
			case "normal":
			case "model":
			case "difference":
			case "normalFlip":
				// console.log("flag call");
				mana.applyCtrlFlag(uuid, evt.flag);
				break;
			case "local":
			case "global":
			case "modelColor":
				// console.log("select call");
				mana.applyFeatureColor(uuid);
				break;
			case "normalScaleBtnSelect":
				console.log("XXXX normalScaleBtnSelect");
				mana.normalScaleBtnSelect();
				break;
			case "normalLineColor":
				console.log("appaly normal color");
				break;
			case "normalTest":
				this.m_uiscene.prompt.showPrompt("It can't be used now!");
				console.log("appaly normal data feature test");
				break;
			default:
				break;
		}
	}
	private normalScale(evt: any): void {
		// console.log("NormalViewerScene::normalScale(), evt.uuid: ", evt.uuid, evt.progress);
		// console.log("NormalViewerScene::normalScale(), evt.progress: ", evt.progress);
		let mana = this.m_entityManager;
		mana.applyNormalScale(evt.progress);
	}

	destroy(): void {

		this.m_uiscene = null;

		if (this.m_ctrPanel != null) {

			this.m_ctrPanel.destroy();
			this.m_ctrPanel = null;

			this.entityScene.destroy();
			this.entityScene = null;
		}
	}
	open(scene: ICoUIScene = null): void {
		if (this.m_ctrPanel != null) {
			this.m_ctrPanel.open();
		}
	}
	isOpen(): boolean {
		return true;
	}
	close(): void {
		if (this.m_ctrPanel != null) {
			this.m_ctrPanel.close();
		}
	}
	update(): void {
	}
}
export { NormalViewerScene };
