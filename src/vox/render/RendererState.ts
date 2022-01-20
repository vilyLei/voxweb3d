/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import { IRAdapterContext } from "../../vox/render/IRAdapterContext";
import { IRODrawState } from "../../vox/render/rendering/IRODrawState";

import { RenderColorMask } from "../../vox/render/rendering/RenderColorMask";
import { RenderStateObject } from "../../vox/render/rendering/RenderStateObject";

import { CullFaceMode, RenderBlendMode, DepthTestMode, GLBlendMode, GLBlendEquation } from "../../vox/render/RenderConst";
import { IVRO } from "../../vox/render/vtx/IVRO";

class RendererState {

    private static s_initBoo: boolean = true;

    private static readonly VRO: IVRO = null;
    private static readonly Rstate: IRODrawState = null;
    static DrawCallTimes: number = 0;
    static DrawTrisNumber: number = 0;
    static POVNumber: number = 0;

    static readonly COLOR_MASK_ALL_TRUE: number = 0;
    static readonly COLOR_MASK_ALL_FALSE: number = 1;
    static readonly COLOR_MASK_RED_TRUE: number = 2;
    static readonly COLOR_MASK_GREEN_TRUE: number = 3;
    static readonly COLOR_MASK_BLUE_TRUE: number = 4;
    static readonly COLOR_MASK_ALPHA_TRUE: number = 5;
    static readonly COLOR_MASK_RED_FALSE: number = 6;
    static readonly COLOR_MASK_GREEN_FALSE: number = 7;
    static readonly COLOR_MASK_BLUE_FALSE: number = 8;
    static readonly COLOR_MASK_ALPHA_FALSE: number = 9;

    static readonly NORMAL_STATE: number = 0;
    static readonly BACK_CULLFACE_NORMAL_STATE: number = 0;
    static readonly FRONT_CULLFACE_NORMAL_STATE: number = 1;
    static readonly NONE_CULLFACE_NORMAL_STATE: number = 2;
    static readonly ALL_CULLFACE_NORMAL_STATE: number = 3;
    static readonly BACK_NORMAL_ALWAYS_STATE: number = 4;
    static readonly BACK_TRANSPARENT_STATE: number = 5;
    static readonly BACK_TRANSPARENT_ALWAYS_STATE: number = 6;
    static readonly NONE_TRANSPARENT_STATE: number = 7;
    static readonly NONE_TRANSPARENT_ALWAYS_STATE: number = 8;
    static readonly FRONT_CULLFACE_GREATER_STATE: number = 9;
    static readonly BACK_ADD_BLENDSORT_STATE: number = 10;
    static readonly BACK_ADD_ALWAYS_STATE: number = 11;
    static readonly BACK_ALPHA_ADD_ALWAYS_STATE: number = 12;
    static readonly NONE_ADD_ALWAYS_STATE: number = 13;
    static readonly NONE_ADD_BLENDSORT_STATE: number = 14;
    static readonly NONE_ALPHA_ADD_ALWAYS_STATE: number = 15;
    static readonly FRONT_ADD_ALWAYS_STATE: number = 16;
    static readonly FRONT_TRANSPARENT_STATE: number = 17;
    static readonly FRONT_TRANSPARENT_ALWAYS_STATE: number = 18;
    static readonly NONE_CULLFACE_NORMAL_ALWAYS_STATE: number = 19;
    static readonly BACK_ALPHA_ADD_BLENDSORT_STATE: number = 20;

    static Initialize(rstate: IRODrawState, vro: IVRO): void {
        if (RendererState.s_initBoo) {
            RendererState.s_initBoo = false;

            let state: any = RendererState;
            state.Rstate = rstate;
            state.VRO = vro;

            RenderColorMask.Rstate = RendererState.Rstate;
            RenderStateObject.Rstate = RendererState.Rstate;

            state.COLOR_MASK_ALL_TRUE = RenderColorMask.Create("all_true", true, true, true, true);
            state.COLOR_MASK_ALL_FALSE = RenderColorMask.Create("all_false", false, false, false, false);
            state.COLOR_MASK_RED_TRUE = RenderColorMask.Create("red_true", true, false, false, false);
            state.COLOR_MASK_GREEN_TRUE = RenderColorMask.Create("green_true", false, true, false, false);
            state.COLOR_MASK_BLUE_TRUE = RenderColorMask.Create("blue_true", false, false, true, false);
            state.COLOR_MASK_ALPHA_TRUE = RenderColorMask.Create("alpha_true", false, false, false, true);
            state.COLOR_MASK_RED_FALSE = RenderColorMask.Create("red_false", false, true, true, true);
            state.COLOR_MASK_GREEN_FALSE = RenderColorMask.Create("green_false", true, false, true, true);
            state.COLOR_MASK_BLUE_FALSE = RenderColorMask.Create("blue_false", true, true, false, true);
            state.COLOR_MASK_ALPHA_FALSE = RenderColorMask.Create("alpha_false", true, true, true, false);

            let rso = RenderStateObject;
            let rBlendMode: any = RenderBlendMode;

            rBlendMode.NORMAL = rso.CreateBlendMode("NORMAL", GLBlendMode.ONE, GLBlendMode.ZERO, GLBlendEquation.FUNC_ADD);
            rBlendMode.OPAQUE = rso.CreateBlendMode("OPAQUE", GLBlendMode.ONE, GLBlendMode.ZERO, GLBlendEquation.FUNC_ADD);
            rBlendMode.TRANSPARENT = rso.CreateBlendMode("TRANSPARENT", GLBlendMode.SRC_ALPHA, GLBlendMode.ONE_MINUS_SRC_ALPHA, GLBlendEquation.FUNC_ADD);
            rBlendMode.ALPHA_ADD = rso.CreateBlendMode("ALPHA_ADD", GLBlendMode.ONE, GLBlendMode.ONE_MINUS_SRC_ALPHA, GLBlendEquation.FUNC_ADD);
            rBlendMode.ADD = rso.CreateBlendMode("ADD", GLBlendMode.SRC_ALPHA, GLBlendMode.ONE, GLBlendEquation.FUNC_ADD);
            rBlendMode.ADD_LINEAR = rso.CreateBlendMode("ADD_LINEAR", GLBlendMode.ONE, GLBlendMode.ONE, GLBlendEquation.FUNC_ADD);
            rBlendMode.INVERSE_ALPHA = rso.CreateBlendMode("INVERSE_ALPHA", GLBlendMode.ONE, GLBlendMode.SRC_ALPHA, GLBlendEquation.FUNC_ADD);

            rBlendMode.BLAZE = rso.CreateBlendMode("BLAZE", GLBlendMode.SRC_COLOR, GLBlendMode.ONE, GLBlendEquation.FUNC_ADD);
            rBlendMode.OVERLAY = rso.CreateBlendMode("OVERLAY", GLBlendMode.DST_COLOR, GLBlendMode.DST_ALPHA, GLBlendEquation.FUNC_ADD);
            rBlendMode.OVERLAY2 = rso.CreateBlendMode("OVERLAY2", GLBlendMode.DST_COLOR, GLBlendMode.SRC_ALPHA, GLBlendEquation.FUNC_ADD);

            state.NORMAL_STATE = rso.Create("normal", CullFaceMode.BACK, RenderBlendMode.NORMAL, DepthTestMode.OPAQUE);
            state.BACK_CULLFACE_NORMAL_STATE = state.NORMAL_STATE;
            state.FRONT_CULLFACE_NORMAL_STATE = rso.Create("front_normal", CullFaceMode.FRONT, RenderBlendMode.NORMAL, DepthTestMode.OPAQUE);
            state.NONE_CULLFACE_NORMAL_STATE = rso.Create("none_normal", CullFaceMode.NONE, RenderBlendMode.NORMAL, DepthTestMode.OPAQUE);
            state.ALL_CULLFACE_NORMAL_STATE = rso.Create("all_cull_normal", CullFaceMode.FRONT_AND_BACK, RenderBlendMode.NORMAL, DepthTestMode.OPAQUE);
            state.BACK_NORMAL_ALWAYS_STATE = rso.Create("back_normal_always", CullFaceMode.BACK, RenderBlendMode.NORMAL, DepthTestMode.ALWAYS);
            state.BACK_TRANSPARENT_STATE = rso.Create("back_transparent", CullFaceMode.BACK, RenderBlendMode.TRANSPARENT, DepthTestMode.TRANSPARENT_SORT);
            state.BACK_TRANSPARENT_ALWAYS_STATE = rso.Create("back_transparent_always", CullFaceMode.BACK, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);
            state.NONE_TRANSPARENT_STATE = rso.Create("none_transparent", CullFaceMode.NONE, RenderBlendMode.TRANSPARENT, DepthTestMode.TRANSPARENT_SORT);
            state.NONE_TRANSPARENT_ALWAYS_STATE = rso.Create("none_transparent_always", CullFaceMode.NONE, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);
            state.FRONT_CULLFACE_GREATER_STATE = rso.Create("front_greater", CullFaceMode.FRONT, RenderBlendMode.NORMAL, DepthTestMode.TRUE_GREATER);
            state.BACK_ADD_BLENDSORT_STATE = rso.Create("back_add_blendSort", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.TRANSPARENT_SORT);
            state.BACK_ADD_ALWAYS_STATE = rso.Create("back_add_always", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
            state.BACK_ALPHA_ADD_ALWAYS_STATE = rso.Create("back_alpha_add_always", CullFaceMode.BACK, RenderBlendMode.ALPHA_ADD, DepthTestMode.ALWAYS);
            state.NONE_ADD_ALWAYS_STATE = rso.Create("none_add_always", CullFaceMode.NONE, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
            state.NONE_ADD_BLENDSORT_STATE = rso.Create("none_add_blendSort", CullFaceMode.NONE, RenderBlendMode.ADD, DepthTestMode.TRANSPARENT_SORT);
            state.NONE_ALPHA_ADD_ALWAYS_STATE = rso.Create("none_alpha_add_always", CullFaceMode.NONE, RenderBlendMode.ALPHA_ADD, DepthTestMode.ALWAYS);
            state.FRONT_ADD_ALWAYS_STATE = rso.Create("front_add_always", CullFaceMode.FRONT, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
            state.FRONT_TRANSPARENT_STATE = rso.Create("front_transparent", CullFaceMode.FRONT, RenderBlendMode.TRANSPARENT, DepthTestMode.TRANSPARENT_SORT);
            state.FRONT_TRANSPARENT_ALWAYS_STATE = rso.Create("front_transparent_always", CullFaceMode.FRONT, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);
            state.NONE_CULLFACE_NORMAL_ALWAYS_STATE = rso.Create("none_normal_always", CullFaceMode.NONE, RenderBlendMode.NORMAL, DepthTestMode.ALWAYS);
            state.BACK_ALPHA_ADD_BLENDSORT_STATE = rso.Create("back_alpha_add_blendSort", CullFaceMode.BACK, RenderBlendMode.ALPHA_ADD, DepthTestMode.TRANSPARENT_SORT);
        }
    }

    static CreateBlendMode(name: string, srcColor: number, dstColor: number, blendEquation: number = 0): number {
        return RenderStateObject.CreateBlendMode(name, srcColor, dstColor, blendEquation);
    }
    static CreateBlendModeSeparate(name: string, srcColor: number, dstColor: number, srcAlpha: number = 0, dstAlpha: number = 0, blendEquation: number = 0): number {
        return RenderStateObject.CreateBlendModeSeparate(name, srcColor, dstColor, srcAlpha, dstAlpha, blendEquation);
    }
    static CreateRenderState(objName: string, cullFaceMode: number, blendMode: number, depthTestMode: number): number {
        return RenderStateObject.Create(objName, cullFaceMode, blendMode, depthTestMode);
    }
    static CreateRenderColorMask(objName: string, rBoo: boolean, gBoo: boolean, bBoo: boolean, aBoo: boolean): number {
        return RenderColorMask.Create(objName, rBoo, gBoo, bBoo, aBoo);
    }
    static GetRenderStateByName(objName: string): number {
        return RenderStateObject.GetRenderStateByName(objName);
    }
    static GetRenderColorMaskByName(objName: string): number {
        return RenderColorMask.GetColorMaskByName(objName);
    }

    static UnlockBlendMode(): void {
        RenderStateObject.UnlockBlendMode();
    }
    static LockBlendMode(cullFaceMode: number): void {
        RenderStateObject.LockBlendMode(cullFaceMode);
    }
    static UnlockDepthTestMode(): void {
        RenderStateObject.UnlockDepthTestMode();
    }
    static LockDepthTestMode(depthTestMode: number): void {
        RenderStateObject.LockDepthTestMode(depthTestMode);
    }
    static ResetState(): void {
        RenderColorMask.Reset();
        RenderStateObject.Reset();
        RendererState.Rstate.reset();
        RendererState.VRO.__$resetVRO();
        // VROBase.Reset();
    }
    static Reset(context: IRAdapterContext): void {
        RenderColorMask.Reset();
        RenderStateObject.Reset();
        RendererState.Rstate.setRenderContext(context);
        RendererState.Rstate.reset();
    }
    static ResetInfo(): void {
        RendererState.DrawCallTimes = 0;
        RendererState.DrawTrisNumber = 0;
        RendererState.POVNumber = 0;
    }

    static SetDepthTestEnable(enable: boolean): void {

        RendererState.Rstate.setDepthTestEnable(enable);
    }
    static SetBlendEnable(enable: boolean): void {
        RendererState.Rstate.setBlendEnable(enable);
    }
}

export default RendererState;