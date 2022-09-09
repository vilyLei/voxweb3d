import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IClipEntity } from "./IClipEntity";
import IColor4 from "../../../vox/material/IColor4";


interface IClipLabel extends IClipEntity {

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void;
	initializeWithLable(srcLable: IClipLabel): void;
	setColor(color: IColor4): void;
	getColor(color: IColor4): void;
	getClipWidthAt(i: number): number;
	getClipHeightAt(i: number): number;
}
export { IClipLabel };
