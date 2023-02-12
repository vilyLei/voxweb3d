import IRendererScene from "../../../vox/scene/IRendererScene";

interface ICoKeyboardInteraction {

	initialize(rscene: IRendererScene): void;
	
	reset(): void;
	getCurrDownKeyCode(): number;
	/**
	 * @param keyTypes example: [Keyboard.CTRL, Keyboard.Z]
	 * @returns combination keys event type
	 */
	createKeysEventType(keyTypes: number[]): number;
	/**
	 * @param keysEventType the value is come from the createKeysEventType() function
	 * @param target event listerner
	 * @param func event listerner callback function
	 * @param captureEnabled the default value is true
	 * @param bubbleEnabled the default value is false
	 */
	addKeysDownListener(keysEventType: number, target: any, func: (evt: any) => void): void;
	/**
	 * @param keysEventType the value is come from the createKeysEventType() function
	 * @param target event listerner
	 * @param func event listerner callback function
	 */
	removeKeysDownListener(keysEventType: number, target: any, func: (evt: any) => void): void;
}

export { ICoKeyboardInteraction }
