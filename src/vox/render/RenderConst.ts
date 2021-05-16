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
    static readonly ADD2: number = 5;
    static readonly INVERSE_ALPHA: number = 6;
    static readonly BLAZE: number = 7;
    static readonly OVERLAY: number = 8;
    static readonly OVERLAY2: number = 8;
    static readonly DISABLE: number = 0;
}
export class CullFaceMode {
    static readonly BACK: number = 1;
    static readonly FRONT: number = 2;
    static readonly FRONT_AND_BACK: number = 3;
    static readonly NONE: number = 4;
    static readonly DISABLE: number = 0;
}
export class DepthTestMode {
    static readonly RENDER_NEVER: number = 1;
    //glDepthMask(false); glDepthFunc(GL_ALWAYS);
    static readonly RENDER_ALWAYS: number = 2;
    //glDepthMask(true); glDepthFunc(GL_LEQUAL);
    static readonly RENDER_SKY: number = 3;
    static readonly RENDER_TRUE_LESS_EQUAL: number = 3;
    //glDepthMask(true); glDepthFunc(GL_LESS);
    static readonly RENDER_OPAQUE: number = 4;
    static readonly RENDER_TRUE_LESS: number = 4;
    //glDepthMask(false); glDepthFunc(GL_EQUAL);
    static readonly RENDER_OPAQUE_OVERHEAD: number = 5;
    static readonly RENDER_FALSE_EQUAL: number = 5;
    //glDepthMask(false); glDepthFunc(GL_LESS);
    static readonly RENDER_FALSE_LESS: number = 6;
    static readonly RENDER_BLEND: number = 6;
    static readonly RENDER_BLEND_SORT: number = 6;
    static readonly RENDER_TRANSPARENT_SORT: number = 6;
    //glDepthMask(TRUE); glDepthFunc(GL_LEQUAL);
    static readonly RENDER_TRUE_LEQUAL: number = 7;
    static readonly RENDER_WIRE_FRAME: number = 7;
    //
    //glDepthMask(false); glDepthFunc(GL_LEQUAL);
    static readonly RENDER_FALSE_LEQUAL: number = 8;
    static readonly RENDER_DECALS: number = 8;
    //glDepthMask(false); glDepthFunc(GL_ALWAYS);
    static readonly RENDER_NEXT_LAYER: number = 11;
    static readonly RENDER_WIRE_FRAME_NEXT: number = 12;
    //glDepthMask(true); glDepthFunc(GL_EQUAL);
    static RENDER_TRUE_EQUAL: number = 13;
    //glDepthMask(true); glDepthFunc(GL_GREATER);
    static RENDER_TRUE_GREATER: number = 14;
    //glDepthMask(true); glDepthFunc(GL_GEQUAL);
    static RENDER_TRUE_GEQUAL: number = 15;
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