import { IUIPanel } from "../panel/IUIPanel";
import IColor4 from "../../../vox/material/IColor4";
import { ICoUIScene } from "../scene/ICoUIScene";
import { IUIFontFormat } from "../system/IUIConfig";

interface IColorPickPanel extends IUIPanel {
	/**
	 * @param scene ICoUIScene instance
	 * @param rpi renderer process id
	 * @param panelW the default value 260
	 * @param panelH the default value 260
	 * @param marginWidth the default value 3
	 */
	initialize(scene: ICoUIScene, rpi: number, panelW?: number, panelH?: number, marginWidth?: number): void;
	setSelectColorCallback(callback: (color: IColor4)=>void): void;

}
export { IColorPickPanel };
