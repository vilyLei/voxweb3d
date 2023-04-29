/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IRenderingState {
    
    readonly NORMAL_STATE: number;// the default value is 0;
    readonly BACK_CULLFACE_NORMAL_STATE: number;// the default value is 0;
    readonly FRONT_CULLFACE_NORMAL_STATE: number;// the default value is 1;
    readonly NONE_CULLFACE_NORMAL_STATE: number;// the default value is 2;
    readonly ALL_CULLFACE_NORMAL_STATE: number;// the default value is 3;
    readonly BACK_NORMAL_ALWAYS_STATE: number;// the default value is 4;
    readonly BACK_TRANSPARENT_STATE: number;// the default value is 5;
    readonly BACK_TRANSPARENT_ALWAYS_STATE: number;// the default value is 6;
    readonly NONE_TRANSPARENT_STATE: number;// the default value is 7;
    readonly NONE_TRANSPARENT_ALWAYS_STATE: number;// the default value is 8;
    readonly FRONT_CULLFACE_GREATER_STATE: number;// the default value is 9;
    readonly BACK_ADD_BLENDSORT_STATE: number;// the default value is 10;
    readonly BACK_ADD_ALWAYS_STATE: number;// the default value is 11;
    readonly BACK_ALPHA_ADD_ALWAYS_STATE: number;// the default value is 12;
    readonly NONE_ADD_ALWAYS_STATE: number;// the default value is 13;
    readonly NONE_ADD_BLENDSORT_STATE: number;// the default value is 14;
    readonly NONE_ALPHA_ADD_ALWAYS_STATE: number;// the default value is 15;
    readonly FRONT_ADD_ALWAYS_STATE: number;// the default value is 16;
    readonly FRONT_TRANSPARENT_STATE: number;// the default value is 17;
    readonly FRONT_TRANSPARENT_ALWAYS_STATE: number;// the default value is 18;
    readonly NONE_CULLFACE_NORMAL_ALWAYS_STATE: number;// the default value is 19;
    readonly BACK_ALPHA_ADD_BLENDSORT_STATE: number;// the default value is 20;
}
export { IRenderingState }