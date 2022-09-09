import IColor4 from "../../../vox/material/IColor4";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IClipEntity } from "./IClipEntity";
import { IClipColorLabel } from "./IClipColorLabel";

interface IColorClipLabel extends IClipEntity {

	initialize(label: IClipColorLabel, colorsTotal: number): void;
	initializeWithLable(srcLable: IColorClipLabel): void;
	initializeWithoutTex(width: number, height: number, colorsTotal: number): void;
	initializeWithSize(width: number, height: number, atlas: ICanvasTexAtlas, idns: string, colorsTotal: number): void;
	getColors(): IColor4[];
	getColorAt(i: number): IColor4;
	setColorAt(i: number, color4: IColor4): void;

}
export { IColorClipLabel };
