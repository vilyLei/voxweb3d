
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "./IUIEntity";
import { IClipEntity } from "./IClipEntity";

interface IButton extends IUIEntity {

	uuid: string;
	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void;
	initializeWithLable(lable: IClipEntity): void;
	getLable(): IClipEntity;

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
	removeEventListener(type: number, listener: any, func: (evt: any) => void): void;
}
export { IButton };
