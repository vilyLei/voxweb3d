/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IRayLine from "./IRayLine";
import { isPositiveGreaterZero, isLessPositiveZero } from "./Float";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

let __rlv0: IVector3D = null;
let __rlv1: IVector3D = null;

export default class RayLine implements IRayLine {
	uid: number = -1;
	pos: IVector3D = CoMath.createVec3();
	tv: IVector3D = CoMath.createVec3(1);

	/**
	 * 检测由(rlpv,rltv)构成的射线和两个点(spva, lspvb)表示的线段是否相交
	 * @param rlpv 射线的起点
	 * @param rltv 射线的朝向单位化矢量
	 * @param lspva 线段的起点
	 * @param lspvb 线段的终点
	 * @param outV 如果相交存放交点
	 * @param radius 相交半径, 小于这个半径的距离表示相交
	 * @returns 返回true表示相交
	 */
	static IntersectSegmentLine(
		rlpv: IVector3D,
		rltv: IVector3D,
		lspva: IVector3D,
		lspvb: IVector3D,
		outV: IVector3D,
		radius: number = 1.0
	): boolean {
		if (__rlv0 == null) {
			__rlv0 = CoMath.createVec3();
			__rlv1 = CoMath.createVec3();
		}

		let pv = __rlv0;

		pv.copyFrom(lspvb)
			.subtractBy(lspva)
			.normalize();

		CoMath.Vector3D.Cross(rltv, pv, outV);

		outV.normalize();

		pv.w = outV.dot(rlpv) - outV.dot(lspvb);

		if (Math.abs(pv.w) <= radius) {
			// 两条直线已经相交
			// outV 和 rlpv rltv 计算构成了一个平面
			outV.crossBy(rltv);
			outV.normalize();
			outV.w = outV.dot(rlpv);
			// 计算 lspva 所在的直线与平面的交点
			pv.w = (outV.w - outV.dot(lspva)) / pv.dot(outV);
			outV.copyFrom(pv)
				.scaleBy(pv.w)
				.addBy(lspva);
			pv.copyFrom(outV).subtractBy(lspva);
			const pv1 = __rlv1;
			pv1.copyFrom(outV).subtractBy(lspvb);

			outV.w = 1.0;
			return pv.dot(pv1) <= 0.0;
		}
		return false;
	}

	/**
	 * 检测射线是否和球体相交，如果相交，得到距离起点最近的交点
	 * @param rlpv 射线起点
	 * @param rltv 标准化后射线朝向矢量
	 * @param cv 球心坐标
	 * @param radius 球体半径
	 * @param outV 存放距离起点最近的交点
	 * @returns true表示相交, false表示不相交
	 */
	static IntersectSphereNearPos(rlpv: IVector3D, rltv: IVector3D, cv: IVector3D, radius: number, outV: IVector3D): boolean {
		if (__rlv0 == null) {
			__rlv0 = CoMath.createVec3();
			__rlv1 = CoMath.createVec3();
		}

		let pv = __rlv0;
		pv.x = cv.x - rlpv.x;
		pv.y = cv.y - rlpv.y;
		pv.z = cv.z - rlpv.z;

		pv.w = pv.dot(rltv);
		radius *= radius;
		if (isPositiveGreaterZero(pv.w)) {
			outV.copyFrom(rltv);
			outV.scaleBy(pv.w);
			outV.subtractBy(pv);
			pv.x = outV.getLengthSquared();

			if (pv.x <= radius) {
				// 远距离
				//outV.w = pv.w + Math.sqrt(radius * radius - outV.getLengthSquared());
				// 取近距离
				pv.w -= Math.sqrt(radius - pv.x);
				outV.copyFrom(rltv);
				outV.scaleBy(pv.w);
				outV.addBy(rlpv);
				outV.w = 1.0;
				return true;
			}
		} else if (pv.getLengthSquared() <= radius) {
			outV.copyFrom(rltv);
			outV.scaleBy(pv.w);
			outV.subtractBy(pv);
			pv.x = outV.getLengthSquared();

			if (pv.x <= radius) {
				// 取远距离
				pv.w += Math.sqrt(radius - pv.x);
				outV.copyFrom(rltv);
				outV.scaleBy(pv.w);
				outV.addBy(rlpv);
				outV.w = 1.0;
				return true;
			}
		}
		return false;
	}
	static IntersectSphere(rlpv: IVector3D, rltv: IVector3D, cv: IVector3D, radius: number): boolean {
		if (__rlv0 == null) {
			__rlv0 = CoMath.createVec3();
			__rlv1 = CoMath.createVec3();
		}

		let pv = __rlv0;

		pv.x = cv.x - rlpv.x;
		pv.y = cv.y - rlpv.y;
		pv.z = cv.z - rlpv.z;
		pv.w = pv.dot(rltv);
		if (isLessPositiveZero(pv.w)) {
			return pv.getLengthSquared() <= radius * radius;
		}
		pv.x -= pv.w * rltv.x;
		pv.y -= pv.w * rltv.y;
		pv.z -= pv.w * rltv.z;
		return pv.getLengthSquared() <= radius * radius;
	}

	reset(): void {
		this.pos.setXYZ(0, 0, 0);
		this.tv.setXYZ(1, 0, 0);
	}
	update(): void {
		this.tv.normalize();
	}
}
