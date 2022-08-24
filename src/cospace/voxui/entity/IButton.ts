
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "./IUIEntity";
import { IClipLable } from "./IClipLable";

interface IButton extends IUIEntity {

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void;
	initializeWithLable(lable: IClipLable): void;
	getLable(): IClipLable;

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
	removeEventListener(type: number, listener: any, func: (evt: any) => void): void;
}
export { IButton };
