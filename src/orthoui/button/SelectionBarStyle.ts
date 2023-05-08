/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../vox/material/Color4";
import ColorRectImgButton from "./ColorRectImgButton";

export default class SelectionBarStyle {

    readonly headFontColor = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly headFontBgColor = new Color4(1.0, 1.0, 1.0, 0.3);
    readonly bodyFontColor = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly bodyFontBgColor = new Color4(1.0, 1.0, 1.0, 0.3);

    readonly overColor = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly downColor = new Color4(1.0, 1.0, 0.6, 1.0);
    readonly outColor = new Color4(0.8, 0.8, 0.8, 1.0);
    // "left", "right"
    headAlignType = "";
    headAlignPosValue = 0;
    // distance = 2;
    headVisible = true;
    bodyVisible = true;
	headEnabled = true;
	bodyEnabled = true;
	fontSize = 30;
	renderState = 0;
	bodyFixWidth = 0;
	headFixWidth = 0;

	trueImageKey = "";
	falseImageKey = "";

	visible = true;
	scale = 1.0;
    constructor() { }
	copyTo(dst: SelectionBarStyle): void {
		dst.headFontColor.copyFrom(this.headFontColor);
		dst.headFontBgColor.copyFrom(this.headFontBgColor);
		dst.bodyFontColor.copyFrom(this.bodyFontColor);
		dst.bodyFontBgColor.copyFrom(this.bodyFontBgColor);
		dst.overColor.copyFrom(this.overColor);
		dst.downColor.copyFrom(this.downColor);
		dst.outColor.copyFrom(this.outColor);
		dst.headAlignType = this.headAlignType;
		dst.headAlignPosValue = this.headAlignPosValue;
		dst.headVisible = this.headVisible;
		dst.bodyVisible = this.bodyVisible;
		dst.headEnabled = this.headEnabled;
		dst.bodyEnabled = this.bodyEnabled;
		dst.fontSize = this.fontSize;
	}
	clone(): SelectionBarStyle {
		let s = new SelectionBarStyle();
		this.copyTo(s);
		return s;
	}
    applyToBtn(btn: ColorRectImgButton): void {
        if(btn) {
            btn.overColor.copyFrom(this.overColor);
            btn.downColor.copyFrom(this.downColor);
            btn.outColor.copyFrom(this.outColor);
			btn.setColor(btn.outColor);
        }
    }
    destroy(): void {
    }
    copyFrom(dst: SelectionBarStyle): void {
		dst.copyTo(this);
    }
}
