/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../RendererState";
import { IRenderingState } from "./IRenderingState";

class RenderingState implements IRenderingState {

    readonly NORMAL_STATE: number = 0;
    readonly BACK_CULLFACE_NORMAL_STATE: number = 0;
    readonly FRONT_CULLFACE_NORMAL_STATE: number = 1;
    readonly NONE_CULLFACE_NORMAL_STATE: number = 2;
    readonly ALL_CULLFACE_NORMAL_STATE: number = 3;
    readonly BACK_NORMAL_ALWAYS_STATE: number = 4;
    readonly BACK_TRANSPARENT_STATE: number = 5;
    readonly BACK_TRANSPARENT_ALWAYS_STATE: number = 6;
    readonly NONE_TRANSPARENT_STATE: number = 7;
    readonly NONE_TRANSPARENT_ALWAYS_STATE: number = 8;
    readonly FRONT_CULLFACE_GREATER_STATE: number = 9;
    readonly BACK_ADD_BLENDSORT_STATE: number = 10;
    readonly BACK_ADD_ALWAYS_STATE: number = 11;
    readonly BACK_ALPHA_ADD_ALWAYS_STATE: number = 12;
    readonly NONE_ADD_ALWAYS_STATE: number = 13;
    readonly NONE_ADD_BLENDSORT_STATE: number = 14;
    readonly NONE_ALPHA_ADD_ALWAYS_STATE: number = 15;
    readonly FRONT_ADD_ALWAYS_STATE: number = 16;
    readonly FRONT_TRANSPARENT_STATE: number = 17;
    readonly FRONT_TRANSPARENT_ALWAYS_STATE: number = 18;
    readonly NONE_CULLFACE_NORMAL_ALWAYS_STATE: number = 19;
    readonly BACK_ALPHA_ADD_BLENDSORT_STATE: number = 20;
    constructor() {
        
        let state = RendererState;
        let selfT: any = this;
        selfT.NORMAL_STATE = state.NORMAL_STATE;
        selfT.BACK_CULLFACE_NORMAL_STATE = state.BACK_CULLFACE_NORMAL_STATE;
        selfT.FRONT_CULLFACE_NORMAL_STATE = state.FRONT_CULLFACE_NORMAL_STATE;
        selfT.NONE_CULLFACE_NORMAL_STATE = state.NONE_CULLFACE_NORMAL_STATE;
        selfT.ALL_CULLFACE_NORMAL_STATE = state.ALL_CULLFACE_NORMAL_STATE;
        selfT.BACK_NORMAL_ALWAYS_STATE = state.BACK_NORMAL_ALWAYS_STATE;
        selfT.BACK_TRANSPARENT_STATE = state.BACK_TRANSPARENT_STATE;
        selfT.BACK_TRANSPARENT_ALWAYS_STATE = state.BACK_TRANSPARENT_ALWAYS_STATE;
        selfT.NONE_TRANSPARENT_STATE = state.NONE_TRANSPARENT_STATE;
        selfT.NONE_TRANSPARENT_ALWAYS_STATE = state.NONE_TRANSPARENT_ALWAYS_STATE;
        selfT.FRONT_CULLFACE_GREATER_STATE = state.FRONT_CULLFACE_GREATER_STATE;
        selfT.BACK_ADD_BLENDSORT_STATE = state.BACK_ADD_BLENDSORT_STATE;
        selfT.BACK_ADD_ALWAYS_STATE = state.BACK_ADD_ALWAYS_STATE;
        selfT.BACK_ALPHA_ADD_ALWAYS_STATE = state.BACK_ALPHA_ADD_ALWAYS_STATE;
        selfT.NONE_ADD_ALWAYS_STATE = state.NONE_ADD_ALWAYS_STATE;
        selfT.NONE_ADD_BLENDSORT_STATE = state.NONE_ADD_BLENDSORT_STATE;
        selfT.NONE_ALPHA_ADD_ALWAYS_STATE = state.NONE_ALPHA_ADD_ALWAYS_STATE;
        selfT.FRONT_ADD_ALWAYS_STATE = state.FRONT_ADD_ALWAYS_STATE;
        selfT.FRONT_TRANSPARENT_STATE = state.FRONT_TRANSPARENT_STATE;
        selfT.FRONT_TRANSPARENT_ALWAYS_STATE = state.FRONT_TRANSPARENT_ALWAYS_STATE;
        selfT.NONE_CULLFACE_NORMAL_ALWAYS_STATE = state.NONE_CULLFACE_NORMAL_ALWAYS_STATE;
        selfT.BACK_ALPHA_ADD_BLENDSORT_STATE = state.BACK_ALPHA_ADD_BLENDSORT_STATE;
    }
}
export { RenderingState }