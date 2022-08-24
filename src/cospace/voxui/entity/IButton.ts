
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "./IUIEntity";
import { IClipLabel } from "./IClipLabel";

interface IButton extends IUIEntity {

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void;
	initializeWithLable(lable: IClipLabel): void;
	getLable(): IClipLabel;

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
	removeEventListener(type: number, listener: any, func: (evt: any) => void): void;
}
export { IButton };
