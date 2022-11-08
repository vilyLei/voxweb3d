import { ICoUIScene } from "../scene/ICoUIScene";
import { IUIPanel } from "../panel/IUIPanel";
// import { IPromptPanel } from "../panel/IPromptPanel";
// import { PromptPanel } from "../panel/PromptPanel";
import { IPanelSystem } from "./IPanelSystem";
import IColor4 from "../../../vox/material/IColor4";
import { ColorPickPanel } from "../panel/ColorPickPanel";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;

class PanelSystem implements IPanelSystem {

	private m_uiscene: ICoUIScene;
	private m_colorPickPanel = new ColorPickPanel();
	private m_curPanel: IUIPanel = null;
	constructor() { }

	initialize(uiscene: ICoUIScene, rpi: number = 1): void {
		if (this.m_uiscene == null) {
			this.m_uiscene = uiscene;
			this.m_colorPickPanel.setBGColor(CoMaterial.createColor4(0.4, 0.4, 0.4));
			this.m_colorPickPanel.initialize(uiscene, rpi, 260, 260, 3);
		}
	}
	private getPanelByName(panelName: string): IUIPanel {
		switch (panelName) {
			case "colorPickPanel":
				return this.m_colorPickPanel;
				break;
			default:
				return null;
				break;
		}
	}
	setXY(panelName: string, px: number, py: number, type: number = 0): void {
		let panel = this.getPanelByName(panelName);
		if (panel != null) {
			panel.setXY(px, py);
		}
	}
	openPanel(panelName: string, type: number = 0): void {
		let panel = this.getPanelByName(panelName);
		if (panel != null) {
			panel.open();
		}
	}
	closePanel(panelName: string, type: number = 0): void {
		let panel = this.getPanelByName(panelName);
		if (panel != null) {
			panel.close();
		}
	}
	getPanel(panelName: string, type: number = 0): IUIPanel {
		return this.getPanelByName(panelName);
	}
}
export { PanelSystem };
