import { IClipLable } from "./entity/IClipLable";

import { IButton } from "./entity/IButton";

import { ICoUIScene } from "./scene/ICoUIScene";

interface ICoUI {
	createClipLabel(): IClipLable;
	createButton(): IButton;
	createUIScene(): ICoUIScene;
}
export { ICoUI };
