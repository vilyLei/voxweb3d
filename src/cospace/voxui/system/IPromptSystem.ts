import IColor4 from "../../../vox/material/IColor4";

interface IPromptSystem {

	setPromptTextColor(color: IColor4, type?: number): void;
	setPromptBGColor(color: IColor4, type?: number): void;
	setPromptListener(confirmFunc: () => void, cancelFunc: () => void, type?: number): void;
	showPrompt(promptInfo: string, type?: number): void;
	
}
export { IPromptSystem };
