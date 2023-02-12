/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
import IROVtxBuf from "../../../vox/render/IROVtxBuf";

interface IROIndicesRes {
    version: number;
    ibufStep: number;

    getUid(): number;
    getVtxUid(): number;
    getGpuBuf(): any;
    getVTCount(): number;
    updateToGpu(rc: IROVtxBuilder): void;
    initialize(rc: IROVtxBuilder, vtx: IROVtxBuf): void;

    destroy(rc: IROVtxBuilder): void;
}
export { IROIndicesRes };
