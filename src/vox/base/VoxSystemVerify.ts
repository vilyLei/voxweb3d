/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import URLFilter from "../../tool/base/URLFilter";
import ISystemVerify from "../../vox/base/ISystemVerify";
declare var VoxVerify: ISystemVerify;
export default class VoxSystemVerify {
    static isEnabled(): boolean {
        if(typeof VoxVerify !== "undefined") {
            return VoxVerify.isEnabled();
        }
        return URLFilter.isEnabled();
    }
}
