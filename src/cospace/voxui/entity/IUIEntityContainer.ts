import IVector3D from "../../../vox/math/IVector3D";
import { IUIEntity } from "./IUIEntity";

interface IUIEntityContainer extends IUIEntity {
	initContainer(): void;
	addEntity(entity: IUIEntity): void;
	removeEntity(entity: IUIEntity): void;
	getEntitiesTotal(): number;
	globalToLocal(pv: IVector3D): void;
	localToGlobal(pv: IVector3D): void;
}
export { IUIEntityContainer };
