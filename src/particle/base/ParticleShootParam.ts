/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";

class ParticleShootParam {
	total = 1;
	totalRange = 2;
	lifetimeScale = 0.3;
	lifetimeScaleRange = 1.7;
	spaceRadius = 15;
	spaceRadiusRange = 15;
	stepDistance = 30;
	constructor() {
	}
	setTotalRange(t0: number, t1: number): void {
		this.total = t0;
		this.totalRange = t1 - t0;
	}
	setlifetimeScaleRange(t0: number, t1: number): void {
		this.lifetimeScale = t0;
		this.lifetimeScaleRange = t1 - t0;
	}

	getTotalValue(): number {
		return Math.random() * this.totalRange + this.total;
	}
	getLifeTimeStaleValue(): number {
		return Math.random() * this.lifetimeScaleRange + this.lifetimeScale;
	}
	getSpaceRadiusValue(): number {
		return Math.random() * this.spaceRadiusRange + this.spaceRadius;
	}
	getPosition(pv: Vector3D): Vector3D {
		return pv;
	}
	getAccelerationScale(): number {
		return (Math.random() - 0.5) * (0.1 * Math.random() + 0.01);
	}
}
export { ParticleShootParam }
