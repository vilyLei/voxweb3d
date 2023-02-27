/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正被高频运行的渲染管线中的被执行对象


import IVertexRenderObj from "../../vox/render/IVertexRenderObj";
import ITextureRenderObj from "../../vox/render/ITextureRenderObj";
import RPOUnit from "../../vox/render/RPOUnit";
import IPoolNode from "../../vox/base/IPoolNode";
import DebugFlag from "../debug/DebugFlag";

// 为了渲染循环执行中持有RPOUnit和对应的Disp
export default interface IRPONode extends IPoolNode {

    __$ruid: number;
    drawEnabled: boolean;
    uid: number;
    index: number;
    // only for show info

    // drawMode: number;
    // ivsIndex: number;
    // ivsCount: number;
    
    insCount: number;
    shdUid: number;
    vtxUid: number;
    texMid: number;
    rtokey: number;
    prev: IRPONode;
    next: IRPONode;
    unit: RPOUnit;
    vro: IVertexRenderObj;
    tro: ITextureRenderObj;
    rvroI: number;
    rtroI: number;
    setValue(value: number): void;
    isVsible(): boolean;
    updateData(): void;
    reset(): void;
    toString(): string;
}
