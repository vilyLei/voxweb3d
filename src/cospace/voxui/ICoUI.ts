import { IClipLabel } from "./entity/IClipLabel";

import { IButton } from "./entity/IButton";

import { ICoUIScene } from "./scene/ICoUIScene";

interface ICoUI {
	createClipLabel(): IClipLabel;
	createButton(): IButton;
	createUIScene(): ICoUIScene;
}
export { ICoUI };
