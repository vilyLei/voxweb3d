/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as VtxBufIDT from "../../vox/mesh/VtxBufID";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as IVtxBufT from "../../vox/mesh/IVtxBuf";
import * as VtxBufDataT from "../../vox/mesh/VtxBufData";
import * as VertexRenderObjT from "../../vox/mesh/VertexRenderObj";
import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";

import VtxBufID = VtxBufIDT.vox.mesh.VtxBufID;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import IVtxBuf = IVtxBufT.vox.mesh.IVtxBuf;
import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;
import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;

export namespace vox
{
    export namespace mesh
    {
        export class VtxCombinedBuf implements IVtxBuf
        {
            private m_uid:number = -1;
            private m_bufDataUsage:number = 0;
            private m_aTypeList:number[] = null;
            private m_total:number = 0;
            bufData:VtxBufData = null;
            constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
            {
                this.m_uid = VtxBufID.CreateNewID();
                this.m_bufDataUsage = bufDataUsage;
            }
            
            public getType():number
            {
                return 0;
            }
            getBufDataUsage():number
            {
                return this.m_bufDataUsage;
            }
            public setBufDataUsage(bufDataUsage:number):void
            {
                this.m_bufDataUsage = bufDataUsage;
            }
            getUid():number
            {
                return this.m_uid;
            }
            private m_fOffsetList:number[] = null;
            private m_pOffsetList:number[] = null;
            private m_f32:Float32Array = null;
            private m_f32Size:number = 0;
            private m_f32PreSize:number = 0;
            private m_f32Changed:boolean = false;
            private m_f32Buf:any = null;
            private m_f32Stride:number = 0;
            private m_wholeStride:number = 0;
            
            getF32DataAt(index:number):Float32Array
            {
                return this.m_f32;
            }
            isGpuEnabled():boolean
            {
                return this.m_f32Buf != null;
            }
            isChanged():boolean
            {
                return this.m_f32Changed;
            }
            setF32DataAt(index:number,float32Arr:Float32Array,stepFloatsTotal:number,setpOffsets:number[]):void
            {
                if(setpOffsets != null)this.m_fOffsetList = setpOffsets;
                this.m_f32Stride = stepFloatsTotal;
                //console.log("VtxCombinedBuf::setF32DataAt(),"+this+" m_f32.length: "+float32Arr.length+", this.m_f32PreSize: "+this.m_f32PreSize);
                this.m_f32 = float32Arr;
                if(this.m_f32Buf != null && float32Arr != null)
                {
                    this.m_f32Changed = true;
                }
                if(float32Arr != null)
                {
                    this.m_f32Size = float32Arr.length;
                }
            }
            setData4fAt(vertexI:number,attribI:number,px:number,py:number,pz:number,pw:number):void
            {
                vertexI = (this.m_f32Stride * vertexI) + this.m_fOffsetList[attribI];
                //console.log("VtxCombinedBuf::setData4fAt(), vertexI: "+vertexI+",this.m_f32Stride: "+this.m_f32Stride);
                this.m_f32[vertexI++] = px;
                this.m_f32[vertexI++] = py;
                this.m_f32[vertexI++] = pz;
                this.m_f32[vertexI++] = pw;
                this.m_f32Changed = true;
            }
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void
            {
                vertexI = (this.m_f32Stride * vertexI) + this.m_fOffsetList[attribI];
                //console.log("VtxCombinedBuf::setData3fAt(), vertexI: "+vertexI+",this.m_f32Stride: "+this.m_f32Stride);
                this.m_f32[vertexI++] = px;
                this.m_f32[vertexI++] = py;
                this.m_f32[vertexI++] = pz;
                this.m_f32Changed = true;
            }
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void
            {
                vertexI = (this.m_f32Stride * vertexI) + this.m_fOffsetList[attribI];
                //console.log("VtxCombinedBuf::setData2fAt(), vertexI: "+vertexI+",this.m_f32Stride: "+this.m_f32Stride);
                this.m_f32[vertexI++] = px;
                this.m_f32[vertexI++] = py;
                this.m_f32Changed = true;
            }
            updateToGpu(rc:RenderProxy):void
            {
                if(this.m_f32Changed)
                {
                    if(this.m_f32 != null && this.m_f32Buf != null)
                    {
                        //console.log("VtxCombinedBuf::updateToGpu(), this.m_f32PreSize >= this.m_f32Size: "+(this.m_f32PreSize >= this.m_f32Size));
                        if(this.m_f32PreSize >= this.m_f32Size)
                        {
                            rc.bindArrBuf(this.m_f32Buf);
                            rc.arrBufSubData(this.m_f32, 0);
                        }
                        else
                        {
                            if(this.m_f32Size > this.m_f32PreSize)
                            {
                                rc.bindArrBuf(this.m_f32Buf);
                                rc.arrBufData(this.m_f32, this.m_bufDataUsage);
                            }
                            this.m_f32PreSize = this.m_f32Size;
                        }
                    }
                    this.m_f32Changed = false;
                }
            }
            upload(rc:RenderProxy,shdp:IVtxShdCtr):void
            {
                //console.log("VtxCombinedBuf::upload()... ");
                if(this.m_f32 != null)
                {
                    this.m_f32PreSize = this.m_f32Size;
                    if(this.m_f32Buf == null)
                    {
                        this.m_f32Buf = rc.createBuf();
                        rc.bindArrBuf(this.m_f32Buf);
                        //  console.log("this.m_f32: "+this.m_f32);
                        rc.arrBufData(this.m_f32, this.m_bufDataUsage);
                    }
                }
                if(this.m_aTypeList == null)
                {
                    this.m_wholeStride = 0;
                    this.m_aTypeList = [];
                    this.m_pOffsetList = [];
                    this.m_total = shdp.getLocationsTotal();

                    for(let i:number = 0; i < this.m_total; ++i)
                    {
                        this.m_pOffsetList[i] = this.m_wholeStride;
                        this.m_wholeStride += shdp.getLocationSizeByIndex(i) * 4;
                        this.m_aTypeList.push( shdp.getLocationTypeByIndex(i) );
                    }
                }
            }
            private m_vroList:VertexRenderObj[] = [];
            private m_vroListLen:number = 0;
            // 创建被 RPOUnit 使用的 vro 实例
            createVROBegin(rc:RenderProxy, shdp:IVtxShdCtr, vaoEnabled:boolean = true):VertexRenderObj
            {
                let mid:number = shdp.getLayoutBit();
                if(vaoEnabled)
                {
                    // 之所以这样区分，是因为 shdp.getLayoutBit() 的取值范围不会超过short(double bytes)取值范围
                    mid += 0xf0000;
                }
                let i:number = 0;
                for(; i < this.m_vroListLen; ++i)
                {
                    if(this.m_vroList[i].getMid() == mid)
                    {
                        return this.m_vroList[i];
                    }
                }
                //console.log("### Combined mid: "+mid+", uid: "+this.m_uid);
                let vro:VertexRenderObj = VertexRenderObj.Create(mid,this.m_uid);
                vro.shdp = shdp;
                vro.vbuf = this.m_f32Buf;
                if(vaoEnabled)
                {
                    // vao 的生成要记录标记,防止重复生成, 因为同一组数据在不同的shader使用中可能组合方式不同，导致了vao可能是多样的
                    //console.log("VtxCombinedBuf::createVROBegin(), "+this.m_aTypeList+" /// "+this.m_wholeStride+" /// "+this.m_pOffsetList);
                    vro.vao = rc.createVertexArray();
                    rc.bindVertexArray(vro.vao);

                    rc.bindArrBuf(this.m_f32Buf);
                    
                    for(i = 0; i < this.m_total; ++i)
                    {
                        shdp.vertexAttribPointerTypeFloat(this.m_aTypeList[i], this.m_wholeStride, this.m_pOffsetList[i]);
                    }
                    vro.attribTypes = null;
                }
                else
                {
                    vro.attribTypes = [];
                    vro.wholeOffsetList = [];
                    vro.wholeStride = this.m_wholeStride;
                    
                    for(i = 0; i < this.m_total; ++i)
                    {
                        if(shdp.testVertexAttribPointerType(this.m_aTypeList[i]))
                        {
                            vro.attribTypes.push(this.m_aTypeList[i]);
                            vro.wholeOffsetList.push( this.m_pOffsetList[i] );
                        }
                    }
                    vro.attribTypesLen = vro.attribTypes.length;
                }
                this.m_vroList.push(vro);
                ++this.m_vroListLen;
                return vro;
            }
            public disposeGpu(rc:RenderProxy):void
            {
                if(this.isGpuEnabled())
                {
                    console.log("VtxCombinedBuf::__$disposeGpu()... "+this);
                    let i:number = 0;
                    let vro:VertexRenderObj = null;
                    for(; i < this.m_vroListLen; ++i)
                    {
                        vro = this.m_vroList.pop();
                        if(vro.vao != null)
                        {
                            rc.deleteVertexArray(vro.vao);
                        }
                        VertexRenderObj.Restore(vro);
                        this.m_vroList[i] = null;
                    }
                    this.m_vroListLen = 0;
                    if(this.m_f32Buf != null)
                    {
                        rc.deleteBuf(this.m_f32Buf);
                        this.m_f32Buf = null;
                    }
                }
            }
            public destroy():void
            {
                if(!this.isGpuEnabled())
                {
                    console.log("VtxCombinedBuf::__$destroy()... "+this);
                    this.m_aTypeList = null;
                    this.m_f32Changed = false;
                    this.m_f32 = null;
                    this.m_pOffsetList = null;
                }
            }
            toString():string
            {
                return "VtxCombinedBuf(uid = "+this.m_uid+")";
            }
        }
    }
}