/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPassProcess from "../../vox/render/pass/IPassProcess";
import PassRItem from "../../vox/render/pass/PassRItem";

export default class ConvexTransparentPassItem extends PassRItem {
    constructor() {
        super();
        this.initialize();
    }
    run(process: IPassProcess): void {

        if (this.m_enabled && process) {

            const unit = process.units[0];
            let st = process.rc.renderingState;
            let t = unit.renderState;
            // 绘制背面
            unit.renderState = st.FRONT_TRANSPARENT_STATE;
            process.run();
            // 绘制正面
            unit.renderState = st.BACK_TRANSPARENT_STATE;
            process.run();
            unit.renderState = t;
        }
    }
}