/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
import IROVtxBuf from "../../../vox/render/IROVtxBuf";

class ROIndicesRes {
    private m_uid: number = 0;
    private static s_uid: number = 0;
    private m_vtx: IROVtxBuf = null;
    private m_vtxUid: number = 0;
    private m_gpuBuf: any = null;
    private m_ivsSize: number = 0;
    private m_ivs: Uint16Array | Uint32Array;
    version: number;
    ibufStep: number = 0;
    constructor() {
        this.m_uid = (ROIndicesRes.s_uid + 1);
    }
    getUid(): number {
        return this.m_uid;
    }
    getVtxUid(): number {
        return this.m_vtxUid;
    }
    getGpuBuf(): any {
        return this.m_gpuBuf;
    }
    getVTCount(): number {
        return this.m_ivsSize;
    }
    updateToGpu(rc: IROVtxBuilder): void {
        if (this.m_gpuBuf != null && this.m_ivsSize > 0) {
            let vtx: IROVtxBuf = this.m_vtx;
            // console.log("indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", this.version != vtx.indicesVer: ", this.version != vtx.indicesVer);
            if (this.version != vtx.indicesVer) {
                this.m_ivs = vtx.getIvsData();
                rc.bindEleBuf(this.m_gpuBuf);
                if (this.m_ivsSize >= this.m_ivs.length) {
                    //console.log("A indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", ivs.length", this.m_ivs.length);
                    rc.eleBufSubData(this.m_ivs, vtx.getBufDataUsage());
                }
                else {
                    //console.log("B indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", ivs.length", this.m_ivs.length);
                    rc.eleBufData(this.m_ivs, vtx.getBufDataUsage());
                }
                this.m_ivsSize = this.m_ivs.length;
                this.version = vtx.indicesVer;
            }
        }
    }
    initialize(rc: IROVtxBuilder, vtx: IROVtxBuf): void {
        if (this.m_gpuBuf == null && vtx.getIvsData() != null) {
            this.version = vtx.indicesVer;
            this.m_vtx = vtx;
            this.m_vtxUid = vtx.getUid();
            this.m_ivs = vtx.getIvsData();
            
            this.m_gpuBuf = rc.createBuf();
            rc.bindEleBuf(this.m_gpuBuf);

            if (vtx.bufData == null) {
                rc.eleBufData(this.m_ivs, vtx.getBufDataUsage());
                this.m_ivsSize = this.m_ivs.length;
            }
            else {
                rc.eleBufDataMem(vtx.bufData.getIndexDataTotalBytes(), vtx.getBufDataUsage());
                let uintArr: any = null;
                let offset: number = 0;
                this.m_ivsSize = 0;
                for (let i: number = 0, len: number = vtx.bufData.getIndexDataTotal(); i < len; ++i) {
                    uintArr = vtx.bufData.getIndexDataAt(i);
                    rc.eleBufSubData(uintArr, offset);
                    offset += uintArr.byteLength;
                    this.m_ivsSize += uintArr.length;
                }
            }
        }
    }

    destroy(rc: IROVtxBuilder): void {
        if (this.m_gpuBuf != null) {
            this.m_vtx = null;
            rc.deleteBuf(this.m_gpuBuf);
            this.m_gpuBuf = null;
            this.m_ivs = null;
            this.m_ivsSize = 0;
        }
    }
}
export { ROIndicesRes };