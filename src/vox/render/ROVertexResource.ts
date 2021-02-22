/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";
import * as IBufferBuilderT from "../../vox/render/IBufferBuilder";
import * as IVertexRenderObjT from "../../vox/mesh/IVertexRenderObj";
import * as VertexRenderObjT from "../../vox/mesh/VertexRenderObj";
import * as VaoVertexRenderObjT from "../../vox/mesh/VaoVertexRenderObj";
import * as VtxBufDataT from "../../vox/mesh/VtxBufData";
import * as IVtxBufT from "../../vox/mesh/IVtxBuf";

import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;
import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import IVertexRenderObj = IVertexRenderObjT.vox.mesh.IVertexRenderObj;
import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import VaoVertexRenderObj = VaoVertexRenderObjT.vox.mesh.VaoVertexRenderObj;
import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;
import IVtxBuf = IVtxBufT.vox.mesh.IVtxBuf;

export namespace vox
{
    export namespace render
    {
        class ROVertexRes
        {
            private m_vtx:IVtxBuf = null;
            private m_vtxUid:number = -1;
            private m_gpuBufs:any[] = [];
            private m_gpuBufsTotal:number = 0;
            private m_type:number = 0;
            private m_attribsTotal:number = 0;
            private m_wholeStride:number = 0;
            private m_typeList:number[] = null;
            private m_offsetList:number[] = null;
            
            private m_vroList:IVertexRenderObj[] = [];
            private m_vroListLen:number = 0;

            constructor()
            {
            }
            
            private uploadCombined(rc:IBufferBuilder,shdp:IVtxShdCtr):void
            {
                let pvtx:IVtxBuf = this.m_vtx;
                this.m_gpuBufs.push(rc.createBuf());
                rc.bindArrBuf(this.m_gpuBufs[0]);
                //  console.log("this.m_f32: "+this.m_f32);
                rc.arrBufData(pvtx.getF32DataAt(0), pvtx.getBufDataUsage());
                this.m_gpuBufsTotal = 1;
                
                if(this.m_typeList == null)
                {
                    this.m_wholeStride = 0;
                    this.m_typeList = new Array(this.m_attribsTotal);
                    this.m_offsetList = new Array(this.m_attribsTotal);

                    for(let i:number = 0; i < this.m_attribsTotal; ++i)
                    {
                        this.m_offsetList[i] = this.m_wholeStride;
                        this.m_wholeStride += shdp.getLocationSizeByIndex(i) * 4;
                        this.m_typeList[i] = ( shdp.getLocationTypeByIndex(i) );
                    }
                }
            }
            private uploadSeparated(rc:IBufferBuilder,shdp:IVtxShdCtr):void
            {
                if(true)
                {
                    let pvtx:IVtxBuf = this.m_vtx;
                    let i:number = 0;
                    let buf:any = null;
                    let dataUsage:number = pvtx.getBufDataUsage();
                    if(pvtx.bufData == null)
                    {
                        for(; i < this.m_attribsTotal; ++i)
                        {
                            buf = rc.createBuf();
                            this.m_gpuBufs.push(buf);
                            rc.bindArrBuf(buf);
                            rc.arrBufData(pvtx.getF32DataAt(i), dataUsage);
                            //this.m_f32PreSizeList[i] = this.m_f32SizeList[i];
                        }
                    }
                    else
                    {
                        //console.log(">>>>>>>>vtxSepbuf use (this.bufData == null) : "+(this.bufData == null));
                        let fs32:any = null;
                        let j:number = 0;
                        let tot:number = 0;
                        let offset:number = 0;
                        let dataSize:number = 0;
                        for(; i < this.m_attribsTotal; ++i)
                        {
                            buf = rc.createBuf();
                            //console.log("this.bufData.getAttributeDataTotalBytesAt("+i+"): "+this.bufData.getAttributeDataTotalBytesAt(i));
                            this.m_gpuBufs.push(buf);
                            rc.bindArrBuf(buf);
                            rc.arrBufDataMem(pvtx.bufData.getAttributeDataTotalBytesAt(i), dataUsage);
                            
                            offset = 0;
                            dataSize = 0;
                            tot = pvtx.bufData.getAttributeDataTotalAt(i);
                            
                            for(j = 0; j < tot; ++j)
                            {
                                fs32 = pvtx.bufData.getAttributeDataAt(i,j);
                                dataSize += fs32.length;
                                rc.arrBufSubData(fs32,offset);
                                offset += fs32.byteLength;
                            }
                            //this.m_f32PreSizeList[i] = dataSize;
                        }
                    }
                }
                if(this.m_typeList == null)
                {
                    this.m_wholeStride = 0;
                    this.m_typeList = new Array(this.m_attribsTotal);
                    this.m_offsetList = new Array(this.m_attribsTotal);
                    this.m_offsetList.fill(0);
                    for(let i:number = 0; i < this.m_attribsTotal; ++i)
                    {
                        this.m_typeList[i] = ( shdp.getLocationTypeByIndex(i) );
                    }
                }
                this.m_gpuBufsTotal = this.m_vtx.getBuffersTotal();
            }
            initialize(rc:IBufferBuilder,shdp:IVtxShdCtr, vtx:IVtxBuf,vtxUid:number):void
            {
                if(this.m_gpuBufs.length < 1 && vtx != null)
                {
                    this.m_vtx = vtx;
                    this.m_vtxUid = vtxUid;
                    this.m_type = vtx.getType();
                    this.m_attribsTotal = shdp.getLocationsTotal();

                    if(this.m_type < 1)
                    {
                        // combined buf
                        this.uploadCombined(rc, shdp);
                    }
                    else
                    {
                        // separated buf
                        this.uploadSeparated(rc, shdp);
                    }
                }
            }
            private getVROMid(rc:IBufferBuilder, shdp:IVtxShdCtr, vaoEnabled:boolean):number
            {
                let mid:number = (131 + rc.getUid()) * this.m_vtxUid;
                if(vaoEnabled)
                {
                    // 之所以 + 0xf0000 这样区分，是因为 shdp.getLayoutBit() 的取值范围不会超过short(double bytes)取值范围
                    mid = mid * 131 + shdp.getLayoutBit() + 0xf0000;
                }
                else
                {
                    mid = mid * 131 + shdp.getLayoutBit();
                }
                
                return mid;
            }
            
            // 创建被 RPOUnit 使用的 vro 实例
            createVRO(rc:IBufferBuilder, shdp:IVtxShdCtr, vaoEnabled:boolean):IVertexRenderObj
            {
                if(this.m_attribsTotal > 0)
                {
                    let mid:number = this.getVROMid(rc,shdp,vaoEnabled);
                
                    let i:number = 0;
                    //console.log("### Combined mid: "+mid+", uid: "+this.m_uid);
                    let pvro:IVertexRenderObj = VaoVertexRenderObj.GetByMid(mid);
                    if(pvro != null)
                    {
                        return pvro;
                    }
                    let attribsTotal:number = this.m_attribsTotal;
                    if(vaoEnabled)
                    {
                        // vao 的生成要记录标记,防止重复生成, 因为同一组数据在不同的shader使用中可能组合方式不同，导致了vao可能是多样的
                        //console.log("VtxCombinedBuf::createVROBegin(), "+this.m_typeList+" /// "+this.m_wholeStride+" /// "+this.m_offsetList);
                        let vro:VaoVertexRenderObj = VaoVertexRenderObj.Create(mid, this.m_vtx.getUid());
                        vro.vao = rc.createVertexArray();
                        rc.bindVertexArray(vro.vao);
                        if(this.m_type < 1)
                        {
                            // combined buf vro
                            rc.bindArrBuf(this.m_gpuBufs[0]);
                            for(i = 0; i < attribsTotal; ++i)
                            {
                                shdp.vertexAttribPointerTypeFloat(this.m_typeList[i], this.m_wholeStride, this.m_offsetList[i]);
                            }
                        }
                        else
                        {
                            for(i = 0; i < attribsTotal; ++i)
                            {
                                rc.bindArrBuf(this.m_gpuBufs[i]);
                                shdp.vertexAttribPointerTypeFloat(this.m_typeList[i], 0, 0);
                            }
                        }
                        pvro = vro;
                        rc.bindVertexArray(null);
                    }
                    else
                    {
                        let vro:VertexRenderObj = VertexRenderObj.Create(mid, this.m_vtx.getUid());
                        vro.shdp = shdp;
                        vro.attribTypes = [];
                        vro.wholeOffsetList = [];
                        vro.wholeStride = this.m_wholeStride;
    
                        if(this.m_type < 1)
                        {
                            vro.vbuf = this.m_gpuBufs[0];
                        }
                        else
                        {
                            vro.vbufs = this.m_gpuBufs;
                        }
                        for(i = 0; i < attribsTotal; ++i)
                        {
                            if(shdp.testVertexAttribPointerType(this.m_typeList[i]))
                            {
                                vro.attribTypes.push( this.m_typeList[i] );
                                vro.wholeOffsetList.push( this.m_offsetList[i] );
                            }
                        }
    
                        vro.attribTypesLen = vro.attribTypes.length;
                        pvro = vro;
                    }
                    this.m_vroList.push(pvro);
                    ++this.m_vroListLen;
                    return pvro;
                }
                return null;
            }
            destroy(rc:IBufferBuilder):void
            {
                if(this.m_gpuBufs.length > 0)
                {
                    console.log("ROVertexRes::destroy(), type: "+this.m_type);
                    this.m_type = -1;
                    let i:number = 0;
                    let vro:IVertexRenderObj = null;
                    for(; i < this.m_vroListLen; ++i)
                    {
                        vro = this.m_vroList.pop();
                        vro.restoreThis(rc);
                        this.m_vroList[i] = null;
                    }
                    this.m_vroListLen = 0;
                    for(i = 0; i < this.m_attribsTotal; ++i)
                    {
                        rc.deleteBuf(this.m_gpuBufs[i]);
                        this.m_gpuBufs[i] = null;
                    }
                    this.m_attribsTotal = 0;
                    this.m_gpuBufs = [];
                }
            }
        }
        class ROIndicesRes
        {
            private m_vtxUid:number = 0;
            private m_gpuBuf:any = null;
            private m_ivsSize:number = 0;
            private m_ivs:Uint16Array|Uint32Array;
            ibufStep:number;
            constructor()
            {
            }
            getVtxUid():number
            {
                return this.m_vtxUid;
            }
            getGpuBuf():any
            {
                return this.m_gpuBuf;
            }
            initialize(rc:IBufferBuilder, ivs:Uint16Array|Uint32Array,bufData:VtxBufData,bufDataUsage:number,vtxUid:number):void
            {
                if(this.m_gpuBuf == null && ivs != null)
                {
                    this.m_vtxUid = vtxUid;
                    this.m_ivs = ivs;
                    this.m_gpuBuf = rc.createBuf();
                    rc.bindEleBuf(this.m_gpuBuf);
                    
                    if(bufData == null)
                    {
                        rc.eleBufData(this.m_ivs, bufDataUsage);
                        this.m_ivsSize = this.m_ivs.length;
                    }
                    else
                    {
                        rc.eleBufDataMem(bufData.getIndexDataTotalBytes(),bufDataUsage);
                        let uintArr:any = null;
                        let offset:number = 0;
                        this.m_ivsSize = 0;
                        for(let i:number = 0, len:number = bufData.getIndexDataTotal(); i < len; ++i)
                        {
                            uintArr = bufData.getIndexDataAt(i);
                            rc.eleBufSubData(uintArr, offset);
                            offset += uintArr.byteLength;
                            this.m_ivsSize += uintArr.length;
                        }
                    }
                }
            }

            destroy(rc:IBufferBuilder):void
            {
                if(this.m_gpuBuf != null)
                {
                    rc.deleteBuf(this.m_gpuBuf);
                    this.m_gpuBuf = null;
                    this.m_ivs = null;
                    
                }
            }
        }
        export class GpuVtxObect
        {
            version:number = -1;
            // wait del times
            waitDelTimes:number = 0;
			// renderer context unique id
            rcuid:number = 0;
            // texture resource unique id
            resUid:number = 0;
            
            vertex:ROVertexRes = new ROVertexRes();
            indices:ROIndicesRes = new ROIndicesRes();
            constructor()
            {
            }
            private m_attachCount:number = 0;
            __$attachThis():void
            {
                ++this.m_attachCount;
                console.log("GpuVtxObect::__$attachThis() this.m_attachCount: "+this.m_attachCount);
            }
            __$detachThis():void
            {
                --this.m_attachCount;
                console.log("GpuVtxObect::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                if(this.m_attachCount < 1)
                {
                    this.m_attachCount = 0;
                    console.log("GpuVtxObect::__$detachThis() this.m_attachCount value is 0.");
                    // do something
                }
            }
            getAttachCount():number
            {
                return this.m_attachCount;
            }
            createVRO(rc:IBufferBuilder, shdp:IVtxShdCtr, vaoEnabled:boolean):IVertexRenderObj
            {
                let vro:IVertexRenderObj = this.vertex.createVRO(rc, shdp,vaoEnabled);
                vro.ibuf = this.indices.getGpuBuf();
                vro.ibufStep = this.indices.ibufStep;
                return vro;
            }
            destroy(rc:IBufferBuilder):void
            {
                if(this.getAttachCount() < 1 && this.resUid >= 0)
                {
                    this.vertex.destroy(rc);
                    this.indices.destroy(rc);
                    this.resUid = -1;
                }
            }
        }
        // gpu vertex buffer renderer resource
        export class ROVertexResource
        {
            private m_resMap:Map<number,GpuVtxObect> = new Map();
            private m_freeMap:Map<number,GpuVtxObect> = new Map();
            // 显存的vtx buffer的总数
            private m_vtxResTotal:number = 0;
            private m_attachTotal:number = 0;
            private m_delay:number = 128;

			// renderer context unique id
			private m_rcuid:number = 0;
            private m_gl:any = null;

            // render vertex object unique id
            vroUid:number = -2;
            // indices buffer object unique id
            rioUid:number = -3;
            unlocked:boolean = true;
            constructor(rcuid:number, gl:any)
            {
                this.m_rcuid = rcuid;
                this.m_gl = gl;
            }
            getRCUid():number
            {
                return this.m_rcuid;
            }
            getRC():any
            {
                return this.m_gl;
            }
            renderBegin():void
            {
                this.vroUid = -2;
                this.rioUid = -3;
            }
            getVertexResTotal():number
            {
                return this.m_vtxResTotal;
            }
            addVertexRes(object:GpuVtxObect):void
            {
                if(!this.m_resMap.has(object.resUid))
                {
                    object.waitDelTimes = 0;
                    
                    console.log("ROTextureResource add a texture buffer(resUid="+object.resUid+")");
                    this.m_resMap.set(object.resUid, object);
                    this.m_vtxResTotal++;
                }
            }
            hasVertexRes(resUid:number):boolean
            {
                return this.m_resMap.has(resUid);
            }
            getVertexRes(resUid:number):GpuVtxObect
            {
                return this.m_resMap.get(resUid);
            }
            __$attachRes(resUid:number):void
            {
                if(this.m_resMap.has(resUid))
                {
                    this.m_attachTotal++;
                    let object:GpuVtxObect = this.m_resMap.get(resUid);
                    if(object.getAttachCount() < 1)
                    {
                        if(this.m_freeMap.has(resUid))
                        {
                            this.m_freeMap.delete(resUid);
                        }
                    }
                    object.waitDelTimes = 0;
                    object.__$attachThis();
                }
            }
            __$detachRes(resUid:number):void
            {
                if(this.m_resMap.has(resUid))
                {
                    if(this.m_resMap.has(resUid))
                    {
                        let object:GpuVtxObect = this.m_resMap.get(resUid);
                        if(object.getAttachCount() > 0)
                        {
                            this.m_attachTotal--;
                            object.__$detachThis();
                            if(object.getAttachCount() < 1)
                            {
                                // 将其加入待清理的map
                                this.m_freeMap.set(resUid, object);
                            }
                        }
                    }
                }
            }
            getVROByResUid(resUid:number,rc:IBufferBuilder,shdp:IVtxShdCtr,vaoEnabled:boolean):IVertexRenderObj
            {
                let vtxObj:GpuVtxObect = this.m_resMap.get(resUid);
                if(vtxObj != null)
                {
                    return vtxObj.createVRO(rc, shdp,vaoEnabled);
                }
                return null;
            }
            update(rc:IBufferBuilder):void
            {
                this.m_delay --;
                if(this.m_delay < 1)
                {
                    this.m_delay = 128;
                    for(const [key,value] of this.m_freeMap)
                    {
                        value.waitDelTimes++;
                        if(value.getAttachCount() < 1)
                        {
                            if(value.waitDelTimes > 5)
                            {
                                console.log("ROVertexResource remove a vertex buffer(resUid="+value.resUid+")");
                                this.m_resMap.delete(value.resUid);
                                this.m_freeMap.delete(value.resUid);
                                
                                value.destroy(rc);
                                this.m_vtxResTotal--;
                            }
                        }
                        else
                        {
                            console.log("ROVertexResource 重新使用 a vertex buffer(resUid="+value.resUid+")");
                            this.m_freeMap.delete(value.resUid);
                        }
                    }
                }
            }

        }
        
    }
}