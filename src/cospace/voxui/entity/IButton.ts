
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "./IUIEntity";
import { IClipEntity } from "./IClipEntity";

interface IButton extends IUIEntity {

	uuid: string;
	
	addLabel(label: IClipEntity): void;
	enable(): IButton;
	disable(): IButton;
	isEnabled(): boolean;
	setMouseEnabled(enabled: boolean): void;
	isMouseEnabled(): boolean;

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): IButton;
	initializeWithLable(lable: IClipEntity): IButton;
	getLable(): IClipEntity;

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): IButton;
	removeEventListener(type: number, listener: any, func: (evt: any) => void): IButton;
	setClipIndex(i: number): void;
}
export { IButton };
