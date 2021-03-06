/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufData from "../../vox/mesh/VtxBufData";

//import VtxBufData = VtxBufDataT.vox.mesh.VtxBufData;
interface IROVtxBuf
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
    getIBufStep():number;
}
export default IROVtxBuf;