/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRenderingState } from "./IRenderingState";

class RenderingState implements IRenderingState {

    readonly NORMAL_STATE: number;
    readonly BACK_CULLFACE_NORMAL_STATE: number;
    readonly FRONT_CULLFACE_NORMAL_STATE: number;
    readonly NONE_CULLFACE_NORMAL_STATE: number;
    readonly ALL_CULLFACE_NORMAL_STATE: number;
    readonly BACK_NORMAL_ALWAYS_STATE: number;
    readonly BACK_TRANSPARENT_STATE: number;
    readonly BACK_TRANSPARENT_ALWAYS_STATE: number;
    readonly NONE_TRANSPARENT_STATE: number;
    readonly NONE_TRANSPARENT_ALWAYS_STATE: number;
    readonly FRONT_CULLFACE_GREATER_STATE: number;
    readonly BACK_ADD_BLENDSORT_STATE: number;
    readonly BACK_ADD_ALWAYS_STATE: number;
    readonly BACK_ALPHA_ADD_ALWAYS_STATE: number;
    readonly NONE_ADD_ALWAYS_STATE: number;
    readonly NONE_ADD_BLENDSORT_STATE: number;
    readonly NONE_ALPHA_ADD_ALWAYS_STATE: number;
    readonly FRONT_ADD_ALWAYS_STATE: number;
    readonly FRONT_TRANSPARENT_STATE: number;
    readonly FRONT_TRANSPARENT_ALWAYS_STATE: number;
    readonly NONE_CULLFACE_NORMAL_ALWAYS_STATE: number;
    readonly BACK_ALPHA_ADD_BLENDSORT_STATE: number;
    constructor(st: any) {

        let t: any = this;
        t.NORMAL_STATE = st.NORMAL_STATE;
        t.BACK_CULLFACE_NORMAL_STATE = st.BACK_CULLFACE_NORMAL_STATE;
        t.FRONT_CULLFACE_NORMAL_STATE = st.FRONT_CULLFACE_NORMAL_STATE;
        t.NONE_CULLFACE_NORMAL_STATE = st.NONE_CULLFACE_NORMAL_STATE;
        t.ALL_CULLFACE_NORMAL_STATE = st.ALL_CULLFACE_NORMAL_STATE;
        t.BACK_NORMAL_ALWAYS_STATE = st.BACK_NORMAL_ALWAYS_STATE;
        t.BACK_TRANSPARENT_STATE = st.BACK_TRANSPARENT_STATE;
        t.BACK_TRANSPARENT_ALWAYS_STATE = st.BACK_TRANSPARENT_ALWAYS_STATE;
        t.NONE_TRANSPARENT_STATE = st.NONE_TRANSPARENT_STATE;
        t.NONE_TRANSPARENT_ALWAYS_STATE = st.NONE_TRANSPARENT_ALWAYS_STATE;
        t.FRONT_CULLFACE_GREATER_STATE = st.FRONT_CULLFACE_GREATER_STATE;
        t.BACK_ADD_BLENDSORT_STATE = st.BACK_ADD_BLENDSORT_STATE;
        t.BACK_ADD_ALWAYS_STATE = st.BACK_ADD_ALWAYS_STATE;
        t.BACK_ALPHA_ADD_ALWAYS_STATE = st.BACK_ALPHA_ADD_ALWAYS_STATE;
        t.NONE_ADD_ALWAYS_STATE = st.NONE_ADD_ALWAYS_STATE;
        t.NONE_ADD_BLENDSORT_STATE = st.NONE_ADD_BLENDSORT_STATE;
        t.NONE_ALPHA_ADD_ALWAYS_STATE = st.NONE_ALPHA_ADD_ALWAYS_STATE;
        t.FRONT_ADD_ALWAYS_STATE = st.FRONT_ADD_ALWAYS_STATE;
        t.FRONT_TRANSPARENT_STATE = st.FRONT_TRANSPARENT_STATE;
        t.FRONT_TRANSPARENT_ALWAYS_STATE = st.FRONT_TRANSPARENT_ALWAYS_STATE;
        t.NONE_CULLFACE_NORMAL_ALWAYS_STATE = st.NONE_CULLFACE_NORMAL_ALWAYS_STATE;
        t.BACK_ALPHA_ADD_BLENDSORT_STATE = st.BACK_ALPHA_ADD_BLENDSORT_STATE;
    }
}
export { RenderingState }
