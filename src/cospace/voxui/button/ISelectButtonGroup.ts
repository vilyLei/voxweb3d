import { IButton } from "../button/IButton";

interface ISelectButtonGroup {
	addButton(btn: IButton): void;
	setSelectedFunction(selectFunc: (btn: IButton)=>void, deselectFunc: (btn: IButton)=>void): void;
	select(uuid: string): void;
	destroy(): void;
}
export { ISelectButtonGroup };
