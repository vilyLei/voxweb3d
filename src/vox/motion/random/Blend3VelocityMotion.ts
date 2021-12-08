/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import { BaseMotion } from "../../../vox/motion/base/BaseMotion";

/**
 * ec3d.anim.ctr.FixPosProjYMotion
 * 实现 垂直于 xoz 平面指定起点和终点的抛体运动, 可设置高度和两点间的移动速度
 * @author Vily
 */
class Blend3VelocityMotion extends BaseMotion {
	timeSpeed: number = 0.02;
	timeBounds: number = 1.0;
	speedRange: number = 3.0;
	speed: number = 3.0;
	private m_time: number = 0.0;
	private m_spdV: Vector3D = new Vector3D();
	private m_spdV0: Vector3D = new Vector3D();
	private m_spdV1: Vector3D = new Vector3D();
	private m_spdV2: Vector3D = new Vector3D();
	constructor(px: number = 0, py: number = 0, pz: number = 0, pw: number = 0) {
		super(px, py, pz, pw);
	}
	initialize(synSpdBoo: boolean = false): void {
		let half: number = this.speedRange * 0.5;
		if (synSpdBoo) {
			this.m_spdV.normalize();
			this.m_spdV.scaleBy(Math.random() * this.speedRange + 1.0);
			this.m_spdV0.copyFrom(this.m_spdV);
		}
		else {
			this.m_spdV0.setXYZ(Math.random() * this.speedRange - half, Math.random() * this.speedRange - half, Math.random() * this.speedRange - half);
		}
		this.m_spdV1.setXYZ(Math.random() * this.speedRange - half, Math.random() * this.speedRange - half, Math.random() * this.speedRange - half);
		this.m_spdV2.setXYZ(Math.random() * this.speedRange - half, Math.random() * this.speedRange - half, Math.random() * this.speedRange - half);
		this.m_time = 0.0;
		this.m_moving = true;
		this.m_arrived = false;
	}

	initializeXOZ(synSpdBoo: boolean = false): void {
		let half: number = this.speedRange * 0.5;
		if (synSpdBoo) {
			this.m_spdV.normalize();
			this.m_spdV.scaleBy(Math.random() * this.speedRange + 1.0);
			this.m_spdV0.copyFrom(this.m_spdV);
		}
		else {
			this.m_spdV0.setXYZ(Math.random() * this.speedRange - half, 0.0, Math.random() * this.speedRange - half);
		}
		this.m_spdV1.setXYZ(Math.random() * this.speedRange - half, 0.0, Math.random() * this.speedRange - half);
		this.m_spdV2.setXYZ(Math.random() * this.speedRange - half, 0.0, Math.random() * this.speedRange - half);
		this.m_time = 0.0;
		this.m_moving = true;
		this.m_arrived = false;
	}
	isMoving(): boolean {
		return this.m_moving;
	}
	/**
	 * 是否已经到达目标位置
	 * */
	isArrived(): boolean {
		return this.m_arrived;
	}
	run(): void {
		if (this.m_moving) {
			this.m_time += this.timeSpeed;
			if (this.timeSpeed > 0) {
				if (this.m_time > this.timeBounds) {
					this.m_time = this.timeBounds;
					this.m_moving = false;
					this.m_arrived = true;
				}
			}
			else {
				if (this.m_time < this.timeBounds) {
					this.m_time = this.timeBounds;
					this.m_moving = false;
					this.m_arrived = true;
				}
			}

			let t: number = this.m_time;
			t = 1.0 - (Math.abs(t - 0.5) / 0.5);// 0.0->1.0 => 0.0->1.0->0.0
			//t = 1.0;

			let k0: number = this.m_time;
			let k1: number = 1.0 - k0;
			let k2: number = k1 * k1;
			this.m_spdV.x = (this.m_spdV0.x * k1 - this.m_spdV1.x * k0) * 0.7 + k2 * this.m_spdV2.x;
			this.m_spdV.y = (this.m_spdV0.y * k1 - this.m_spdV1.y * k0) * 0.7 + k2 * this.m_spdV2.y;
			this.m_spdV.z = (this.m_spdV0.z * k1 - this.m_spdV1.z * k0) * 0.7 + k2 * this.m_spdV2.z;
			this.m_spdV.normalize();
			this.m_spdV.scaleBy(this.speed * t);
			this.addBy(this.m_spdV);


		}
	}
}
export { Blend3VelocityMotion }