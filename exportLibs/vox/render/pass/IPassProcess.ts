/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPOUnit from "../IRPOUnit";
import IRenderProxy from "../IRenderProxy";
import IRenderMaterial from "../IRenderMaterial";
import IPassMaterialWrapper from "./IPassMaterialWrapper";

export default interface IPassProcess {
    
    materials: IPassMaterialWrapper[];
    rc: IRenderProxy;
    units: IRPOUnit[];
    createMaterialWrapper(m: IRenderMaterial, dstRUnit: IRPOUnit): IPassMaterialWrapper
    run(): void;
    destroy(): void;
    
	resetUniform(): void;
	resetTransUniform(): void;
}