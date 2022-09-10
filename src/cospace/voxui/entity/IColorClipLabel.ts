import IColor4 from "../../../vox/material/IColor4";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IClipEntity } from "./IClipEntity";
import { IClipLabel } from "./IClipLabel";

interface IColorClipLabel extends IClipEntity {

	initialize(label: IClipLabel, colorsTotal: number): void;
	setLabelClipIndex(i: number): void;
	getLabelClipIndex(): number;
	setLabelCircleClipIndex(i: number): void;
	getLabelClipsTotal(): number;

	getColors(): IColor4[];
	getColorAt(i: number): IColor4;
	setColorAt(i: number, color4: IColor4): void;

}
export { IColorClipLabel };
