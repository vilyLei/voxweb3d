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
        export class VtxSeparatedBuf implements IVtxBuf
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
            private m_fOffsetList:number[] = null;
            //private m_pOffsetList:number[] = null;
            private m_f32List:Float32Array[] = null;
            private m_f32SizeList:number[] = null;
            private m_f32PreSizeList:number[] = null;
            private m_f32ChangedList:boolean[] = null;
            private m_f32Bufs:any[] = null;
            private m_stepFloatsTotal:number = 0;
            private m_f32Changed:boolean = false;

            
            getBuffersTotal():number
            {
                return this.m_f32List.length;
            }
            getVtxAttributesTotal():number
            {
                return this.m_total;
            }
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
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
                this.m_f32List[attribI][vertexI++] = pz;
                this.m_f32List[attribI][vertexI++] = pw;
                this.m_f32Changed = true;
            }
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void
            {
                vertexI *= this.m_fOffsetList[attribI];
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
                this.m_f32List[attribI][vertexI++] = pz;
                this.m_f32Changed = true;
            }
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void
            {
                vertexI *= this.m_fOffsetList[attribI];
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
                this.m_f32Changed = true;
            }
            updateToGpu(rc:IBufferBuilder):void
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
            
            public destroy():void
            {
                if(this.m_f32Bufs == null)
                {
                    this.m_f32List = null;
                    this.m_f32ChangedList = null;
                    this.m_f32SizeList = null;
                    this.m_f32PreSizeList = null;

                    console.log("VtxSeparatedBuf::__$destroy()... ",this);
                    this.m_f32Changed = false;
                    this.m_f32List = null;
                }
            }
            toString():string
            {
                return "VtxSeparatedBuf(uid = "+this.m_uid+")";
            }
        }
    }
}