/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IROIvsRDP } from "./IROIvsRDP";
import IVtxDrawingInfo from "./IVtxDrawingInfo";

export default interface IVDRInfo extends IVtxDrawingInfo {
    // rdp: IROIvsRDP;
    __$$copyToRDP(rdp: IROIvsRDP): boolean;
}
