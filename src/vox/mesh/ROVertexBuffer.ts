/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVtxBufUidStore from "../../vox/mesh/ROVtxBufUidStore";
import VtxBufData from "../../vox/mesh/VtxBufData";
import IVtxBuf from "../../vox/mesh/IVtxBuf";
import IROVtxBuf from "../../vox/render/IROVtxBuf";
import VtxCombinedBuf from "../../vox/mesh/VtxCombinedBuf";
import VtxSeparatedBuf from "../../vox/mesh/VtxSeparatedBuf";
import { RenderDrawMode } from "../../vox/render/RenderConst";
import { IROVertexBuffer } from "../../vox/mesh/IROVertexBuffer";

export default class ROVertexBuffer implements IVtxBuf, IROVtxBuf {
    private static s_uid: number = 0;
    private m_uid: number = 0;

    private m_vtxBuf: IVtxBuf = null;
    private m_ivs: Uint16Array | Uint32Array = null;
    private m_bufDataUsage: number = 0;
    private m_ibufStep: number = 2;// 2 or 4
    private m_bufTypeList: number[] = null;
    private m_bufSizeList: number[] = null;

    layoutBit: number = 0x0;
    vertexVer: number = 0;
    indicesVer: number = 0;
    version: number = 0;
    drawMode: number = RenderDrawMode.ELEMENTS_TRIANGLES;
    bufData: VtxBufData = null;
    private constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        this.m_uid = ROVertexBuffer.s_uid++;
        this.m_bufDataUsage = bufDataUsage;
    }
    private setVtxBuf(vtxBuf: IVtxBuf): void {
        if (vtxBuf != this) {
            this.m_vtxBuf = vtxBuf;
            if (vtxBuf != null) {
                vtxBuf.layoutBit = this.layoutBit;
            }
        }
    }
    private setBufDataUsage(bufDataUsage: number): void {
        this.m_bufDataUsage = bufDataUsage;
    }
    getUid(): number {
        return this.m_uid;
    }
    getType(): number {
        return this.m_vtxBuf.getType();
    }

    setBufTypeList(list: number[]): void {
        this.m_bufTypeList = list;
    }
    setBufSizeList(list: number[]): void {
        this.m_bufSizeList = list;
    }
    getBufTypeList(): number[] {
        return this.m_bufTypeList;
    }
    getBufSizeList(): number[] {
        return this.m_bufSizeList;
    }

    getIBufStep(): number {
        return this.m_ibufStep;
    }
    getBufDataUsage(): number {
        return this.m_bufDataUsage;
    }
    getBuffersTotal(): number {
        return this.m_vtxBuf.getBuffersTotal();
    }

    getAttribsTotal(): number {
        return this.m_vtxBuf.getAttribsTotal();
    }
    getF32DataAt(index: number): Float32Array {
        return this.m_vtxBuf.getF32DataAt(index);
    }
    getIvsData(): Uint16Array | Uint32Array {
        return this.m_ivs;
    }
    setF32DataAt(index: number, float32Arr: Float32Array, stepFloatsTotal: number, setpOffsets: number[]): void {
        this.m_vtxBuf.setF32DataAt(index, float32Arr, stepFloatsTotal, setpOffsets);
        this.vertexVer++;
    }
    setUintIVSData(uint16Or32Arr: Uint16Array | Uint32Array, status: number = VtxBufConst.VTX_STATIC_DRAW): void {
        if ((uint16Or32Arr instanceof Uint16Array)) {
            this.m_ibufStep = 2;
            if(uint16Or32Arr.length > 65535) {
                throw Error("its type is not Uint32Array.");
            }
        }
        else if ((uint16Or32Arr instanceof Uint32Array)) {
            this.m_ibufStep = 4;
        }
        else {
            console.error("Error: uint16Or32Arr is not an Uint32Array or an Uint16Array bufferArray instance !!!!");
            return;
        }

        this.m_ivs = uint16Or32Arr;
        if (uint16Or32Arr != null) {
            this.indicesVer++;
        }
    }
    setData4fAt(vertexI: number, attribI: number, px: number, py: number, pz: number, pw: number): void {
        if (this.m_vtxBuf != null) {
            this.m_vtxBuf.setData4fAt(vertexI, attribI, px, py, pz, pw);
            this.vertexVer++;
        }
    }
    setData3fAt(vertexI: number, attribI: number, px: number, py: number, pz: number): void {
        if (this.m_vtxBuf != null) {
            this.m_vtxBuf.setData3fAt(vertexI, attribI, px, py, pz);
            this.vertexVer++;
        }
    }
    setData2fAt(vertexI: number, attribI: number, px: number, py: number): void {
        if (this.m_vtxBuf != null) {
            this.m_vtxBuf.setData2fAt(vertexI, attribI, px, py);
            this.vertexVer++;
        }
    }
    /**
     * this function is only an empty function.
     */
    destroy(): void {
    }

    private static s_combinedBufs: IVtxBuf[] = [];
    private static s_separatedBufs: IVtxBuf[] = [];
    private __$destroy(): void {
        console.log("ROVertexBuffer::__$destroy()... " + this);
        this.m_vtxBuf.destroy();
        if (this.m_vtxBuf.getType() < 1) {
            ROVertexBuffer.s_combinedBufs.push(this.m_vtxBuf);
        }
        else {
            ROVertexBuffer.s_separatedBufs.push(this.m_vtxBuf);
        }
        this.m_vtxBuf = null;
        this.m_ivs = null;
        this.bufData = null;
        this.m_bufTypeList = null;
        this.m_bufSizeList = null;
    }
    toString(): string {
        return "ROVertexBuffer(uid = " + this.m_uid + ")";
    }
    private static s_FLAG_BUSY: number = 1;
    private static s_FLAG_FREE: number = 0;
    private static s_unitFlagList: number[] = [];
    private static s_unitListLen: number = 0;
    private static s_unitList: ROVertexBuffer[] = [];
    private static s_freeIdList: number[] = [];
    private static s_vtxStore: ROVtxBufUidStore = new ROVtxBufUidStore();
    private static GetFreeId(): number {
        if (ROVertexBuffer.s_freeIdList.length > 0) {
            return ROVertexBuffer.s_freeIdList.pop();
        }
        return -1;
    }
    private static GetVtxByUid(uid: number): ROVertexBuffer {
        return ROVertexBuffer.s_unitList[uid];
    }
    private static Create(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW): ROVertexBuffer {
        let unit: ROVertexBuffer = null;
        let index: number = ROVertexBuffer.GetFreeId();
        if (index >= 0) {
            unit = ROVertexBuffer.s_unitList[index];
            unit.setBufDataUsage(bufDataUsage);
            ROVertexBuffer.s_unitFlagList[index] = ROVertexBuffer.s_FLAG_BUSY;
        }
        else {
            unit = new ROVertexBuffer(bufDataUsage);
            ROVertexBuffer.s_unitList.push(unit);
            ROVertexBuffer.s_unitFlagList.push(ROVertexBuffer.s_FLAG_BUSY);
            ROVertexBuffer.s_unitListLen++;
        }
        unit.vertexVer = 0;
        unit.indicesVer = 0;
        unit.version++;
        //console.log("ROVertexBuffer::Create(), ROVertexBuffer.s_unitList.length: "+ROVertexBuffer.s_unitList.length+", new buf: "+unit);
        ROVertexBuffer.s_vtxStore.__$attachAt(unit.getUid());
        return unit;
    }
    private static __$Restore(pobj: ROVertexBuffer): void {
        if (pobj != null && ROVertexBuffer.s_unitFlagList[pobj.getUid()] == ROVertexBuffer.s_FLAG_BUSY) {
            //console.log("ROVertexBuffer::__$Restore, pobj: "+pobj);
            let uid: number = pobj.getUid();
            ROVertexBuffer.s_freeIdList.push(uid);
            ROVertexBuffer.s_unitFlagList[uid] = ROVertexBuffer.s_FLAG_FREE;
            pobj.__$destroy();
        }
    }
    static __$$AttachAt(uid: number): void {
        ROVertexBuffer.s_vtxStore.__$attachAt(uid);
    }
    static __$$DetachAt(uid: number): void {
        ROVertexBuffer.s_vtxStore.__$detachAt(uid);
    }
    private static s_stride: number = 0;
    static BufDataList: Float32Array[] = null;
    static BufDataStepList: number[] = null;
    static BufStatusList: number[] = null;
    static vtxDataFS32: number[] = null;
    static vbWholeDataEnabled: boolean = false;
    static dynBufSegEnabled: boolean = false;
    static useBufByIndexEnabled: boolean = false;
    static vtxFS32: Float32Array = null;

    static Reset(): void {
        ROVertexBuffer.BufDataList = [];
        ROVertexBuffer.s_stride = 0;
        ROVertexBuffer.BufStatusList = [];
        ROVertexBuffer.BufDataStepList = [];
        ROVertexBuffer.vtxFS32 = null;
        ROVertexBuffer.vbWholeDataEnabled = false;
        ROVertexBuffer.dynBufSegEnabled = false;
        ROVertexBuffer.useBufByIndexEnabled = false;
    }
    static AddFloat32Data(float32Arr: Float32Array, step: number, status: number = VtxBufConst.VTX_STATIC_DRAW): void {
        ROVertexBuffer.BufDataList.push(float32Arr);
        ROVertexBuffer.BufDataStepList.push(step);
        ROVertexBuffer.BufStatusList.push(status);
        ROVertexBuffer.s_stride += step;
    }
    static CreateBySaveData(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW, layoutBit: number = 0x0): ROVertexBuffer {
        let i: number = 0;
        let k: number = 0;
        let stride: number = 0;
        let bufTot: number = ROVertexBuffer.BufDataStepList.length;
        let offsetList: number[] = [];

        for (; i < bufTot; i++) {
            offsetList.push(stride);
            stride += ROVertexBuffer.BufDataStepList[i];
        }
        let tot: number = ROVertexBuffer.BufDataList[0].length / ROVertexBuffer.BufDataStepList[0];
        let vtxfs32: Float32Array = new Float32Array(stride * tot);
        let j: number = 0;
        let segLen: number = 0;
        let parrf32: Float32Array = null;
        let subArr: Float32Array = null;

        for (i = 0; i < tot; ++i) {
            k = i * stride;
            for (j = 0; j < bufTot; ++j) {
                segLen = ROVertexBuffer.BufDataStepList[j];
                parrf32 = ROVertexBuffer.BufDataList[j];
                subArr = parrf32.subarray(i * segLen, (i + 1) * segLen);
                vtxfs32.set(subArr, k);
                k += segLen;
            }
        }
        let vb: ROVertexBuffer = ROVertexBuffer.Create(bufDataUsage);
        vb.layoutBit = layoutBit;
        if (ROVertexBuffer.s_combinedBufs.length > 0) {
            let vtx: VtxCombinedBuf = ROVertexBuffer.s_combinedBufs.pop() as VtxCombinedBuf;
            vb.setVtxBuf(vtx);
        }
        else {
            vb.setVtxBuf(new VtxCombinedBuf(vb.getBufDataUsage()));
        }
        vb.setF32DataAt(0, vtxfs32, stride, offsetList);
        return vb;
    }
    static CreateVtxCombinedBuf(vtxfs32: Float32Array, bufDataStepList: number[], bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW, layoutBit: number = 0x0): ROVertexBuffer {

        let i: number = 0;
        let stride: number = 0;
        let bufTot: number = bufDataStepList.length;
        let offsetList: number[] = [];

        for (; i < bufTot; i++) {
            offsetList.push(stride);
            stride += bufDataStepList[i];
        }

        let vb: ROVertexBuffer = ROVertexBuffer.Create(bufDataUsage);
        vb.layoutBit = layoutBit;
        if (ROVertexBuffer.s_combinedBufs.length > 0) {
            let vtx: VtxCombinedBuf = ROVertexBuffer.s_combinedBufs.pop() as VtxCombinedBuf;
            vb.setVtxBuf(vtx);
        }
        else {
            vb.setVtxBuf(new VtxCombinedBuf(vb.getBufDataUsage()));
        }
        vb.setF32DataAt(0, vtxfs32, stride, offsetList);
        return vb;
    }
    private static UpdateCombinedBufData(vb: ROVertexBuffer): void {
        let i: number = 0;
        let k: number = 0;
        let stride: number = 0;
        let bufTot: number = ROVertexBuffer.BufDataStepList.length;
        let tot: number = ROVertexBuffer.BufDataList[0].length / ROVertexBuffer.BufDataStepList[0];
        let vtxfs32: Float32Array = vb.getF32DataAt(0);
        let newBoo: boolean = (ROVertexBuffer.s_stride * tot) != vtxfs32.length;
        let offsetList: number[] = null;
        if (newBoo) {
            offsetList = [];
            vtxfs32 = new Float32Array(ROVertexBuffer.s_stride * tot);
            for (; i < bufTot; i++) {
                offsetList.push(stride);
                stride += ROVertexBuffer.BufDataStepList[i];
            }
        }
        else {
            stride = ROVertexBuffer.s_stride;
        }
        let j: number = 0;
        let segLen: number = 0;
        let parrf32: Float32Array = null;
        let subArr: Float32Array = null;

        for (i = 0; i < tot; ++i) {
            k = i * stride;
            for (j = 0; j < bufTot; ++j) {
                segLen = ROVertexBuffer.BufDataStepList[j];
                parrf32 = ROVertexBuffer.BufDataList[j];
                subArr = parrf32.subarray(i * segLen, (i + 1) * segLen);
                vtxfs32.set(subArr, k);
                k += segLen;
            }
        }
        if (newBoo) {
            vb.setF32DataAt(0, vtxfs32, stride, offsetList);
        }
        else {
            vb.setF32DataAt(0, vtxfs32, stride, null);
        }
    }

    static UpdateBufData(vb: ROVertexBuffer): void {

        if(vb.getType() == 0) {
            ROVertexBuffer.UpdateCombinedBufData( vb );
        }else {
            ROVertexBuffer.UpdateSeparatedBufData( vb );
        }
    }
    static CreateByBufDataSeparate(bufData: VtxBufData, bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW, layoutBit: number = 0x0): ROVertexBuffer {
        let i: number = 0;
        let stride: number = 0;
        let bufTot: number = bufData.getAttributesTotal();
        let offsetList: number[] = new Array(bufTot);
        offsetList.fill(0);
        let vb: ROVertexBuffer = ROVertexBuffer.Create(bufDataUsage);
        vb.layoutBit = layoutBit;
        if (ROVertexBuffer.s_separatedBufs.length > 0) {
            let vtx: VtxSeparatedBuf = ROVertexBuffer.s_separatedBufs.pop() as VtxSeparatedBuf;
            vb.setVtxBuf(vtx);
        }
        else {
            vb.setVtxBuf(new VtxSeparatedBuf());
        }
        for (i = 0; i < bufTot; i++) {
            vb.setF32DataAt(i, bufData.getAttributeDataAt(i, 0), stride, offsetList);
        }
        vb.setUintIVSData(bufData.getIndexDataAt(0));
        vb.bufData = bufData;
        return vb;
    }

    static CreateBySaveDataSeparate(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW): ROVertexBuffer {
        
        let i: number = 0;
        let stride: number = 0;
        let bufTot: number = ROVertexBuffer.BufDataStepList.length;
        let offsetList: number[] = new Array(bufTot);
        
        let vb: ROVertexBuffer = ROVertexBuffer.Create(bufDataUsage);
        if (ROVertexBuffer.s_separatedBufs.length > 0) {
            let vtx: VtxSeparatedBuf = ROVertexBuffer.s_separatedBufs.pop() as VtxSeparatedBuf;
            vb.setVtxBuf(vtx);
        }
        else {
            vb.setVtxBuf(new VtxSeparatedBuf());
        }

        for (i = 0; i < bufTot; i++) {
            vb.setF32DataAt(i, ROVertexBuffer.BufDataList[i], stride, offsetList);
        }
        return vb;
    }
    private static UpdateSeparatedBufData(vb: ROVertexBuffer): ROVertexBuffer {

        let bufTot: number = ROVertexBuffer.BufDataStepList.length;
        let offsetList: number[] = new Array(bufTot);
        // console.log("ROVertexBuffer::CreateBySaveDataSeparate(), bufTot: "+bufTot);
        for (let i: number = 0; i < bufTot; i++) {
            vb.setF32DataAt(i, ROVertexBuffer.BufDataList[i], 0, offsetList);
        }
        return vb;
    }
    static GetVtxAttachCountAt(vtxUid: number): number {
        return ROVertexBuffer.s_vtxStore.getAttachCountAt(vtxUid);
    }
    static GetVtxAttachAllCount(): number {
        return ROVertexBuffer.s_vtxStore.getAttachAllCount();
    }
    private static s_timeDelay: number = 128;
    /**
     * 放在帧循环中自动定时清理资源 system memory vertex data
     */
    static ClearTest(): void {
        --ROVertexBuffer.s_timeDelay;
        if (ROVertexBuffer.s_timeDelay < 1) {
            ROVertexBuffer.s_timeDelay = 128;
            // 管理作为数据
            let store: ROVtxBufUidStore = ROVertexBuffer.s_vtxStore;

            if (store.__$getRemovedListLen() > 0) {
                let list: number[] = store.__$getRemovedList();
                let len: number = list.length;
                let i: number = 0;
                let vtxUid: number = 0;
                let vb: ROVertexBuffer = null;
                let maxSteps: number = 32;
                len = len > maxSteps ? maxSteps : len;
                for (; i < len; ++i) {
                    vtxUid = list.shift();
                    if (store.getAttachCountAt(vtxUid) < 1) {
                        console.log("ROVertexBuffer remove a instance, vtxUid: " + vtxUid);
                        vb = ROVertexBuffer.GetVtxByUid(vtxUid);
                        ROVertexBuffer.__$Restore(vb);
                    }
                }
            }
        }
    }
}