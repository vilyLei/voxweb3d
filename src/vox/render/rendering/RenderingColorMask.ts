/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRenderingColorMask } from "./IRenderingColorMask";

class RenderingColorMask implements IRenderingColorMask {

    readonly ALL_TRUE: number;
    readonly ALL_FALSE: number;
    readonly RED_TRUE: number;
    readonly GREEN_TRUE: number;
    readonly BLUE_TRUE: number;
    readonly ALPHA_TRUE: number;
    readonly RED_FALSE: number;
    readonly GREEN_FALSE: number;
    readonly BLUE_FALSE: number;
    readonly ALPHA_FALSE: number;

    constructor(st: any) {

        let t: any = this;
        t.ALL_TRUE = st.COLOR_MASK_ALL_TRUE;
        t.ALL_FALSE = st.COLOR_MASK_ALL_FALSE;
        t.RED_TRUE = st.COLOR_MASK_RED_TRUE;
        t.GREEN_TRUE = st.COLOR_MASK_GREEN_TRUE;
        t.BLUE_TRUE = st.COLOR_MASK_BLUE_TRUE;
        t.ALPHA_TRUE = st.COLOR_MASK_ALPHA_TRUE;
        t.RED_FALSE = st.COLOR_MASK_RED_FALSE;
        t.GREEN_FALSE = st.COLOR_MASK_GREEN_FALSE;
        t.BLUE_FALSE = st.COLOR_MASK_BLUE_FALSE;
        t.ALPHA_FALSE = st.COLOR_MASK_ALPHA_FALSE;
    }
}
export { RenderingColorMask }
