interface IPromptSystem {

	setPromptListener(confirmFunc: () => void, cancelFunc: () => void): void;
	showPrompt(promptInfo: string, type?: number): void;
	
}
export { IPromptSystem };
