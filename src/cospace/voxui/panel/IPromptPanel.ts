import { IUIPanel } from "../panel/IUIPanel";
import IColor4 from "../../../vox/material/IColor4";
import { ICoUIScene } from "../scene/ICoUIScene";
import { IUIFontFormat } from "../system/IUIConfig";

interface IPromptPanel extends IUIPanel {

	initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number, btnW: number, btnH: number, confirmNS?: string, cancelNS?: string): void;
	setListener(confirmFunc: () => void, cancelFunc: () => void): void;
	setPrompt(text: string): void;
	setPromptTextColor(color: IColor4): void;
	applyConfirmButton(): void;
	applyAllButtons(): void;

}
export { IPromptPanel };
