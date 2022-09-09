import IColor4 from "../../../vox/material/IColor4";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "./IUIEntity";

interface IClipEntity extends IUIEntity {

	setClipIndex(i: number): void;
	setCircleClipIndex(i: number): void;
	getClipIndex(): number;
	getClipsTotal(): number;
	hasTexture(): boolean;
	getClipWidth(): number;
	getClipHeight(): number;
}
export { IClipEntity };
