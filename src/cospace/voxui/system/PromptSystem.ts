import { ICoUIScene } from "../scene/ICoUIScene";
import { IPromptPanel } from "../panel/IPromptPanel";
import { PromptPanel } from "../panel/PromptPanel";
import { IPromptSystem } from "./IPromptSystem";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import IColor4 from "../../../vox/material/IColor4";
declare var CoMaterial: ICoMaterial;

class PromptSystem implements IPromptSystem {

	private m_uiscene: ICoUIScene;
	private m_promptPanel: PromptPanel = null;
	constructor(){}

	initialize(uiscene: ICoUIScene, rpi: number = 3): void {
		if(this.m_promptPanel == null) {
			this.m_uiscene = uiscene;
			let pl = new PromptPanel();
			pl.initialize(this.m_uiscene, rpi, 300, 200, 120, 50);
			pl.setZ(3.0);
			pl.setBGColor(CoMaterial.createColor4(0.2, 0.2, 0.2));
			this.m_promptPanel = pl;
			// pl.open();
			// pl.close();
		}
	}
	
	setPromptListener(confirmFunc: () => void, cancelFunc: () => void, type: number = 0): void {
		if(this.m_promptPanel != null) {
			this.m_promptPanel.setListener(confirmFunc, cancelFunc);
		}
	}
	showPrompt(promptInfo: string, type: number = 0): void {
		if(this.m_promptPanel != null) {
			this.m_promptPanel.setPrompt(promptInfo);
			this.m_promptPanel.open();
		}
	}
	setPromptTextColor(color: IColor4, type: number = 0): void {
		if(this.m_promptPanel != null) {
			this.m_promptPanel.setPromptTextColor(color);
		}
	}
	setPromptBGColor(color: IColor4, type: number = 0): void {
		if(this.m_promptPanel != null) {
			this.m_promptPanel.setBGColor(color);
		}
	}
	getPromptPanel(type: number = 0): IPromptPanel {
		return this.m_promptPanel;
	}
}
export { PromptSystem };
