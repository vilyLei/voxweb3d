/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxShdCtr from "../../../vox/material/IVtxShdCtr";
import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
import IVertexRenderObj from "../../../vox/render/IVertexRenderObj";
import VertexRenderObj from "../../../vox/render/VertexRenderObj";
import VaoVertexRenderObj from "../../../vox/render/VaoVertexRenderObj";
import IROVtxBuf from "../../../vox/render/IROVtxBuf";
import { ROIndicesRes } from "./ROIndicesRes";

class ROVertexRes {
    version: number;
    private m_vtx: IROVtxBuf = null;
    private m_typeList: number[] = null;
    private m_offsetList: number[] = null;
    private m_sizeList: number[] = null;
    private m_vtxUid = -1;
    private m_gpuBufs: any[] = [];
    private m_gpuBufsTotal = 0;
    private m_type = 0;
    private m_attribsTotal = 0;
    private m_wholeStride = 0;

    private m_vroList: IVertexRenderObj[] = [];
    private m_vroListLen = 0;
    private m_attachCount = 0;

    constructor() {
    }
    __$attachThis(): void {
        ++this.m_attachCount;
        console.log("ROVertexRes::__$attachThis() this.m_attachCount: "+this.m_attachCount);
    }
    __$detachThis(): void {
        if (this.m_attachCount == 1) {
            --this.m_attachCount;
            console.log("ROVertexRes::__$detachThis() this.m_attachCount: "+this.m_attachCount);
            // this.__$dispose();
        }
        else {
            --this.m_attachCount;
            console.log("ROVertexRes::__$detachThis() this.m_attachCount: "+this.m_attachCount);
        }
        if (this.m_attachCount < 1) {
            this.m_attachCount = 0;
        }
    }
    getAttachCount(): number {
        return this.m_attachCount;
    }
    updateToGpu(rc: IROVtxBuilder): void {
        let len: number = this.m_gpuBufs.length;
        if (len > 0) {
            let vtx: IROVtxBuf = this.m_vtx;
            if (this.version != vtx.vertexVer) {
                let usage: number = vtx.getBufDataUsage();
                let fvs: Float32Array;
                let sizeList: number[] = this.m_sizeList;
                for (let i: number = 0; i < len; ++i) {
                    fvs = vtx.getF32DataAt(i);
                    if (sizeList[i] >= fvs.length) {
                        rc.bindArrBuf(this.m_gpuBufs[i]);
                        rc.arrBufSubData(fvs, 0);
                    }
                    else {
                        rc.bindArrBuf(this.m_gpuBufs[i]);
                        rc.arrBufData(fvs, usage);
                        sizeList[i] = fvs.length;
                    }
                }
                this.version = vtx.vertexVer;
            }
        }
    }
    //private m_preCombinedSize: number = 0;
    private uploadCombined(rc: IROVtxBuilder, shdp: IVtxShdCtr): void {
        let vtx: IROVtxBuf = this.m_vtx;
        let fvs: Float32Array = vtx.getF32DataAt(0);
        //console.log("uploadCombined combSize: ",this.m_preCombinedSize, fvs.length);
        //this.m_preCombinedSize = fvs.length;

        this.m_gpuBufs.push(rc.createBuf());
        rc.bindArrBuf(this.m_gpuBufs[0]);
        // console.log("uploadCombined, this.m_gpuBufs: "+this.m_gpuBufs);
        rc.arrBufData(fvs, vtx.getBufDataUsage());
        this.m_gpuBufsTotal = 1;
        this.m_sizeList = [fvs.length];
        if (this.m_typeList == null) {

            this.m_wholeStride = 0;
            this.m_typeList = new Array(this.m_attribsTotal);
            this.m_offsetList = new Array(this.m_attribsTotal);
            let typeList: number[] = vtx.getBufTypeList();
            let sizeList: number[] = vtx.getBufSizeList();

            if (typeList != null) {

                for (let i: number = 0; i < this.m_attribsTotal; ++i) {
                    this.m_offsetList[i] = this.m_wholeStride;
                    this.m_wholeStride += sizeList[i] * 4;
                    this.m_typeList[i] = typeList[i];
                }
            }
            else {

                for (let i: number = 0; i < this.m_attribsTotal; ++i) {
                    this.m_offsetList[i] = this.m_wholeStride;
                    this.m_wholeStride += shdp.getLocationSizeByIndex(i) * 4;
                    this.m_typeList[i] = (shdp.getLocationTypeByIndex(i));
                }
            }
        }

    }
    private uploadSeparated(rc: IROVtxBuilder, shdp: IVtxShdCtr): void {

        let vtx: IROVtxBuf = this.m_vtx;
        let i: number = 0;
        let buf: any = null;
        let dataUsage: number = vtx.getBufDataUsage();
        this.m_gpuBufsTotal = this.m_vtx.getBuffersTotal();
        this.m_sizeList = new Array(this.m_attribsTotal);
        // console.log("uploadSeparated, this.m_gpuBufs: "+this.m_gpuBufs);
        if (vtx.bufData == null) {
            for (; i < this.m_attribsTotal; ++i) {
                buf = rc.createBuf();
                this.m_gpuBufs.push(buf);
                rc.bindArrBuf(buf);
                rc.arrBufData(vtx.getF32DataAt(i), dataUsage);
                this.m_sizeList[i] = vtx.getF32DataAt(i).length;
            }
        }
        else {
            //console.log(">>>>>>>>vtxSepbuf use (this.bufData == null) : "+(this.bufData == null));
            let fs32: any = null;
            let j: number = 0;
            let tot: number = 0;
            let offset: number = 0;
            let dataSize: number = 0;
            for (; i < this.m_attribsTotal; ++i) {
                buf = rc.createBuf();
                //console.log("this.bufData.getAttributeDataTotalBytesAt("+i+"): "+this.bufData.getAttributeDataTotalBytesAt(i));
                this.m_gpuBufs.push(buf);
                rc.bindArrBuf(buf);
                rc.arrBufDataMem(vtx.bufData.getAttributeDataTotalBytesAt(i), dataUsage);

                offset = 0;
                dataSize = 0;
                tot = vtx.bufData.getAttributeDataTotalAt(i);

                for (j = 0; j < tot; ++j) {
                    fs32 = vtx.bufData.getAttributeDataAt(i, j);
                    dataSize += fs32.length;
                    rc.arrBufSubData(fs32, offset);
                    offset += fs32.byteLength;
                }
                this.m_sizeList[i] = dataSize;
            }
        }
        if (this.m_typeList == null) {

            this.m_typeList = new Array(this.m_attribsTotal);
            this.m_offsetList = new Array(this.m_attribsTotal);

            let typeList: number[] = vtx.getBufTypeList();
            let sizeList: number[] = vtx.getBufSizeList();

            if (typeList != null) {
                for (let i: number = 0; i < this.m_attribsTotal; ++i) {
                    this.m_offsetList[i] = this.m_wholeStride;
                    this.m_wholeStride += sizeList[i] * 4;
                    this.m_typeList[i] = typeList[i];
                }
            }
            else {
                for (let i: number = 0; i < this.m_attribsTotal; ++i) {
                    this.m_offsetList[i] = this.m_wholeStride;
                    this.m_wholeStride += shdp.getLocationSizeByIndex(i) * 4;
                    this.m_typeList[i] = (shdp.getLocationTypeByIndex(i));
                }
            }
            this.m_wholeStride = 0;
        }
    }
    initialize(rc: IROVtxBuilder, shdp: IVtxShdCtr, vtx: IROVtxBuf): void {
        if (this.m_gpuBufs.length < 1 && vtx != null) {
            this.version = vtx.vertexVer;
            this.m_vtx = vtx;
            this.m_vtxUid = vtx.getUid();
            this.m_type = vtx.getType();

            let typeList: number[] = vtx.getBufTypeList();
            //let sizeList: number[] = vtx.getBufSizeList();
            this.m_attribsTotal = typeList != null ? typeList.length : shdp.getLocationsTotal();

            if (shdp.getLocationsTotal() != vtx.getAttribsTotal()) {
                console.warn("shdp.getLocationsTotal() is " + shdp.getLocationsTotal() + " != vtx.getAttribsTotal() is " + vtx.getAttribsTotal() + "/" + (typeList != null ? typeList.length : 0));
            }
            if (this.m_type < 1) {
                // combined buf
                this.uploadCombined(rc, shdp);
            }
            else {
                // separated buf
                this.uploadSeparated(rc, shdp);
            }
        }
    }
    /**
     * get vro object attribute mix id
     */
    private getVROMid(rc: IROVtxBuilder, shdp: IVtxShdCtr, vaoEnabled: boolean, ibufId: number): number {
        let mid: number = (131 + rc.getRCUid()) * this.m_vtxUid;
        if (vaoEnabled) mid = mid * 131 + 1;
        mid = mid * 131 + shdp.getMid();
        mid = mid * 131 + ibufId;
        return mid;
    }

    // 创建被 RPOUnit 使用的 vro 实例
    createVRO(rc: IROVtxBuilder, shdp: IVtxShdCtr, vaoEnabled: boolean, ibufRes: ROIndicesRes): IVertexRenderObj {

        let attribsTotal: number = shdp.getLocationsTotal();
        // console.log("(this.m_attribsTotal * attribsTotal) > 0 && attribsTotal <= this.m_attribsTotal: ", (this.m_attribsTotal * attribsTotal) > 0 && attribsTotal <= this.m_attribsTotal);
        // console.log("(this.m_attribsTotal * attribsTotal) > 0 && attribsTotal <= this.m_attribsTotal: ", this.m_attribsTotal,attribsTotal,attribsTotal,this.m_attribsTotal);
        if ((this.m_attribsTotal * attribsTotal) > 0 && attribsTotal <= this.m_attribsTotal) {
            let mid = this.getVROMid(rc, shdp, vaoEnabled, ibufRes.getUid());

            let i = 0;
            let pvro = VaoVertexRenderObj.GetByMid(mid);
            if (pvro != null) {
                return pvro;
            }
            // console.log("VtxCombinedBuf::createVROBegin(), this.m_type: ",this.m_type, "mid: ",mid);
            // TODO(vilyLei): 暂时注释掉下面这行代码
            // let flag: boolean = shdp.testVertexAttribPointerOffset(this.m_offsetList);
            // console.log("createVRO testVertexAttribPointerOffset flag: ",flag, this.m_typeList);
            // DivLog.ShowLog("createVRO testVertexAttribPointerOffset flag: "+flag);
            if (vaoEnabled) {
                // vao 的生成要记录标记,防止重复生成, 因为同一组数据在不同的shader使用中可能组合方式不同，导致了vao可能是多样的
                // console.log("VtxCombinedBuf::createVROBegin(), "+this.m_typeList+" /// "+this.m_wholeStride+" /// "+this.m_offsetList);
                // console.log("VtxCombinedBuf::createVROBegin(), "+this.m_type);
                let vro = VaoVertexRenderObj.Create(rc, mid, this.m_vtx.getUid());
                vro.indicesRes = ibufRes;
                vro.vao = rc.createVertexArray();
                rc.bindVertexArray(vro.vao);
                if (this.m_type < 1) {
                    // combined buf vro
                    rc.bindArrBuf(this.m_gpuBufs[0]);
                    // for (i = 0; i < attribsTotal; ++i) {
                    //     shdp.vertexAttribPointerTypeFloat(this.m_typeList[i], this.m_wholeStride, this.m_offsetList[i]);
                    // }
                    const types = shdp.getLocationTypes();
                    for (i = 0; i < types.length; ++i) {
                        const k = types[i] - 1;
                        shdp.vertexAttribPointerTypeFloat(this.m_typeList[k], this.m_wholeStride, this.m_offsetList[k]);
                    }
                }
                else {
                    // console.log("A attribsTotal: ", attribsTotal, this.m_typeList);
                    // console.log("B shdp.getLocationTypes(): ", shdp.getLocationTypes());
                    // for (i = 0; i < attribsTotal; ++i) {
                    //     rc.bindArrBuf(this.m_gpuBufs[i]);
                    //     shdp.vertexAttribPointerTypeFloat(this.m_typeList[i], 0, 0);
                    // }
                    const types = shdp.getLocationTypes();
                    for (i = 0; i < types.length; ++i) {
                        const k = types[i] - 1;
                        rc.bindArrBuf(this.m_gpuBufs[k]);
                        shdp.vertexAttribPointerTypeFloat(this.m_typeList[k], 0, 0);
                    }
                }
                pvro = vro;
                vro.ibuf = ibufRes.getGpuBuf();
                // rc.bindEleBuf(vro.ibuf);
                rc.bindVertexArray(null);
            }
            else {
                let vro: VertexRenderObj = VertexRenderObj.Create(rc, mid, this.m_vtx.getUid());
                vro.indicesRes = ibufRes;
                vro.shdp = shdp;
                vro.attribTypes = [];
                vro.wholeOffsetList = [];
                vro.wholeStride = this.m_wholeStride;

                if (this.m_type < 1) {
                    vro.vbuf = this.m_gpuBufs[0];
                }
                else {
                    vro.vbufs = this.m_gpuBufs;
                }
                for (i = 0; i < attribsTotal; ++i) {
                    if (shdp.testVertexAttribPointerType(this.m_typeList[i])) {
                        vro.attribTypes.push(this.m_typeList[i]);
                        //vro.wholeOffsetList.push( this.m_offsetList[i] );
                        vro.wholeOffsetList.push(0);
                    }
                }

                vro.attribTypesLen = vro.attribTypes.length;
                vro.ibuf = ibufRes.getGpuBuf();
                pvro = vro;
            }
            this.m_vroList.push(pvro);
            ++this.m_vroListLen;
            return pvro;
        }
        return null;
    }
    destroy(rc: IROVtxBuilder): void {
        console.log("ROVertexRes::destroy(), this.m_attachCount: ", this.m_attachCount);
        if(this.m_attachCount < 1) {
            if (this.m_gpuBufs.length > 0) {
                console.log("ROVertexRes::destroy(), type: ", this.m_type);
                this.m_type = -1;
                let i = 0;
                let vro: IVertexRenderObj = null;
                for (; i < this.m_vroListLen; ++i) {
                    vro = this.m_vroList.pop();
                    vro.restoreThis();
                    this.m_vroList[i] = null;
                }
                this.m_vroListLen = 0;
                for (i = 0; i < this.m_attribsTotal; ++i) {
                    rc.deleteBuf(this.m_gpuBufs[i]);
                    this.m_gpuBufs[i] = null;
                }
                this.m_attribsTotal = 0;
                this.m_gpuBufs = [];
            }
        }
    }
}
export { ROVertexRes };