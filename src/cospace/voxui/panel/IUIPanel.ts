import { IUIEntityContainer } from "../entity/IUIEntityContainer";
import IColor4 from "../../../vox/material/IColor4";
import { ICoUIScene } from "../scene/ICoUIScene";

interface IUIPanel extends IUIEntityContainer {


	setBGColor(c: IColor4): IUIPanel;
	setUIscene(scene: ICoUIScene): void;
	open(scene?: ICoUIScene): void;
	isOpen(): boolean;
	close(): void;
}
export { IUIPanel };
