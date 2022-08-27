
import { IDragMoveController } from "./move/IDragMoveController";
import { DragMoveController } from "./move/DragMoveController";

function createDragMoveController(): IDragMoveController {
	return new DragMoveController();
}


export {
	createDragMoveController
}
