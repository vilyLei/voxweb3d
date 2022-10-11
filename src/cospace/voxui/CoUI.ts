import { IClipLabel } from "./entity/IClipLabel";
import { ClipLabel } from "./entity/ClipLabel";
import { IClipColorLabel } from "./entity/IClipColorLabel";
import { ClipColorLabel } from "./entity/ClipColorLabel";
import { ColorClipLabel } from "./entity/ColorClipLabel";
import { ColorLabel } from "./entity/ColorLabel";
import { TextLabel } from "./entity/TextLabel";

import { IButton } from "./button/IButton";
import { Button } from "./button/Button";
import { FlagButton } from "./button/FlagButton";
import { SelectButtonGroup } from "./button/SelectButtonGroup";

import { ICoUIScene } from "./scene/ICoUIScene";
import { CoUIScene } from "./scene/CoUIScene";
import { RectTextTip } from "./entity/RectTextTip";
import { TipInfo } from "./base/TipInfo";
import { UILayout } from "./layout/UILayout";
import { PromptPanel } from "./panel/PromptPanel";
import { UIPanel } from "./panel/UIPanel";


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
function createTextLabel(): TextLabel {
	return new TextLabel();
}

function createButton(): IButton {
	return new Button();
}
function createFlagButton(): FlagButton {
	return new FlagButton();
}

function createSelectButtonGroup(): SelectButtonGroup {
	return new SelectButtonGroup();
}

function createUIPanel(): UIPanel {
	return new UIPanel();
}
function createPromptPanel(): PromptPanel {
	return new PromptPanel();
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
	createTextLabel,
	createButton,
	createFlagButton,
	createSelectButtonGroup,
	
	createUIPanel,
	createPromptPanel,
	createUIScene
};
