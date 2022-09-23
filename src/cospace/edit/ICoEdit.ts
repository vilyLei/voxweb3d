// import { IDragMoveController } from "./move/IDragMoveController";
// import { IDragRotationController } from "./rotate/IDragRotationController";
import { ICoTransformRecorder } from "./recorde/ICoTransformRecorder";
import { ITransformController } from "./transform/ITransformController";

interface ICoEdit {
	createTransformRecorder(): ICoTransformRecorder;
	createTransformController(): ITransformController;

	// createDragMoveController(): IDragMoveController;
	// createRotationController(): IDragRotationController;
}
export { ICoEdit };
