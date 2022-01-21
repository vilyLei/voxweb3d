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
    
    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    attenuationFactor1: number = 0.0;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    attenuationFactor2: number = 0.0;

    constructor(rgbUint24: number = 0xffffff, direction: Vector3D = null) {
        this.color.setRGBUint24(rgbUint24);
        if(direction != null) this.direction.copyFrom( direction );
    }

}