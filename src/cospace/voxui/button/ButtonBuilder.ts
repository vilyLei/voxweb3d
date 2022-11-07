import { ClipLabel } from "../entity/ClipLabel";
import { ClipColorLabel } from "../entity/ClipColorLabel";
import { Button } from "./Button";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import IColor4 from "../../../vox/material/IColor4";

import { IButton } from "./IButton";
import { ICoUIScene } from "../scene/ICoUIScene";
import { IUIPanelConfig } from "../system/uiconfig/IUIPanelConfig";


import { ICoUI } from "../../voxui/ICoUI";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoUI: ICoUI;
declare var CoMaterial: ICoMaterial;


interface ITextParam {

	text: string;
	textColor: IColor4;
	fontSize: number;
	font: string;
}

class ButtonBuilder {

	static createCurrTextBtn(pw: number, ph: number, idns: string, texAtlas: ICanvasTexAtlas, textParam: ITextParam, colors: IColor4[] = null): Button {

		if (textParam.text !== null && textParam.text != "") {
	
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
	
	static createTextButton(width: number, height: number, idns: string, texAtlas: ICanvasTexAtlas, textParam: ITextParam, colors: IColor4[]): Button {
	
		let tp = textParam;
		let img = texAtlas.createCharsCanvasFixSize(width, height, tp.text, tp.fontSize, CoMaterial.createColor4(), CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0));
		texAtlas.addImageToAtlas(tp.text, img);
		
		return ButtonBuilder.createCurrTextBtn(width, height, idns, texAtlas, textParam, colors);
	}
	static createPanelBtnWithCfg(couiScene: ICoUIScene, px: number, py: number, btnIndex: number, uiConfig: IUIPanelConfig): IButton {
		
		let tta = couiScene.transparentTexAtlas;
		let cfg = couiScene.uiConfig;
		let btnSize = uiConfig.btnSize;
		let pw = btnSize[0];
		let ph = btnSize[1];

		let names = uiConfig.btnNames;
		let keys = uiConfig.btnKeys;
		let tips = uiConfig.btnTips;

		let fontFormat = uiConfig.btnTextFontFormat;
		tta.setFontName(fontFormat.font);
		let fontColor = CoMaterial.createColor4();
		fontColor.fromBytesArray3(cfg.getUIGlobalColor().text);
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		let img = tta.createCharsCanvasFixSize(pw, ph, names[btnIndex], fontFormat.fontSize, fontColor, bgColor);
		tta.addImageToAtlas(names[btnIndex], img);

		let label = CoUI.createClipColorLabel();
		label.initializeWithoutTex(pw, ph, 4);

		let iconLable = CoUI.createClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [names[btnIndex]]);

		let btn = CoUI.createButton();
		btn.uuid = keys[btnIndex];
		btn.addLabel(iconLable);
		btn.initializeWithLable(label);

		let tipsAlign = "right";
		let btnStyle = uiConfig.buttonStyle;		
		if (btnStyle != undefined) {
			if (btnStyle.globalColor != undefined) {
				tipsAlign = btnStyle.tipsAlign;
				cfg.applyButtonGlobalColor(btn, btnStyle.globalColor);
			}
		}
		if (tips.length > btnIndex) {
			couiScene.tips.addTipsTarget(btn);
			let tipInfo = CoUI.createTipInfo().setContent(tips[btnIndex]);
			switch(tipsAlign) {
				case "top":
					btn.info = tipInfo.alignTop();
					break;
				case "bottom":
					btn.info = tipInfo.alignBottom();
					break;
				default:
					btn.info = tipInfo.alignRight();
					break;
			}
		}

		btn.setXY(px, py);
		return btn;
	}
}

export {
	ITextParam,
	ButtonBuilder
};
