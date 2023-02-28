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
import RenderDrawMode from "../RenderDrawMode";
import IRODisplay from "../../display/IRODisplay";
import IRenderProxy from "../IRenderProxy";
import { IROIvsRD, IROIvsRDP } from "./IROIvsRDP";

class BufRData implements IROIvsRD {
    private static s_uid = 0;
    private m_uid = BufRData.s_uid++;
    buf: any = null;
    // type = 0;
    ivsSize = 0;
    ivsInitSize = 0;
    ivsIndex = 0;
    /**
     * ivs buffer stride
     */
    stride = 2;
    drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;
    common = true;
    bufType = 0;
    ivsOffset = 0;
    rdpIndex = 0;
    constructor() { }
    getUid(): number {
        return this.m_uid;
    }
    clone(): BufRData {
        let rd = new BufRData();
        rd.buf = this.buf;
        rd.ivsIndex = this.ivsIndex;
        rd.ivsSize = this.ivsSize;
        rd.ivsInitSize = this.ivsInitSize;
        rd.stride = this.stride;
        rd.drawMode = this.drawMode;
        rd.common = this.common;
        rd.bufType = this.bufType;
        rd.ivsOffset = this.ivsOffset;
        rd.rdpIndex = this.rdpIndex;
        return rd;
    }
    setIvsParam(ivsIndex: number, ivsSize: number): void {

        let pI = this.ivsIndex;
        let pS = this.ivsSize;
        if (ivsIndex >= 0) {
            pI = ivsIndex;
        }
        if (ivsSize >= 0) {
            pS = ivsSize;
        }
        ivsIndex = pI;
        ivsSize = pS;

        const rd = this;

        rd.ivsIndex = rd.common ? ivsIndex : ivsIndex * 2;
        if (rd.ivsIndex < 0) rd.ivsIndex = 0;
        else if (rd.ivsIndex >= this.ivsInitSize) rd.ivsIndex = this.ivsInitSize - 1;

        rd.ivsOffset = rd.ivsIndex * rd.stride;
        // console.log(" >>> #### !rd.common: ", !rd.common, ", uid: ",this.getUid());
        // console.log("!rd.common: ", !rd.common, pI, pS);
        if (!rd.common) {
            ivsSize *= 2;
        }
        if ((ivsSize + rd.ivsIndex) >= this.ivsInitSize) {
            ivsSize = this.ivsInitSize - rd.ivsIndex;
        }
        this.ivsSize = ivsSize;
        // console.log("OOOO BufRData !rd.common #####: ", !rd.common, rd.ivsIndex, this.ivsSize, ", uid: ",this.getUid());
    }
    destroy(vrc: IROVtxBuilder): void {
        if (this.buf != null) {
            vrc.deleteBuf(this.buf);
            this.buf = null;
        }
    }
    clear(): void {
        this.buf = null;
    }
}
class BufRDataPair implements IROIvsRDP {
    private static s_uid = 0;
    private m_uid = BufRDataPair.s_uid++;
    private m_rdpVer = 0;
    private m_st = 101;
    private m_tst = 0;
    private m_rdpIndex = 0;
    r0: BufRData = null;
    r1: BufRData = null;
    rd: BufRData = null;
    buf: any = null;
    roiRes: ROIndicesRes = null;
    constructor(index: number) {
        this.m_rdpIndex = index;
    }
    getRDPIndex(): number {
        return this.m_rdpIndex;
    }
    getUid(): number {
        return this.m_uid;
    }
    destroy(vrc: IROVtxBuilder): void {
        this.r0.destroy(vrc);
        this.r1.destroy(vrc);
        this.r0 = null;
        this.r1 = null;
        this.rd = null;
        this.buf = null;
    }
    private clearBuf(): void {
        if(this.r0 != null) {
            this.r0.clear();
            this.r1.clear();
            this.roiRes = null;
            this.r0 = null;
            this.r1 = null;
            this.rd = null;
            this.buf = null;
        }
    }
    clear(): void {
        this.clearBuf();
    }
    private updateStatus(): void {
        this.m_st++;
        this.m_tst = (this.m_st * 131 + this.m_rdpVer) * 131 + this.m_uid;
    }
    setIvsParam(ivsIndex: number, ivsSize: number): void {

        // console.log(">>> >>>>>>>>>>>> #### BufRDataPair::setIvsParam(), uid: ", this.getUid());
        this.updateStatus();
        this.r0.setIvsParam(ivsIndex, ivsSize);
        if (this.r0 != this.r1) {
            this.r1.setIvsParam(ivsIndex, ivsSize);
        }
        let rd = this.rd;
        // console.log("BufRDataPair::setIvsParam(), ivsIndex, ivsSize: ", ivsIndex, ivsSize);
        // console.log("****** ###### !rd.common: ", !rd.common, ", rd.getUid(): ",rd.getUid());
        // console.log("BufRDataPair::setIvsParam(), rd.ivsIndex, rd.ivsSize: ", rd.ivsIndex, rd.ivsSize);
    }
    applyRDPAt(index: number): void {
        if (this.roiRes != null && this.m_rdpIndex != index) {
            let rd = this.rd;
            // console.log("AAAA index: ",index);
            // console.log("AAAA 0 rd.getUid(): ",rd.getUid(), ", r0.getUid(): ",this.r0.getUid(), ", r0.ivsSize: ", this.r0.ivsSize, ", r0.rdpIndex: ", this.r0.rdpIndex);
            let rdp = this.roiRes.getRDPDataAt(index);
            if(rdp) {
                this.updateStatus();
                this.clearBuf();
                this.m_rdpIndex = rdp.getRDPIndex();
                // console.log("ROInidcesRes::applyRDPAt(), index: ", index);
                this.copyFrom(rdp, true, false);
                rd = this.rd;
                // console.log("AAAA 1 rd.getUid(): ",rd.getUid(), ", r0.getUid(): ",this.r0.getUid(), ", r0.ivsSize: ",  this.r0.ivsSize, ", r0.rdpIndex: ", this.r0.rdpIndex);
            }
        }
    }
    getVersion(): number {
        return this.m_tst;
    }
    toWireframe(): void {

        this.m_rdpVer = 1;
        this.rd = this.r1;
        this.buf = this.rd.buf;
        this.roiRes.rdp = this;

        this.updateStatus();
        console.log("BufRDataPair::toWireframe()............, uid: ", this.m_uid);
    }
    toShape(): void {

        this.m_rdpVer = 0;        
        this.rd = this.r0;
        this.buf = this.rd.buf;
        this.roiRes.rdp = this;

        this.updateStatus();
        console.log("BufRDataPair::toShape()............, uid: ", this.m_uid);
    }
    toCommon(): void {
        this.toShape();
    }
    isCommon(): boolean {
        return this.m_rdpVer == 0;
    }
    test(): boolean {
        // console.log("AAA this.getType(): ", this.getType(), this.getUid());
        this.roiRes.rdp = this;
        return this.roiRes.test();
    }
    copyFrom(rdp: BufRDataPair, auto: boolean = true, force: boolean = true): void {

        // console.log("AAAA 0 copyFrom(), rdp.r0.getUid(): ",rdp.r0.getUid(), ", r0.ivsSize: ", rdp.r0.ivsSize, ", r0.rdpIndex: ", rdp.r0.rdpIndex);
        this.roiRes = rdp.roiRes;
        if(force) this.m_rdpVer = rdp.m_rdpVer;
        this.r0 = rdp.r0.clone();
        if (rdp.r0 != rdp.r1) {
            this.r1 = rdp.r1.clone();
        } else {
            this.r1 = this.r0;
        }
        if (auto) {
            if (this.isCommon()) {
                this.toCommon();
            } else {
                this.toWireframe();
            }
        }
    }
    copyTo(rdp: BufRDataPair, auto: boolean = true, force: boolean = true): void {

        rdp.roiRes = this.roiRes;
        if(force) rdp.m_rdpVer = this.m_rdpVer;
        rdp.r0 = this.r0.clone();
        if (this.r0 != this.r1) {
            rdp.r1 = this.r1.clone();
        } else {
            rdp.r1 = rdp.r0;
        }
        if (auto) {
            if (rdp.isCommon()) {
                rdp.toCommon();
            } else {
                rdp.toWireframe();
            }
        }
    }
    clone(): BufRDataPair {
        let rdp = new BufRDataPair(this.getRDPIndex());
        this.copyTo(rdp);
        return rdp;
    }
}


class ROIndicesRes implements IROIndicesRes {

    private static s_uid = 0;
    private m_uid = ROIndicesRes.s_uid++;
    private m_vrc: IROVtxBuilder;
    private m_vtx: IROIVtxBuf = null;
    private m_vtxUid = 0;
    // private m_index = 0;

    private m_ivsData: IROIvsData = null;

    private m_rdps: BufRDataPair[] = [];
    private m_rdpVer = -2;

    rdp: BufRDataPair = null;
    initRdp: BufRDataPair = null;
    version = -1;

    constructor() {
        this.m_rdps.fill(null);
    }
    getUid(): number {
        return this.m_uid;
    }
    getVtxUid(): number {
        return this.m_vtxUid;
    }
    getRDPDataAt(index: number): BufRDataPair {
        if (index >= 0 && index < this.m_rdps.length) {
            // console.log("getRDPDataAt(), index: ", index);
            return this.m_rdps[index];
            // let rdp = this.m_rdps[index];
            // console.log("getRDPDataAt(), rdp: ", rdp);
            // return rdp;
        }
        return null;
    }
    // applyRDPAt(index: number): boolean {
    //     if (this.m_index != index && index >= 0 && index < this.m_rdps.length) {
    //         let rdp = this.m_rdps[this.m_index];
    //         this.m_index = index;
    //         this.rdp = this.m_rdps[index];
    //         this.m_rdpVer = -2;
    //         if (rdp.isCommon) {
    //             this.rdp.toShape();
    //         } else {
    //             this.rdp.toWireframe();
    //         }
    //         this.initRdp = rdp;
    //         return true;
    //     }
    //     return false;
    // }
    test(): boolean {
        return this.m_rdpVer != this.rdp.getVersion();
    }
    /**
     * @param force the default value is false
     */
    bindToGPU(force: boolean = false): void {
        force = force || this.m_rdpVer != this.rdp.getVersion();
        // console.log("B this.rdp.getType(): ", this.rdp.getType(), this.rdp.getUid());
        if (this.m_vrc.testRIOUid(this.m_vtxUid) || force) {
            // console.log(this.rdp.buf.wireframe);
            // console.log("bindToGPU()");
            this.m_vrc.bindEleBuf(this.rdp.buf);
            this.m_rdpVer = this.rdp.getVersion();
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
        // let wireframe = false;
        let rdp: BufRDataPair = null;
        if (this.m_rdps.length < 1 && ivtx.getIvsDataAt() != null) {

            // console.log("ROIndicesRes::initialize(), uid: ", this.m_uid, ", ivtx: ", ivtx);

            this.version = ivtx.indicesVer;
            this.m_vtx = ivtx;
            this.m_vtxUid = ivtx.getUid();
            rdp = this.createRDPAt(0, rc, vrc, disp);
        } else {
            rdp = new BufRDataPair(0);
            let rd = new BufRData();
            rd.buf = null;
            rd.ivsSize = disp.ivsCount;
            rd.ivsIndex = disp.ivsIndex;
            rd.stride = 2;
            rd.drawMode = disp.drawMode;
            rdp.r0 = rd;
            rdp.r1 = rd;
        }
        this.rdp = this.m_rdps[0] = rdp;
        this.initRdp = rdp;
        rdp.roiRes = this;
        rdp.toShape();
        let total = ivtx.getIvsDataTotal();
        // console.log("ROIndicesRes::initialize(), total: ", total);
        for (let i = 1; i < total; ++i) {
            rdp = this.createRDPAt(i, rc, vrc, disp);
            this.m_rdps.push(rdp);
        }
    }
    private createRDPAt(rdpIndex: number, rc: IRenderProxy, vrc: IROVtxBuilder, disp: IRODisplay): BufRDataPair {
        let rdp = new BufRDataPair(rdpIndex);
        rdp.roiRes = this;
        const ivtx = this.m_vtx;
        let ird = ivtx.getIvsDataAt(rdpIndex);
        console.log("ird: ", ird);
        this.m_ivsData = ird;
        let wireframe = ird.wireframe;
        let shape = ird.shape;

        let r0: BufRData = null;
        let r1: BufRData = null;
        if (shape) {
            r0 = this.createBuf(rdpIndex, rc, vrc, ivtx, disp.ivsIndex, false);
        }
        if (wireframe) {
            r1 = this.createBuf(rdpIndex, rc, vrc, ivtx, disp.ivsIndex, wireframe);
        }
        // console.log("createRDPAt(), r0: ", r0, ", r1: ", r1);
        if(r0 == null && r1 == null) {
            r0 = this.createBuf(rdpIndex, rc, vrc, ivtx, disp.ivsIndex, false);
        }
        if(r0 == null) {
            r0 = r1;
        }else if(r1 == null) {
            r1 = r0;
        }

        rdp.r0 = r0;
        rdp.r1 = r1;
        // console.log("createRDPAt(), rdpIndex: ", rdpIndex, ", wireframe: ", wireframe,", rdp.r0.getUid(): ", rdp.r0.getUid());
        // console.log("       rdp.r0.ivsSize: ", rdp.r0.ivsSize, ", r0.rdpIndex: ",rdp.r0.rdpIndex);
        return rdp;
    }
    private createBuf(rdpIndex: number, rc: IRenderProxy, vrc: IROVtxBuilder, ivtx: IROIVtxBuf, ivsIndex: number, wireframe: boolean = false): BufRData {
        // console.log("createBuf(), wireframe:", wireframe, ivtx);
        let ird = ivtx.getIvsDataAt(rdpIndex);
        let ivs = ird.ivs;
        let size = 0;

        let stride = 2;
        let gbuf = vrc.createBuf();
        vrc.bindEleBuf(gbuf);

        if (ivtx.bufData == null) {

            if (wireframe) {
                ivs = this.createWireframeIvs(ivs);
            }
            vrc.eleBufData(ivs, ivtx.getBufDataUsage());
            size = ivs.length;
            stride = size > 65536 ? 4 : 2;
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

                stride = 4;

                for (let i = 0, len = list.length; i < len; ++i) {
                    ivs = list[i];
                    list[i] = (ivs instanceof Uint32Array) ? ivs : new Uint32Array(ivs);
                }
            } else {
                stride = 2;
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

        gbuf.rdpIndex = rdpIndex;
        gbuf.wireframe = wireframe;


        let rd = new BufRData();
        rd.buf = gbuf;
        rd.rdpIndex = rdpIndex;
        rd.ivsSize = size;
        rd.ivsInitSize = size;
        rd.stride = stride;
        console.log("size: ", size, ", rdpIndex: ", rdpIndex);
        rd.common = !wireframe;
        rd.ivsIndex = rd.common ? ivsIndex : ivsIndex * 2;
        rd.ivsOffset = rd.ivsIndex * rd.stride;

        rd.bufType = stride != 4 ? rc.UNSIGNED_SHORT : rc.UNSIGNED_INT;
        rd.drawMode = wireframe ? RenderDrawMode.ELEMENTS_LINES : RenderDrawMode.ELEMENTS_TRIANGLES;
        // rd.type = wireframe ? 1 : 0;
        return rd;
    }

    destroy(vrc: IROVtxBuilder): void {

        this.m_vrc = null;
        if (this.m_rdps.length > 0) {
            this.m_vtx = null;
            for (let i = 0; i < this.m_rdps.length; ++i) {
                this.m_rdps[i].destroy(vrc);
            }
            this.m_ivsData = null;
            this.rdp = null;
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
            // console.log("createWireframeIvs(), wivs.length:", wivs.length);
            return wivs;
        }
        return ivs;
    }
}
export { IROIvsRDP, BufRDataPair, ROIndicesRes };
