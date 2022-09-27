import { ICoTransformRecorder } from "./recorde/ICoTransformRecorder";
import { ITransformController } from "./transform/ITransformController";
import { IFloorLineGrid } from "./entity/IFloorLineGrid";

interface IExp_UserEditEvent {
    readonly EDIT_BEGIN: number;
    readonly EDIT_END: number;
}

interface ICoEdit {
	UserEditEvent: IExp_UserEditEvent;
	createTransformRecorder(): ICoTransformRecorder;
	createTransformController(): ITransformController;
	createFloorLineGrid(): IFloorLineGrid;
	
}
export { ICoEdit };
