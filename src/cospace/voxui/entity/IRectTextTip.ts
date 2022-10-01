import IColor4 from "../../../vox/material/IColor4";
import IVector3D from "../../../vox/math/IVector3D";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { IMouseEvtUIEntity } from "./IMouseEvtUIEntity";

import { IUIEntity } from "./IUIEntity";

interface IRectTextTip extends IUIEntity {

	/**
	 * @param uiScene ICoUIScene instance
	 * @param rpi the default value is 0
	 * @param fontSize the default value is 24
	 * @param fontColor the default value is null
	 * @param bgColor the default value is null
	 */
	initialize(uiScene: ICoUIScene, rpi?: number, fontSize?: number, fontColor?: IColor4, bgColor?: IColor4): void;
	
	addEntity(entity: IMouseEvtUIEntity): void;
	removeEntity(entity: IMouseEvtUIEntity): void;
	setText(text: string): void;
	getText(): string;
}

export { IRectTextTip }
