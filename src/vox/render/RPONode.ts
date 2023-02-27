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
import IRPONode from "./IRPONode";
import DebugFlag from "../debug/DebugFlag";

// 为了渲染循环执行中持有RPOUnit和对应的Disp
export default class RPONode implements IPoolNode, IRPONode {
    constructor() {
    }
    __$ruid: number = -1;
    drawEnabled = true;
    uid = -1;
    index = -1;
    // only for show info

    // drawMode = 0;
    // ivsIndex = 0;
    // ivsCount = 0;
    insCount = 0;
    shdUid = -1;
    vtxUid = -1;
    texMid = -1;
    rtokey = -1;
    prev: RPONode = null;
    next: RPONode = null;
    unit: RPOUnit = null;
    vro: IVertexRenderObj = null;
    tro: ITextureRenderObj = null;
    rvroI = -1;
    rtroI = -1;
    setValue(value: number): void {
        this.unit.value = value;
    }
    isVsible(): boolean {
        return this.unit == null || this.unit.drawEnabled;
    }
    updateData(): void {
        let p: RPOUnit = this.unit;
        // this.drawMode = p.drawMode;
        // this.ivsIndex = p.ivsIndex;
        // this.ivsCount = p.ivsCount;
        this.insCount = p.insCount;
        // p.drawOffset = p.ivsIndex * p.ibufStep;
        this.vtxUid = p.vtxUid;
        this.vro = p.vro;
        // material info etc.
        this.shdUid = p.shdUid;
        this.texMid = p.texMid;
        this.tro = p.tro;
    }
    reset(): void {
        this.drawEnabled = true;
        this.uid = -1;
        this.index = -1;
        // this.drawMode = 0;
        // this.ivsIndex = 0;
        // this.ivsCount = 0;
        this.insCount = 0;
        this.shdUid = -1;
        this.vtxUid = -1;
        this.texMid = -1;
        this.rtokey = -1;
        this.unit = null;
        this.vro = null;
        this.tro = null;
        this.prev = null;
        this.next = null;
    }
    toString(): string {
        return "[Object RPONode(uid = " + this.uid + ", index = " + this.index + ", shdUid = " + this.shdUid + ", vtxUid = " + this.vtxUid + ")]";
    }
}
