/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import { IRAdapterContext } from "../../vox/render/IRAdapterContext";

import IRSTBuilder from "./IRSTBuilder";
class RendererState {

    private static readonly rstb: IRSTBuilder;

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

    static CreateBlendMode(name: string, srcColor: number, dstColor: number, blendEquation: number = 0): number {
        return RendererState.rstb.createBlendMode(name, srcColor, dstColor, blendEquation);
    }
    static CreateBlendModeSeparate(name: string, srcColor: number, dstColor: number, srcAlpha: number = 0, dstAlpha: number = 0, blendEquation: number = 0): number {
        return RendererState.rstb.createBlendModeSeparate(name, srcColor, dstColor, srcAlpha, dstAlpha, blendEquation);
    }
    static CreateRenderState(objName: string, cullFaceMode: number, blendMode: number, depthTestMode: number): number {
        return RendererState.rstb.createRenderState(objName, cullFaceMode, blendMode, depthTestMode);
    }
    static CreateRenderColorMask(objName: string, rBoo: boolean, gBoo: boolean, bBoo: boolean, aBoo: boolean): number {
        return RendererState.rstb.createRenderColorMask(objName, rBoo, gBoo, bBoo, aBoo);
    }
    static GetRenderStateByName(objName: string): number {
        return RendererState.rstb.getRenderStateByName(objName);
    }
    static GetRenderColorMaskByName(objName: string): number {
        return RendererState.rstb.getRenderColorMaskByName(objName);
    }

    static UnlockBlendMode(): void {
        RendererState.rstb.unlockBlendMode();
    }
    static LockBlendMode(cullFaceMode: number): void {
        RendererState.rstb.lockBlendMode(cullFaceMode);
    }
    static UnlockDepthTestMode(): void {
        RendererState.rstb.unlockDepthTestMode();
    }
    static LockDepthTestMode(depthTestMode: number): void {
        RendererState.rstb.lockDepthTestMode(depthTestMode);
    }
    static ResetState(): void {
        RendererState.rstb.resetState();
    }
    static Reset(context: IRAdapterContext): void {
        RendererState.rstb.reset(context);
    }
    static ResetInfo(): void {
        RendererState.DrawCallTimes = 0;
        RendererState.DrawTrisNumber = 0;
        RendererState.POVNumber = 0;
    }

    static SetDepthTestEnable(enable: boolean): void {
        RendererState.rstb.setDepthTestEnable(enable);
    }
    static SetBlendEnable(enable: boolean): void {
        RendererState.rstb.setBlendEnable(enable);
    }
}

export default RendererState;
