/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxBufData from "../../vox/mesh/IVtxBufData";
import IROIvsData from "../../vox/render/vtx/IROIvsData";
interface IROIVtxBuf {

    indicesVer: number;
    version: number;

    bufData: IVtxBufData;
    getIvsDataTotal(): number;
    /**
     * @param index the default value is 0
     */
    getIvsDataAt(index?: number): IROIvsData;
    getUid(): number;
    getType(): number;
    getBufDataUsage(): number;
}
export default IROIVtxBuf;
