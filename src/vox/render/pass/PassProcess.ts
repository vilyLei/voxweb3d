/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPOUnit from "../IRPOUnit";
import IRenderProxy from "../IRenderProxy";
import IPassProcess from "./IPassProcess";
import IRenderMaterial from "../IRenderMaterial";
import IPassMaterialWrapper from "./IPassMaterialWrapper";
import PassMaterialWrapper from "./PassMaterialWrapper";
export default class PassProcess implements IPassProcess {

    constructor() { }
    rc: IRenderProxy;
    vtxFlag: boolean;
    texFlag: boolean;
    units: IRPOUnit[] = null;
    materials: IPassMaterialWrapper[] = null;
    createMaterialWrapper(m: IRenderMaterial): IPassMaterialWrapper {
        let w = new PassMaterialWrapper();
        w.bindMaterial(m);
        return w;
    }
    run(): void {
        const units = this.units;
        if (units != null) {
            const rc = this.rc;
            let vtxFlag = this.vtxFlag;
            let texFlag = this.texFlag;
            const mts = this.materials as PassMaterialWrapper[];
            if(mts == null || mts.length == 0) {
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
            }else {
                const mtln = mts.length;
                for (let i = 0, ln = units.length; i < ln; ++i) {
                    const unit = units[i];
                    const mt = i < mtln ? mts[i] : mts[mtln - 1];
                    vtxFlag = unit.updateVtx() || vtxFlag;
                    if (vtxFlag) {
                        unit.vro.run();
                        vtxFlag = false;
                    }
                    unit.copyMaterialFrom(mt.unit);
                    unit.tro.run();
                    unit.run2(rc);
                    unit.draw(rc);
                }
            }
        }
    }
    destroy(): void {
        this.materials = null;
        if(this.units != null) {
            this.units = null;
        }
    }
}