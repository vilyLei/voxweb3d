/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../vox/material/Color4";

export default class SelectionBarStyle {

    readonly fontColor = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly fontBgColor = new Color4(1.0, 1.0, 1.0, 0.3);

    readonly overColor = new Color4(1.0, 0.5, 1.1, 1.0);
    readonly downColor = new Color4(1.0, 0.0, 1.0, 1.0);
    readonly outColor = new Color4(1.0, 1.0, 1.0, 1.0);

    headAlignType = "";
    headAlignPosValue = 0;
    // distance = 2;
    headVisible = true;
    bodyVisible = true;
    constructor() { }

    destroy(): void {
    }
    copyFrom(dst: SelectionBarStyle): void {

    }
}
