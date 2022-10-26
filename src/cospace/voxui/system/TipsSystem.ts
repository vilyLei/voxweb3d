import { ICoUIScene } from "../scene/ICoUIScene";
// import { ITipEntity } from "../panel/ITipEntity";
// import { TipEntity } from "../panel/TipEntity";
import { IRectTextTip } from "../../voxui/entity/IRectTextTip";
import { IPromptSystem } from "./IPromptSystem";

import IColor4 from "../../../vox/material/IColor4";

import { ICoUI } from "../../voxui/ICoUI";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
declare var CoUI: ICoUI;
/**
 * 光标移入的信息提示系统
 */
class TipsSystem {

	private m_uiscene: ICoUIScene;
	private m_tipEntity: IRectTextTip = null;
	constructor(){}

	initialize(uiscene: ICoUIScene, rpi: number = 3): void {
		if(this.m_tipEntity == null) {
			this.m_uiscene = uiscene;
			let tip = CoUI.createRectTextTip();
			tip.initialize(uiscene, rpi);
			this.m_tipEntity = tip;
		}
	}
	
	// showTipInfo(promptInfo: string, type: number = 0): void {
	// 	if(this.m_tipEntity != null) {
	// 		// this.m_tipEntity.setPrompt(promptInfo);
	// 		// this.m_tipEntity.open();
	// 	}
	// }
	// setPromptTextColor(color: IColor4, type: number = 0): void {
	// 	if(this.m_tipEntity != null) {
	// 		// this.m_tipEntity.setPromptTextColor(color);
	// 	}
	// }
	// setPromptBGColor(color: IColor4, type: number = 0): void {
	// 	if(this.m_tipEntity != null) {
	// 		// this.m_tipEntity.setBGColor(color);
	// 	}
	// }
	getTipEntity(type: number = 0): IRectTextTip {
		return this.m_tipEntity;
	}
}
export { TipsSystem };
