/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";

export class DirectionLight {

    readonly direction: Vector3D = new Vector3D(0.0, -1.0, 0.0, 0.0);
    readonly color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    
    constructor() { }

}