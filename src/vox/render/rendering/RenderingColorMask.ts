/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../RendererState";
import { IRenderingColorMask } from "./IRenderingColorMask";

class RenderingColorMask implements IRenderingColorMask {

    readonly ALL_TRUE: number = 0;
    readonly ALL_FALSE: number = 1;
    readonly RED_TRUE: number = 2;
    readonly GREEN_TRUE: number = 3;
    readonly BLUE_TRUE: number = 4;
    readonly ALPHA_TRUE: number = 5;
    readonly RED_FALSE: number = 6;
    readonly GREEN_FALSE: number = 7;
    readonly BLUE_FALSE: number = 8;
    readonly ALPHA_FALSE: number = 9;
    
    constructor() {
        
        let state = RendererState;
        let selfT: any = this;
        selfT.ALL_TRUE = state.COLOR_MASK_ALL_TRUE;
        selfT.ALL_FALSE = state.COLOR_MASK_ALL_FALSE;
        selfT.RED_TRUE = state.COLOR_MASK_RED_TRUE;
        selfT.GREEN_TRUE = state.COLOR_MASK_GREEN_TRUE;
        selfT.BLUE_TRUE = state.COLOR_MASK_BLUE_TRUE;
        selfT.ALPHA_TRUE = state.COLOR_MASK_ALPHA_TRUE;
        selfT.RED_FALSE = state.COLOR_MASK_RED_FALSE;
        selfT.GREEN_FALSE = state.COLOR_MASK_GREEN_FALSE;
        selfT.BLUE_FALSE = state.COLOR_MASK_BLUE_FALSE;
        selfT.ALPHA_FALSE = state.COLOR_MASK_ALPHA_FALSE;
    }
}
export { RenderingColorMask }