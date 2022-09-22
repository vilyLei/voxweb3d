/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRAdapterContext } from "../../../vox/render/IRAdapterContext";

interface IRODrawState {
    
    roColorMask: number;

    reset(): void;
    setRenderContext(context: IRAdapterContext): void;
    setColorMask(mr: boolean, mg: boolean, mb: boolean, ma: boolean): void;
    setStencilFunc(func:number, ref:number, mask:number): void;
    setStencilMask(mask:number): void;
    setStencilOp(fail: number, zfail: number, zpass: number): void;
    setDepthTestEnable(enable:boolean): void;
    setCullFaceEnable(enable:boolean): void;
    setBlendEnable(enable:boolean): void;
    setCullFaceMode(mode: number): void;
    setBlendMode(mode: number, params: number[]): void;

    getDepthTestMode(): number;
    setDepthTestMode(type: number): void;
}
export { IRODrawState }