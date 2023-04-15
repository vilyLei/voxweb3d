/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Plane3DEntity from "../../vox/entity/Plane3DEntity";

export default class ScreenAlignPlaneEntity extends Plane3DEntity {
    constructor() {
        super();
        this.alignScreen = true;
    }
}