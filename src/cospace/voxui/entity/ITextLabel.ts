import IColor4 from "../../../vox/material/IColor4";
import IVector3D from "../../../vox/math/IVector3D";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { IMouseEvtUIEntity } from "./IMouseEvtUIEntity";

import { IUIEntity } from "./IUIEntity";

interface ITextLabel extends IUIEntity {

	/**
	 * @param text text content
	 * @param uiScene ICoUIScene instance
	 * @param rpi the default value is 0
	 * @param fontSize the default value is 24
	 */
	initialize(text: string, uiScene: ICoUIScene, rpi?: number, fontSize?: number): void;
	setText(text: string): void;
	getText(): string;

	setColor(c: IColor4): ITextLabel;
	getColor(): IColor4;
}

export { ITextLabel }
