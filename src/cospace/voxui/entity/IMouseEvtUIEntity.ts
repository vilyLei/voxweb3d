import { IUIEntity } from "./IUIEntity";
import { IClipEntity } from "./IClipEntity";

interface IMouseEvtUIEntity extends IUIEntity {

	uuid: string;
	
	addLabel(label: IClipEntity): void;
	enable(): IMouseEvtUIEntity;
	disable(): IMouseEvtUIEntity;
	isEnabled(): boolean;
	setMouseEnabled(enabled: boolean): void;
	isMouseEnabled(): boolean;


	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): IMouseEvtUIEntity;
	removeEventListener(type: number, listener: any, func: (evt: any) => void): IMouseEvtUIEntity;
}
export { IMouseEvtUIEntity };
