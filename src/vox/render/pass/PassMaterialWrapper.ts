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
import RPOUnit from "../RPOUnit";
import IRODataBuilder from "../IRODataBuilder";
export default class PassMaterialWrapper implements IPassMaterialWrapper {
    private m_mt: IRenderMaterial = null;
    private m_build = false;
    rdataBuilder: IRODataBuilder = null;
    unit: RPOUnit = null;
    hostUnit: RPOUnit = null;
    constructor() { }
    isEnabled(): boolean {
        if(this.m_build) {
            let m = this.m_mt;
            this.m_mt = null;
            this.build(m);
            this.m_build = !m.hasShaderData();
            if(this.m_build) {
                this.m_mt = m;
            }
        }
        return this.m_mt && this.m_mt.hasShaderData();
    }
    private build(m: IRenderMaterial): void {
        if (m.hasShaderData()) {
            if (this.m_mt != m) {
                if (this.m_mt != null) {
                    this.m_mt.__$detachThis();
                }
                this.m_mt = m;

                const builder = this.rdataBuilder;
                if (this.m_mt != null) {
                    this.m_mt.__$attachThis();
                    if (this.unit == null) {
                        this.unit = builder.createRPOUnit() as RPOUnit;
                    }
                    builder.updateDispMaterial(this.unit, this.m_mt, this.hostUnit.rentity.getDisplay());
                } else {
                    if (this.unit != null) {
                        this.unit.destroy();
                        builder.restoreRPOUnit(this.unit);
                        this.unit = null;
                    }
                }
            }
        }
    }
    bindMaterial(m: IRenderMaterial): void {
        if (m != null) {
            m.initializeByCodeBuf(m.getTextureAt(0) != null);
            this.m_build = true;
            if (m.hasShaderData()) {
                this.build(m);
            }else {
                this.m_mt = m;
            }
        }
    }
    destroy(): void {
        if (this.unit != null) {
            this.unit.destroy();
            this.rdataBuilder.restoreRPOUnit(this.unit);
            this.unit = null;
        }
        this.m_build = false;
        this.hostUnit = null;        
        this.rdataBuilder = null;        
        if (this.m_mt != null) {
            this.m_mt = null;
        }
    }
}