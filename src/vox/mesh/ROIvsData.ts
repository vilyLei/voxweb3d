/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import IROIvsData from "../../vox/render/vtx/IROIvsData";

export default class ROIvsData implements IROIvsData {

    unitBytes = 2;
    status = VtxBufConst.VTX_STATIC_DRAW;
    wireframe = false;
    shape = false;
    ivs: Uint16Array | Uint32Array = null;
    version = -2;
    setData(ivs: Uint16Array | Uint32Array, status: number = VtxBufConst.VTX_STATIC_DRAW): ROIvsData {
        if ((ivs instanceof Uint16Array)) {
            if(ivs.length > 65536) {
                throw Error("ivs.length > 65536, but its type is not Uint32Array.");
            }
        }
        else if (!(ivs instanceof Uint32Array)) {
            throw Error("Error: ivs is not an Uint32Array or an Uint16Array bufferArray instance !!!!");
        }
        this.unitBytes = ivs.BYTES_PER_ELEMENT;

        this.ivs = ivs;
        if (ivs != null) {
            this.version++;
        }
        return this;
    }
    destroy(): void {
        this.wireframe = false;
        this.version = -1;
        this.ivs = null;
    }
}
