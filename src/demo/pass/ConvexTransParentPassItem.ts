/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPassProcess from "../../vox/render/pass/IPassProcess";
import PassRItem from "../../vox/render/pass/PassRItem";

export default class ConvexTransParentPassItem extends PassRItem {
    constructor() {
        super();
        this.initialize();
    }
    run(process: IPassProcess): void {

        if (this.m_enabled && process) {

            const unit = process.units[0];
            let entity = unit.rentity;
            let st = process.rc.renderingState;
            let rst = entity.getRenderState();

            unit.renderState = st.FRONT_TRANSPARENT_STATE;
            process.run();
            unit.renderState = st.BACK_TRANSPARENT_STATE;
            process.run();
            entity.setRenderState(rst);
        }
    }

    // initialize(): void {
    //     this.m_enabled = true;
    // }
    // destroy(): void {
    //     super.destroy();
    // }
}