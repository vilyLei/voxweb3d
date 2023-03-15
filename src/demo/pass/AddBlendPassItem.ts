/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPassProcess from "../../vox/render/pass/IPassProcess";
import PassRItem from "../../vox/render/pass/PassRItem";

export default class AddBlendPassItem extends PassRItem {
    state = 0;
    constructor() {
        super();
    }
    run(process: IPassProcess): void {
        if (this.m_enabled && process) {
            const unit = process.units[0];
            let entity = unit.rentity;
            let rst = entity.getRenderState();
            
            let v0 = entity.getPosition();
            let pv = entity.getPosition();

            for (let i = 0; i < 10; ++i) {
                if(i > 0) {
                    entity.setRenderState( this.state );
                }
                entity.setPosition(pv);
                entity.update();
                process.resetTransUniform();
                process.run();
                pv.x += 5.0;
            }

            entity.setRenderState(rst);
            entity.setPosition(v0);
        }
    }

    initialize(): void {
        this.m_enabled = true;
    }
    destroy(): void {
        super.destroy();
    }
}