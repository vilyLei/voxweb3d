/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";

export class SpotLight {
    
    readonly position: Vector3D = new Vector3D(0.0, 100.0, 0.0);
    readonly direction: Vector3D = new Vector3D(0.0, -1.0, 0.0, 0.0);
    readonly color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    /**
     * spot light 椎体夹角角度值
     */
    angleDegree: number = 30.0;
    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    attenuationFactor1: number = 0.0001;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    attenuationFactor2: number = 0.0005;

    constructor() { }

    setParams(px: number, py: number, pz: number, dx: number, dy: number, dz: number, r: number, g: number, b: number, degree: number, f1: number, f2: number): void {

        this.position.setXYZ(px, py, pz);
        this.direction.setXYZ(dx, dy, dz);
        this.color.setRGB3f(r, g, b);
        this.angleDegree = degree;
        this.attenuationFactor1 = f1;
        this.attenuationFactor2 = f2;
    }
}