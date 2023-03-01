/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPOUnit from "../IRPOUnit";
import IRenderProxy from "../IRenderProxy";
export default interface IPassProcess {

    rc: IRenderProxy;
    // vtxFlag: boolean;
    // texFlag: boolean;
    units: IRPOUnit[];
    run(): void;
    destroy(): void;
}