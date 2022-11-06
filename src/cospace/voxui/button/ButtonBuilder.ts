import { ClipLabel } from "../entity/ClipLabel";
import { ClipColorLabel } from "../entity/ClipColorLabel";
import { Button } from "./Button";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import IColor4 from "../../../vox/material/IColor4";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;


interface ITextParam {

	text: string;
	textColor: IColor4;
	fontSize: number;
	font: string;
}

class ButtonBuilder {

	static crateCurrTextBtn(pw: number, ph: number, idns: string, texAtlas: ICanvasTexAtlas, textParam: ITextParam, colors: IColor4[] = null): Button {

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
		
		return ButtonBuilder.crateCurrTextBtn(width, height, idns, texAtlas, textParam, colors);
	}	
}

export {
	ITextParam,
	ButtonBuilder
};
