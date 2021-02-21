/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as VtxBufDataT from "../../vox/mesh/VtxBufData";
import * as IVertexRenderObjT from "../../vox/mesh/IVertexRenderObj";
import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";

import RenderProxy = RenderProxyT.vox.render.RenderProxy;
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
            getType():number;
            getBufDataUsage():number;
            setBufDataUsage(bufDataUsage:number):void;
            getUid():number;
            getVtxAttributesTotal():number
            getF32DataAt(index:number):Float32Array;
            isGpuEnabled():boolean;
            isChanged():boolean;
            setF32DataAt(index:number,float32Arr:Float32Array,stepFloatsTotal:number,setpOffsets:number[]):void;
            setData4fAt(vertexI:number,attribI:number,px:number,py:number,pz:number,pw:number):void;
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void;
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void;
            updateToGpu(rc:RenderProxy):void;
            upload(rc:RenderProxy,shdp:IVtxShdCtr):void;
            createVROBegin(rc:RenderProxy, shdp:IVtxShdCtr, vaoEnabled:boolean):IVertexRenderObj;
            disposeGpu(rc:RenderProxy):void;
            destroy():void;
            toString():string;
        }
    }
}