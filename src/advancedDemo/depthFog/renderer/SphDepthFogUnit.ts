/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";

export class SphDepthFogUnit {
    constructor() {
    }

    factorColor = new Color4();
    fogColor = new Color4();
    pos = new Vector3D();
    topPos = new Vector3D(0.0, 500.0, 0.0);
    bottomPos = new Vector3D(0.0, -200.0, 0.0);
    coneHeight = 200.0;
    coneRadius = 80.0;
    mcos = 1.0;
    mcos2 = 1.0;
    rstate = 0;
    radius = 1000.0;
	dis = 0;
    protected m_isAlive: boolean = true;
    update(): void {
        this.mcos = this.coneHeight / Math.sqrt(this.coneHeight * this.coneHeight + this.coneRadius * this.coneRadius);
        console.log("this.mcos: " + this.mcos);
        this.mcos2 = this.mcos * this.mcos;
    }
    isAlive(): boolean {
        return this.m_isAlive;
    }
    initWithRandomParam(baseRadius: number, range: number): void {
        this.radius = (0.2 + Math.random()) * baseRadius;
        this.fogColor.randomRGB(2.0);
        this.factorColor.randomRGB(2.0);
        let halfR: number = range * 0.5;
        this.pos.setXYZ(Math.random() * range - halfR, Math.random() * range - halfR * 0.5, Math.random() * range - halfR);
    }
}
