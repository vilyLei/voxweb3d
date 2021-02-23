/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as VtxBufDataT from "../../vox/mesh/VtxBufData";

import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;

export namespace vox
{
    export namespace render
    {
        export interface IROVtxBuf
        {
            vertexVer:number;
            indicesVer:number;
            version:number;
            bufData:VtxBufData;
            getIvsData():Uint16Array | Uint32Array;
            getUid():number;
            getType():number;
            getBufDataUsage():number;
            getBuffersTotal():number;
            getF32DataAt(index:number):Float32Array;
        }
    }
}