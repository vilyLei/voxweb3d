/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import AbsGeomBase from "../../vox/geom/AbsGeomBase";
import PlaneCalc from "../../vox/geom/PlaneCalc";

export class StraightLine extends AbsGeomBase {
	static __tAv: Vector3D = new Vector3D();
	tv = new Vector3D(1.0, 0.0, 0.0);
	update() {
		this.tv.normalize();
	}
	updateFast() {
		this.tv.normalize();
	}
	//
	//计算空间中一点到空间某直线的距离的平方
	//@param			ltv	空间直线的切向
	//@param			lpv	空间直线上的某一点
	//@param			spCV		空间中的一点
	//
	static CalcPVSquaredDis2(ltv: Vector3D, lpv: Vector3D, spCV: Vector3D): number {
		let pv: Vector3D = StraightLine.__tAv;
		pv.x = spCV.x - lpv.x;
		pv.y = spCV.y - lpv.y;
		pv.z = spCV.z - lpv.z;
		pv.w = pv.dot(ltv);
		pv.x -= pv.w * ltv.x;
		pv.y -= pv.w * ltv.y;
		pv.z -= pv.w * ltv.z;
		return pv.getLengthSquared();
	}
	//计算空间中一点到空间某直线的距离
	static CalcPVDis(ltv: Vector3D, lpv: Vector3D, spCV: Vector3D): number {
		let pv: Vector3D = StraightLine.__tAv;
		pv.x = spCV.x - lpv.x;
		pv.y = spCV.y - lpv.y;
		pv.z = spCV.z - lpv.z;
		//
		let da: number = pv.dot(ltv);
		pv.x = da * ltv.x + lpv.x;
		pv.y = da * ltv.y + lpv.y;
		pv.z = da * ltv.z + lpv.z;
		//
		pv.x = spCV.x - pv.x;
		pv.y = spCV.y - pv.y;
		pv.z = spCV.z - pv.z;
		return pv.getLength();
	}

	/**
	 * 计算空间中一点到空间直线最近的点
	 * @param			lpv		直线上的某一点
	 * @param			ltv		直线的切向
	 * @param			spCV			空间中的一点
	 * */
	static CalcPVCloseV2(lpv: Vector3D, ltv: Vector3D, spCV: Vector3D, outV: Vector3D): void {
		outV.x = spCV.x - lpv.x;
		outV.y = spCV.y - lpv.y;
		outV.z = spCV.z - lpv.z;
		let da: number = outV.dot(ltv);
		outV.x = da * ltv.x + lpv.x;
		outV.y = da * ltv.y + lpv.y;
		outV.z = da * ltv.z + lpv.z;
	}
	/**
	 * calculate intersection point of two straight line in the same plane
	 * @param lapv pv of line a
	 * @param latv tv of line a
	 * @param lbpv pv of line b
	 * @param lbtv tv of line b
	 * @param outV intersection position
	 */
	static IntersectionCopSLV2(lapv: Vector3D, latv: Vector3D, lbpv: Vector3D, lbtv: Vector3D, outV: Vector3D): void {
		Vector3D.Cross(latv, lbtv, AbsGeomBase.__tV1);
		Vector3D.Cross(latv, AbsGeomBase.__tV1, AbsGeomBase.__tV2);
		AbsGeomBase.__tV2.normalize();
		PlaneCalc.IntersectionSLV2(AbsGeomBase.__tV2, AbsGeomBase.__tV2.dot(lapv), lbpv, lbtv, outV);
	}
	/**
	 * 计算两条异面直线距离最近的点,而且这个点落在空间直线b线上
	 * @param lapv 直线 a 上的一个点
	 * @param latv 直线 a 的朝向
	 * @param lbpv 直线 b 上的一个点
	 * @param lbtv 直线 b 的朝向
	 * @param outV 落于直线 b 上的 最近点
	 */
	static CalcTwoSLCloseV2(lapv: Vector3D, latv: Vector3D, lbpv: Vector3D, lbtv: Vector3D, outV: Vector3D): void {
		Vector3D.Cross(latv, lbtv, AbsGeomBase.__tV1);
		Vector3D.Cross(latv, AbsGeomBase.__tV1, AbsGeomBase.__tV2);
		AbsGeomBase.__tV2.normalize();
		PlaneCalc.IntersectionSLV2(AbsGeomBase.__tV2, AbsGeomBase.__tV2.dot(lapv), lbpv, lbtv, outV);
		//	// 计算点在空间直线a上的投影
		//	outV.subtractBy(lapv);
		//	outV.w = outV.dot(latv);
		//	outV.x = outV.w * latv.x + lapv.x;
		//	outV.y = outV.w * latv.y + lapv.y;
		//	outV.z = outV.w * latv.z + lapv.z;
		//	outV.w = 1.0;

		// 计算点在空间直线b上的投影
		outV.subtractBy(lbpv);
		outV.w = outV.dot(lbtv);
		outV.x = outV.w * lbtv.x + lbpv.x;
		outV.y = outV.w * lbtv.y + lbpv.y;
		outV.z = outV.w * lbtv.z + lbpv.z;
		outV.w = 1.0;
	}
	// 计算两条异面直线距离最近的点,而且这个点落在这两个空间直线上
	static CalcTwoSLDualCloseV2(lapv: Vector3D, latv: Vector3D, lbpv: Vector3D, lbtv: Vector3D, outVa: Vector3D, outVb: Vector3D): void {
		Vector3D.Cross(latv, lbtv, AbsGeomBase.__tV1);
		Vector3D.Cross(latv, AbsGeomBase.__tV1, AbsGeomBase.__tV2);
		AbsGeomBase.__tV2.normalize();
		PlaneCalc.IntersectionSLV2(AbsGeomBase.__tV2, AbsGeomBase.__tV2.dot(lapv), lbpv, lbtv, outVa);
		outVb.copyFrom(lbpv);
		// 计算点在空间直线a上的投影
		outVa.subtractBy(lapv);
		outVa.w = outVa.dot(latv);
		outVa.x = outVa.w * latv.x + lapv.x;
		outVa.y = outVa.w * latv.y + lapv.y;
		outVa.z = outVa.w * latv.z + lapv.z;
		outVa.w = 1.0;
		// 计算点在空间直线b上的投影
		//AbsGeomBase.__tV1.normalize();
		outVb.subtractBy(outVa);
		outVb.w = outVb.dot(AbsGeomBase.__tV1);
		outVb.x = outVb.w * AbsGeomBase.__tV1.x + outVa.x;
		outVb.y = outVb.w * AbsGeomBase.__tV1.y + outVa.y;
		outVb.z = outVb.w * AbsGeomBase.__tV1.z + outVa.z;
		outVb.w = 1.0;
	}
}

export default StraightLine;