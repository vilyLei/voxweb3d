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

        this.m_gbuf = this.m_gbufs[1];
        this.m_ivsSize = this.m_counts[1];
        this.ibufStep = this.m_steps[1];
    }
    toShape(): void {

        this.m_gbuf = this.m_gbufs[0];
        this.m_ivsSize = this.m_counts[0];
        this.ibufStep = this.m_steps[0];
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
            // this.ibufStep = ird.bufStep;
            // let initIBufStep = this.ibufStep;
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

            
            // let bufData = this.createBuf(0, rc, ivtx);

            // this.m_gbufs[0] = bufData.buf;
            // this.m_counts[0] = bufData.size;
            // this.m_steps[0] = bufData.step;
            this.createBuf(0, rc, ivtx);
            if (ird.wireframe) {
                this.createBuf(1, rc, ivtx, ird.wireframe);
                this.toWireframe();
            } else {
                this.toShape();
            }
        }
    }
    private createBuf(i: number, rc: IROVtxBuilder, ivtx: IROIVtxBuf, wireframe: boolean = false): BufR {

        let ird = ivtx.getIvsDataAt();
        let ivs = ird.ivs;
        let size = 0;

        let step = 2;
        let gbuf = rc.createBuf();
        rc.bindEleBuf(gbuf);

        if (ivtx.bufData == null) {

            if (wireframe) {
                ivs = this.createWireframeIvs(ivs);
            }
            rc.eleBufData(ivs, ivtx.getBufDataUsage());
            size = ivs.length;
            step = size > 65536 ? 4 : 2;
        }
        else {

            let offset = 0;
            let list: (Uint16Array | Uint32Array)[] = [];

            for (let i = 0, len = ivtx.bufData.getIndexDataTotal(); i < len; ++i) {
                const rd = ivtx.bufData.getIndexDataAt(i);
                ivs = rd.ivs;
                if (wireframe) {
                    ivs = this.createWireframeIvs(ivs);
                }
                list[i] = ivs;
                size += ivs.length;
            }
            if (size > 65536) {

                step = 4;

                for (let i = 0, len = list.length; i < len; ++i) {

                    ivs = list[i];
                    list[i] = (ivs instanceof Uint32Array) ? ivs : new Uint32Array(ivs);
                }
            } else {
                step = 2;
                for (let i = 0, len = list.length; i < len; ++i) {

                    ivs = list[i];
                    list[i] = (ivs instanceof Uint16Array) ? ivs : new Uint16Array(ivs);
                }
            }

            size = 0;
            for (let i = 0, len = list.length; i < len; ++i) {
                size += list[i].byteLength;
            }

            rc.eleBufDataMem(size, ivtx.getBufDataUsage());

            offset = 0;
            size = 0;

            for (let i = 0, len = list.length; i < len; ++i) {

                ivs = list[i];
                rc.eleBufSubData(ivs, offset);
                offset += ivs.byteLength;
                size += ivs.length;
            }
        }

        let bufData: BufR = { buf: gbuf, size: size, step: step };
        this.m_gbufs[i] = bufData.buf;
        this.m_counts[i] = bufData.size;
        this.m_steps[i] = bufData.step;
        return bufData;
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
            const wivs = len > 65536 ? new Uint32Array(len) : new Uint16Array(len);
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
