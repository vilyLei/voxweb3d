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
    readonly progressBtnOverColor = new Color4(1.0, 0.5, 1.1, 1.0);
    readonly progressBtnDownColor = new Color4(1.0, 0.0, 1.0, 1.0);
    readonly progressBtnOutColor = new Color4(1.0, 1.0, 1.0, 1.0);

    readonly progressBarOverColor = new Color4(1.0, 0.5, 1.1, 1.0);
    readonly progressBarDownColor = new Color4(1.0, 0.0, 1.0, 1.0);
    readonly progressBarOutColor = new Color4(1.0, 1.0, 1.0, 1.0);

    readonly progressBarBgOverColor = new Color4(1.0, 0.5, 1.1, 0.5);
    readonly progressBarBgDownColor = new Color4(1.0, 0.0, 1.0, 0.5);
    readonly progressBarBgOutColor = new Color4(1.0, 1.0, 1.0, 0.5);

	progressBarLength = 200;
    constructor() {
		super();
	}

    destroy(): void {
    }
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
