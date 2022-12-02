/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxBufData from "../../vox/mesh/IVtxBufData";
interface IROIVtxBuf {
    indicesVer: number;
    version: number;

    bufData: IVtxBufData;
    
    getIvsData(): Uint16Array | Uint32Array;
    getUid(): number;
    getType(): number;
    getBufDataUsage(): number;
    getIBufStep(): number;
}
export default IROIVtxBuf;
