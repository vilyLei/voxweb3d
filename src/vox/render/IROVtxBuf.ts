/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROIVtxBuf from "./IROIVtxBuf";

interface IROVtxBuf extends IROIVtxBuf {
    layoutBit: number;
    vertexVer: number;

    getBuffersTotal(): number;
    getAttribsTotal(): number;
    getF32DataAt(index: number): Float32Array;

    getBufTypeList(): number[];
    getBufSizeList(): number[];
    getBufSortFormat(): number;
}
export default IROVtxBuf;
