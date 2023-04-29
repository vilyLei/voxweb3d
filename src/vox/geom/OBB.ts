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
class Mat3 {
	vs = [
		new Float32Array(3),
		new Float32Array(3),
		new Float32Array(3)
	];
	getAt(i: number, j: number): number {
		return this.vs[i][j];
	}
	setAt(i: number, j: number, value: number): void {
		this.vs[i][j] = value;
	}
}
class OBB implements IOBB {
	// three axes normalization 3d vectors
	readonly axis = [new Vector3D(), new Vector3D(), new Vector3D()];
	readonly extents = new Float32Array(3);
	// half length of these three axes
	readonly extent = new Vector3D();
	readonly center = new Vector3D();

	version = -1;
	radius = 50;

	constructor() { }
	reset(): void { }
	equals(ab: IOBB): boolean {
		return true;
	}
	update(): void {
		this.version++;
		for (let i = 0; i < 3; ++i) this.axis[i].normalize();
		let et = this.extent;
		this.extents.set([et.x, et.y, et.z]);
	}
	private m_pv = new Vector3D();
	private absVec3(v: Vector3D): Vector3D {
		this.m_pv.copyFrom(v);
		return this.m_pv.abs();
	}
	/**
	 * @param entity entity or entity container
	 */
	fromEntity(entity: IRenderEntityBase): void {
		entity.update();
		this.fromAABB(entity.getLocalBounds(), entity.getMatrix());
	}
	/**
	 * @param ab IAABB instance
	 * @param transform IMatrix4 instance, the default is null
	 */
	fromAABB(ab: IAABB, transform: IMatrix4 = null): void {
		const ls = this.axis;
		ls[0].setXYZ(1, 0, 0);
		ls[1].setXYZ(0, 1, 0);
		ls[2].setXYZ(0, 0, 1);
		const extent = this.extent;
		// console.log("#### ab: ", ab);
		// console.log("#### ab.center: ", ab.center);
		// console.log("#### ab.max: ", ab.max);
		if (transform) {

			transform.deltaTransformVectorSelf(ls[0]);
			transform.deltaTransformVectorSelf(ls[1]);
			transform.deltaTransformVectorSelf(ls[2]);

			ls[0].normalize();
			ls[1].normalize();
			ls[2].normalize();

			const pv0 = this.center.copyFrom(ab.center);
			const pv1 = this.m_pv.copyFrom(ab.max);

			transform.transformVector3Self(pv0);
			transform.transformVector3Self(pv1);

			// console.log("#### obb.center: ", pv0);
			// console.log("#### obb.max: ", pv1.clone());

			pv1.subVecsTo(pv1, pv0);
			this.radius = pv1.getLength();

			extent.setXYZ(ls[0].dot(pv1), ls[1].dot(pv1), ls[2].dot(pv1));
		} else {
			this.center.copyFrom(ab.center);
			extent.setXYZ(ab.getWidth() * 0.5, ab.getHeight() * 0.5, ab.getLong() * 0.5);
			this.radius = ab.radius;
		}
		const et = this.extent;
		this.extents.set([et.x, et.y, et.z]);
		this.version ++;
	}

	private R = new Mat3();
	private AbsR = new Mat3();
	private m_ts = [0,0,0];
	private m_tv = new Vector3D();
	intersect(a: OBB, b: OBB = null): boolean {

		// console.log("obbIntersect2() call() ...");
		if(!b) {
			b = this;
		}
		let Avs = this.AbsR.vs;
		let Rvs = this.R.vs;

		const abs = Math.abs;
		// 计算旋转矩阵R
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				Rvs[i][j] = a.axis[i].dot(b.axis[j]);
			}
		}

		// 计算距离向量t
		const t0 = this.m_pv.subVecsTo(b.center, a.center);
		const t = this.m_tv.setXYZ(t0.dot(a.axis[0]), t0.dot(a.axis[1]), t0.dot(a.axis[2]));
		const ts = this.m_ts;
		t.toArray(ts);
		// let ts = [t.x, t.y, t.z];
		// 计算旋转矩阵R的绝对值AbsR
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				// AbsR.setAt(i, j, abs(R.getAt(i, j)) + 1e-6);
				Avs[i][j] = abs(Rvs[i][j]) + 1e-6;
			}
		}
		// console.log("Avs: ", Avs);
		const aets = a.extents;
		const bets = b.extents;
		let ra = 0;
		let rb = 0;

		// test axes(A0, A1, A2)
		for (let i = 0; i < 3; ++i) {
			ra = aets[i];
			rb = bets[0] * Avs[i][0] + bets[1] * Avs[i][1] + bets[2] * Avs[i][2];
			if(abs(ts[i]) > (ra + rb)) return false;
		}
		// console.log("C 0.");
		// test axes(B0, B1, B2)
		for (let i = 0; i < 3; ++i) {
			ra = aets[0] * Avs[i][0] + aets[1] * Avs[i][1] + aets[2] * Avs[i][2];
			rb = bets[i];
			// if(abs(ts[i]) > (ra + rb)) return false;
			if(abs(ts[0] * Rvs[0][i] + ts[1] * Rvs[1][i] + ts[2] * Rvs[2][i]) > (ra + rb)) return false;
		}

		// console.log("C 1.");
		// test axis L = A0 x B0
		ra = aets[1] * Avs[2][0] + aets[2] * Avs[1][0];
		rb = bets[1] * Avs[0][2] + bets[2] * Avs[0][1];
		if(abs(ts[2] * Rvs[1][0] - ts[1] * Rvs[2][0]) > (ra + rb)) return false;


		// console.log("C 2.");
		// test axis L = A0 x B1
		ra = aets[1] * Avs[2][1] + aets[2] * Avs[1][1];
		rb = bets[0] * Avs[0][2] + bets[2] * Avs[0][0];
		if(abs(ts[2] * Rvs[1][1] - ts[1] * Rvs[2][1]) > (ra + rb)) return false;

		// console.log("C 3.");
		// test axis L = A0 x B2
		ra = aets[1] * Avs[2][2] + aets[2] * Avs[1][2];
		rb = bets[0] * Avs[0][1] + bets[1] * Avs[0][0];
		if(abs(ts[2] * Rvs[1][2] - ts[1] * Rvs[2][2]) > (ra + rb)) return false;

		// --------------------------------------------------------------------------

		// test axis L = A1 x B0
		ra = aets[0] * Avs[2][0] + aets[2] * Avs[0][0];
		rb = bets[1] * Avs[1][2] + bets[2] * Avs[1][1];
		if(abs(ts[0] * Rvs[2][0] - ts[2] * Rvs[0][0]) > (ra + rb)) return false;


		// test axis L = A1 x B1
		ra = aets[0] * Avs[2][1] + aets[2] * Avs[0][1];
		rb = bets[0] * Avs[1][2] + bets[2] * Avs[1][0];
		if(abs(ts[0] * Rvs[2][1] - ts[2] * Rvs[0][1]) > (ra + rb)) return false;


		// test axis L = A1 x B2
		ra = aets[0] * Avs[2][2] + aets[2] * Avs[0][2];
		rb = bets[0] * Avs[1][1] + bets[1] * Avs[1][0];
		if(abs(ts[0] * Rvs[2][2] - ts[2] * Rvs[0][2]) > (ra + rb)) return false;

		// --------------------------------------------------------------------------

		// test axis L = A2 x B0
		ra = aets[0] * Avs[1][0] + aets[1] * Avs[0][0];
		rb = bets[1] * Avs[2][2] + bets[2] * Avs[2][1];
		if(abs(ts[1] * Rvs[0][0] - ts[0] * Rvs[1][0]) > (ra + rb)) return false;


		// test axis L = A2 x B1
		ra = aets[0] * Avs[1][1] + aets[1] * Avs[0][1];
		rb = bets[0] * Avs[2][2] + bets[2] * Avs[2][0];
		if(abs(ts[1] * Rvs[0][1] - ts[0] * Rvs[1][1]) > (ra + rb)) return false;


		// test axis L = A2 x B2
		ra = aets[0] * Avs[1][2] + aets[1] * Avs[0][2];
		rb = bets[0] * Avs[2][1] + bets[1] * Avs[2][0];
		if(abs(ts[1] * Rvs[0][2] - ts[0] * Rvs[1][2]) > (ra + rb)) return false;

		return true;
	}
	obbIntersect(obb1: OBB, obb2: OBB = null): boolean {
		const R = new Mat3();
		const AbsR = new Mat3();
		if(!obb2) {
			obb2 = this;
		}

		const abs = Math.abs;
		// 计算旋转矩阵R
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				R.setAt(i, j, obb1.axis[i].dot(obb2.axis[j]));
			}
		}

		// 计算距离向量t
		// Vector3f t = obb2.center - obb1.center;
		const t0 = new Vector3D().subVecsTo(obb2.center, obb1.center);

		const t = new Vector3D(t0.dot(obb1.axis[0]), t0.dot(obb1.axis[1]), t0.dot(obb1.axis[2]));
		// t.normalize();
		let ts = [t.x, t.y, t.z];
		// 计算旋转矩阵R的绝对值AbsR
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				AbsR.setAt(i, j, abs(R.getAt(i, j)) + 1e-6);
			}
		}

		// console.log("XXXXX R: ", R);
		// console.log("XXXXX AbsR: ", AbsR);

		// obb1.extents.set([obb1.extent.x, obb1.extent.y, obb1.extent.z]);
		// obb2.extents.set([obb2.extent.x, obb2.extent.y, obb2.extent.z]);
		const ets1 = obb1.extents;
		const ets2 = obb2.extents;
		// console.log("XXXXX obb1.extents: ", obb1.extents);
		// console.log("XXXXX obb2.extents: ", obb2.extents);

		// 判断重叠性
		for (let i = 0; i < 3; ++i) {
			const ra = ets1[i];
			const rb = obb2.extent.dot(new Vector3D(AbsR.getAt(i, 0), AbsR.getAt(i, 1), AbsR.getAt(i, 2)));
			if (abs(ts[i]) > (ra + rb)) {
				// console.log("false 0");
				return false;
			}
		}

		// 判断重叠性
		for (let i = 0; i < 3; ++i) {
			const ra = obb1.extent.dot(new Vector3D(AbsR.getAt(0, i), AbsR.getAt(1, i), AbsR.getAt(2, i)));
			const rb = ets2[i];
			if (abs(t.dot(obb2.axis[i])) > (ra + rb)) {
				// console.log("false 1");
				return false;
			}
		}

		// 判断重叠性
		let axis = obb1.axis[0].crossProduct(obb2.axis[0]);
		let ra = ets1[1] * abs(R.getAt(0, 2)) + ets1[2] * abs(R.getAt(0, 1));
		let rb = ets2[1] * abs(R.getAt(2, 0)) + ets2[2] * abs(R.getAt(1, 0));
		if (abs(t.dot(axis)) > (ra + rb)) {
			// console.log("false 2");
			return false;
		}


		axis = obb1.axis[0].crossProduct(obb2.axis[1]);
		ra = ets1[1] * abs(R.getAt(1, 2)) + ets1[2] * abs(R.getAt(1, 1));
		rb = ets2[0] * abs(R.getAt(2, 0)) + ets2[2] * abs(R.getAt(0, 0));
		if (abs(t.dot(axis)) > (ra + rb)) {
			return false;
		}

		axis = obb1.axis[0].crossProduct(obb2.axis[2]);
		ra = ets1[1] * abs(R.getAt(2, 2)) + ets1[2] * abs(R.getAt(2, 1));
		rb = ets2[0] * abs(R.getAt(1, 0)) + ets2[1] * abs(R.getAt(0, 0));
		if (abs(t.dot(axis)) > (ra + rb)) {
			return false;
		}

		axis = obb1.axis[1].crossProduct(obb2.axis[0]);
		ra = ets1[0] * abs(R.getAt(0, 2)) + ets1[2] * abs(R.getAt(0, 0));
		rb = ets2[1] * abs(R.getAt(2, 1)) + ets2[2] * abs(R.getAt(1, 1));
		if (abs(t.dot(axis)) > (ra + rb)) {
			return false;
		}

		axis = obb1.axis[1].crossProduct(obb2.axis[1]);
		ra = ets1[0] * abs(R.getAt(1, 2)) + ets1[2] * abs(R.getAt(1, 0));
		rb = ets2[0] * abs(R.getAt(2, 1)) + ets2[2] * abs(R.getAt(0, 1));
		if (abs(t.dot(axis)) > (ra + rb)) {
			return false;
		}

		axis = obb1.axis[1].crossProduct(obb2.axis[2]);
		ra = ets1[0] * abs(R.getAt(2, 2)) + ets1[2] * abs(R.getAt(2, 0));
		rb = ets2[0] * abs(R.getAt(1, 1)) + ets2[1] * abs(R.getAt(0, 1));
		if (abs(t.dot(axis)) > (ra + rb)) {
			return false;
		}

		axis = obb1.axis[2].crossProduct(obb2.axis[0]);
		ra = ets1[0] * abs(R.getAt(0, 1)) + ets1[1] * abs(R.getAt(0, 0));
		rb = ets2[1] * abs(R.getAt(2, 2)) + ets2[2] * abs(R.getAt(1, 2));
		if (abs(t.dot(axis)) > (ra + rb)) {
			return false;
		}

		axis = obb1.axis[2].crossProduct(obb2.axis[1]);
		ra = ets1[0] * abs(R.getAt(1, 1)) + ets1[1] * abs(R.getAt(1, 0));
		rb = ets2[0] * abs(R.getAt(2, 2)) + ets2[2] * abs(R.getAt(0, 2));
		if (abs(t.dot(axis)) > (ra + rb)) {
			return false;
		}

		axis = obb1.axis[2].crossProduct(obb2.axis[2]);
		ra = ets1[0] * abs(R.getAt(2, 1)) + ets1[1] * abs(R.getAt(2, 0));
		rb = ets2[0] * abs(R.getAt(1, 2)) + ets2[1] * abs(R.getAt(0, 2));
		if (abs(t.dot(axis)) > (ra + rb)) {
			return false;
		}
		return true;
	}
}

export default OBB;
