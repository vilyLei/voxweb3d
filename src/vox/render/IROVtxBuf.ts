/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufData from "../../vox/mesh/VtxBufData";

interface IROVtxBuf {
    layoutBit: number;
    vertexVer: number;
    indicesVer: number;
    version: number;
    bufData: VtxBufData;

    getIvsData(): Uint16Array | Uint32Array;
    getUid(): number;
    getType(): number;
    getBufDataUsage(): number;
    getBuffersTotal(): number;
    getAttribsTotal(): number;
    getF32DataAt(index: number): Float32Array;
    getIBufStep(): number;
    
    getBufTypeList(): number[];
    getBufSizeList(): number[];
}
export default IROVtxBuf;