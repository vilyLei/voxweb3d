/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import IOBB from "../../vox/geom/IOBB";
import IAABB from "./IAABB";
import IMatrix4 from "../math/IMatrix4";
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
	private m_Tv = new Vector3D();
	private m_pv = new Vector3D();
	private absVec3(v: Vector3D): Vector3D {
		this.m_pv.copyFrom(v);
		return this.m_pv.abs();
	}
	fromAABB(ab: IAABB, transform: IMatrix4 = null): void {
		const ls = this.axis;
		ls[0].setXYZ(1, 0, 0);
		ls[1].setXYZ(0, 1, 0);
		ls[2].setXYZ(0, 0, 1);
		const extent = this.extent;
		console.log("#### ab: ", ab);
		console.log("#### ab.center: ", ab.center);
		console.log("#### ab.max: ", ab.max);
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

			console.log("#### obb.center: ", pv0);
			console.log("#### obb.max: ", pv1.clone());

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
	}
	intersect(ob: OBB): boolean {
		const T = this.m_Tv.subVecsTo(ob.center, this.center);

		const abs = Math.abs;
		const axis = this.axis;
		// const ext = [this.extent.x, this.extent.y, this.extent.z];
		// const ext2 = [ob.extent.x, ob.extent.y, ob.extent.z];
		const ext = this.extents;
		const ext2 = ob.extents;
		let ra, rb;

		// 测试第一个盒子的轴
		for (let i = 0; i < 3; ++i) {
			ra = ext[i];
			rb = ob.extent.dot(this.absVec3(axis[i]));

			if (abs(T.dot(axis[i])) > (ra + rb)) {
				return false;
			}
		}

		// 测试第二个盒子的轴
		for (let i = 0; i < 3; ++i) {
			ra = this.extent.dot(this.absVec3(ob.axis[i]));
			rb = ext2[i];

			if (abs(T.dot(ob.axis[i])) > (ra + rb)) {
				return false;
			}
		}

		let pv = this.m_pv;

		// 测试第一个盒子的三个轴和第二个盒子的三个轴的组合
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				if (i == j) continue;

				const axis1 = axis[i];
				const axis2 = ob.axis[j];

				pv.copyFrom(T);
				ra = ext[i] * abs(axis1.dot(pv.crossBy(axis2)));
				pv.copyFrom(T);
				rb = ext2[j] * abs(axis2.dot(pv.crossBy(axis1)));
				pv.copyFrom(axis1);
				if (abs(T.dot(pv.crossBy(axis2))) > (ra + rb)) {
					return false;
				}
			}
		}

		return true;
	}
	detectIntersection(obb1: OBB, obb2: OBB): boolean {
		// 计算两个 OBB 的中心点距离
		let distance = new Vector3D().subVecsTo(obb1.center, obb2.center);
		// 计算两个 OBB 的轴向量之间的夹角
		let c = [new Float32Array(3), new Float32Array(3), new Float32Array(3)];
		const fabs = Math.abs;
		//float c[3][3];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				// c[i][j] = fabs(Vector3::Dot(obb1.axis[i], obb2.axis[j]));
				c[i][j] = fabs(obb1.axis[i].dot(obb2.axis[j]));
			}
		}
		// 计算两个 OBB 的半径长度之和
		let r_sum = new Vector3D().addVecsTo(obb1.extent, obb2.extent);
		let r_sums = [r_sum.x, r_sum.y, r_sum.z];
		// 判断两个 OBB 是否相交
		for (let i = 0; i < 3; i++) {
			const r = r_sums[i];
			if (fabs(distance.dot(obb1.axis[i])) > (r + r * c[i][0] + r * c[i][1] + r * c[i][2])) {
				return false;
			}
		}
		for (let i = 0; i < 3; i++) {
			const r = r_sum.dot(obb2.axis[i]);
			if (fabs(distance.dot(obb2.axis[i])) > (r + r * c[0][i] + r * c[1][i] + r * c[2][i])) {
				return false;
			}
		}
		// 如果经过所有轴的检测后，两个 OBB 都没有分离，则它们相交
		return true;
	}
	obbIntersect2(a: OBB, b: OBB): boolean {

		console.log("obbIntersect2() call() ...");

		const R = new Mat3();
		const AbsR = new Mat3();

		let Avs = AbsR.vs;
		let Rvs = R.vs;

		const abs = Math.abs;
		// 计算旋转矩阵R
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				// R.setAt(i, j, a.axis[i].dot(b.axis[j]));
				Rvs[i][j] = a.axis[i].dot(b.axis[j]);
			}
		}

		// 计算距离向量t
		// Vector3f t = obb2.center - obb1.center;
		let t = new Vector3D().subVecsTo(b.center, a.center);		
		t = new Vector3D(t.dot(a.axis[0]), t.dot(a.axis[1]), t.dot(a.axis[2]));
		// t.normalize();
		let ts = [t.x, t.y, t.z];
		// 计算旋转矩阵R的绝对值AbsR
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				// AbsR.setAt(i, j, abs(R.getAt(i, j)) + 1e-6);
				Avs[i][j] = abs(Rvs[i][j]) + 1e-6;
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
			if(abs(ts[i]) > (ra + rb)) return false;
		}
		// test axes(B0, B1, B2)
		for (let i = 0; i < 3; ++i) {
			ra = aets[0] * Avs[i][0] + aets[1] * Avs[i][1] + aets[2] * Avs[i][2];
			rb = bets[i];
			// if(abs(ts[i]) > (ra + rb)) return false;
			if(abs(ts[0] * Rvs[0][i] + ts[1] * Rvs[1][i] + ts[2] * Rvs[2][i]) > (ra + rb)) return false;
		}

		// test axis L = A0 x B0
		ra = aets[1] * Avs[2][0] + aets[2] * Avs[1][0];
		rb = bets[1] * Avs[0][2] + bets[2] * Avs[0][1];
		if(abs(ts[2] * Rvs[1][0] - ts[1] * Rvs[2][0]) > (ra + rb)) return false;

		
		// test axis L = A0 x B1
		ra = aets[1] * Avs[2][1] + aets[2] * Avs[1][1];
		rb = bets[0] * Avs[0][2] + bets[2] * Avs[0][0];
		if(abs(ts[2] * Rvs[1][1] - ts[1] * Rvs[2][1]) > (ra + rb)) return false;

		
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
	obbIntersect(obb1: OBB, obb2: OBB): boolean {
		const R = new Mat3();
		const AbsR = new Mat3();

		// obb1.update();
		// obb2.update();

		const abs = Math.abs;
		// 计算旋转矩阵R
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				R.setAt(i, j, obb1.axis[i].dot(obb2.axis[j]));
			}
		}

		// 计算距离向量t
		// Vector3f t = obb2.center - obb1.center;
		let t = new Vector3D().subVecsTo(obb2.center, obb1.center);

		t = new Vector3D(t.dot(obb1.axis[0]), t.dot(obb1.axis[1]), t.dot(obb1.axis[2]));
		t.normalize();
		let ts = [t.x, t.y, t.z];
		// 计算旋转矩阵R的绝对值AbsR
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				AbsR.setAt(i, j, abs(R.getAt(i, j)) + 1e-6);
			}
		}

		console.log("XXXXX R: ", R);
		console.log("XXXXX AbsR: ", AbsR);

		// obb1.extents.set([obb1.extent.x, obb1.extent.y, obb1.extent.z]);
		// obb2.extents.set([obb2.extent.x, obb2.extent.y, obb2.extent.z]);
		const ets1 = obb1.extents;
		const ets2 = obb2.extents;
		console.log("XXXXX obb1.extents: ", obb1.extents);
		console.log("XXXXX obb2.extents: ", obb2.extents);

		// 判断重叠性
		for (let i = 0; i < 3; ++i) {
			const ra = ets1[i];
			const rb = obb2.extent.dot(new Vector3D(AbsR.getAt(i, 0), AbsR.getAt(i, 1), AbsR.getAt(i, 2)));
			if (abs(ts[i]) > (ra + rb)) {
				console.log("false 0");
				return false;
			}
		}

		// 判断重叠性
		for (let i = 0; i < 3; ++i) {
			const ra = obb1.extent.dot(new Vector3D(AbsR.getAt(0, i), AbsR.getAt(1, i), AbsR.getAt(2, i)));
			const rb = ets2[i];
			if (abs(t.dot(obb2.axis[i])) > (ra + rb)) {
				console.log("false 1");
				return false;
			}
		}

		// 判断重叠性
		let axis = obb1.axis[0].crossProduct(obb2.axis[0]);
		let ra = ets1[1] * abs(R.getAt(0, 2)) + ets1[2] * abs(R.getAt(0, 1));
		let rb = ets2[1] * abs(R.getAt(2, 0)) + ets2[2] * abs(R.getAt(1, 0));
		if (abs(t.dot(axis)) > (ra + rb)) {
			console.log("false 2");
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
	/*
#include <iostream>
#include <Eigen/Core>
#include <Eigen/Geometry>

using namespace Eigen;

// 定义OBB包围盒结构体
struct OBB
{
	Vector3f center;    // 中心点
	Vector3f axis[3];   // 三个轴向
	Vector3f extent;  // 长、宽、高的一半
};

// 判断两个OBB包围盒是否相交
bool obbIntersect(const OBB& obb1, const OBB& obb2)
{
	Matrix3f R, AbsR;

	// 计算旋转矩阵R
	for (int i = 0; i < 3; ++i)
	{
		for (int j = 0; j < 3; ++j)
		{
			R.getAt(i, j) = obb1.axis[i].dot(obb2.axis[j]);
		}
	}

	// 计算距离向量t
	Vector3f t = obb2.center - obb1.center;
	t = Vector3f(t.dot(obb1.axis[0]), t.dot(obb1.axis[1]), t.dot(obb1.axis[2]));

	// 计算旋转矩阵R的绝对值AbsR
	for (int i = 0; i < 3; ++i)
	{
		for (int j = 0; j < 3; ++j)
		{
			AbsR.getAt(i, j) = abs(R.getAt(i, j)) + 1e-6;
		}
	}

	// 判断重叠性
	for (int i = 0; i < 3; ++i)
	{
		float ra = ets1[i];
		float rb = obb2.extent.dot(Vector3f(AbsR.getAt(i, 0), AbsR.getAt(i, 1), AbsR.getAt(i, 2)));
		if (abs(t[i]) > (ra + rb))
		{
			return false;
		}
	}

	// 判断重叠性
	for (int i = 0; i < 3; ++i)
	{
		float ra = obb1.extent.dot(Vector3f(AbsR.getAt(0, i), AbsR.getAt(1, i), AbsR.getAt(2, i)));
		float rb = ets2[i];
		if (abs(t.dot(obb2.axis[i])) > (ra + rb))
		{
			return false;
		}
	}

	// 判断重叠性
	Vector3f axis = obb1.axis[0].crossProduct(obb2.axis[0]);
	float ra = ets1[1] * abs(R.getAt(0, 2)) + ets1[2] * abs(R.getAt(0, 1));
	float rb = ets2[1] * abs(R.getAt(2, 0)) + ets2[2] * abs(R.getAt(1, 0));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}

	axis = obb1.axis[0].crossProduct(obb2.axis[1]);
	ra = ets1[1] * abs(R.getAt(1, 2)) + ets1[2] * abs(R.getAt(1, 1));
	rb = ets2[0] * abs(R.getAt(2, 0)) + ets2[2] * abs(R.getAt(0, 0));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}

	axis = obb1.axis[0].crossProduct(obb2.axis[2]);
	ra = ets1[1] * abs(R.getAt(2, 2)) + ets1[2] * abs(R.getAt(2, 1));
	rb = ets2[0] * abs(R.getAt(1, 0)) + ets2[1] * abs(R.getAt(0, 0));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}

	axis = obb1.axis[1].crossProduct(obb2.axis[0]);
	ra = ets1[0] * abs(R.getAt(0, 2)) + ets1[2] * abs(R.getAt(0, 0));
	rb = ets2[1] * abs(R.getAt(2, 1)) + ets2[2] * abs(R.getAt(1, 1));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}
// ---------------01----------
	axis = obb1.axis[1].crossProduct(obb2.axis[1]);
	ra = ets1[0] * abs(R.getAt(1, 2)) + ets1[2] * abs(R.getAt(1, 0));
	rb = ets2[0] * abs(R.getAt(2, 1)) + ets2[2] * abs(R.getAt(0, 1));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}

	axis = obb1.axis[1].crossProduct(obb2.axis[2]);
	ra = ets1[0] * abs(R.getAt(2, 2)) + ets1[2] * abs(R.getAt(2, 0));
	rb = ets2[0] * abs(R.getAt(1, 1)) + ets2[1] * abs(R.getAt(0, 1));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}

	axis = obb1.axis[2].crossProduct(obb2.axis[0]);
	ra = ets1[0] * abs(R.getAt(0, 1)) + ets1[1] * abs(R.getAt(0, 0));
	rb = ets2[1] * abs(R.getAt(2, 2)) + ets2[2] * abs(R.getAt(1, 2));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}

// ---------------02----------
	axis = obb1.axis[2].crossProduct(obb2.axis[1]);
	ra = ets1[0] * abs(R.getAt(1, 1)) + ets1[1] * abs(R.getAt(1, 0));
	rb = ets2[0] * abs(R.getAt(2, 2)) + ets2[2] * abs(R.getAt(0, 2));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}

	axis = obb1.axis[2].crossProduct(obb2.axis[2]);
	ra = ets1[0] * abs(R.getAt(2, 1)) + ets1[1] * abs(R.getAt(2, 0));
	rb = ets2[0] * abs(R.getAt(1, 2)) + ets2[1] * abs(R.getAt(0, 2));
	if (abs(t.dot(axis)) > (ra + rb))
	{
		return false;
	}

	return true;
}

int main()
{
	// 创建两个OBB包围盒
	OBB obb1, obb2;

	// 设置obb1包围盒参数
	obb1.center = Vector3f(0, 0, 0);
	obb1.axis[0] = Vector3f(1, 0, 0);
	obb1.axis[1] = Vector3f(0, 1, 0);
	obb1.axis[2] = Vector3f(0, 0, 1);
	obb1.extent = Vector3f(1, 1, 1);

	// 设置obb2包围盒参数
	obb2.center = Vector3f(2, 2, 2);
	obb2.axis[0] = Vector3f(1, 0, 0);
	obb2.axis[1] = Vector3f(0, 1, 0);
	obb2.axis[2] = Vector3f(0, 0, 1);
	obb2.extent = Vector3f(1, 1, 1);

	// 判断两个包围盒是否相交
	bool intersect = obbIntersect(obb1, obb2);

	// 输出结果
	if (intersect)
	{
		std::cout << "The two OBBs intersect!" << std::endl;
	}
	else
	{
		std::cout << "The two OBBs do not intersect!" << std::endl;
	}

	return 0;
}

	*/
	/*
	bool intersect(const OBB& ob) const {
		Vec3 T = ob.center - center;

		double ra, rb;

		// 测试第一个盒子的轴
		for (int i = 0; i < 3; ++i) {
			ra = extent[i];
			rb = ob.extent.dot(abs(axis[i]));

			if (abs(T.dot(axis[i])) > (ra + rb)) {
				return false;
			}
		}

		// 测试第二个盒子的轴
		for (int i = 0; i < 3; ++i) {
			ra = extent.dot(abs(ob.axis[i]));
			rb = ob.extent[i];

			if (abs(T.dot(ob.axis[i])) > (ra + rb)) {
				return false;
			}
		}

		// 测试第一个盒子的三个轴和第二个盒子的三个轴的组合
		for (int i = 0; i < 3; ++i) {
			for (int j = 0; j < 3; ++j) {
				if (i == j) continue;

				Vec3 axis1 = axis[i];
				Vec3 axis2 = ob.axis[j];

				ra = extent[i] * abs(axis1.dot(T.crossProduct(axis2)));
				rb = ob.extent[j] * abs(axis2.dot(T.crossProduct(axis1)));

				if (abs(T.dot(axis1.crossProduct(axis2))) > (ra + rb)) {
					return false;
				}
			}
		}

		return true;
	}
	//*/
}

export default OBB;
