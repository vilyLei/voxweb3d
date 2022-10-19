import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ICoUI } from "../../../voxui/ICoUI";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";
import { NormalEntityScene } from "./NormalEntityScene";
import { ViewerCoSApp } from "../../../demo/coViewer/ViewerCoSApp";

declare var CoUI: ICoUI;

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalViewerScene {

	private m_uiscene: ICoUIScene = null;
	private m_ctrPanel: NormalCtrlPanel = null;

	entityScene: NormalEntityScene;
	private m_vcoapp: ViewerCoSApp;

	constructor() { }

	getUIScene(): ICoUIScene {
		return this.m_uiscene;
	}

	initialize(uiscene: ICoUIScene, vcoapp: ViewerCoSApp): void {

		if (this.m_uiscene == null) {
			this.m_uiscene = uiscene;
			this.m_vcoapp = vcoapp;

			this.entityScene = new NormalEntityScene(uiscene, vcoapp);
			this.initUI();

		}
	}
	protected initUI(): void {
		let panel = new NormalCtrlPanel();
		panel.initialize(this.m_uiscene, 0, 310, 320, 50);
		panel.setBGColor(CoMaterial.createColor4(0.2, 0.2, 0.2));
		this.m_ctrPanel = panel;
		panel.addEventListener(CoRScene.SelectionEvent.SELECT, this, this.selectDisplay);
		panel.addEventListener(CoRScene.ProgressDataEvent.PROGRESS, this, this.normalScale);
		this.entityScene.ctrPanel = panel;
		this.entityScene.nodeGroup.ctrPanel = panel;
	}
	private selectDisplay(evt: any): void {
		console.log("NormalViewerScene::selectDisplay(), evt.uuid: ", evt.uuid);
		let group = this.entityScene.nodeGroup;
		let uuid = evt.uuid;
		switch (uuid) {
			case "normal":
			case "model":
			case "difference":
				// console.log("flag call");
				group.applyVisibility(uuid, evt.flag);
				break;
			case "local":
			case "global":
			case "modelColor":
				// console.log("select call");
				group.applyFeatureColor(uuid);
				break;
			default:
				break;
		}
	}
	private normalScale(evt: any): void {
		// console.log("NormalViewerScene::normalScale(), evt.uuid: ", evt.uuid, evt.progress);
		// console.log("NormalViewerScene::normalScale(), evt.progress: ", evt.progress);
		let group = this.entityScene.nodeGroup;
		group.applyNormalScale(evt.progress);
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
