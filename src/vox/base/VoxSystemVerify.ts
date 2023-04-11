/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ISystemVerify from "../../vox/base/ISystemVerify";
declare var VoxVerify: ISystemVerify;
export default class VoxSystemVerify {
    // constructor(){}
    isEnabled(): boolean {
        return VoxVerify.isEnabled();
    }
}
