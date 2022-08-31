import { IDragMoveController } from "./move/IDragMoveController";
import { IDragRotationController } from "./rotate/IDragRotationController";

interface ICoEdit {
	createDragMoveController(): IDragMoveController;
	createRotationController(): IDragRotationController;
}
export { ICoEdit };
