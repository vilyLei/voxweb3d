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
import { RenderDrawMode as RDM } from "../RenderConst";
import IRODisplay from "../../display/IRODisplay";
import IRenderProxy from "../IRenderProxy";

class BufRData {
    buf: any = null;
    ivsSize = 0;
    ivsIndex = 0;
    step = 2;
    drawMode = RDM.ELEMENTS_TRIANGLES;
    common = true;
    bufType = 0;
    ivsOffset = 0;
    clone(): BufRData {
        let rd = new BufRData;
        rd.buf = this.buf;
        rd.ivsIndex = this.ivsIndex;
        rd.ivsSize = this.ivsSize;
        rd.step = this.step;
        rd.drawMode = this.drawMode;
        rd.common = this.common;
        rd.bufType = this.bufType;
        rd.ivsOffset = this.ivsOffset;
        return rd;
    }
    destroy(vrc: IROVtxBuilder): void {
        if (this.buf != null) {
            vrc.deleteBuf(this.buf);
            this.buf = null;
        }
    }
}
class BufRDataPair {
    r0: BufRData;
    r1: BufRData;
    destroy(vrc: IROVtxBuilder): void {
        this.r0.destroy(vrc);
        this.r1.destroy(vrc);
    }
}


class ROIndicesRes implements IROIndicesRes {
    private static s_uid = 0;
    private m_uid = ROIndicesRes.s_uid++;
    private m_vrc: IROVtxBuilder;
    private m_vtx: IROIVtxBuf = null;
    private m_vtxUid = 0;
    private m_index = 0;

    // private m_gbuf: any;

    private m_ivsData: IROIvsData = null;

    version = -1;
    private m_rdpType = 0;
    private m_rdps: BufRDataPair[] = [];

    rd: BufRData = null;

    constructor() {
        this.m_rdps.fill(null);
    }
    getUid(): number {
        return this.m_uid;
    }
    getVtxUid(): number {
        return this.m_vtxUid;
    }
    toWireframe(): void {
        this.m_rdpType = 1;
        this.rd = this.m_rdps[this.m_index].r1;
        // console.log("toWireframe()............");
    }
    toShape(): void {
        this.m_rdpType = 0;
        this.rd = this.m_rdps[this.m_index].r0;
    }
    toCommon(): void {
        this.toShape();
    }
    applyDataAt(i: number): void {
        if(this.m_index != i && i >= 0 && i < this.m_rdps.length) {
            this.m_index = i;
            if(this.m_rdpType < 1) {
                this.toShape();
            }else {
                this.toWireframe();
            }
        }
    }
    /**
     * @param force the default value is false
     */
    bindToGPU(force: boolean = false): void {
        if (this.m_vrc.testRIOUid(this.m_vtxUid) || force) {
            this.m_vrc.bindEleBuf(this.rd.buf);
        }
    }
    updateToGpu(rc: IROVtxBuilder): void {
        let rd = this.m_rdps.length > 0 ? this.m_rdps[0].r0 : null;
        if (rc != null && rd.buf != null) {
            let vtx = this.m_vtx;
            // console.log("indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", this.version != vtx.indicesVer: ", this.version != vtx.indicesVer);
            if (this.version != vtx.indicesVer) {
                
                let ird = vtx.getIvsDataAt();
                this.m_ivsData = ird;
                const ivs = ird.ivs;
                rc.bindEleBuf(rd.buf);
                let size = this.m_rdps[0].r0.ivsSize;
                if (size >= ivs.length) {
                    //console.log("A indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", ivs.length", ivs.length);
                    rc.eleBufSubData(ivs, ird.status);
                }
                else {
                    //console.log("B indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", ivs.length", ivs.length);
                    rc.eleBufData(ivs, vtx.getBufDataUsage());
                }
                rd.ivsSize = ivs.length;
                this.version = vtx.indicesVer;
            }
        }
    }
    initialize(rc: IRenderProxy, vrc: IROVtxBuilder, ivtx: IROIVtxBuf, disp: IRODisplay): void {

        this.m_vrc = vrc;
        let wireframe = false;
        let rpdp = new BufRDataPair();
        if (this.m_rdps.length < 1 && ivtx.getIvsDataAt() != null) {

            // console.log("ROIndicesRes::initialize(), uid: ", this.m_uid, ", ivtx: ", ivtx);

            this.version = ivtx.indicesVer;
            this.m_vtx = ivtx;
            this.m_vtxUid = ivtx.getUid();

            let ird = ivtx.getIvsDataAt();
            this.m_ivsData = ird;
            wireframe = ird.wireframe;

            let rd0 = this.createBuf(0, rc, vrc, ivtx, disp.ivsIndex);
            let rd1: BufRData = null;
            if (wireframe) {
                rd1 = this.createBuf(1, rc, vrc, ivtx, disp.ivsIndex, wireframe);
            } else {
                rd1 = rd0.clone();
            }
            rpdp.r0 = rd0;
            rpdp.r1 = rd1;
        } else {
            let rd = new BufRData();
            rd.buf = null;
            rd.ivsSize = disp.ivsCount;
            rd.ivsIndex = disp.ivsIndex;
            rd.step = 2;
            rd.drawMode = disp.drawMode;
            rpdp.r0 = rd;
            rpdp.r1 = rd;
        }
        this.m_rdps[0] = rpdp;

        if (wireframe) {
            this.toWireframe();
        } else {
            this.toShape();
        }
    }
    private createBuf(i: number, rc: IRenderProxy, vrc: IROVtxBuilder, ivtx: IROIVtxBuf, ivsIndex: number, wireframe: boolean = false): BufRData {

        let ird = ivtx.getIvsDataAt();
        let ivs = ird.ivs;
        let size = 0;

        let step = 2;
        let gbuf = vrc.createBuf();
        vrc.bindEleBuf(gbuf);

        if (ivtx.bufData == null) {

            if (wireframe) {
                ivs = this.createWireframeIvs(ivs);
            }
            vrc.eleBufData(ivs, ivtx.getBufDataUsage());
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

            vrc.eleBufDataMem(size, ivtx.getBufDataUsage());

            offset = 0;
            size = 0;

            for (let i = 0, len = list.length; i < len; ++i) {

                ivs = list[i];
                vrc.eleBufSubData(ivs, offset);
                offset += ivs.byteLength;
                size += ivs.length;
            }
        }
        let rd = new BufRData();
        rd.buf = gbuf;
        rd.ivsSize = size;
        rd.ivsIndex = wireframe ? ivsIndex * 2 : ivsIndex;
        rd.step = step;
        rd.bufType = step != 4 ? rc.UNSIGNED_SHORT : rc.UNSIGNED_INT;
        rd.ivsOffset = rd.ivsIndex * rd.step;
        rd.common = !wireframe;
        rd.drawMode = wireframe ? RDM.ELEMENTS_LINES : RDM.ELEMENTS_TRIANGLES;
        return rd;
    }

    destroy(vrc: IROVtxBuilder): void {

        this.m_vrc = null;
        if (this.m_rdps .length > 0) {
            this.m_vtx = null;
            for(let i = 0; i < this.m_rdps.length; ++i) {
                this.m_rdps[i].destroy(vrc);
            }
            this.m_ivsData = null;            
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
