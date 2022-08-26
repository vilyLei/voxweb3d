import { IClipLabel } from "./entity/IClipLabel";
import { IClipColorLabel } from "./entity/IClipColorLabel";

import { IButton } from "./entity/IButton";

import { ICoUIScene } from "./scene/ICoUIScene";

interface ICoUI {
	createClipLabel(): IClipLabel;
	createClipColorLabel(): IClipColorLabel;
	createButton(): IButton;
	createUIScene(): ICoUIScene;
}
export { ICoUI };
