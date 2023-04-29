/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Plane3DEntity from "../../vox/entity/Plane3DEntity";

export default class ScreenFixedAlignPlaneEntity extends Plane3DEntity {
    constructor() {
        super();
        this.fixAlignScreen = true;
    }
}