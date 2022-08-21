/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import { Intersection } from "./Intersection";

import { isZero, isNotZero } from "../../../vox/math/Float";

class PlaneUtils {
	/**
	 * 记录相交的状态
	 */
	static Intersection: Intersection = Intersection.None;
	static CalcPVCloseV(planeNV: IVector3D, planeDis: number, posV: IVector3D, outV: IVector3D): void {
		let value = planeDis - posV.dot(planeNV);
		outV.setTo(value * planeNV.x, value * planeNV.y, value * planeNV.z);
		outV.addBy(posV);
	}
	/**
	 * 直线和平面的关系: 平行(parallel)，包含(contain, 也属于hit)，相交(hit)
	 */
	static IntersectLinePos2(pnv: IVector3D, pdis: number, sl_pos: IVector3D, sl_tv: IVector3D, outV: IVector3D): boolean {

		PlaneUtils.Intersection = Intersection.None;
		// intersection or parallel
		let td = pnv.dot(sl_tv);
		if (isNotZero(td)) {
			// intersection
			let m_dis = pnv.dot(sl_pos) - pdis;

			outV.x = sl_tv.x * 100000.0 + sl_pos.x;
			outV.y = sl_tv.y * 100000.0 + sl_pos.y;
			outV.z = sl_tv.z * 100000.0 + sl_pos.z;
			//
			td = pnv.dot(outV) - pdis;

			td = m_dis / (m_dis - td);

			outV.subtractBy(sl_pos);
			outV.scaleBy(td);
			outV.addBy(sl_pos);
			PlaneUtils.Intersection = Intersection.Hit;
			return true;
		}
		td = pnv.dot(sl_pos) - pdis;
		if (isZero(td)) {
			// plane contains line
			outV.copyFrom(sl_pos);
			// 平行且包含
			PlaneUtils.Intersection = Intersection.Contain;
			return true;
		}
		PlaneUtils.Intersection = Intersection.parallel;
		return false;
	}
}

export default PlaneUtils;
