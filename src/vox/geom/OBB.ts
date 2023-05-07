/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IOBB from "../../vox/geom/IOBB";
import IAABB from "./IAABB";
import IMatrix4 from "../math/IMatrix4";
import IRenderEntityBase from "../render/IRenderEntityBase";
import MathConst from "../math/MathConst";

let OR = [new Float32Array(3), new Float32Array(3), new Float32Array(3)];
let OAbsR = [new Float32Array(3), new Float32Array(3), new Float32Array(3)];

class OBB implements IOBB {
	private static s_obb = new OBB();
	private m_pv = new Vector3D();
	private m_pv1 = new Vector3D();
	
	/**
	 * three axes normalization 3d vectors
	 */
	readonly axes = [new Vector3D(), new Vector3D(), new Vector3D()];
	readonly extents = new Float32Array(3);
	/**
	 * half length of these three axes
	 */
	readonly extent = new Vector3D();
	readonly center = new Vector3D();

	version = -1;
	radius = 50;
	constructor() {}

	reset(): void {}
	equals(ob: IOBB): boolean {
		if (ob != this && ob != null) {
			if (!this.center.equalsXYZ(ob.center)) return false;
			if (!this.extent.equalsXYZ(ob.extent)) return false;
			for (let i = 0; i < 3; ++i) {
				if (!this.axes[i].equalsXYZ(ob.axes[i])) return false;
			}
			return true;
		}
		return false;
	}
	update(): void {
		this.version++;
		for (let i = 0; i < 3; ++i) this.axes[i].normalize();
		let et = this.extent;
		this.radius = et.getLength();
		this.extents.set([et.x, et.y, et.z]);
	}
	getSize(v3: Vector3D = null): Vector3D {
		if (!v3) {
			v3 = new Vector3D();
		}
		return v3.copyFrom(this.extent).scaleBy(2.0);
	}
	/**
	 * @param entity entity or entity container
	 */
	fromEntity(entity: IRenderEntityBase): void {
		entity.update();
		this.fromAABB(entity.getLocalBounds(), entity.getMatrix());
	}

	/**
	 * @param ob IAABB instance
	 * @param transform IMatrix4 instance, the default is null
	 */
	fromAABB(ob: IAABB, transform: IMatrix4 = null): void {
		const ls = this.axes;
		ls[0].setXYZ(1, 0, 0);
		ls[1].setXYZ(0, 1, 0);
		ls[2].setXYZ(0, 0, 1);
		const extent = this.extent;
		
		if (transform) {
			transform.deltaTransformVectorSelf(ls[0]);
			transform.deltaTransformVectorSelf(ls[1]);
			transform.deltaTransformVectorSelf(ls[2]);

			ls[0].normalize();
			ls[1].normalize();
			ls[2].normalize();

			const pv0 = this.center.copyFrom(ob.center);
			const pv1 = this.m_pv.copyFrom(ob.max);

			transform.transformVector3Self(pv0);
			transform.transformVector3Self(pv1);

			pv1.subVecsTo(pv1, pv0);

			extent.setXYZ(ls[0].dot(pv1), ls[1].dot(pv1), ls[2].dot(pv1));
		} else {
			this.center.copyFrom(ob.center);
			extent.setXYZ(ob.getWidth() * 0.5, ob.getHeight() * 0.5, ob.getLong() * 0.5);
		}
		const et = this.extent;
		this.extents.set([et.x, et.y, et.z]);
		this.radius = et.getLength();
		this.version++;
	}

	getClosePosition(pv: Vector3D, result: Vector3D = null): Vector3D {
		const et = this.extent;

		const axes = this.axes;
		const v0 = this.m_pv.subVecsTo(pv, this.center);
		if (!result) result = new Vector3D();
		result.copyFrom(this.center);

		const clamp = MathConst.Clamp;
		const v1 = this.m_pv1;
		const x = clamp(v0.dot(v1.copyFrom(axes[0])), -et.x, et.x);
		result.add(v1.scaleBy(x));

		const y = clamp(v0.dot(v1.copyFrom(axes[1])), -et.y, et.y);
		result.add(v1.scaleBy(y));

		const z = clamp(v0.dot(v1.copyFrom(axes[2])), -et.z, et.z);
		result.add(v1.scaleBy(z));

		return result;
	}

	intersectAABB(ob: IAABB, transform: IMatrix4 = null): boolean {
		const obb = OBB.s_obb;
		obb.fromAABB(ob, transform);
		return this.intersect(obb);
	}
	intersectSphere(cv: Vector3D, radius: number): boolean {
		const v1 = this.m_pv1;
		this.getClosePosition(cv, v1);
		return v1.subtractBy(cv).getLengthSquared() <= radius * radius;
	}
	containsV(pv: Vector3D): boolean {
		const v0 = this.m_pv.subVecsTo(pv, this.center);
		const axes = this.axes;
		const abs = Math.abs;
		const et = this.extent;
		return abs(v0.dot(axes[0])) <= et.x && abs(v0.dot(axes[1])) <= et.y && abs(v0.dot(axes[2])) <= et.z;
	}
	intersectPlane(planeNV: Vector3D, planeDis: number): boolean {
		const et = this.extent;
		const axes = this.axes;

		// compute the projection interval radius of this OBB onto L(t) = this.center + t * planeNV;

		const r = et.x * Math.abs(planeNV.dot(axes[0])) + et.y * Math.abs(planeNV.dot(axes[1])) + et.z * Math.abs(planeNV.dot(axes[2]));

		// compute distance of the OBB's center from the plane

		const d = planeNV.dot(this.center) - planeDis;

		// Intersection occurs when distance d falls within [-r,+r] interval

		return Math.abs(d) <= r;
	}
	private m_ts = [0, 0, 0];
	intersect(a: OBB, b: OBB = null, epsilon = 1e-6): boolean {
		if (!b) {
			b = a;
			a = this;
		}

		const abs = Math.abs;
		// 计算距离向量tv
		const tv = this.m_pv.subVecsTo(b.center, a.center);
		if (tv.getLength() - (a.radius + b.radius) > epsilon) {
			return false;
		}
		let Avs = OAbsR;
		let Rvs = OR;

		// 计算旋转矩阵R
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				Rvs[i][j] = a.axes[i].dot(b.axes[j]);
			}
		}

		// 应用距离向量tv
		const ts = this.m_ts;
		ts[0] = tv.dot(a.axes[0]);
		ts[1] = tv.dot(a.axes[1]);
		ts[2] = tv.dot(a.axes[2]);

		// 计算旋转矩阵R的绝对值AbsR
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				Avs[i][j] = abs(Rvs[i][j]) + epsilon;
			}
		}

		const aets = a.extents;
		const bets = b.extents;

		let ra = 0;
		let rb = 0;

		// test axes(A0, A1, A2)
		for (let i = 0; i < 3; ++i) {
			ra = aets[i];
			rb = bets[0] * Avs[i][0] + bets[1] * Avs[i][1] + bets[2] * Avs[i][2];
			if (abs(ts[i]) > ra + rb) return false;
		}

		// test axes(B0, B1, B2)
		for (let i = 0; i < 3; ++i) {
			ra = aets[0] * Avs[0][i] + aets[1] * Avs[1][i] + aets[2] * Avs[2][i];
			rb = bets[i];
			if (abs(ts[0] * Rvs[0][i] + ts[1] * Rvs[1][i] + ts[2] * Rvs[2][i]) > ra + rb) return false;
		}

		// test axes L = A0 x B0
		ra = aets[1] * Avs[2][0] + aets[2] * Avs[1][0];
		rb = bets[1] * Avs[0][2] + bets[2] * Avs[0][1];
		if (abs(ts[2] * Rvs[1][0] - ts[1] * Rvs[2][0]) > ra + rb) return false;

		// test axes L = A0 x B1
		ra = aets[1] * Avs[2][1] + aets[2] * Avs[1][1];
		rb = bets[0] * Avs[0][2] + bets[2] * Avs[0][0];
		if (abs(ts[2] * Rvs[1][1] - ts[1] * Rvs[2][1]) > ra + rb) return false;

		// test axes L = A0 x B2
		ra = aets[1] * Avs[2][2] + aets[2] * Avs[1][2];
		rb = bets[0] * Avs[0][1] + bets[1] * Avs[0][0];
		if (abs(ts[2] * Rvs[1][2] - ts[1] * Rvs[2][2]) > ra + rb) return false;

		// --------------------------------------------------------------------------

		// test axes L = A1 x B0
		ra = aets[0] * Avs[2][0] + aets[2] * Avs[0][0];
		rb = bets[1] * Avs[1][2] + bets[2] * Avs[1][1];
		if (abs(ts[0] * Rvs[2][0] - ts[2] * Rvs[0][0]) > ra + rb) return false;

		// test axes L = A1 x B1
		ra = aets[0] * Avs[2][1] + aets[2] * Avs[0][1];
		rb = bets[0] * Avs[1][2] + bets[2] * Avs[1][0];
		if (abs(ts[0] * Rvs[2][1] - ts[2] * Rvs[0][1]) > ra + rb) return false;

		// test axes L = A1 x B2
		ra = aets[0] * Avs[2][2] + aets[2] * Avs[0][2];
		rb = bets[0] * Avs[1][1] + bets[1] * Avs[1][0];
		if (abs(ts[0] * Rvs[2][2] - ts[2] * Rvs[0][2]) > ra + rb) return false;

		// --------------------------------------------------------------------------

		// test axes L = A2 x B0
		ra = aets[0] * Avs[1][0] + aets[1] * Avs[0][0];
		rb = bets[1] * Avs[2][2] + bets[2] * Avs[2][1];
		if (abs(ts[1] * Rvs[0][0] - ts[0] * Rvs[1][0]) > ra + rb) return false;

		// test axes L = A2 x B1
		ra = aets[0] * Avs[1][1] + aets[1] * Avs[0][1];
		rb = bets[0] * Avs[2][2] + bets[2] * Avs[2][0];
		if (abs(ts[1] * Rvs[0][1] - ts[0] * Rvs[1][1]) > ra + rb) return false;

		// test axes L = A2 x B2
		ra = aets[0] * Avs[1][2] + aets[1] * Avs[0][2];
		rb = bets[0] * Avs[2][1] + bets[1] * Avs[2][0];
		if (abs(ts[1] * Rvs[0][2] - ts[0] * Rvs[1][2]) > ra + rb) return false;

		return true;
	}
}

export default OBB;
