/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import { IRAdapterContext } from "../../vox/render/IRAdapterContext";
import { IRODrawState } from "../../vox/render/rendering/IRODrawState";
import { IVRO } from "../../vox/render/vtx/IVRO";

interface IRSTBuilder {

	buildToRST(state: any): void;
	initialize(state: any, rstate: IRODrawState, vro: IVRO): void;
    createBlendMode(name: string, srcColor: number, dstColor: number, blendEquation?: number): number;
    createBlendModeSeparate(name: string, srcColor: number, dstColor: number, srcAlpha?: number, dstAlpha?: number, blendEquation?: number): number;
    createRenderState(objName: string, cullFaceMode: number, blendMode: number, depthTestMode: number): number;
    createRenderColorMask(objName: string, rBoo: boolean, gBoo: boolean, bBoo: boolean, aBoo: boolean): number;
    getRenderStateByName(objName: string): number;
    getRenderColorMaskByName(objName: string): number;

    unlockBlendMode(): void;
    lockBlendMode(cullFaceMode: number): void;
    unlockDepthTestMode(): void;
    lockDepthTestMode(depthTestMode: number): void;
    resetState(): void;
    reset(context: IRAdapterContext): void;
    resetInfo(): void;

    setDepthTestEnable(enable: boolean): void;
    setBlendEnable(enable: boolean): void;
}

export default IRSTBuilder;
