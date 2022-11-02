import { ICoUIScene } from "../scene/ICoUIScene";
import { IMouseEvtUIEntity } from "../../voxui/entity/IMouseEvtUIEntity";
import { IRectTextTip } from "../../voxui/entity/IRectTextTip";
import { ITipsSystem } from "./ITipsSystem";
import { ICoUI } from "../../voxui/ICoUI";
declare var CoUI: ICoUI;
/**
 * 光标移入的信息提示系统
 */
class TipsSystem implements ITipsSystem {

	private m_uiscene: ICoUIScene;
	private m_tipEntity: IRectTextTip = null;
	constructor(){}

	initialize(uiscene: ICoUIScene, rpi: number = 2): void {
		if(this.m_tipEntity == null) {
			this.m_uiscene = uiscene;
			let tip = CoUI.createRectTextTip();
			tip.initialize(uiscene, rpi);
			this.m_tipEntity = tip;
		}
	}
	/**
	 * get tip entity
	 * @param type the default value is 0
	 * @returns IRectTextTip instance
	 */
	 getTipEntity(type?: number): IRectTextTip {
		return this.m_tipEntity;
	}
	 /**
	  * @param entity IMouseEvtUIEntity instance
	  * @param type the default value is 0
	  */
	 addTipsTarget(entity: IMouseEvtUIEntity, type?: number): void {
		this.m_tipEntity.addEntity(entity);
	 }
	 /**
	  * @param entity IMouseEvtUIEntity instance
	  * @param type the default value is 0
	  */
	 removeTipsTarget(entity: IMouseEvtUIEntity, type?: number): void {		
		this.m_tipEntity.removeEntity(entity);
	 }
	 destroy(): void {
		
	 }
}
export { TipsSystem };
