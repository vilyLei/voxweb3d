/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPOUnit from "../IRPOUnit";
import IRenderProxy from "../IRenderProxy";
import IRenderMaterial from "../IRenderMaterial";
export default interface IPassProcess {

    rc: IRenderProxy;
    // vtxFlag: boolean;
    // texFlag: boolean;
    units: IRPOUnit[];
    applyMaterial(m: IRenderMaterial): void;
    run(): void;
    destroy(): void;
}