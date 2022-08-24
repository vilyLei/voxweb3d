import ITransformEntity from "../../../vox/entity/ITransformEntity";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "./IUIEntity";

interface IClipLabel extends IUIEntity {
	
	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void;
	initializeWithLable(srcLable: IClipLabel): void;
	setClipIndex(i: number): void;
	setCircleClipIndex(i: number): void;
	getClipIndex(): number;
	getClipsTotal(): number;

}
export { IClipLabel };
