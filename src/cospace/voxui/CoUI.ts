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
import { ITextParam, ButtonBuilder } from "./button/ButtonBuilder";
import { SelectButtonGroup } from "./button/SelectButtonGroup";

import { ICoUIScene } from "./scene/ICoUIScene";
import { CoUIScene } from "./scene/CoUIScene";
import { RectTextTip } from "./entity/RectTextTip";
import { TipInfo } from "./base/TipInfo";
import { UILayout } from "./layout/UILayout";
import { PromptPanel } from "./panel/PromptPanel";
import { UIPanel } from "./panel/UIPanel";
import ICanvasTexAtlas from "../voxtexture/atlas/ICanvasTexAtlas";
import IColor4 from "../../vox/material/IColor4";

import { ICoMaterial } from "../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;

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

/*
interface ITextParam {

	text: string;
	textColor: IColor4;
	fontSize: number;
	font: string;
}

function crateCurrTextBtn(pw: number, ph: number, idns: string, texAtlas: ICanvasTexAtlas, textParam: ITextParam, colors: IColor4[]): Button {

	if (textParam.text !== null && textParam.text != "" && colors != null) {

		let colorClipLabel = new ClipColorLabel();
		colorClipLabel.initializeWithoutTex(pw, ph, 4);
		colorClipLabel.setColors( colors );

		let iconLable = new ClipLabel();
		iconLable.depthTest = true;
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(texAtlas, [textParam.text]);
		iconLable.setColor(textParam.textColor);

		let btn = new Button();
		btn.uuid = idns;
		btn.addLabel(iconLable);
		btn.initializeWithLable(colorClipLabel);

		return btn;
	}
	return null;
}

function createTextButton(width: number, height: number, idns: string, texAtlas: ICanvasTexAtlas, textParam: ITextParam, colors: IColor4[]): Button {

	let tp = textParam;
	let img = texAtlas.createCharsCanvasFixSize(width, height, tp.text, tp.fontSize, CoMaterial.createColor4(), CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0));
	texAtlas.addImageToAtlas(tp.text, img);

	return crateCurrTextBtn(width, height, idns, texAtlas, textParam, colors);
}
//*/

function createTextButton(width: number, height: number, idns: string, texAtlas: ICanvasTexAtlas, textParam: ITextParam, colors: IColor4[]): Button {
	return ButtonBuilder.createTextButton(width, height, idns, texAtlas, textParam, colors);
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
	createTextButton,

	createUIPanel,
	createPromptPanel,
	createUIScene
};
