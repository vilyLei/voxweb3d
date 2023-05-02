/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ILine from "./ILine";
import PlaneUtils from "./PlaneUtils";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

let __llv0: IVector3D = null;
let __llv1: IVector3D = null;
let __llv2: IVector3D = null;
function __buildLLBase(): void {
	if (__llv0 == null) {
		__llv0 = CoMath.createVec3();
		__llv1 = CoMath.createVec3();
		__llv2 = CoMath.createVec3();
	}
}
export default class Line implements ILine {
	uid: number = -1;
	pos: IVector3D = CoMath.createVec3();
	tv: IVector3D = CoMath.createVec3(1);

	/**
	 * 计算空间中一点到空间某直线的距离的平方
	 * @param ltv 空间直线的朝向
	 * @param lpv 空间直线上的某一点
	 * @param spCV 空间中的一点
	 * @returns
	 */
	static CalcPVSquaredDis2(ltv: IVector3D, lpv: IVector3D, spCV: IVector3D): number {
		__buildLLBase();
		let pv = __llv0;
		pv.subVecsTo(spCV, lpv);
		const s = pv.dot(ltv);
		pv.x -= s * ltv.x;
		pv.y -= s * ltv.y;
		pv.z -= s * ltv.z;
		return pv.getLengthSquared();
	}
	/**
	 * 计算空间中一点到空间某直线的距离
	 * @param ltv 空间直线的朝向
	 * @param lpv 空间直线上的某一点
	 * @param spCV 空间中的一点
	 * @returns
	 */
	static CalcPVDis(ltv: IVector3D, lpv: IVector3D, spCV: IVector3D): number {
		return Math.sqrt(Line.CalcPVSquaredDis2(ltv, lpv, spCV));
	}

	/**
	 * 计算空间中一点到空间直线最近的点
	 * @param			lpv		直线上的某一点
	 * @param			ltv		直线的切向
	 * @param			spCV			空间中的一点
	 * */
	static CalcPVCloseV2(lpv: IVector3D, ltv: IVector3D, spCV: IVector3D, outV: IVector3D): void {
		outV.subVecsTo(spCV, lpv);
		const s = outV.dot(ltv);
		outV.x = s * ltv.x + lpv.x;
		outV.y = s * ltv.y + lpv.y;
		outV.z = s * ltv.z + lpv.z;
	}
	/**
	 * calculate intersection point of two straight line in the same plane
	 * @param lapv pv of line a
	 * @param latv tv of line a
	 * @param lbpv pv of line b
	 * @param lbtv tv of line b
	 * @param outV intersection position
	 */
	static IntersectionCopSLV2(lapv: IVector3D, latv: IVector3D, lbpv: IVector3D, lbtv: IVector3D, outV: IVector3D): void {

		__buildLLBase();

		const V3 = CoMath.Vector3D;
		V3.Cross(latv, lbtv, __llv1);
		V3.Cross(latv, __llv1, __llv2);
		__llv2.normalize();
		PlaneUtils.IntersectLinePos2(__llv2, __llv2.dot(lapv), lbpv, lbtv, outV);
	}
	/**
	 * 计算两条异面直线距离最近的点,而且这个点落在空间直线b线上
	 * @param lapv 直线 a 上的一个点
	 * @param latv 直线 a 的朝向
	 * @param lbpv 直线 b 上的一个点
	 * @param lbtv 直线 b 的朝向
	 * @param outV 落于直线 b 上的 最近点
	 */
	static CalcTwoSLCloseV2(lapv: IVector3D, latv: IVector3D, lbpv: IVector3D, lbtv: IVector3D, outV: IVector3D): void {
		__buildLLBase();
		const V3 = CoMath.Vector3D;
		V3.Cross(latv, lbtv, __llv1);
		V3.Cross(latv, __llv1, __llv2);
		__llv2.normalize();
		PlaneUtils.IntersectLinePos2(__llv2, __llv2.dot(lapv), lbpv, lbtv, outV);

		// 计算点在空间直线b上的投影
		outV.subtractBy(lbpv);
		const s = outV.dot(lbtv);
		outV.x = s * lbtv.x + lbpv.x;
		outV.y = s * lbtv.y + lbpv.y;
		outV.z = s * lbtv.z + lbpv.z;
	}
	// 计算两条异面直线距离最近的点,而且这个点落在这两个空间直线上
	static CalcTwoSLDualCloseV2(lapv: IVector3D, latv: IVector3D, lbpv: IVector3D, lbtv: IVector3D, outVa: IVector3D, outVb: IVector3D): void {
		__buildLLBase();
		const V3 = CoMath.Vector3D;
		V3.Cross(latv, lbtv, __llv1);
		V3.Cross(latv, __llv1, __llv2);
		__llv2.normalize();
		PlaneUtils.IntersectLinePos2(__llv2, __llv2.dot(lapv), lbpv, lbtv, outVa);
		outVb.copyFrom(lbpv);
		// 计算点在空间直线a上的投影
		outVa.subtractBy(lapv);
		let s = outVa.dot(latv);
		outVa.x = s * latv.x + lapv.x;
		outVa.y = s * latv.y + lapv.y;
		outVa.z = s * latv.z + lapv.z;
		// 计算点在空间直线b上的投影
		//__llv1.normalize();
		outVb.subtractBy(outVa);
		s = outVb.dot(__llv1);
		outVb.x = s * __llv1.x + outVa.x;
		outVb.y = s * __llv1.y + outVa.y;
		outVb.z = s * __llv1.z + outVa.z;
	}

	reset(): void {
		this.pos.setXYZ(0, 0, 0);
		this.tv.setXYZ(1, 0, 0);
	}
	update(): void {
		this.tv.normalize();
	}
}
