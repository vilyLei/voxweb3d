/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export class RenderDrawMode {
    static readonly ELEMENTS_TRIANGLES: number = 1;
    static readonly ELEMENTS_TRIANGLE_STRIP: number = 2;
    static readonly ELEMENTS_TRIANGLE_FAN: number = 3;
    static readonly ELEMENTS_INSTANCED_TRIANGLES: number = 4;
    static readonly ARRAYS_LINES: number = 5;
    static readonly ARRAYS_LINE_STRIP: number = 6;
    static readonly ARRAYS_POINTS: number = 7;
    static readonly DISABLE: number = 0;
}
// blend mode
export class RenderBlendMode {
    static readonly NORMAL: number = 1;
    static readonly OPAQUE: number = 1;
    static readonly TRANSPARENT: number = 2;
    static readonly ALPHA_ADD: number = 3;
    static readonly ADD: number = 4;
    static readonly ADD_LINEAR: number = 5;
    static readonly INVERSE_ALPHA: number = 6;
    static readonly BLAZE: number = 7;
    static readonly OVERLAY: number = 8;
    static readonly OVERLAY2: number = 8;
    static readonly DISABLE: number = 0;
    //static readonly MAX: number = 8;
}
/**
 * gl.NEVER:           Never pass.
 * gl.LESS:            Pass if (ref & mask) <  (stencil & mask).
 * gl.EQUAL:           Pass if (ref & mask) =  (stencil & mask).
 * gl.LEQUAL:          Pass if (ref & mask) <= (stencil & mask).
 * gl.GREATER:         Pass if (ref & mask) >  (stencil & mask).
 * gl.NOTEQUAL:        Pass if (ref & mask) != (stencil & mask).
 * gl.GEQUAL:          Pass if (ref & mask) >= (stencil & mask).
 * gl.ALWAYS:          Always pass.
 */
export class GLStencilFunc {
    static readonly NEVER: number = 1;
    static readonly LESS: number = 1;
    static readonly EQUAL: number = 1;
    static readonly GREATER: number = 1;
    static readonly NOTEQUAL: number = 1;
    static readonly GEQUAL: number = 1;
    static readonly ALWAYS: number = 1;
}
/**
 * gl.KEEP              Keeps the current value.
 * gl.ZERO              Sets the stencil buffer value to 0.
 * gl.REPLACE           Sets the stencil buffer value to the reference value as specified by WebGLRenderingContext.stencilFunc().
 * gl.INCR              Increments the current stencil buffer value. Clamps to the maximum representable unsigned value.
 * gl.INCR_WRAP         Increments the current stencil buffer value. Wraps stencil buffer value to zero when incrementing the maximum representable unsigned value.
 * gl.DECR              Decrements the current stencil buffer value. Clamps to 0.
 * gl.DECR_WRAP         Decrements the current stencil buffer value. Wraps stencil buffer value to the maximum representable unsigned value when decrementing a stencil buffer value of 0.
 * gl.INVERT            Inverts the current stencil buffer value bitwise.
 */
export class GLStencilOp {
    static readonly KEEP: number = 1;
    static readonly ZERO: number = 1;
    static readonly REPLACE: number = 1;
    static readonly INCR: number = 1;
    static readonly INCR_WRAP: number = 1;
    static readonly DECR: number = 1;
    static readonly DECR_WRAP: number = 1;
    static readonly INVERT: number = 1;
}
export class GLBlendMode {
    static readonly ZERO: number = 1;
    static readonly ONE: number = 1;
    static readonly SRC_COLOR: number = 1;
    static readonly DST_COLOR: number = 1;
    static readonly SRC_ALPHA: number = 1;
    static readonly DST_ALPHA: number = 1;
    static readonly ONE_MINUS_SRC_ALPHA: number = 1;
}
export class GLBlendEquation {
    static readonly FUNC_ADD: number = 1;
    static readonly FUNC_SUBTRACT: number = 1;
    static readonly FUNC_REVERSE_SUBTRACT: number = 1;
    static readonly MIN_EXT: number = 1;
    static readonly MAX_EXT: number = 1;
    static readonly MIN: number = 1;
    static readonly MAX: number = 1;
}
export class CullFaceMode {
    static readonly BACK: number = 1;
    static readonly FRONT: number = 2;
    static readonly FRONT_AND_BACK: number = 3;
    static readonly NONE: number = 0;
    static readonly DISABLE: number = 0;
}
export class DepthTestMode {
    static readonly NEVER: number = 1;
    //glDepthMask(false); glDepthFunc(GL_ALWAYS);
    static readonly ALWAYS: number = 2;
    //glDepthMask(true); glDepthFunc(GL_LEQUAL);
    static readonly SKY: number = 3;
    static readonly TRUE_LESS_EQUAL: number = 3;
    //glDepthMask(true); glDepthFunc(GL_LESS);
    static readonly OPAQUE: number = 4;
    static readonly TRUE_LESS: number = 4;
    //glDepthMask(false); glDepthFunc(GL_EQUAL);
    static readonly OPAQUE_OVERHEAD: number = 5;
    static readonly FALSE_EQUAL: number = 5;
    //glDepthMask(false); glDepthFunc(GL_LESS);
    static readonly FALSE_LESS: number = 6;
    static readonly BLEND: number = 6;
    static readonly BLEND_SORT: number = 6;
    static readonly TRANSPARENT_SORT: number = 6;
    //glDepthMask(TRUE); glDepthFunc(GL_LEQUAL);
    static readonly TRUE_LEQUAL: number = 7;
    static readonly WIRE_FRAME: number = 7;
    //
    //glDepthMask(false); glDepthFunc(GL_LEQUAL);
    static readonly FALSE_LEQUAL: number = 8;
    static readonly DECALS: number = 8;
    //glDepthMask(false); glDepthFunc(GL_ALWAYS);
    static readonly NEXT_LAYER: number = 11;
    static readonly WIRE_FRAME_NEXT: number = 12;
    //glDepthMask(true); glDepthFunc(GL_EQUAL);
    static TRUE_EQUAL: number = 13;
    //glDepthMask(true); glDepthFunc(GL_GREATER);
    static TRUE_GREATER: number = 14;
    //glDepthMask(true); glDepthFunc(GL_GEQUAL);
    static TRUE_GEQUAL: number = 15;
    static DISABLE: number = 0;
}
export class RenderConst {
    // 32bit psign: 8bit->pageIndex,8bit->block uid,16bit->RenderDispRenderID
    static readonly SCENE_RO_FILTER_BEGIN: number = (1 << 19);
    static readonly SCENE_RO_FILTER_FINISH: number = (2 << 19);
    static readonly SCENE_RO_ERASE: number = 0;
}
export enum DisplayRenderSign {
    // 还没有加入 world
    NOT_IN_WORLD = -1,
    // 正在进入 world
    GO_TO_WORLD = 1,
    // 真正存在于 world, 也就是直接可以在 process 中使用了
    LIVE_IN_WORLD = 2
}

//export {RenderBlendMode, DisplayRenderSign};