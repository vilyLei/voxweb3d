
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IMouseEvtUIEntity } from "../entity/IMouseEvtUIEntity";
import { IClipEntity } from "../entity/IClipEntity";

interface IButton extends IMouseEvtUIEntity {

	addLabel(label: IClipEntity): void;
	
	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): IButton;
	initializeWithLable(lable: IClipEntity): IButton;
	getLable(): IClipEntity;
	setClipIndex(i: number): IButton;
}
export { IButton };
