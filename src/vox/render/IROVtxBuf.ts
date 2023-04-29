/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROIVtxBuf from "./IROIVtxBuf";

interface IROVtxBuf extends IROIVtxBuf {
    layoutBit: number;
    vertexVer: number;

    getBuffersTotal(): number;
    getAttribsTotal(): number;

    setF32DataAt(index: number, data: Float32Array, stepFloatsTotal?: number, setpOffsets?: number[]): void;
    setF32DataVerAt(index: number, ver: number): void;

    getF32DataAt(index: number): Float32Array;
    getF32DataVerAt(index: number): number;

    getBufTypeList(): number[];
    getBufSizeList(): number[];
    getBufSortFormat(): number;
}
export default IROVtxBuf;
