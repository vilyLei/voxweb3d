/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
// import IROVtxBuf from "../../../vox/render/IROVtxBuf";
import IROIVtxBuf from "../../../vox/render/IROIVtxBuf";
import { IROIndicesRes } from "./IROIndicesRes";

class ROIndicesRes implements IROIndicesRes {
    private static s_uid = 0;
    private m_uid = ROIndicesRes.s_uid ++;
    private m_vtx: IROIVtxBuf = null;
    private m_vtxUid = 0;
    private m_gpuBuf: any = null;
    private m_ivsSize = 0;
    private m_ivs: Uint16Array | Uint32Array;
    version = -1;
    ibufStep = 0;
    constructor() {
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
            let vtx: IROIVtxBuf = this.m_vtx;
            // console.log("indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", this.version != vtx.indicesVer: ", this.version != vtx.indicesVer);
            if (this.version != vtx.indicesVer) {
                this.m_ivs = vtx.getIvsDataAt();
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
    initialize(rc: IROVtxBuilder, ivtx: IROIVtxBuf): void {
        if (this.m_gpuBuf == null && ivtx.getIvsDataAt() != null) {

            // console.log("ROIndicesRes::initialize(), uid: ", this.m_uid, ", ivtx: ", ivtx);

            this.version = ivtx.indicesVer;
            this.m_vtx = ivtx;
            this.m_vtxUid = ivtx.getUid();
            this.m_ivs = ivtx.getIvsDataAt();

            this.m_gpuBuf = rc.createBuf();
            rc.bindEleBuf(this.m_gpuBuf);

            if (ivtx.bufData == null) {
                rc.eleBufData(this.m_ivs, ivtx.getBufDataUsage());
                this.m_ivsSize = this.m_ivs.length;
            }
            else {
                rc.eleBufDataMem(ivtx.bufData.getIndexDataTotalBytes(), ivtx.getBufDataUsage());
                let uintArr: any = null;
                let offset = 0;
                this.m_ivsSize = 0;
                for (let i = 0, len = ivtx.bufData.getIndexDataTotal(); i < len; ++i) {
                    uintArr = ivtx.bufData.getIndexDataAt(i);
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
            console.log("ROIndicesRes::destroy() this.m_uid: ",this.m_uid);
        }
    }
}
export { ROIndicesRes };
