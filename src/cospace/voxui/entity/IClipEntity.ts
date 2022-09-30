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
