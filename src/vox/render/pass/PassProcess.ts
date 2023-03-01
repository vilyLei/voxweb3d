/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPOUnit from "../IRPOUnit";
import IRenderProxy from "../IRenderProxy";
import IPassProcess from "./IPassProcess";
export default class PassProcess implements IPassProcess {

    constructor() { }
    rc: IRenderProxy;
    vtxFlag: boolean;
    texFlag: boolean;
    units: IRPOUnit[] = null;
    run(): void {
        const units = this.units;
        if (units != null) {
            const rc = this.rc;
            let vtxFlag = this.vtxFlag;
            let texFlag = this.texFlag;
            for (let i = 0, ln = units.length; i < ln; ++i) {
                const unit = units[i];
                vtxFlag = unit.updateVtx() || vtxFlag;
                if (vtxFlag) {
                    unit.vro.run();
                    vtxFlag = false;
                }
                if (texFlag) {
                    unit.tro.run();
                    texFlag = false;
                }
                unit.run2(rc);
                unit.draw(rc);
            }
        }
    }
    destroy(): void {
        if(this.units != null) {
            this.units = null;
        }
    }
}