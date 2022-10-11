import IVector3D from "../../../vox/math/IVector3D";
import { IUIEntity } from "./IUIEntity";

interface IUIEntityContainer extends IUIEntity {
	
	addEntity(entity: IUIEntity): void;
	removeEntity(entity: IUIEntity): void;
	getEneitysTotal(): number;
	globalToLocal(pv: IVector3D): void;
	localToGlobal(pv: IVector3D): void;
}
export { IUIEntityContainer };
