/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPOUnit from "../IRPOUnit";
import IRenderProxy from "../IRenderProxy";
import IPassProcess from "./IPassProcess";
import IRenderMaterial from "../IRenderMaterial";
import IPassMaterialWrapper from "./IPassMaterialWrapper";
import PassMaterialWrapper from "./PassMaterialWrapper";
import RPOUnit from "../RPOUnit";
import IRenderShader from "../IRenderShader";

export default class PassProcess implements IPassProcess {

    constructor() {}

    rc: IRenderProxy = null;
    vtxFlag = false;
    texFlag = false;
    units: IRPOUnit[] = null;
    materials: IPassMaterialWrapper[] = null;

    shader: IRenderShader;
	resetUniform(): void {
        this.shader.resetUniform();
    }
	resetTransUniform(): void {
        this.shader.resetTransUniform();
    }
    createMaterialWrapper(m: IRenderMaterial, hostRUnit: IRPOUnit): IPassMaterialWrapper {
        const rc = this.rc;
        let w = new PassMaterialWrapper();
        w.rdataBuilder = rc.rdataBuilder;
        w.hostUnit = hostRUnit as RPOUnit;
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
            if(mts == null || mts.length < 1) {
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
                    const mt = i < mtln ? mts[i] : mts[mtln - 1];
                    // console.log("mt.isEnabled(): ", mt.isEnabled());
                    if(mt.isEnabled()) {
                        
                        const unit = units[i];
                        unit.copyMaterialFrom(mt.unit);
                        unit.applyShader(true);
                        vtxFlag = unit.updateVtx() || vtxFlag;
                        if (vtxFlag) {
                            unit.vro.run();
                            vtxFlag = false;
                        }
                        unit.tro.run();
                        unit.run2(rc);
                        unit.draw(rc);
                    }
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