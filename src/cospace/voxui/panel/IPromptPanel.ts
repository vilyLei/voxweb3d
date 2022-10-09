import { IUIEntity } from "../entity/IUIEntity";
import IColor4 from "../../../vox/material/IColor4";
import { ICoUIScene } from "../scene/ICoUIScene";

interface IPromptPanel extends IUIEntity {

	setBGColor(c: IColor4): this;
	initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number, btnW: number, btnH: number, confirmNS?: string, cancelNS?: string): void;
	open(): void;
	isOpen(): boolean;
	close(): void;
	setListener(confirmFunc: () => void, cancelFunc: () => void): void;
	setPrompt(text: string): void;
	
}
export { IPromptPanel };
