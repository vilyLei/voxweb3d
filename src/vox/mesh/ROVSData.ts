/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import IROIvsData from "../../vox/render/vtx/IROIvsData";

export default class ROVSData {

    type: number;
    name = "";
    bufStep = 4;
    status = VtxBufConst.VTX_STATIC_DRAW;
    vs: Float32Array = null;
    version = -2;
    setData(vs: Float32Array, status: number = VtxBufConst.VTX_STATIC_DRAW): ROVSData {
        
        this.vs = vs;
        this.version++;
        return this;
    }
    destroy(): void {
        this.version = -1;
        this.vs = null;
    }
}