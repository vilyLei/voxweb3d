/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPassMaterialWrapper from "../../vox/render/pass/IPassMaterialWrapper";
import IPassProcess from "../../vox/render/pass/IPassProcess";
import PassRItem from "../../vox/render/pass/PassRItem";

export default class SigleMaterialPassItem extends PassRItem {
    
    private m_pmws: IPassMaterialWrapper[] = null;
    renderState = 0;
    constructor() {
        super();
        this.initialize();
    }
    run(process: IPassProcess): void {

        if (this.m_enabled && process) {

            const unit = process.units[0];
            unit.renderState = this.renderState;

            if (this.m_pmws == null) {
                this.m_pmws = [process.createMaterialWrapper(this.material, unit)];
            }

            process.materials = this.m_pmws;
            process.run();
        }
    }
}