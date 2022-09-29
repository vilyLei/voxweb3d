import { IUIEntity } from "./IUIEntity";

interface IUIEntityContainer extends IUIEntity {

	addEntity(entity: IUIEntity): void;
	removeEntity(entity: IUIEntity): void;
	getEneitysTotal(): number;
}
export { IUIEntityContainer };
