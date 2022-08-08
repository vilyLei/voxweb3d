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

    private static readonly VRO: IVRO;
    private static readonly Rstate: IRODrawState;
    static DrawCallTimes: number = 0;
    static DrawTrisNumber: number = 0;
    static POVNumber: number = 0;

    static readonly COLOR_MASK_ALL_TRUE: number;
    static readonly COLOR_MASK_ALL_FALSE: number;
    static readonly COLOR_MASK_RED_TRUE: number;
    static readonly COLOR_MASK_GREEN_TRUE: number;
    static readonly COLOR_MASK_BLUE_TRUE: number;
    static readonly COLOR_MASK_ALPHA_TRUE: number;
    static readonly COLOR_MASK_RED_FALSE: number;
    static readonly COLOR_MASK_GREEN_FALSE: number;
    static readonly COLOR_MASK_BLUE_FALSE: number;
    static readonly COLOR_MASK_ALPHA_FALSE: number;

    static readonly NORMAL_STATE: number;
    static readonly BACK_CULLFACE_NORMAL_STATE: number;
    static readonly FRONT_CULLFACE_NORMAL_STATE: number;
    static readonly NONE_CULLFACE_NORMAL_STATE: number;
    static readonly ALL_CULLFACE_NORMAL_STATE: number;
    static readonly BACK_NORMAL_ALWAYS_STATE: number;
    static readonly BACK_TRANSPARENT_STATE: number;
    static readonly BACK_TRANSPARENT_ALWAYS_STATE: number;
    static readonly NONE_TRANSPARENT_STATE: number;
    static readonly NONE_TRANSPARENT_ALWAYS_STATE: number;
    static readonly FRONT_CULLFACE_GREATER_STATE: number;
    static readonly BACK_ADD_BLENDSORT_STATE: number;
    static readonly BACK_ADD_ALWAYS_STATE: number;
    static readonly BACK_ALPHA_ADD_ALWAYS_STATE: number;
    static readonly NONE_ADD_ALWAYS_STATE: number;
    static readonly NONE_ADD_BLENDSORT_STATE: number;
    static readonly NONE_ALPHA_ADD_ALWAYS_STATE: number;
    static readonly FRONT_ADD_ALWAYS_STATE: number;
    static readonly FRONT_TRANSPARENT_STATE: number;
    static readonly FRONT_TRANSPARENT_ALWAYS_STATE: number;
    static readonly NONE_CULLFACE_NORMAL_ALWAYS_STATE: number;
    static readonly BACK_ALPHA_ADD_BLENDSORT_STATE: number;

	static Initialize(rstate: IRODrawState, vro: IVRO): void {
		if (RendererState.s_initBoo) {

			const rso: any = RenderStateObject;
			const rcm: any = RenderColorMask;

			const gbm = GLBlendMode;
			const gbe = GLBlendEquation;
			const cfm = CullFaceMode;
			const dtm = DepthTestMode;
			const rbm: any = RenderBlendMode;

			let state: any = RendererState;
			state.s_initBoo = false;
			state.Rstate = rstate;
			state.VRO = vro;

			rcm.Rstate = rstate;
			rso.Rstate = rstate;

			state.COLOR_MASK_ALL_TRUE = rcm.Create("all_true", true, true, true, true);
			state.COLOR_MASK_ALL_FALSE = rcm.Create("all_false", false, false, false, false);
			state.COLOR_MASK_RED_TRUE = rcm.Create("red_true", true, false, false, false);
			state.COLOR_MASK_GREEN_TRUE = rcm.Create("green_true", false, true, false, false);
			state.COLOR_MASK_BLUE_TRUE = rcm.Create("blue_true", false, false, true, false);
			state.COLOR_MASK_ALPHA_TRUE = rcm.Create("alpha_true", false, false, false, true);
			state.COLOR_MASK_RED_FALSE = rcm.Create("red_false", false, true, true, true);
			state.COLOR_MASK_GREEN_FALSE = rcm.Create("green_false", true, false, true, true);
			state.COLOR_MASK_BLUE_FALSE = rcm.Create("blue_false", true, true, false, true);
			state.COLOR_MASK_ALPHA_FALSE = rcm.Create("alpha_false", true, true, true, false);


			rbm.NORMAL = rso.CreateBlendMode("NORMAL", gbm.ONE, gbm.ZERO, gbe.FUNC_ADD);
			rbm.OPAQUE = rso.CreateBlendMode("OPAQUE", gbm.ONE, gbm.ZERO, gbe.FUNC_ADD);
			rbm.TRANSPARENT = rso.CreateBlendMode("TRANSPARENT", gbm.SRC_ALPHA, gbm.ONE_MINUS_SRC_ALPHA, gbe.FUNC_ADD);
			rbm.ALPHA_ADD = rso.CreateBlendMode("ALPHA_ADD", gbm.ONE, gbm.ONE_MINUS_SRC_ALPHA, gbe.FUNC_ADD);
			rbm.ADD = rso.CreateBlendMode("ADD", gbm.SRC_ALPHA, gbm.ONE, gbe.FUNC_ADD);
			rbm.ADD_LINEAR = rso.CreateBlendMode("ADD_LINEAR", gbm.ONE, gbm.ONE, gbe.FUNC_ADD);
			rbm.INVERSE_ALPHA = rso.CreateBlendMode("INVERSE_ALPHA", gbm.ONE, gbm.SRC_ALPHA, gbe.FUNC_ADD);

			rbm.BLAZE = rso.CreateBlendMode("BLAZE", gbm.SRC_COLOR, gbm.ONE, gbe.FUNC_ADD);
			rbm.OVERLAY = rso.CreateBlendMode("OVERLAY", gbm.DST_COLOR, gbm.DST_ALPHA, gbe.FUNC_ADD);
			rbm.OVERLAY2 = rso.CreateBlendMode("OVERLAY2", gbm.DST_COLOR, gbm.SRC_ALPHA, gbe.FUNC_ADD);

			state.NORMAL_STATE = rso.Create("normal", cfm.BACK, rbm.NORMAL, dtm.OPAQUE);
			state.BACK_CULLFACE_NORMAL_STATE = state.NORMAL_STATE;
			state.FRONT_CULLFACE_NORMAL_STATE = rso.Create("front_normal", cfm.FRONT, rbm.NORMAL, dtm.OPAQUE);
			state.NONE_CULLFACE_NORMAL_STATE = rso.Create("none_normal", cfm.NONE, rbm.NORMAL, dtm.OPAQUE);
			state.ALL_CULLFACE_NORMAL_STATE = rso.Create("all_cull_normal", cfm.FRONT_AND_BACK, rbm.NORMAL, dtm.OPAQUE);
			state.BACK_NORMAL_ALWAYS_STATE = rso.Create("back_normal_always", cfm.BACK, rbm.NORMAL, dtm.ALWAYS);
			state.BACK_TRANSPARENT_STATE = rso.Create("back_transparent", cfm.BACK, rbm.TRANSPARENT, dtm.TRANSPARENT_SORT);
			state.BACK_TRANSPARENT_ALWAYS_STATE = rso.Create("back_transparent_always", cfm.BACK, rbm.TRANSPARENT, dtm.ALWAYS);
			state.NONE_TRANSPARENT_STATE = rso.Create("none_transparent", cfm.NONE, rbm.TRANSPARENT, dtm.TRANSPARENT_SORT);
			state.NONE_TRANSPARENT_ALWAYS_STATE = rso.Create("none_transparent_always", cfm.NONE, rbm.TRANSPARENT, dtm.ALWAYS);
			state.FRONT_CULLFACE_GREATER_STATE = rso.Create("front_greater", cfm.FRONT, rbm.NORMAL, dtm.TRUE_GREATER);
			state.BACK_ADD_BLENDSORT_STATE = rso.Create("back_add_blendSort", cfm.BACK, rbm.ADD, dtm.TRANSPARENT_SORT);
			state.BACK_ADD_ALWAYS_STATE = rso.Create("back_add_always", cfm.BACK, rbm.ADD, dtm.ALWAYS);
			state.BACK_ALPHA_ADD_ALWAYS_STATE = rso.Create("back_alpha_add_always", cfm.BACK, rbm.ALPHA_ADD, dtm.ALWAYS);
			state.NONE_ADD_ALWAYS_STATE = rso.Create("none_add_always", cfm.NONE, rbm.ADD, dtm.ALWAYS);
			state.NONE_ADD_BLENDSORT_STATE = rso.Create("none_add_blendSort", cfm.NONE, rbm.ADD, dtm.TRANSPARENT_SORT);
			state.NONE_ALPHA_ADD_ALWAYS_STATE = rso.Create("none_alpha_add_always", cfm.NONE, rbm.ALPHA_ADD, dtm.ALWAYS);
			state.FRONT_ADD_ALWAYS_STATE = rso.Create("front_add_always", cfm.FRONT, rbm.ADD, dtm.ALWAYS);
			state.FRONT_TRANSPARENT_STATE = rso.Create("front_transparent", cfm.FRONT, rbm.TRANSPARENT, dtm.TRANSPARENT_SORT);
			state.FRONT_TRANSPARENT_ALWAYS_STATE = rso.Create("front_transparent_always", cfm.FRONT, rbm.TRANSPARENT, dtm.ALWAYS);
			state.NONE_CULLFACE_NORMAL_ALWAYS_STATE = rso.Create("none_normal_always", cfm.NONE, rbm.NORMAL, dtm.ALWAYS);
			state.BACK_ALPHA_ADD_BLENDSORT_STATE = rso.Create("back_alpha_add_blendSort", cfm.BACK, rbm.ALPHA_ADD, dtm.TRANSPARENT_SORT);
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
