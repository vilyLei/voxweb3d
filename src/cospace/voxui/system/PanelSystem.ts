import { ICoUIScene } from "../scene/ICoUIScene";
import { IUIPanel } from "../panel/IUIPanel";
// import { IPromptPanel } from "../panel/IPromptPanel";
// import { PromptPanel } from "../panel/PromptPanel";
import { IPanelSystem } from "./IPanelSystem";

// import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import IColor4 from "../../../vox/material/IColor4";
// declare var CoMaterial: ICoMaterial;

class PanelSystem implements IPanelSystem {

	private m_uiscene: ICoUIScene;
	private m_curPanel: IUIPanel = null;
	constructor() { }

	initialize(uiscene: ICoUIScene, rpi: number = 3): void {
		if (this.m_uiscene == null) {
			this.m_uiscene = uiscene;

			// let cfg = uiscene.uiConfig;
			// let uimodule = cfg.getUIPanelCfgByName("promptPanel");
			// let plSize = uimodule.panelSize;
			// let btnSize = uimodule.btnSize;
			// let names = uimodule.btnNames;
			// let pl = new PromptPanel();
			
			// this.m_curPanel = pl;
		}
	}

	openPanel(panelName: string, type: number = 0): void {
		
	}
	closePanel(panelName: string, type: number = 0): void {
		
	}
	getPanel(panelName: string, type: number = 0): IUIPanel {
		return this.m_curPanel;
	}
}
export { PanelSystem };
