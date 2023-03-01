/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPassProcess from "../../vox/render/pass/IPassProcess";
import PassRItem from "../../vox/render/pass/PassRItem";

export default class SigleMaterialPassItem extends PassRItem {
    renderState = 0;
    constructor() {
        super();
        this.initialize();
    }
    run(process: IPassProcess): void {
        
        if (this.m_enabled && process) {

            const unit = process.units[0];
            unit.applyShader(true);
            unit.renderState = this.renderState;
            process.run();
            // entity.setRenderState(st.BACK_TRANSPARENT_STATE);
            // process.run();
            // entity.setRenderState(rst);
        }
    }
}