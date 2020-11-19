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
import * as ShaderProgramT from "../../vox/material/ShaderProgram";

import VtxBufID = VtxBufIDT.vox.mesh.VtxBufID;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import IVtxBuf = IVtxBufT.vox.mesh.IVtxBuf;
import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;
import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;

export namespace vox
{
    export namespace mesh
    {
        export class VtxSeparatedBuf implements IVtxBuf
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
                return 1;
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
            private m_f32List:Float32Array[] = null;
            private m_f32SizeList:number[] = null;
            private m_f32PreSizeList:number[] = null;
            private m_f32ChangedList:boolean[] = null;
            private m_f32Bufs:any[] = null;
            private m_f32StrideList:number[] = null;
            private m_wholeStride:number = 0;
            private m_stepFloatsTotal:number = 0;
            private m_f32Changed:boolean = false;
            getF32DataAt(index:number):Float32Array
            {
                return this.m_f32List[index];
            }
            isGpuEnabled():boolean
            {
                return this.m_f32Bufs != null;
            }
            isChanged():boolean
            {
                return this.m_f32Changed;
            }
            setF32DataAt(index:number,float32Arr:Float32Array,stepFloatsTotal:number,setpOffsets:number[]):void
            {
                if(this.m_f32List == null)
                {
                    this.m_f32List = [null,null,null,null, null,null,null,null];
                    this.m_f32ChangedList = [false,false,false,false, false,false,false,false];
                    this.m_f32SizeList = [0,0,0,0, 0,0,0,0];
                    this.m_f32PreSizeList = [0,0,0,0, 0,0,0,0];
                }
                this.m_f32List[index] = float32Arr;
                if(this.m_f32Bufs != null && float32Arr != null)
                {
                    this.m_f32ChangedList[index] = true;
                    this.m_f32Changed = true;
                }
                if(setpOffsets != null)this.m_fOffsetList = setpOffsets;
                this.m_stepFloatsTotal = stepFloatsTotal;
                //console.log("VtxSeparatedBuf::setF32DataAt(),"+this+" m_f32List.length: "+float32Arr.length+", this.m_f32PreSizeList: "+this.m_f32PreSizeList);
                if(float32Arr != null)
                {
                    this.m_f32SizeList[index] = float32Arr.length;
                }
                console.log("this.m_f32Changed: "+this.m_f32Changed);
            }
            setData4fAt(vertexI:number,attribI:number,px:number,py:number,pz:number,pw:number):void
            {
                vertexI *= this.m_fOffsetList[attribI];
                //console.log("VtxSeparatedBuf::setData4fAt(), vertexI: "+vertexI+",this.m_f32StrideList: "+this.m_f32StrideList);
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
                this.m_f32List[attribI][vertexI++] = pz;
                this.m_f32List[attribI][vertexI++] = pw;
                this.m_f32Changed = true;
            }
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void
            {
                vertexI *= this.m_fOffsetList[attribI];
                //console.log("VtxSeparatedBuf::setData3fAt(), vertexI: "+vertexI+",this.m_f32StrideList: "+this.m_f32StrideList);
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
                this.m_f32List[attribI][vertexI++] = pz;
                this.m_f32Changed = true;
            }
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void
            {
                vertexI *= this.m_fOffsetList[attribI];
                //console.log("VtxSeparatedBuf::setData2fAt(), vertexI: "+vertexI+",this.m_f32StrideList: "+this.m_f32StrideList);
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
                this.m_f32Changed = true;
            }
            updateToGpu(rc:RenderProxy):void
            {
                if(this.m_f32Changed)
                {
                    if(this.m_f32List != null && this.m_f32Bufs != null)
                    {
                        //console.log("VtxSeparatedBuf::updateToGpu(), this.m_f32PreSizeList >= this.m_f32SizeList: "+(this.m_f32PreSizeList >= this.m_f32SizeList));
                        let i:number = 0;
                        for(; i < this.m_total; ++i)
                        {
                            if(this.m_f32PreSizeList[i] >= this.m_f32SizeList[i])
                            {
                                rc.bindArrBuf(this.m_f32Bufs[i]);
                                rc.arrBufSubData(this.m_f32List[i], 0);
                            }
                            else
                            {
                                if(this.m_f32SizeList[i] > this.m_f32PreSizeList[i])
                                {
                                    rc.bindArrBuf(this.m_f32Bufs[i]);
                                    rc.arrBufData(this.m_f32List[i], this.m_bufDataUsage);
                                }
                                this.m_f32PreSizeList = this.m_f32SizeList;
                            }
                        }
                    }
                    this.m_f32Changed = false;
                }
            }
            upload(rc:RenderProxy,shdp:ShaderProgram):void
            {
                //console.log("VtxSeparatedBuf::upload()... ");
                if(this.m_f32List != null)
                {
                    if(this.m_f32Bufs == null)
                    {
                        this.m_total = shdp.getLocationsTotal();
                        this.m_f32Bufs = [];
                        let i:number = 0;
                        let buf:any = null;
                        
                        if(this.bufData == null)
                        {
                            for(; i < this.m_total; ++i)
                            {
                                buf = rc.createBuf();
                                this.m_f32Bufs.push(buf);
                                rc.bindArrBuf(buf);
                                rc.arrBufData(this.m_f32List[i], this.m_bufDataUsage);
                                this.m_f32PreSizeList[i] = this.m_f32SizeList[i];
                            }
                        }
                        else
                        {
                            //console.log(">>>>>>>>vtxSepbuf use (this.bufData == null) : "+(this.bufData == null));
                            let j:number = 0;
                            let tot:number = 0;
                            let fs32:any = null;
                            let offset:number = 0;
                            let dataSize:number = 0;
                            for(; i < this.m_total; ++i)
                            {
                                buf = rc.createBuf();
                                //console.log("this.bufData.getAttributeDataTotalBytesAt("+i+"): "+this.bufData.getAttributeDataTotalBytesAt(i));
                                this.m_f32Bufs.push(buf);
                                rc.bindArrBuf(buf);
                                rc.arrBufDataMem(this.bufData.getAttributeDataTotalBytesAt(i),this.m_bufDataUsage);
                                //rc.arrBufData(this.m_f32List[i], this.m_bufDataUsage);
                                offset = 0;
                                dataSize = 0;
                                tot = this.bufData.getAttributeDataTotalAt(i);
                                //console.log("#### tot: "+tot);
                                for(j = 0; j < tot; ++j)
                                {
                                    
                                    //console.log("#### i j: ",i,j);
                                    fs32 = this.bufData.getAttributeDataAt(i,j);
                                    dataSize += fs32.length;
                                    //console.log("fs32.length: "+fs32.length);
                                    rc.arrBufSubData(fs32,offset);
                                    offset += fs32.byteLength;
                                }
                                this.m_f32PreSizeList[i] = dataSize;//this.m_f32SizeList[i];
                            }
                        }
                    }
                }
                if(this.m_aTypeList == null)
                {
                    this.m_wholeStride = 0;
                    this.m_aTypeList = [];
                    this.m_pOffsetList = [];

                    for(let i:number = 0; i < this.m_total; ++i)
                    {
                        this.m_pOffsetList[i] = 0;//this.m_wholeStride;
                        this.m_aTypeList.push( shdp.getLocationTypeByIndex(i) );
                    }
                }
            }
            private m_vroList:VertexRenderObj[] = [];
            private m_vroListLen:number = 0;
        
            // 创建被 RPOUnit 使用的 vro 实例
            createVROBegin(rc:RenderProxy, shdp:ShaderProgram, vaoEnabled:boolean = true):VertexRenderObj
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
                //console.log("### Separated mid: "+mid+", uid: "+this.m_uid);
                let vro:VertexRenderObj = VertexRenderObj.Create(mid,this.m_uid);
                vro.vbuf = this.m_f32Bufs;
                if(vaoEnabled)
                {
                    // vao 的生成要记录标记,防止重复生成, 因为同一组数据在不同的shader使用中可能组合方式不同，导致了vao可能是多样的
                    //console.log("VtxSeparatedBuf::createVROBegin(), "+this.m_aTypeList+" /// "+this.m_wholeStride+" /// "+this.m_pOffsetList);
                    vro.vao = rc.createVertexArray();
                    rc.bindVertexArray(vro.vao);
                    rc.bindArrBuf(this.m_f32Bufs[0]);
                    //shdp.vertexAttribPointerTypeFloat(this.m_aTypeList[0], 0,this.m_pOffsetList[0]);
                    shdp.vertexAttribPointerTypeFloat(this.m_aTypeList[0], 0,0);
                    for(i = 1; i < this.m_total; ++i)
                    {
                        rc.bindArrBuf(this.m_f32Bufs[i]);
                        shdp.vertexAttribPointerTypeFloat(this.m_aTypeList[i], 0, 0);
                        //shdp.vertexAttribPointerTypeFloat(this.m_aTypeList[i], 0, this.m_pOffsetList[i]);
                    }
                    vro.registers = null;
                }
                else
                {
                    vro.registers = [];
                    vro.wholeOffsetList = [];
                    //vro.wholeStride = this.m_wholeStride;
                    vro.wholeStride = 0;
                    let reg:number = -1;
                    for(i = 0; i < this.m_total; ++i)
                    {
                        reg = shdp.getVertexAttribByTpye(this.m_aTypeList[i]);
                        if(reg > -1)
                        {
                            vro.registers.push(reg);
                            vro.wholeOffsetList.push( 0 );
                        }
                    }
                    vro.registersLen = vro.registers.length;
                }
                this.m_vroList.push(vro);
                ++this.m_vroListLen;
                return vro;
            }
            public disposeGpu(rc:RenderProxy):void
            {
                if(this.isGpuEnabled())
                {
                    console.log("VtxSeparatedBuf::__$disposeGpu()... "+this);
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
                    for(i = 0; i < this.m_total; ++i)
                    {
                        rc.deleteBuf(this.m_f32Bufs[i]);
                        this.m_f32Bufs[i] = null;
                    }
                    this.m_f32Bufs = null;
                }
            }
            public destroy():void
            {
                if(!this.isGpuEnabled())
                {
                    this.m_f32List = null;
                    this.m_f32ChangedList = null;
                    this.m_f32SizeList = null;
                    this.m_f32PreSizeList = null;

                    console.log("VtxSeparatedBuf::__$destroy()... "+this);
                    this.m_aTypeList = null;
                    this.m_f32Changed = false;
                    this.m_f32List = null;
                    this.m_pOffsetList = null;
                }
            }
            toString():string
            {
                return "VtxSeparatedBuf(uid = "+this.m_uid+")";
            }
        }
    }
}