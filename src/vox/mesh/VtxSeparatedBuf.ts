/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as VtxBufIDT from "../../vox/mesh/VtxBufID";
import * as IVtxBufT from "../../vox/mesh/IVtxBuf";

import VtxBufID = VtxBufIDT.vox.mesh.VtxBufID;
import IVtxBuf = IVtxBufT.vox.mesh.IVtxBuf;

export namespace vox
{
    export namespace mesh
    {
        export class VtxSeparatedBuf implements IVtxBuf
        {
            private m_uid:number = -1;
            private m_total:number = 0;

            constructor()
            {
                this.m_uid = VtxBufID.CreateNewID();
            }
            
            getUid():number
            {
                return this.m_uid;
            }
            public getType():number
            {
                return 1;
            }
            private m_fOffsetList:number[] = null;
            //private m_pOffsetList:number[] = null;
            private m_f32List:Float32Array[] = null;
            private m_f32SizeList:number[] = null;
            private m_f32PreSizeList:number[] = null;
            private m_f32ChangedList:boolean[] = null;
            private m_f32Bufs:any[] = null;
            private m_stepFloatsTotal:number = 0;

            
            getBuffersTotal():number
            {
                return this.m_f32List.length;
            }
            getF32DataAt(index:number):Float32Array
            {
                return this.m_f32List[index];
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
                }
                if(setpOffsets != null)this.m_fOffsetList = setpOffsets;
                this.m_stepFloatsTotal = stepFloatsTotal;
                //console.log("VtxSeparatedBuf::setF32DataAt(),"+this+" m_f32List.length: "+float32Arr.length+", this.m_f32PreSizeList: "+this.m_f32PreSizeList);
                if(float32Arr != null)
                {
                    this.m_f32SizeList[index] = float32Arr.length;
                }
            }
            setData4fAt(vertexI:number,attribI:number,px:number,py:number,pz:number,pw:number):void
            {
                vertexI *= this.m_fOffsetList[attribI];
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
                this.m_f32List[attribI][vertexI++] = pz;
                this.m_f32List[attribI][vertexI++] = pw;
            }
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void
            {
                vertexI *= this.m_fOffsetList[attribI];
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
                this.m_f32List[attribI][vertexI++] = pz;
            }
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void
            {
                vertexI *= this.m_fOffsetList[attribI];
                this.m_f32List[attribI][vertexI++] = px;
                this.m_f32List[attribI][vertexI++] = py;
            }
            public destroy():void
            {
                this.m_f32List = null;
                this.m_f32ChangedList = null;
                this.m_f32SizeList = null;
                this.m_f32PreSizeList = null;

                console.log("VtxSeparatedBuf::__$destroy()... ",this);
                this.m_f32List = null;
            }
            toString():string
            {
                return "VtxSeparatedBuf(uid = "+this.m_uid+")";
            }
        }
    }
}