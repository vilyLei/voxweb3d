import { IClipLabel } from "./entity/IClipLabel";
import { ClipLabel } from "./entity/ClipLabel";
import { IClipColorLabel } from "./entity/IClipColorLabel";
import { ClipColorLabel } from "./entity/ClipColorLabel";
import { ColorClipLabel } from "./entity/ColorClipLabel";
import { ColorLabel } from "./entity/ColorLabel";

import { IButton } from "./button/IButton";
import { Button } from "./button/Button";
import { ICoUIScene } from "./scene/ICoUIScene";
import { CoUIScene } from "./scene/CoUIScene";
import { RectTextTip } from "./entity/RectTextTip";
import { TipInfo } from "./base/TipInfo";
import { UILayout } from "./layout/UILayout";


function createColorLabel(): ColorLabel {
	return new ColorLabel();
}
function createRectTextTip(): RectTextTip {
	return new RectTextTip();
}
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
function createTipInfo(): TipInfo {
	return new TipInfo();
}
function createUILayout(): UILayout {
	return new UILayout();
}

export {
	
	createColorLabel,
	createUILayout,
	createTipInfo,
	createRectTextTip,
	createClipLabel,
	createClipColorLabel,
	createColorClipLabel,
	createButton,
	createUIScene
};
