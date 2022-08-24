import { IClipLabel } from "./entity/IClipLabel";
import { ClipLabel } from "./entity/ClipLabel";

import { IButton } from "./entity/IButton";
import { Button } from "./entity/Button";

import { ICoUIScene } from "./scene/ICoUIScene";
import { CoUIScene } from "./scene/CoUIScene";

// import { ICoRScene } from "../voxengine/ICoRScene";
// declare var CoRScene: ICoRScene;

function createClipLabel(): IClipLabel {
	return new ClipLabel();
}
function createButton(): IButton {
	return new Button();
}
function createUIScene(): ICoUIScene {
	return new CoUIScene();
}
export {
	createClipLabel,
	createButton,
	createUIScene
};
