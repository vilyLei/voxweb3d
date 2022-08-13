/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { BillboardGroupDcrBase } from "./BillboardGroupDcrBase";

class BillboardFlowDcr extends BillboardGroupDcrBase {
	

    playOnce: boolean = false;
    direcEnabled: boolean = false;
    // 因为速度增加，在x轴方向缩放(拉长或者缩短)
    spdScaleEnabled: boolean = false;

    constructor() {
        super();
    }
	initialize(texEnabled: boolean): void {

        super.initialize(texEnabled);
        this.m_uniqueName = "flow_" + this.m_uniqueName;
        if (this.playOnce && this.direcEnabled) {
            this.m_uniqueName += "_OD";
        } else if (this.playOnce) {
            this.m_uniqueName += "_O";
        } else if (this.direcEnabled) {
            this.m_uniqueName += "_D";
            if (this.spdScaleEnabled) this.m_uniqueName += "SpdScale";
        }
        if (this.premultiplyAlpha) this.m_uniqueName += "PreMAlpha";
    }

    buildVertShd(coder: IShaderCodeBuilder): void {

        coder.addVertLayout("vec4", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec4", "a_nvs");
        coder.addVertLayout("vec4", "a_vs2");
        coder.addVertLayout("vec4", "a_uvs2");
        coder.addVertLayout("vec4", "a_nvs2");

        let paramTotal: number = this.m_clipEnabled ? 5 : 4;
        coder.addVertUniform("vec4", "u_billParam", paramTotal);

        if (this.direcEnabled) coder.addDefine("ROTATION_DIRECT");
        if (this.playOnce) coder.addDefine("PLAY_ONCE");
        if (this.spdScaleEnabled) coder.addDefine("SPEED_SCALE");
        if (this.m_clipEnabled) coder.addDefine("BILL_PARAM_INDEX", "4");

    }

}
export { BillboardFlowDcr };
