/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as VtxBufDataT from "../../vox/mesh/VtxBufData";
import * as VertexRenderObjT from "../../vox/mesh/VertexRenderObj";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";

import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;
import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;

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
            getF32DataAt(index:number):Float32Array;
            isGpuEnabled():boolean;
            isChanged():boolean;
            setF32DataAt(index:number,float32Arr:Float32Array,stepFloatsTotal:number,setpOffsets:number[]):void;
            setData4fAt(vertexI:number,attribI:number,px:number,py:number,pz:number,pw:number):void;
            setData3fAt(vertexI:number,attribI:number,px:number,py:number,pz:number):void;
            setData2fAt(vertexI:number,attribI:number,px:number,py:number):void;
            updateToGpu(rc:RenderProxy):void;
            upload(rc:RenderProxy,shdp:ShaderProgram):void;
            createVROBegin(rc:RenderProxy, shdp:ShaderProgram, vaoEnabled:boolean):VertexRenderObj;
            disposeGpu(rc:RenderProxy):void;
            destroy():void;
            toString():string;
        }
    }
}