/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../vox/material/Color4";
import ColorRectImgButton from "./ColorRectImgButton";
import SelectionBarStyle from "./SelectionBarStyle";

export default class ProgressBarStyle extends SelectionBarStyle {

    readonly progressBtnFontColor = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly progressBtnFontBgColor = new Color4(1.0, 1.0, 1.0, 0.5);
    readonly progressBtnOverColor = new Color4(1.0, 1.0, 1.0, 0.8);
    readonly progressBtnDownColor = new Color4(1.0, 1.0, 0.6, 0.8);
    readonly progressBtnOutColor = new Color4(0.8, 0.8, 0.8, 0.8);

    readonly progressBarOverColor = new Color4(1.0, 1.0, 1.0, 0.8);
    readonly progressBarDownColor = new Color4(1.0, 1.0, 0.6, 0.8);
    readonly progressBarOutColor = new Color4(0.8, 0.8, 0.8, 0.8);

    readonly progressBarBgOverColor = new Color4(0.8, 0.8, 0.8, 0.5);
    readonly progressBarBgDownColor = new Color4(0.8, 0.8, 0.5, 0.5);
    readonly progressBarBgOutColor = new Color4(0.7, 0.7, 0.7, 0.5);
	bodyScaleY = 1.0;
	progressBarLength = 200;
    constructor() {
		super();
	}

    destroy(): void {
    }
    applyToBodyBtn(btn: ColorRectImgButton): void {
        if(btn) {
            btn.overColor.copyFrom(this.progressBtnOverColor);
            btn.downColor.copyFrom(this.progressBtnDownColor);
            btn.outColor.copyFrom(this.progressBtnOutColor);
			btn.setColor(btn.outColor);
        }
	}
    // applyToHeadBtn(btn: ColorRectImgButton): void {
    //     if(btn) {
    //         btn.overColor.copyFrom(this.progressBtnOverColor);
    //         btn.downColor.copyFrom(this.progressBtnDownColor);
    //         btn.outColor.copyFrom(this.progressBtnOutColor);
    //     }
	// }
    // applyToBtn(btn: ColorRectImgButton): void {
    //     if(btn) {
    //         btn.overColor.copyFrom(this.progressBtnOverColor);
    //         btn.downColor.copyFrom(this.progressBtnDownColor);
    //         btn.outColor.copyFrom(this.progressBtnOutColor);
    //     }
	// }
	copyTo(dst: ProgressBarStyle): void {
		super.copyTo(dst);
		dst.progressBtnFontColor.copyFrom( this.progressBtnFontColor );
		dst.progressBtnFontBgColor.copyFrom( this.progressBtnFontBgColor );
		dst.progressBtnOverColor.copyFrom( this.progressBtnOverColor );
		dst.progressBtnDownColor.copyFrom( this.progressBtnDownColor );
		dst.progressBtnOutColor.copyFrom( this.progressBtnOutColor );

		dst.progressBarOverColor.copyFrom( this.progressBarOverColor );
		dst.progressBarDownColor.copyFrom( this.progressBarDownColor );
		dst.progressBarOutColor.copyFrom( this.progressBarOutColor );

		dst.progressBarBgOverColor.copyFrom( this.progressBarBgOverColor );
		dst.progressBarBgDownColor.copyFrom( this.progressBarBgDownColor );
		dst.progressBarBgOutColor.copyFrom( this.progressBarBgOutColor );
		dst.progressBarLength = this.progressBarLength;
	}
}
