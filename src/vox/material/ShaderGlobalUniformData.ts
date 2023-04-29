/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";
import ShaderUniformData from "../../vox/material/ShaderUniformData";

class ShaderGlobalUniformData extends ShaderUniformData {
    constructor() {
        super();
        this.always = false;
    }
    slotId: number = 0;
    slotIndex: number = 0;
    slotSize: number = 0;
    locationIndexList: number[] = null;
    locations: any[] = null;
    rst = 0;
    copyDataFromProbe(probe: IShaderUniformProbe): void {
        this.types = probe.uniformTypes.slice(0);
        this.slotIndex = probe.getSlotBeginIndex();
        this.slotSize = probe.uniformsTotal;
        this.slotId = probe.getRCUid();
    }
    copyDataFromProbeAt(i: number, probe: IShaderUniformProbe): void {
        if (this.types == null) {
            this.types = [];
        }
        this.slotIndex = probe.getSlotBeginIndex();
        this.slotSize = probe.uniformsTotal;
        this.slotId = probe.getRCUid();
        this.types.push(probe.uniformTypes[i]);
    }
    destroy(): void {
        this.types = null;
        this.slotIndex = -1;
        this.slotSize = 0;
    }
}
export { ShaderGlobalUniformData }