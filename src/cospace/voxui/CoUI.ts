import { IClipLabel } from "./entity/IClipLabel";
import { ClipLabel } from "./entity/ClipLabel";
import { IClipColorLabel } from "./entity/IClipColorLabel";
import { ClipColorLabel } from "./entity/ClipColorLabel";
import { ColorClipLabel } from "./entity/ColorClipLabel";

import { IButton } from "./entity/IButton";
import { Button } from "./entity/Button";

import { ICoUIScene } from "./scene/ICoUIScene";
import { CoUIScene } from "./scene/CoUIScene";

// import { ICoRScene } from "../voxengine/ICoRScene";
// declare var CoRScene: ICoRScene;

function createClipLabel(): IClipLabel {
	return new ClipLabel();
}
function createClipColorLabel(): IClipColorLabel {
	return new ClipColorLabel();
}
function createColorClipLabel(): ColorClipLabel {
	return new ColorClipLabel();
}

function createButton(): IButton {
	return new Button();
}
function createUIScene(): ICoUIScene {
	return new CoUIScene();
}
export {
	createClipLabel,
	createClipColorLabel,
	createColorClipLabel,
	createButton,
	createUIScene
};
