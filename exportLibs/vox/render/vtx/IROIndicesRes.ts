/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
import IROVtxBuf from "../../../vox/render/IROVtxBuf";
import IRODisplay from "../../display/IRODisplay";
import IRenderProxy from "../IRenderProxy";

interface IROIndicesRes {
    version: number;
    getUid(): number;
    getVtxUid(): number;
    updateToGpu(vrc: IROVtxBuilder): void;
    initialize(rc: IRenderProxy, vrc: IROVtxBuilder, vtx: IROVtxBuf, disp: IRODisplay): void;

    destroy(vrc: IROVtxBuilder): void;
}
export { IROIndicesRes };
