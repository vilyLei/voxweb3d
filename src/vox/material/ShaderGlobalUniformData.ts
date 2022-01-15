/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
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
    copyDataFromProbe(probe: ShaderUniformProbe): void {
        this.types = probe.uniformTypes.slice(0);
        this.slotIndex = probe.getSlotBeginIndex();
        this.slotSize = probe.uniformsTotal;
        this.slotId = probe.getSlotUid();
    }
    copyDataFromProbeAt(i: number, probe: ShaderUniformProbe): void {
        if (this.types == null) {
            this.types = [];
        }
        this.slotIndex = probe.getSlotBeginIndex();
        this.slotSize = probe.uniformsTotal;
        this.slotId = probe.getSlotUid();
        this.types.push(probe.uniformTypes[i]);
    }
    destroy(): void {
        this.types = null;
        this.slotIndex = -1;
        this.slotSize = 0;
    }
}
export { ShaderGlobalUniformData }