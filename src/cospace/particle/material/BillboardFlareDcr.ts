/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { BillboardGroupDcrBase } from "./BillboardGroupDcrBase";

class BillboardFlareDcr extends BillboardGroupDcrBase {

    constructor() {
        super();
    }
	initialize(texEnabled: boolean): void {

        super.initialize(texEnabled);
        this.m_uniqueName = "flare_" + this.m_uniqueName;
    }

    buildVertShd(coder: IShaderCodeBuilder): void {

        coder.addDefine("VOX_PARTICLE_FLARE", "1");
        coder.addVertLayout("vec4", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec4", "a_vs2");
        coder.addVertLayout("vec4", "a_uvs2");

        let paramTotal = this.m_clipEnabled ? 4 : 3;
        coder.addVertUniform("vec4", "u_billParam", paramTotal);

        if (this.m_clipEnabled) coder.addDefine("BILL_PARAM_INDEX", "3");

    }

}
export { BillboardFlareDcr };
