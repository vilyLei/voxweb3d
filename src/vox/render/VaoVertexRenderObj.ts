/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROVtxBuilder from "../../vox/render/IROVtxBuilder";
import IVertexRenderObj from "../../vox/render/IVertexRenderObj";
import VROBase from "../../vox/render/VROBase";

export default class VaoVertexRenderObj extends VROBase {
    private static s_uid: number = 0;

    /**
     * vao buffer object
     */
    vao: any = null;

    private constructor() {
        super();
        this.m_uid = VaoVertexRenderObj.s_uid++;
    }

    run(): void {
        if (this.m_rc.testVROUid(this.m_uid)) {
            // console.log("VaoVertexRenderObj::run(), rcuid: ",this.m_rc.getRCUid(),this.m_vtxUid, this.m_uid);
            this.m_rc.bindVertexArray(this.vao);
            this.indicesRes.bindToGPU(VROBase.s_mid != this.m_mid);
            VROBase.s_mid = this.m_mid;
            // if (this.m_rc.testRIOUid(this.m_vtxUid) || VROBase.s_mid != this.m_mid) {
            // // if (this.m_rc.testRIOUid(this.m_vtxUid)) {
            //     // console.log("VaoVertexRenderObj::run(), testRIOUid()..");
            //     this.m_rc.bindEleBuf(this.ibuf);
            // }
            // VROBase.s_mid = this.m_mid;
        }
    }
    protected __$destroy(): void {
        console.log("VaoVertexRenderObj::__$destroy()..., " + this);
        VROBase.s_midMap.delete(this.m_mid);
        this.m_mid = 0;
        this.m_vtxUid = -1;
        // this.ibuf = null;
        this.vao = null;
        this.m_rc = null;
        this.indicesRes = null;
    }
    restoreThis(): void {
        if (this.vao != null) {
            this.m_rc.deleteVertexArray(this.vao);
        }
        VaoVertexRenderObj.Restore(this);
    }

    private static s_FLAG_BUSY: number = 1;
    private static s_FLAG_FREE: number = 0;
    private static s_unitFlagList: number[] = [];
    private static s_unitListLen: number = 0;
    private static s_unitList: VaoVertexRenderObj[] = [];
    private static s_freeIdList: number[] = [];
    static HasMid(mid: number): boolean {
        return VROBase.s_midMap.has(mid);
    }
    static GetByMid(mid: number): IVertexRenderObj {
        return VROBase.s_midMap.get(mid);
    }
    private static GetFreeId(): number {
        if (VaoVertexRenderObj.s_freeIdList.length > 0) {
            return VaoVertexRenderObj.s_freeIdList.pop();
        }
        return -1;
    }
    static Create(rc: IROVtxBuilder, mid: number, pvtxUid: number): VaoVertexRenderObj {
        let unit: VaoVertexRenderObj = null;
        let index: number = VaoVertexRenderObj.GetFreeId();
        if (index >= 0) {
            unit = VaoVertexRenderObj.s_unitList[index];
            VaoVertexRenderObj.s_unitFlagList[index] = VaoVertexRenderObj.s_FLAG_BUSY;
            unit.setMidAndBufUid(mid, pvtxUid);
        }
        else {
            unit = new VaoVertexRenderObj();
            unit.setMidAndBufUid(mid, pvtxUid);
            VaoVertexRenderObj.s_unitList.push(unit);
            VaoVertexRenderObj.s_unitFlagList.push(VaoVertexRenderObj.s_FLAG_BUSY);
            VaoVertexRenderObj.s_unitListLen++;
        }
        unit.setRC(rc);
        VROBase.s_midMap.set(mid, unit);
        return unit;
    }

    private static Restore(pobj: VaoVertexRenderObj): void {
        //console.log("VaoVRO Restore XXXX ("+pobj.getUid()+")pobj.m_attachCount: ",pobj.m_attachCount);
        if (pobj != null && pobj.m_attachCount < 1 && VaoVertexRenderObj.s_unitFlagList[pobj.getUid()] == VaoVertexRenderObj.s_FLAG_BUSY) {
            let uid: number = pobj.getUid();
            VaoVertexRenderObj.s_freeIdList.push(uid);
            VaoVertexRenderObj.s_unitFlagList[uid] = VaoVertexRenderObj.s_FLAG_FREE;
            pobj.__$destroy();
        }
    }
}