import { FloorLineGrid } from "./entity/FloorLineGrid";
import { UserEditEvent } from "./event/UserEditEvent";
import { CoTransformRecorder } from "./recorde/CoTransformRecorder";
import { TransformController } from "./transform/TransformController";

function createTransformRecorder(): CoTransformRecorder {
	return new CoTransformRecorder();
}

function createTransformController(): TransformController {
	return new TransformController();
}
function createFloorLineGrid(): FloorLineGrid {
	return new FloorLineGrid();
}

export {
	UserEditEvent,
	createTransformRecorder,
	createTransformController,
	createFloorLineGrid

}
