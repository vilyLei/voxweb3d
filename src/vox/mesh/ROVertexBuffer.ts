/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderConstT from "../../vox/render/RenderConst";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";
import * as RenderBufferUpdaterT from "../../vox/render/RenderBufferUpdater";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as ROVtxBufUidStoreT from "../../vox/mesh/ROVtxBufUidStore";
import * as VtxBufDataT from "../../vox/mesh/VtxBufData";
import * as VertexRenderObjT from "../../vox/mesh/VertexRenderObj";
import * as IVtxBufT from "../../vox/mesh/IVtxBuf";
import * as VtxCombinedBufT from "../../vox/mesh/VtxCombinedBuf";
import * as VtxSeparatedBufT from "../../vox/mesh/VtxSeparatedBuf";
import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";

import RenderDrawMode = RenderConstT.vox.render.RenderDrawMode;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;
import RenderBufferUpdater = RenderBufferUpdaterT.vox.render.RenderBufferUpdater;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import ROVtxBufUidStore = ROVtxBufUidStoreT.vox.mesh.ROVtxBufUidStore;
import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;
import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import IVtxBuf = IVtxBufT.vox.mesh.IVtxBuf;
import VtxCombinedBuf = VtxCombinedBufT.vox.mesh.VtxCombinedBuf;
import VtxSeparatedBuf = VtxSeparatedBufT.vox.mesh.VtxSeparatedBuf;
import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;

export namespace vox
{
    export namespace mesh
    {
        export class ROVertexBuffer implements IRenderBuffer
        {
            private static __s_uid:number = 0;
            private m_uid:number = 0;
            private m_bufDataUsage:number = 0;
            //
            private m_vtxBuf:IVtxBuf = null;

            bufData:VtxBufData = null;
            private constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
            {
                this.m_uid = ROVertexBuffer.__s_uid++;
                this.m_bufDataUsage = bufDataUsage;
            }
            private setVtxBuf(vtxBuf:IVtxBuf):void
            {
                this.m_vtxBuf = vtxBuf;
                if(vtxBuf != null)vtxBuf.bufData = this.bufData;
            }
            private m_rc:RenderProxy = null;
            //private m_ivs:Uint16Array = null;
            private m_ivs:Uint16Array|Uint32Array = null;// Uint16Array or Uint32Array
            private m_ivsChanged:boolean = false;
            private m_ivsPreSize:number = 0;
            private m_ivsBuf:any = null;
            private m_vaoEnabled:boolean = true;
            private m_f32Changed:boolean = false;
            private m_ibufStep:number = 2;// 2 or 4
 
            drawMode:number = RenderDrawMode.ELEMENTS_TRIANGLES;
            getIBufStep():number
            {
                return this.m_ibufStep;
            }
            getBufDataUsage():number
            {
                return this.m_bufDataUsage;
            }
            private setBufDataUsage(bufDataUsage:number):void
            {
                this.m_bufDataUsage = bufDataUsage;
                if(this.m_vtxBuf != null)this.m_vtxBuf.setBufDataUsage(this.m_bufDataUsage);
            }
            getUid():number
            {
                return this.m_uid;
            }
            setVaoEnabled(boo:boolean):void
            {
                this.m_vaoEnabled = boo;
            }
            getVaoEnabled()
            {
                return this.m_vaoEnabled;
            }
            getF32DataAt(index:number):Float32Array
            {
                return this.m_vtxBuf.getF32DataAt(index);
            }
            getIvsData():Uint16Array | Uint32Array
            {
                return this.m_ivs;
            }
            isGpuEnabled():boolean
            {
                return this.m_vtxBuf.isGpuEnabled();
            }
            isEnabled():boolean
            {
                return this.m_rc != null;
            }
            setF32DataAt(index:number,float32Arr:Float32Array,stepFloatsTotal:number,setpOffsets:number[]):void
            {
                if(this.m_vtxBuf == null)
                {
                    this.m_vtxBuf = new VtxCombinedBuf(this.m_bufDataUsage);
                }
                this.m_vtxBuf.setF32DataAt(index, float32Arr, stepFloatsTotal, setpOffsets);
                if(!this.m_f32Changed && this.m_vtxBuf.isChanged())
                {
                    this.m_f32Changed = true;
                    RenderBufferUpdater.GetInstance().__$addBuf(this);
                }
            }
            setUintIVSData(uint16Or32Arr:Uint16Array | Uint32Array,status:number = VtxBufConst.VTX_STATIC_DRAW):void
            {
                if((uint16Or32Arr instanceof Uint16Array))
                {
                    this.m_ibufStep = 2;
                }
                else if((uint16Or32Arr instanceof Uint32Array))
                {
                    this.m_ibufStep = 4;
                }
                else
                {
                    console.error("Error: uint16Or32Arr is not an Uint32Array or an Uint16Array bufferArray instance !!!!");
                    return;
                }
                
                this.m_ivs = uint16Or32Arr;
                if(this.m_ivsBuf != null && uint16Or32Arr != null)
                {
                    this.m_ivsChanged = true;
                }
            }
            setUint16IVSData(uint16Arr:Uint16Array|Uint32Array,status:number = VtxBufConst.VTX_STATIC_DRAW):void
            {
                if((uint16Arr instanceof Uint16Array))
                {
                    this.m_ivs = uint16Arr;
                    if(this.m_ivsBuf != null && uint16Arr != null)
                    {
                        this.m_ivsChanged = true;
                    }
                    this.m_ibufStep = 2;
                }
                else
                {
                    console.error("Error: uint16Arr is not an Uint16Array bufferArray instance !!!!");
                }
            }
            setUint32IVSData(uint32Arr:Uint16Array|Uint32Array,status:number = VtxBufConst.VTX_STATIC_DRAW):void
            {
                if((uint32Arr instanceof Uint32Array))
                {
                    this.m_ivs = uint32Arr;
                    if(this.m_ivsBuf != null && uint32Arr != null)
                    {
                        this.m_ivsChanged = true;
                    }
                    this.m_ibufStep = 4;
                }
                else
                {
                    console.error("Error: uint32Arr is not an Uint32Array bufferArray instance !!!!");
                }
            }
            setData4fAt(vertexI:number,attribI:number,px:number,py:number,pz:number,pw:number):void
            {
                if(this.m_vtxBuf.isGpuEnabled())
                {
                    this.m_vtxBuf.setData4fAt(vertexI,attribI,px,py,pz,pw);
                    if(!this.m_f32Changed)
                    {
                        this.m_f32Changed = true;
                        RenderBufferUpdater.GetInstance().__$addBuf(this);
                    }
                }
            }
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void
            {
                if(this.m_vtxBuf.isGpuEnabled())
                {
                    this.m_vtxBuf.setData3fAt(vertexI,attribI,px,py,pz);
                    if(!this.m_f32Changed)
                    {
                        this.m_f32Changed = true;
                        RenderBufferUpdater.GetInstance().__$addBuf(this);
                    }
                }
            }
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void
            {
                if(this.m_vtxBuf.isGpuEnabled())
                {
                    this.m_vtxBuf.setData2fAt(vertexI,attribI,px,py);
                    if(!this.m_f32Changed)
                    {
                        this.m_f32Changed = true;
                        RenderBufferUpdater.GetInstance().__$addBuf(this);
                    }
                }
            }
            private m_updateStatus:number = -1;
            __$setUpdateStatus(s:number):void
            {
                this.m_updateStatus = s;
            }
            __$getUpdateStatus():number
            {
                return this.m_updateStatus;
            }
            __$updateToGpu(rc:RenderProxy):void
            {
                if(this.m_rc != null)
                {
                    if(this.m_ivsChanged && this.m_ivsBuf != null)
                    {
                        if(this.m_ivsPreSize >= this.m_ivs.length)
                        {
                            rc.bindEleBuf(this.m_ivsBuf);
                            rc.eleBufSubData(this.m_ivs, this.m_bufDataUsage);
                        }
                        else
                        {
                            rc.bindEleBuf(this.m_ivsBuf);
                            rc.eleBufData(this.m_ivs, this.m_bufDataUsage);
                        }
                        this.m_ivsPreSize = this.m_ivs.length;
                        this.m_ivsChanged = false;
                    }

                    if(this.m_f32Changed)
                    {
                        this.m_vtxBuf.updateToGpu( rc );
                        this.m_f32Changed = false;
                    }
                }
            }
            upload(rc:RenderProxy,shdp:IVtxShdCtr):void
            {
                //console.log("ROVertexBuffer::upload()... this.m_rc == null: "+(this.m_rc == null)+", "+this);
                if(this.m_rc == null)
                {
                    this.m_rc = rc;
                    this.m_f32Changed = false;
                    
                    this.m_vtxBuf.bufData = this.bufData;
                    this.m_vtxBuf.upload(rc, shdp);

                    if(this.m_ivs != null)
                    {
                        if(this.m_ivsBuf != null)
                        {
                            rc.deleteBuf(this.m_ivsBuf);
                            this.m_ivsBuf = null;
                        }
                        if(this.m_ivsBuf == null)
                        {
                            this.m_ivsBuf = rc.createBuf();
                        }
                        rc.bindEleBuf(this.m_ivsBuf);
                        if(this.bufData == null)
                        {
                            rc.eleBufData(this.m_ivs, this.m_bufDataUsage);
                            this.m_ivsPreSize = this.m_ivs.length;
                        }
                        else
                        {
                            //console.log(">>>>>>>>ibuf use (this.bufData == null) : "+(this.bufData == null)+", this.bufData.getIndexDataTotal(): "+this.bufData.getIndexDataTotal());
                            rc.eleBufDataMem(this.bufData.getIndexDataTotalBytes(),this.m_bufDataUsage);
                            let uintArr:any = null;
                            let offset:number = 0;
                            let dataSize:number = 0;
                            for(let i:number = 0, len:number = this.bufData.getIndexDataTotal(); i < len; ++i)
                            {
                                uintArr = this.bufData.getIndexDataAt(i);
                                rc.eleBufSubData(uintArr, offset);
                                offset += uintArr.byteLength;
                                dataSize += uintArr.length;
                            }
                            this.m_ivsPreSize = dataSize;
                        }
                    }
                }
            }
            // 创建被 RPOUnit 使用的 vro 实例
            createVROBegin(rc:RenderProxy, shdp:IVtxShdCtr, vaoEnabled:boolean):VertexRenderObj
            {
                let vro:VertexRenderObj = this.m_vtxBuf.createVROBegin(rc, shdp,vaoEnabled);
                vro.ibuf = this.m_ivsBuf;
                vro.ibufType = this.m_ibufStep != 4?rc.UNSIGNED_SHORT:rc.UNSIGNED_INT;
                vro.ibufStep = this.m_ibufStep;
                return vro;
            }
            createVROEnd():void
            {
                this.m_rc.bindVertexArray(null);
            }
            private __$disposeGpu(rc:RenderProxy):void
            {
                if(this.isGpuEnabled())
                {
                    if(this.m_rc != null)
                    {
                        console.log("ROVertexBuffer::__$disposeGpu()... "+this);
                        this.m_vtxBuf.disposeGpu(rc);

                        if(this.m_ivsBuf != null)
                        {
                            this.m_rc.deleteBuf(this.m_ivsBuf);
                            this.m_ivsBuf = null;
                        }
                        this.m_rc = null;
                    }
                }
            }
            
            private static s_combinedBufs:IVtxBuf[] = [];
            private static s_separatedBufs:IVtxBuf[] = [];
            private __$destroy():void
            {
                if(!this.isGpuEnabled())
                {
                    console.log("ROVertexBuffer::__$destroy()... "+this);
                    this.m_vtxBuf.destroy();
                    if(this.m_vtxBuf.getType() < 1)
                    {
                        ROVertexBuffer.s_combinedBufs.push(this.m_vtxBuf);
                    }
                    else
                    {
                        ROVertexBuffer.s_separatedBufs.push(this.m_vtxBuf);
                    }
                    this.m_vtxBuf = null;
                    this.m_ivs = null;
                    this.m_f32Changed = false;
                    this.m_ivsChanged = false;
                }
            }
            toString():string
            {
                return "ROVertexBuffer(uid = "+this.m_uid+")";
            }
            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:ROVertexBuffer[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(ROVertexBuffer.m_freeIdList.length > 0)
                {
                    return ROVertexBuffer.m_freeIdList.pop();
                }
                return -1;
            }
            private static GetVtxByUid(uid:number):ROVertexBuffer
            {
                return ROVertexBuffer.m_unitList[uid];
            }
            private static Create(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW):ROVertexBuffer
            {
                let unit:ROVertexBuffer = null;
                let index:number = ROVertexBuffer.GetFreeId();
                if(index >= 0)
                {
                    unit = ROVertexBuffer.m_unitList[index];
                    unit.setBufDataUsage(bufDataUsage);
                    ROVertexBuffer.m_unitFlagList[index] = ROVertexBuffer.S_FLAG_BUSY;
                }
                else
                {
                    unit = new ROVertexBuffer(bufDataUsage);
                    ROVertexBuffer.m_unitList.push( unit );
                    ROVertexBuffer.m_unitFlagList.push(ROVertexBuffer.S_FLAG_BUSY);
                    ROVertexBuffer.m_unitListLen++;
                }
                //console.log("ROVertexBuffer::Create(), ROVertexBuffer.m_unitList.length: "+ROVertexBuffer.m_unitList.length+", new buf: "+unit);
                ROVtxBufUidStore.GetInstance().__$attachAt(unit.getUid());
                return unit;
            }
            private static __$Restore(pobj:ROVertexBuffer):void
            {
                if(pobj != null && ROVertexBuffer.m_unitFlagList[pobj.getUid()] == ROVertexBuffer.S_FLAG_BUSY)
                {
                    //console.log("ROVertexBuffer::__$Restore, pobj: "+pobj);
                    let uid:number = pobj.getUid();
                    ROVertexBuffer.m_freeIdList.push(uid);
                    ROVertexBuffer.m_unitFlagList[uid] = ROVertexBuffer.S_FLAG_FREE;
                    pobj.__$destroy();
                }
            }
            static Restore(pobj:ROVertexBuffer):void
            {
                //console.log("ROVertexBuffer::Restore, pobj: "+pobj);
                ROVtxBufUidStore.GetInstance().__$detachAt(pobj.getUid());
            }
    
            private static s_stride:number = 0;
            static BufDataList:Float32Array[] = null;
            static BufDataStepList:number[] = null;
            static BufStatusList:number[] = null;
            static vtxDataFS32:number[] = null;
            static vbWholeDataEnabled:boolean = false;
            static dynBufSegEnabled:boolean = false;
            static useBufByIndexEnabled:boolean = false;
            static vtxFS32:Float32Array = null;

            static Reset():void
            {
                ROVertexBuffer.BufDataList = [];
                ROVertexBuffer.s_stride = 0;
                ROVertexBuffer.BufStatusList = [];
                ROVertexBuffer.BufDataStepList = [];
                ROVertexBuffer.vtxFS32 = null;
                ROVertexBuffer.vbWholeDataEnabled = false;
                ROVertexBuffer.dynBufSegEnabled = false;
                ROVertexBuffer.useBufByIndexEnabled = false;
            }
            static AddFloat32Data(float32Arr:Float32Array,step:number,status:number = VtxBufConst.VTX_STATIC_DRAW):void
            {
                ROVertexBuffer.BufDataList.push(float32Arr);
                ROVertexBuffer.BufDataStepList.push(step);
                ROVertexBuffer.BufStatusList.push(status);
                ROVertexBuffer.s_stride += step;
            }
            static CreateBySaveData(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW):ROVertexBuffer
            {
                let i:number = 0;
                let k:number = 0;
                let stride:number = 0;
                let bufTot:number = ROVertexBuffer.BufDataStepList.length;
                let offsetList:number[] = [];

                for(; i < bufTot; i++)
                {
                    offsetList.push(stride);
                    stride += ROVertexBuffer.BufDataStepList[i];
                }
                let tot:number = ROVertexBuffer.BufDataList[0].length / ROVertexBuffer.BufDataStepList[0];
                let vtxfs32:Float32Array = new Float32Array(stride * tot);
                let j:number = 0;
                let segLen:number = 0;
                let parrf32:Float32Array = null;
                let subArr:Float32Array = null;
                
                for(i = 0; i < tot; ++i)
                {
                    k = i * stride;
                    for(j = 0; j < bufTot; ++j)
                    {
                        segLen = ROVertexBuffer.BufDataStepList[j];
                        parrf32 = ROVertexBuffer.BufDataList[j];
                        subArr = parrf32.subarray(i * segLen, i * segLen + segLen);
                        vtxfs32.set(subArr, k);
                        k += segLen;
                    }
                }
                let vb:ROVertexBuffer = ROVertexBuffer.Create(bufDataUsage);
                if(ROVertexBuffer.s_combinedBufs.length > 0)
                {
                    let vtx:IVtxBuf = ROVertexBuffer.s_combinedBufs.pop();
                    vtx.setBufDataUsage(vb.getBufDataUsage());
                    vb.setVtxBuf( vtx );
                }
                else
                {
                    vb.setVtxBuf(new VtxCombinedBuf(vb.getBufDataUsage()));
                }
                vb.setF32DataAt(0, vtxfs32, stride, offsetList);
                return vb;
            }

            static UpdateBufData(vb:ROVertexBuffer):void
            {
                let i:number = 0;
                let k:number = 0;
                let stride:number = 0;
                let bufTot:number = ROVertexBuffer.BufDataStepList.length;
                let tot:number = ROVertexBuffer.BufDataList[0].length / ROVertexBuffer.BufDataStepList[0];
                let vtxfs32:Float32Array = vb.getF32DataAt(0);
                let newBoo:boolean = (ROVertexBuffer.s_stride * tot) != vtxfs32.length;
                let offsetList:number[] = null;
                if(newBoo)
                {
                    offsetList = [];
                    vtxfs32 = new Float32Array(ROVertexBuffer.s_stride * tot);
                    for(; i < bufTot; i++)
                    {
                        offsetList.push(stride);
                        stride += ROVertexBuffer.BufDataStepList[i];
                    }
                }
                else
                {
                    stride = ROVertexBuffer.s_stride;
                }
                let j:number = 0;
                let segLen:number = 0;
                let parrf32:Float32Array = null;
                let subArr:Float32Array = null;
                
                for(i = 0; i < tot; ++i)
                {
                    k = i * stride;
                    for(j = 0; j < bufTot; ++j)
                    {
                        segLen = ROVertexBuffer.BufDataStepList[j];
                        parrf32 = ROVertexBuffer.BufDataList[j];
                        subArr = parrf32.subarray(i * segLen, i * segLen + segLen);
                        vtxfs32.set(subArr, k);
                        k += segLen;
                    }
                }
                if(newBoo)
                {
                    vb.setF32DataAt(0,vtxfs32, stride,offsetList);
                }
                else
                {
                    vb.setF32DataAt(0,vtxfs32, stride, null);
                }
            }
            
            static CreateByBufDataSeparate(bufData:VtxBufData,bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW):ROVertexBuffer
            {
                let i:number = 0;
                let stride:number = 0;
                let bufTot:number = bufData.getAttributesTotal();
                let offsetList:number[] = new Array(bufTot);
                offsetList.fill(0);
                let vb:ROVertexBuffer = ROVertexBuffer.Create(bufDataUsage);
                if(ROVertexBuffer.s_separatedBufs.length > 0)
                {
                    let vtx:IVtxBuf = ROVertexBuffer.s_separatedBufs.pop();
                    vtx.setBufDataUsage(vb.getBufDataUsage());
                    vb.setVtxBuf( vtx );
                }
                else
                {
                    vb.setVtxBuf(new VtxSeparatedBuf(vb.getBufDataUsage()));
                }
                for(i = 0; i < bufTot; i++)
                {
                    vb.setF32DataAt(i,bufData.getAttributeDataAt(i,0), stride,offsetList);
                }
                vb.setUintIVSData(bufData.getIndexDataAt(0));
                vb.bufData = bufData;
                return vb;
            }
            
            static CreateBySaveDataSeparate(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW):ROVertexBuffer
            {
                let i:number = 0;
                let stride:number = 0;
                let bufTot:number = ROVertexBuffer.BufDataStepList.length;
                let offsetList:number[] = new Array(bufTot);
                offsetList.fill(0);
                let vb:ROVertexBuffer = ROVertexBuffer.Create(bufDataUsage);
                if(ROVertexBuffer.s_separatedBufs.length > 0)
                {
                    let vtx:IVtxBuf = ROVertexBuffer.s_separatedBufs.pop();
                    vtx.setBufDataUsage(vb.getBufDataUsage());
                    vb.setVtxBuf( vtx );
                }
                else
                {
                    vb.setVtxBuf(new VtxSeparatedBuf(vb.getBufDataUsage()));
                }
                for(i= 0; i < bufTot; i++)
                {
                    vb.setF32DataAt(i,ROVertexBuffer.BufDataList[i], stride,offsetList);
                }
                return vb;
            }
            static __$GetVtxAttachCountAt(vtxUid:number):number
            {
                return ROVtxBufUidStore.GetInstance().getAttachCountAt(vtxUid);
            }
            static GetVtxAttachAllCount():number
            {
                return ROVtxBufUidStore.GetInstance().getAttachAllCount();
            }
            private static s_timeDelay:number = 128;
            static RenderBegin(rc:RenderProxy):void
            {
                --ROVertexBuffer.s_timeDelay;
                if(ROVertexBuffer.s_timeDelay < 1)
                {
                    ROVertexBuffer.s_timeDelay = 128;
                    let store:ROVtxBufUidStore = ROVtxBufUidStore.GetInstance();
                    if(store.__$getRemovedListLen() > 0)
                    {
                        let list:number[] = store.__$getRemovedList();
                        let len:number = list.length;
                        let i:number = 0;
                        let vtxUid:number = 0;
                        let vb:ROVertexBuffer = null;
                        for(; i < 16; ++i)
                        {
                            if(len > 0)
                            {
                                vtxUid = list.pop();
                                --len;
                                if(store.getAttachCountAt(vtxUid) < 1)
                                {
                                    vb = ROVertexBuffer.GetVtxByUid(vtxUid);
                                    vb.__$disposeGpu(rc);
                                    ROVertexBuffer.__$Restore(vb);
                                }
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}