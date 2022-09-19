import { IClipLabel } from "./entity/IClipLabel";
import { IClipColorLabel } from "./entity/IClipColorLabel";
import { IColorClipLabel } from "./entity/IColorClipLabel";

import { IButton } from "./entity/IButton";

import { ICoUIScene } from "./scene/ICoUIScene";

interface ICoUI {
	createClipLabel(): IClipLabel;
	createClipColorLabel(): IClipColorLabel;
	createColorClipLabel(): IColorClipLabel;
	createButton(): IButton;
	createUIScene(): ICoUIScene;
}
export { ICoUI };
