/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IBufferBuilderT from "../../vox/render/IBufferBuilder";
import * as VtxBufDataT from "../../vox/mesh/VtxBufData";
import * as IVertexRenderObjT from "../../vox/mesh/IVertexRenderObj";
import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";

import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;
import IVertexRenderObj = IVertexRenderObjT.vox.mesh.IVertexRenderObj;
import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;

export namespace vox
{
    export namespace mesh
    {
        export interface IVtxBuf
        {
            bufData:VtxBufData;
            getVtxBuf():IVtxBuf;
            getIvsData():Uint16Array | Uint32Array;
            getUid():number;
            getType():number;
            getBufDataUsage():number;
            getBuffersTotal():number;
            getVtxAttributesTotal():number
            getF32DataAt(index:number):Float32Array;
            isGpuEnabled():boolean;
            isChanged():boolean;
            setF32DataAt(index:number,float32Arr:Float32Array,stepFloatsTotal:number,setpOffsets:number[]):void;
            setData4fAt(vertexI:number,attribI:number,px:number,py:number,pz:number,pw:number):void;
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void;
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void;
            updateToGpu(rc:IBufferBuilder):void;
            destroy():void;
            toString():string;
        }
    }
}