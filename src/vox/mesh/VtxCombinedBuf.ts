/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as VtxBufIDT from "../../vox/mesh/VtxBufID";
import * as IBufferBuilderT from "../../vox/render/IBufferBuilder";
import * as IVtxBufT from "../../vox/mesh/IVtxBuf";
import * as VtxBufDataT from "../../vox/mesh/VtxBufData";

import VtxBufID = VtxBufIDT.vox.mesh.VtxBufID;
import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import IVtxBuf = IVtxBufT.vox.mesh.IVtxBuf;
import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;

export namespace vox
{
    export namespace mesh
    {
        export class VtxCombinedBuf implements IVtxBuf
        {
            private m_uid:number = -1;
            private m_bufDataUsage:number = 0;
            private m_total:number = 0;
            bufData:VtxBufData = null;
            constructor(bufDataUsage:number)
            {
                this.m_uid = VtxBufID.CreateNewID();
                this.m_bufDataUsage = bufDataUsage;
            }
            
            getVtxBuf():IVtxBuf
            {
                return this;
            }
            getIvsData():Uint16Array | Uint32Array
            {
                return null;
            }
            getUid():number
            {
                return this.m_uid;
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
            
            private m_offsetList:number[] = null;
            private m_f32:Float32Array = null;
            private m_f32Size:number = 0;
            private m_f32PreSize:number = 0;
            private m_f32Changed:boolean = false;
            private m_f32Buf:any = null;
            private m_f32Stride:number = 0;
            
            getBuffersTotal():number
            {
                return 1;
            }
            getVtxAttributesTotal():number
            {
                return this.m_total;
            }
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
                if(setpOffsets != null)this.m_offsetList = setpOffsets;
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
                vertexI = (this.m_f32Stride * vertexI) + this.m_offsetList[attribI];
                this.m_f32[vertexI++] = px;
                this.m_f32[vertexI++] = py;
                this.m_f32[vertexI++] = pz;
                this.m_f32[vertexI++] = pw;
                this.m_f32Changed = true;
            }
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void
            {
                vertexI = (this.m_f32Stride * vertexI) + this.m_offsetList[attribI];
                //console.log("VtxCombinedBuf::setData3fAt(), vertexI: "+vertexI+",this.m_f32Stride: "+this.m_f32Stride);
                this.m_f32[vertexI++] = px;
                this.m_f32[vertexI++] = py;
                this.m_f32[vertexI++] = pz;
                this.m_f32Changed = true;
            }
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void
            {
                vertexI = (this.m_f32Stride * vertexI) + this.m_offsetList[attribI];
                //console.log("VtxCombinedBuf::setData2fAt(), vertexI: "+vertexI+",this.m_f32Stride: "+this.m_f32Stride);
                this.m_f32[vertexI++] = px;
                this.m_f32[vertexI++] = py;
                this.m_f32Changed = true;
            }
            updateToGpu(rc:IBufferBuilder):void
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
            public destroy():void
            {
                if(this.m_f32Buf == null)
                {
                    console.log("VtxCombinedBuf::__$destroy()... ",this);
                    this.m_f32Changed = false;
                    this.m_offsetList = null;
                    this.m_f32 = null;
                }
            }
            toString():string
            {
                return "VtxCombinedBuf(uid = "+this.m_uid+")";
            }
        }
    }
}