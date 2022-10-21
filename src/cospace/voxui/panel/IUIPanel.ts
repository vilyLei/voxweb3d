import { IUIEntityContainer } from "../entity/IUIEntityContainer";
import IColor4 from "../../../vox/material/IColor4";
import { ICoUIScene } from "../scene/ICoUIScene";

interface IUIPanel extends IUIEntityContainer {
	autoLayout: boolean;
	setSize(pw: number, ph: number): void;
	setBGColor(c: IColor4): IUIPanel;
	/**
	 * @param scene ui scene, it is ICoUIScene instance
	 * @param rpi the default value is -1, it is a invalid value
	 */
	setUIscene(uiscene: ICoUIScene, rpi?: number): void;
	
	/**
	 * @param scene ui scene, it is ICoUIScene instance, the default value is null
	 * @param rpi the default value is -1, it is a invalid value
	 */
	open(scene?: ICoUIScene,rpi?: number): void;
	/**
	 * @returns open or not
	 */
	isOpen(): boolean;
	close(): void;
}
export { IUIPanel };
