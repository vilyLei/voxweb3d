import IColor4 from "../../../vox/material/IColor4";
import { IUIEntity } from "./IUIEntity";

interface IColorLabel extends IUIEntity {

	initialize(width: number, height: number): void;
	getColor(): IColor4;
	setColor(c: IColor4): IColor4;

}
export { IColorLabel };
