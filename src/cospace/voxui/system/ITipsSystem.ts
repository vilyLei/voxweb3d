import { IRectTextTip } from "../../voxui/entity/IRectTextTip";
import { IMouseEvtUIEntity } from "../../voxui/entity/IMouseEvtUIEntity";

/**
 * 光标移入的信息提示系统
 */
interface ITipsSystem {

	// initialize(uiscene: ICoUIScene, rpi?: number): void;
	/**
	 * get tip entity
	 * @param type the default value is 0
	 * @returns IRectTextTip instance
	 */
	getTipEntity(type?: number): IRectTextTip;
	/**
	 * @param entity IMouseEvtUIEntity instance
	 * @param type the default value is 0
	 */
	addTipsTarget(entity: IMouseEvtUIEntity, type?: number): void;
	/**
	 * @param entity IMouseEvtUIEntity instance
	 * @param type the default value is 0
	 */
	removeTipsTarget(entity: IMouseEvtUIEntity, type?: number): void;
}
export { ITipsSystem };
