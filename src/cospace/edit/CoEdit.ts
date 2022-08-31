
import { IDragMoveController } from "./move/IDragMoveController";
import { DragMoveController } from "./move/DragMoveController";
import { IDragRotationController } from "./rotate/IDragRotationController";
import { DragRotationController } from "./rotate/DragRotationController";

function createDragMoveController(): IDragMoveController {
	return new DragMoveController();
}
function createRotationController(): IDragRotationController {
	return new DragRotationController();
}

export {
	createDragMoveController,
	createRotationController
}
