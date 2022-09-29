import IVector3D from "../../../vox/math/IVector3D";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { IMouseEvtUIEntity } from "./IMouseEvtUIEntity";
interface IRectTextTip {

	/**
	 * @param uiScene ICoUIScene instance
	 * @param rpi the default value is 0
	 * @param fontSize the default value is 24
	 */
	initialize(uiScene: ICoUIScene, rpi?: number, fontSize?: number): void;
	
	addEntity(entity: IMouseEvtUIEntity): void;
	removeEntity(entity: IMouseEvtUIEntity): void;
	setText(text: string): void;
	getWidth(): number;
	getHeight(): number;
	setXY(px: number, py: number): void;
	setPosition(pv: IVector3D): void;
	getPosition(pv: IVector3D): IVector3D;
	getText(): string;
	setVisible(v: boolean): void;
	update(): void;
	destroy(): void;
}

export { IRectTextTip }
