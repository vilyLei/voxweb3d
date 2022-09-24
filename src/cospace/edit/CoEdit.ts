
import { UserEditEvent } from "./event/UserEditEvent";
import { CoTransformRecorder } from "./recorde/CoTransformRecorder";
import { TransformController } from "./transform/TransformController";

function createTransformRecorder(): CoTransformRecorder {
	return new CoTransformRecorder();
}

function createTransformController(): TransformController {
	return new TransformController();
}

export {
	UserEditEvent,
	createTransformRecorder,
	createTransformController

}
