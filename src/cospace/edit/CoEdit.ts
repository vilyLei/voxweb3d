
// import { IDragMoveController } from "./move/IDragMoveController";
// import { DragMoveController } from "./move/DragMoveController";
// import { IDragRotationController } from "./rotate/IDragRotationController";
// import { DragRotationController } from "./rotate/DragRotationController";

import { TransformController } from "./transform/TransformController";
import { CoTransformRecorder } from "./recorde/CoTransformRecorder";

function createTransformRecorder(): CoTransformRecorder {
	return new CoTransformRecorder();
}

function createTransformController(): TransformController {
	return new TransformController();
}

// function createDragMoveController(): IDragMoveController {
// 	return new DragMoveController();
// }
// function createRotationController(): IDragRotationController {
// 	return new DragRotationController();
// }

export {

	createTransformRecorder,
	createTransformController

	// createDragMoveController,
	// createRotationController
}
