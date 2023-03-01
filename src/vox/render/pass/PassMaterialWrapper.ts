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
export default class PassMaterialWrapper implements IPassMaterialWrapper {
    private m_material: IRenderMaterial = null;
    unit: RPOUnit = null;
    constructor() { }
    bindMaterial(m: IRenderMaterial): void {
    }
    destroy(): void {
        if(this.m_material != null) {
            this.m_material = null;
        }
    }
}