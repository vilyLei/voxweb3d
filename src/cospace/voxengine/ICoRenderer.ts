import { IRendererInstance } from "../../vox/scene/IRendererInstance";
import { CoRendererDevice } from "./render/CoRendererDevice";
import { CoRendererState } from "./render/CoRendererState";
interface IRenderDrawMode {
    ELEMENTS_TRIANGLES: number;// = 1;
    ELEMENTS_TRIANGLE_STRIP: number;// = 2;
    ELEMENTS_TRIANGLE_FAN: number;// = 3;
    ELEMENTS_INSTANCED_TRIANGLES: number;// = 4;
    ARRAYS_LINES: number;// = 5;
    ARRAYS_LINE_STRIP: number;// = 6;
    ARRAYS_POINTS: number;// = 7;
    ELEMENTS_LINES: number;// = 8;
    DISABLE: number;// = 0;
}

interface IRenderBlendMode {
    NORMAL: number;// = 1;
    OPAQUE: number;// = 1;
    TRANSPARENT: number;// = 2;
    ALPHA_ADD: number;// = 3;
    ADD: number;// = 4;
    ADD_LINEAR: number;// = 5;
    INVERSE_ALPHA: number;// = 6;
    BLAZE: number;// = 7;
    OVERLAY: number;// = 8;
    OVERLAY2: number;// = 8;
    DISABLE: number;// = 0;
    //MAX: number;// = 8;
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
interface IGLStencilFunc {
    NEVER: number;// = 1;
    LESS: number;// = 1;
    EQUAL: number;// = 1;
    GREATER: number;// = 1;
    NOTEQUAL: number;// = 1;
    GEQUAL: number;// = 1;
    ALWAYS: number;// = 1;
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
interface IGLStencilOp {
    KEEP: number;// = 1;
    ZERO: number;// = 1;
    REPLACE: number;// = 1;
    INCR: number;// = 1;
    INCR_WRAP: number;// = 1;
    DECR: number;// = 1;
    DECR_WRAP: number;// = 1;
    INVERT: number;// = 1;
}
interface IGLBlendMode {
    ZERO: number;// = 1;
    ONE: number;// = 1;
    SRC_COLOR: number;// = 1;
    DST_COLOR: number;// = 1;
    SRC_ALPHA: number;// = 1;
    DST_ALPHA: number;// = 1;
    ONE_MINUS_SRC_ALPHA: number;// = 1;
}
interface IGLBlendEquation {
    FUNC_ADD: number;// = 1;
    FUNC_SUBTRACT: number;// = 1;
    FUNC_REVERSE_SUBTRACT: number;// = 1;
    MIN_EXT: number;// = 1;
    MAX_EXT: number;// = 1;
    MIN: number;// = 1;
    MAX: number;// = 1;
}
interface ICullFaceMode {
    BACK: number;// = 1;
    FRONT: number;// = 2;
    FRONT_AND_BACK: number;// = 3;
    NONE: number;// = 0;
    DISABLE: number;// = 0;
}
interface IDepthTestMode {
    NEVER: number;// = 1;
    //glDepthMask(false); glDepthFunc(GL_ALWAYS);
    ALWAYS: number;// = 2;
    //glDepthMask(true); glDepthFunc(GL_LEQUAL);
    SKY: number;// = 3;
    TRUE_LESS_EQUAL: number;// = 3;
    //glDepthMask(true); glDepthFunc(GL_LESS);
    OPAQUE: number;// = 4;
    TRUE_LESS: number;// = 4;
    //glDepthMask(false); glDepthFunc(GL_EQUAL);
    OPAQUE_OVERHEAD: number;// = 5;
    FALSE_EQUAL: number;// = 5;
    //glDepthMask(false); glDepthFunc(GL_LESS);
    FALSE_LESS: number;// = 6;
    BLEND: number;// = 6;
    BLEND_SORT: number;// = 6;
    TRANSPARENT_SORT: number;// = 6;
    //glDepthMask(TRUE); glDepthFunc(GL_LEQUAL);
    TRUE_LEQUAL: number;// = 7;
    WIRE_FRAME: number;// = 7;
    //
    //glDepthMask(false); glDepthFunc(GL_LEQUAL);
    FALSE_LEQUAL: number;// = 8;
    DECALS: number;// = 8;
    //glDepthMask(false); glDepthFunc(GL_ALWAYS);
    NEXT_LAYER: number;// = 11;
    WIRE_FRAME_NEXT: number;// = 12;
    //glDepthMask(true); glDepthFunc(GL_EQUAL);
    TRUE_EQUAL: number;// = 13;
    //glDepthMask(true); glDepthFunc(GL_GREATER);
    TRUE_GREATER: number;// = 14;
    //glDepthMask(true); glDepthFunc(GL_GEQUAL);
    TRUE_GEQUAL: number;// = 15;
    DISABLE: number;// = 0;
}
interface ICoRenderer {

	RenderDrawMode: IRenderDrawMode,
	CullFaceMode: ICullFaceMode,
	DepthTestMode: IDepthTestMode,
	RenderBlendMode: IRenderBlendMode,

	GLStencilFunc: IGLStencilFunc,
	GLStencilOp: IGLStencilOp,
	GLBlendMode: IGLBlendMode,
	GLBlendEquation: IGLBlendEquation,

	RendererDevice: CoRendererDevice;
	RendererState: CoRendererState;
	createRendererInstance(): IRendererInstance;
}
export { IRenderDrawMode,ICullFaceMode,IDepthTestMode,IRenderBlendMode,IGLStencilFunc,IGLStencilOp,IGLBlendMode,IGLBlendEquation, ICoRenderer }
