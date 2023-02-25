/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
// import IROVtxBuf from "../../../vox/render/IROVtxBuf";
import IROIVtxBuf from "../../../vox/render/IROIVtxBuf";
import IROIvsData from "../../../vox/render/vtx/IROIvsData";
import { IROIndicesRes } from "./IROIndicesRes";

interface BufR {
    buf: any;
    size: number;
    step: number;
}

class ROIndicesRes implements IROIndicesRes {
    private static s_uid = 0;
    private m_uid = ROIndicesRes.s_uid++;
    private m_rc: IROVtxBuilder;
    private m_vtx: IROIVtxBuf = null;
    private m_vtxUid = 0;
    private m_gbufs: any[] = new Array(2);
    private m_counts: any[] = new Array(2);
    private m_steps: any[] = new Array(2);
    private m_gbuf: any;
    private m_ivsSize = 0;
    private m_ivsData: IROIvsData = null;
    version = -1;
    ibufStep = 0;
    constructor() {
        this.m_gbufs.fill(null);
    }
    getUid(): number {
        return this.m_uid;
    }
    getVtxUid(): number {
        return this.m_vtxUid;
    }
    getGpuBuf(): any {
        return this.m_gbuf;
    }
    getVTCount(): number {
        return this.m_ivsSize;
    }
    toWireframe(): void {

    }
    toShape(): void {
        this.m_gbuf = this.m_gbufs[0];
        this.m_ivsSize = this.m_counts[0];
        // this.ibufStep = this.m_steps[0];
    }
    use(force: boolean = false): void {
        if (this.m_rc.testRIOUid(this.m_vtxUid) || force) {
            this.m_rc.bindEleBuf(this.m_gbuf);
        }
    }
    updateToGpu(rc: IROVtxBuilder): void {

        if (this.m_gbufs[0] != null && this.m_ivsSize > 0) {
            let vtx = this.m_vtx;
            // console.log("indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", this.version != vtx.indicesVer: ", this.version != vtx.indicesVer);
            if (this.version != vtx.indicesVer) {
                let ird = vtx.getIvsDataAt();
                this.m_ivsData = ird;
                const ivs = ird.ivs;
                rc.bindEleBuf(this.m_gbuf);
                if (this.m_ivsSize >= ivs.length) {
                    //console.log("A indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", ivs.length", ivs.length);
                    rc.eleBufSubData(ivs, ird.status);
                }
                else {
                    //console.log("B indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", ivs.length", ivs.length);
                    rc.eleBufData(ivs, vtx.getBufDataUsage());
                }
                this.m_ivsSize = ivs.length;
                this.version = vtx.indicesVer;
            }
        }
    }
    initialize(rc: IROVtxBuilder, ivtx: IROIVtxBuf): void {
        this.m_rc = rc;
        if (this.m_gbufs[0] == null && ivtx.getIvsDataAt() != null) {

            // console.log("ROIndicesRes::initialize(), uid: ", this.m_uid, ", ivtx: ", ivtx);

            this.version = ivtx.indicesVer;
            this.m_vtx = ivtx;
            this.m_vtxUid = ivtx.getUid();

            let ird = ivtx.getIvsDataAt();
            this.m_ivsData = ird;
            this.ibufStep = ird.bufStep;

            /*
            this.m_gbuf = rc.createBuf();
            rc.bindEleBuf(this.m_gbuf);

            if (ivtx.bufData == null) {
                rc.eleBufData(ivs, ivtx.getBufDataUsage());
                this.m_ivsSize = ivs.length;
            }
            else {
                rc.eleBufDataMem(ivtx.bufData.getIndexDataTotalBytes(), ivtx.getBufDataUsage());
                let offset = 0;
                this.m_ivsSize = 0;
                for (let i = 0, len = ivtx.bufData.getIndexDataTotal(); i < len; ++i) {
                    const rd = ivtx.bufData.getIndexDataAt(i);
                    const pivs = rd.ivs;
                    rc.eleBufSubData(pivs, offset);
                    offset += pivs.byteLength;
                    this.m_ivsSize += pivs.length;
                }
            }
            //*/

            let bufData = this.createBuf(rc, ivtx);

            this.m_gbufs[0] = bufData.buf;
            this.m_counts[0] = bufData.size;
            this.m_steps[0] = bufData.step;

            // this.m_gbuf = this.m_gbufs[0];
            // this.m_ivsSize = this.m_counts[0];
            this.toShape();
        }
    }
    private createBuf(rc: IROVtxBuilder, ivtx: IROIVtxBuf): BufR {

        let ird = ivtx.getIvsDataAt();
        let ivs = ird.ivs;

        let gbuf = rc.createBuf();
        rc.bindEleBuf(gbuf);
        let size = 0;
        if (ivtx.bufData == null) {
            rc.eleBufData(ivs, ivtx.getBufDataUsage());
            size = ivs.length;
        }
        else {
            rc.eleBufDataMem(ivtx.bufData.getIndexDataTotalBytes(), ivtx.getBufDataUsage());
            let offset = 0;
            for (let i = 0, len = ivtx.bufData.getIndexDataTotal(); i < len; ++i) {
                const rd = ivtx.bufData.getIndexDataAt(i);
                ivs = rd.ivs;
                rc.eleBufSubData(ivs, offset);
                offset += ivs.byteLength;
                size += ivs.length;
            }
        }

        return { buf: gbuf, size: size, step: ivs.length < 65535 ? 2 : 4 };
    }

    destroy(rc: IROVtxBuilder): void {

        this.m_rc = null;
        if (this.m_gbuf != null) {
            this.m_vtx = null;
            rc.deleteBuf(this.m_gbuf);
            this.m_gbuf = null;
            this.m_ivsData = null;
            this.m_ivsSize = 0;
            console.log("ROIndicesRes::destroy() this.m_uid: ", this.m_uid);
        }
    }

    private createWireframeIvs(ivs: Uint16Array | Uint32Array): Uint16Array | Uint32Array {

        if (ivs !== null) {

            const len = ivs.length * 2;
            const wivs = len <= 65536 ? new Uint16Array(len) : new Uint32Array(len);
            let a: number;
            let b: number;
            let c: number;
            let k = 0;
            for (let i = 0, l = ivs.length; i < l; i += 3) {

                a = ivs[i + 0];
                b = ivs[i + 1];
                c = ivs[i + 2];
                wivs[k] = a;
                wivs[k + 1] = b;
                wivs[k + 2] = b;
                wivs[k + 3] = c;
                wivs[k + 4] = c;
                wivs[k + 5] = a;
                k += 6;
            }
            return wivs;
        }
        return ivs;
    }
}
export { ROIndicesRes };
