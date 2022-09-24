import { ICoTransformRecorder } from "./recorde/ICoTransformRecorder";
import { ITransformController } from "./transform/ITransformController";

interface IExp_UserEditEvent {
    readonly EDIT_BEGIN: number;// = 20001;
    readonly EDIT_END: number;// = 20002;
}

interface ICoEdit {
	UserEditEvent: IExp_UserEditEvent;
	createTransformRecorder(): ICoTransformRecorder;
	createTransformController(): ITransformController;
}
export { ICoEdit };
