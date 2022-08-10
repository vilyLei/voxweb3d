/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxBufData from "../../vox/mesh/IVtxBufData";


// getUid(): number;
// getType(): number;

interface IROVtxBuf {
    layoutBit: number;
    vertexVer: number;
    indicesVer: number;
    version: number;
    bufData: IVtxBufData;

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
