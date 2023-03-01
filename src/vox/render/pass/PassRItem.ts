/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderMaterial from "../IRenderMaterial";
import IPassProcess from "./IPassProcess";
import IPassRItem from "./IPassRItem";

export default class PassRItem implements IPassRItem {
    protected m_enabled = false;
    material: IRenderMaterial = null;
    rst: any = null;
    constructor() {
    }
    run(process: IPassProcess): void {
        // if (this.m_enabled && process) {
        //     const unit = process.units[0];
        //     let entity = process.units[0].rentity;
        //     let rst = entity.getRenderState();
        //     let v0 = entity.getPosition();
        //     let rc = process.rc;
        //     // console.log("entity: ", entity);
        //     let pv = entity.getPosition();
        //     for (let i = 0; i < 10; ++i) {
        //         if(i > 0) {
        //             entity.setRenderState(rc.renderingState.BACK_ADD_ALWAYS_STATE);
        //         }else {
        //             entity.setRenderState(rst);
        //         }
        //         entity.setPosition(pv);
        //         entity.update();
        //         unit.shader.resetTransUniform();
        //         process.run();
        //         pv.x += 5.0;
        //     }

        //     entity.setPosition(v0);
        //     entity.update();
        // }
    }

    enable(): IPassRItem {
        this.m_enabled = true;
        return this;
    }
    disable(): IPassRItem {
        this.m_enabled = false;
        return this;
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }
    initialize(): void {
        this.m_enabled = true;
    }
    destroy(): void {
        if (this.material != null) {
            this.material = null;
        }
        if (this.rst != null) {
            this.rst = null;
        }
    }
}