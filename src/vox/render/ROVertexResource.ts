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
import * as IROVtxBufT from "../../vox/render/IROVtxBuf";
import * as IRenderResourceT from "../../vox/render/IRenderResource";

import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;
import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import IVertexRenderObj = IVertexRenderObjT.vox.mesh.IVertexRenderObj;
import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import VaoVertexRenderObj = VaoVertexRenderObjT.vox.mesh.VaoVertexRenderObj;
import IROVtxBuf = IROVtxBufT.vox.render.IROVtxBuf;
import IRenderResource = IRenderResourceT.vox.render.IRenderResource;

export namespace vox
{
    export namespace render
    {
        class ROVertexRes
        {
            version:number;
            private m_vtx:IROVtxBuf = null;
            private m_vtxUid:number = -1;
            private m_gpuBufs:any[] = [];
            private m_gpuBufsTotal:number = 0;
            private m_type:number = 0;
            private m_attribsTotal:number = 0;
            private m_wholeStride:number = 0;
            private m_typeList:number[] = null;
            private m_offsetList:number[] = null;
            private m_sizeList:number[] = null;
            
            private m_vroList:IVertexRenderObj[] = [];
            private m_vroListLen:number = 0;

            constructor()
            {
            }
            
            updateToGpu(rc:IBufferBuilder):void
            {
                let len:number = this.m_gpuBufs.length;
                if(len > 0)
                {
                    let vtx:IROVtxBuf = this.m_vtx;
                    if(this.version != vtx.vertexVer)
                    {
                        let usage:number = vtx.getBufDataUsage();
                        let fvs:Float32Array;
                        let sizeList:number[] = this.m_sizeList;
                        for(let i:number = 0; i < len; ++i)
                        {
                            fvs = vtx.getF32DataAt(i);
                            if(sizeList[i] >= fvs.length)
                            {
                                rc.bindArrBuf(this.m_gpuBufs[i]);
                                rc.arrBufSubData(fvs, 0);
                            }
                            else
                            {
                                rc.bindArrBuf(this.m_gpuBufs[i]);
                                rc.arrBufData(fvs, usage);
                                sizeList[i] = fvs.length;
                            }
                        }
                        this.version = vtx.vertexVer;
                    }
                }
            }
            private uploadCombined(rc:IBufferBuilder,shdp:IVtxShdCtr):void
            {
                let vtx:IROVtxBuf = this.m_vtx;
                let fvs:Float32Array = vtx.getF32DataAt(0);
                this.m_gpuBufs.push(rc.createBuf());
                rc.bindArrBuf(this.m_gpuBufs[0]);
                //  console.log("this.m_f32: "+this.m_f32);
                rc.arrBufData(fvs, vtx.getBufDataUsage());
                this.m_gpuBufsTotal = 1;
                this.m_sizeList = [fvs.length];
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
                let vtx:IROVtxBuf = this.m_vtx;
                let i:number = 0;
                let buf:any = null;
                let dataUsage:number = vtx.getBufDataUsage();
                this.m_gpuBufsTotal = this.m_vtx.getBuffersTotal();
                this.m_sizeList = new Array(this.m_attribsTotal);
                if(vtx.bufData == null)
                {
                    for(; i < this.m_attribsTotal; ++i)
                    {
                        buf = rc.createBuf();
                        this.m_gpuBufs.push(buf);
                        rc.bindArrBuf(buf);
                        rc.arrBufData(vtx.getF32DataAt(i), dataUsage);
                        this.m_sizeList[i] = vtx.getF32DataAt(i).length;
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
                        rc.arrBufDataMem(vtx.bufData.getAttributeDataTotalBytesAt(i), dataUsage);
                        
                        offset = 0;
                        dataSize = 0;
                        tot = vtx.bufData.getAttributeDataTotalAt(i);
                        
                        for(j = 0; j < tot; ++j)
                        {
                            fs32 = vtx.bufData.getAttributeDataAt(i,j);
                            dataSize += fs32.length;
                            rc.arrBufSubData(fs32,offset);
                            offset += fs32.byteLength;
                        }
                        this.m_sizeList[i] = dataSize;
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
            }
            initialize(rc:IBufferBuilder,shdp:IVtxShdCtr, vtx:IROVtxBuf):void
            {
                if(this.m_gpuBufs.length < 1 && vtx != null)
                {
                    this.version = vtx.vertexVer;
                    this.m_vtx = vtx;
                    this.m_vtxUid = vtx.getUid();
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
            version:number;
            private m_vtx:IROVtxBuf = null;
            private m_vtxUid:number = 0;
            private m_gpuBuf:any = null;
            private m_ivsSize:number = 0;
            private m_ivs:Uint16Array|Uint32Array;
            ibufStep:number = 0;
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
            updateToGpu(rc:IBufferBuilder):void
            {
                if(this.m_gpuBuf == null && this.m_ivsSize > 0)
                {
                    let vtx:IROVtxBuf = this.m_vtx;
                    
                    if(this.version != vtx.indicesVer)
                    {
                        this.m_ivs = vtx.getIvsData();
                        rc.bindEleBuf(this.m_gpuBuf);
                        if(this.m_ivsSize >= this.m_ivs.length)
                        {
                            rc.eleBufSubData(this.m_ivs, vtx.getBufDataUsage());
                        }
                        else
                        {
                            rc.eleBufData(this.m_ivs, vtx.getBufDataUsage());
                        }
                        this.m_ivsSize = this.m_ivs.length;
                        this.version = vtx.indicesVer;
                    }
                }
            }
            initialize(rc:IBufferBuilder,vtx:IROVtxBuf):void
            {
                if(this.m_gpuBuf == null && vtx.getIvsData() != null)
                {
                    this.version = vtx.indicesVer;
                    this.m_vtx = vtx;
                    this.m_vtxUid = vtx.getUid();
                    this.m_ivs = vtx.getIvsData();

                    this.m_gpuBuf = rc.createBuf();
                    rc.bindEleBuf(this.m_gpuBuf);
                    
                    if(vtx.bufData == null)
                    {
                        rc.eleBufData(this.m_ivs, vtx.getBufDataUsage());
                        this.m_ivsSize = this.m_ivs.length;
                    }
                    else
                    {
                        rc.eleBufDataMem(vtx.bufData.getIndexDataTotalBytes(),vtx.getBufDataUsage());
                        let uintArr:any = null;
                        let offset:number = 0;
                        this.m_ivsSize = 0;
                        for(let i:number = 0, len:number = vtx.bufData.getIndexDataTotal(); i < len; ++i)
                        {
                            uintArr = vtx.bufData.getIndexDataAt(i);
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
                    this.m_vtx = null;
                    rc.deleteBuf(this.m_gpuBuf);
                    this.m_gpuBuf = null;
                    this.m_ivs = null;
                    this.m_ivsSize = 0;
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
                //console.log("GpuVtxObect::__$attachThis() this.m_attachCount: "+this.m_attachCount);
            }
            __$detachThis():void
            {
                --this.m_attachCount;
                //console.log("GpuVtxObect::__$detachThis() this.m_attachCount: "+this.m_attachCount);
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
            updateToGpu(rc:IBufferBuilder):void
            {
                this.indices.updateToGpu(rc);
                this.vertex.updateToGpu(rc);
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
        export class ROVertexResource implements IRenderResource
        {
            private m_resMap:Map<number,GpuVtxObect> = new Map();
            private m_freeMap:Map<number,GpuVtxObect> = new Map();
            private m_updateIds:number[] = [];
            // 显存的vtx buffer的总数
            private m_vtxResTotal:number = 0;
            private m_attachTotal:number = 0;
            private m_delay:number = 128;
            private m_haveDeferredUpdate:boolean = false;

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
            hasResUid(resUid:number):boolean
            {
                return this.m_resMap.has(resUid);
            }
            
            bindToGpu(resUid:number):void
            {
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
            updateDataToGpu(rc:IBufferBuilder, resUid:number, deferred:boolean):void
            {
                if(deferred)
                {
                    this.m_updateIds.push(resUid);
                    this.m_haveDeferredUpdate = true;
                }
                else
                {
                    if(this.m_resMap.has(resUid))
                    {
                        this.m_resMap.get(resUid).updateToGpu(rc);
                    }
                }
            }
            addVertexRes(object:GpuVtxObect):void
            {
                if(!this.m_resMap.has(object.resUid))
                {
                    object.waitDelTimes = 0;
                    
                    //console.log("ROTextureResource add a texture buffer(resUid="+object.resUid+")");
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
                if(this.m_haveDeferredUpdate)
                {
                    this.m_haveDeferredUpdate = false;   
                    let len:number = this.m_updateIds.length;
                    len = len > 16?16:len;
                    let resUid:number;
                    for(let i:number = 0; i < len;++i)
                    {
                        resUid = this.m_updateIds.shift();
                        if(this.m_resMap.has(resUid))
                        {
                            console.log("ROvtxRes("+resUid+") update vtx("+resUid+") data to gpu with deferred mode.");
                            this.m_resMap.get(resUid).updateToGpu(rc);
                        }
                    }
                }
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
                            console.log("ROVertexResource repeat use a vertex buffer(resUid="+value.resUid+") from freeMap.");
                            this.m_freeMap.delete(value.resUid);
                        }
                    }
                }
            }

        }
        
    }
}