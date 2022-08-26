import ITransformEntity from "../../../vox/entity/ITransformEntity";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IClipEntity } from "./IClipEntity";

interface IClipLabel extends IClipEntity {

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void;
	initializeWithLable(srcLable: IClipLabel): void;

}
export { IClipLabel };
