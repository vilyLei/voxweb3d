/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
import IROVtxBuf from "../../../vox/render/IROVtxBuf";
import IRODisplay from "../../display/IRODisplay";
import IRenderProxy from "../IRenderProxy";

interface IROIndicesRes {
    version: number;
    ibufStep: number;

    getUid(): number;
    getVtxUid(): number;
    // getGpuBuf(): any;
    getVTCount(): number;
    updateToGpu(vrc: IROVtxBuilder): void;
    initialize(rc: IRenderProxy, vrc: IROVtxBuilder, vtx: IROVtxBuf, disp: IRODisplay): void;

    destroy(vrc: IROVtxBuilder): void;
}
export { IROIndicesRes };
