import ITransformEntity from "../../../vox/entity/ITransformEntity";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "./IUIEntity";

interface IClipLable extends IUIEntity {
	
	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void;

	setClipIndex(i: number): void;
	setCircleClipIndex(i: number): void;
	getClipIndex(): number;
	getClipsTotal(): number;

}
export { IClipLable };
