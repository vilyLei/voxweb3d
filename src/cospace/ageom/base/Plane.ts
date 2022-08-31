/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IPlane from "./IPlane";
import ILine from "./ILine";
import IRayLine from "./IRayLine";
import { isZero, isNotZero, isGreaterPositiveZero, isLessNegativeZero, isPostiveZero } from "../../../vox/math/Float";

import PlaneUtils from "./PlaneUtils";

import { Intersection } from "./Intersection";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

let __plv0: IVector3D = null;

export default class Plane implements IPlane {


	/**
	 * plane distance
	 */
	private m_dis: number = 0;

	uid: number = -1;
	pos: IVector3D = CoMath.createVec3();

	/**
	 * plane normal
	 */
	nv: IVector3D = CoMath.createVec3(1);
	/**
	 * 相交的状态
	 */
	intersection: Intersection = Intersection.None;

	/**
	 * set plane distance
	 */
	setDistance(dis: number): IPlane {
		this.m_dis = dis;
		this.nv.normalize();
		this.pos.copyFrom(this.nv).scaleBy(dis);
		return this;
	}
	/**
	 * get plane distance
	 */
	getDistance(): number {
		return this.m_dis;
	}
	setXYZ(px: number, py: number, pz: number): IPlane {
		this.pos.setXYZ(px,py,pz);
		this.nv.normalize();
		this.m_dis = this.nv.dot(this.pos);
		return this;
	}
	/**
	 * 直线和平面的关系: 平行(parallel)，包含(contain, 也属于hit)，相交(hit)
	 */
	intersectLinePos(line: ILine, outV: IVector3D): boolean {

		this.intersection = Intersection.None;
		// intersection or parallel
		let td = this.nv.dot(line.tv);
		if (isNotZero(td)) {
			// intersection
			let m_dis = this.nv.dot(line.pos) - this.m_dis;

			outV.x = line.tv.x * 100000.0 + line.pos.x;
			outV.y = line.tv.y * 100000.0 + line.pos.y;
			outV.z = line.tv.z * 100000.0 + line.pos.z;
			//
			td = this.nv.dot(outV) - this.m_dis;

			td = m_dis / (m_dis - td);

			outV.subtractBy(line.pos);
			outV.scaleBy(td);
			outV.addBy(line.pos);
			this.intersection = Intersection.Hit;
			return true;
		}
		td = this.nv.dot(line.pos) - this.m_dis;
		if (isZero(td)) {
			// plane contains line
			outV.copyFrom(line.pos);
			// 平行且包含
			this.intersection = Intersection.Contain;
			return true;
		}
		this.intersection = Intersection.parallel;

		return false;
	}
	/**
	 * 直线和平面的关系: 平行(parallel)，包含(contain, 也属于hit)，相交(hit)
	 */
	intersectLinePos2(sl_pos: IVector3D, sl_tv: IVector3D, outV: IVector3D): boolean {

		let flag = PlaneUtils.IntersectLinePos2(this.nv, this.m_dis, sl_pos, sl_tv, outV);
		this.intersection = PlaneUtils.Intersection;
		return flag;
	}

	intersectRayLinePos(rl: IRayLine, outV: IVector3D): boolean {

		this.intersection = Intersection.None;
		let td = this.nv.dot(rl.pos) - this.m_dis;

		if (isGreaterPositiveZero(td)) {
			// rl position in plane positive space
			td = this.nv.dot(rl.tv);
			if (td < 0.0) {
				// calc intersection position
				return this.intersectLinePos2(rl.pos, rl.tv, outV);
			}
		}
		else if (isLessNegativeZero(td)) {
			// rl position in plane negative space
			td = this.nv.dot(rl.tv);
			if (td > 0.0) {
				// calc intersection position
				return this.intersectLinePos2(rl.pos, rl.tv, outV);
			}
		}
		else {
			td = this.nv.dot(rl.tv);
			if (isNotZero(td)) {
				outV.copyFrom(rl.pos);
				this.intersection = Intersection.Hit;
				return true;
			}
			outV.copyFrom(rl.pos);
			// 平行且包含
			this.intersection = Intersection.Contain;
			return true;
		}
		if(isPostiveZero( td )) {
			this.intersection = Intersection.parallel;
		}
		return false;
	}
	intersectRayLinePos2(rl_pos: IVector3D, rl_tv: IVector3D, outV: IVector3D): boolean {

		this.intersection = Intersection.None;
		let td: number;
		let dis = this.nv.dot(rl_pos) - this.m_dis;
		if (isGreaterPositiveZero(dis)) {
			// rl position in plane positive space
			td = this.nv.dot(rl_tv);
			if (td < 0.0) {
				// calc intersection position
				return this.intersectLinePos2(rl_pos, rl_tv, outV);
			}
		}
		else if (isLessNegativeZero(dis)) {
			// rl position in plane negative space
			td = this.nv.dot(rl_tv);
			if (td > 0.0) {
				// calc intersection position
				return this.intersectLinePos2(rl_pos, rl_tv, outV);
			}
		}
		else {
			td = this.nv.dot(rl_tv);
			if (isNotZero(td)) {
				outV.copyFrom(rl_pos);
				this.intersection = Intersection.Hit;
				return true;
			}
			outV.copyFrom(rl_pos);
			// 平行且包含
			this.intersection = Intersection.Contain;
			return true;
		}

		if(isPostiveZero( td )) {
			this.intersection = Intersection.parallel;
		}
		return false;
	}

	containsPoint(pos: IVector3D): Intersection {

		let f = this.nv.dot(pos) - this.m_dis;
		if (isGreaterPositiveZero(f)) {
			return Intersection.Positive;
		} else if (isLessNegativeZero(f)) {
			return Intersection.Negative;
		}
		return Intersection.Hit;
	}
	intersectSphere(cv: IVector3D, radius: number): boolean {

		this.intersection = Intersection.None;
		let boo = false;
		let f = this.nv.dot(cv) - this.m_dis;
		if (isGreaterPositiveZero(f)) {
			boo = f <= radius;
			this.intersection = Intersection.Positive;
		} else if (isLessNegativeZero(f)) {
			boo = -f <= radius;
			this.intersection = Intersection.Negative;
		}else {
			this.intersection = Intersection.Hit;
			boo = true;
		}
		return boo;
	}
	intersectAABB(minV: IVector3D, maxV: IVector3D): boolean {

		this.intersection = Intersection.None;
		if(__plv0 == null) {
			__plv0 = CoMath.createVec3();
		}

		let pv = __plv0;

		pv.setXYZ(maxV.x, minV.y, maxV.z);
		let flag = this.containsPoint( pv );
		pv.setXYZ(maxV.x, minV.y, minV.z);
		flag += this.containsPoint( pv );
        pv.setXYZ(minV.x, minV.y, minV.z);
		flag += this.containsPoint( pv );
        pv.setXYZ(minV.x, minV.y, maxV.z);
		flag += this.containsPoint( pv );

        pv.setXYZ(maxV.x, maxV.y, maxV.z);
		flag += this.containsPoint( pv );
        pv.setXYZ(maxV.x, maxV.y, minV.z);
		flag += this.containsPoint( pv );
        pv.setXYZ(minV.x, maxV.y, minV.z);
		flag += this.containsPoint( pv );
        pv.setXYZ(minV.x, maxV.y, maxV.z);
		flag += this.containsPoint( pv );

		if(flag < -7) this.intersection = Intersection.Negative;
		else if(flag > 7) this.intersection = Intersection.Positive;
		else {
			this.intersection = Intersection.Hit;
		}
		return flag < 8;;
	}
	/**
	 * 判断一个球体是否和一个平面的负空间相交
	 * @param cv sphere center position
	 * @param radius sphere radius;
	 * @returns intersection yse or no
	 */
	intersectSphNegSpace(cv: IVector3D, radius: number): boolean {
		return Math.abs(this.nv.dot(cv) - this.m_dis) < radius;
	}
	/**
	 * check whether the plane is the same as this
	 * @param plane a IPlane instance
	 * @returns true or false
	 */
	isEqual(plane: IPlane): boolean {
		let d = plane.getDistance() - this.m_dis;
		if(isZero(d)) {
			d = plane.nv.dot(this.nv);
			return isPostiveZero( d );
		}
		return false;
	}

	/**
	 * check whether the plane is parallel to this
	 * @param plane a IPlane instance
	 * @returns true or false
	 */
	isParallel(plane: IPlane): boolean {
		return isPostiveZero( plane.nv.dot(this.nv));
	}

	reset(): void {
		this.nv.setXYZ(1,0,0);
		this.pos.setXYZ(0,0,0);
		this.m_dis = 0;
		this.intersection = Intersection.None;
	}
	update(): void {
		this.nv.normalize();
		this.m_dis = this.nv.dot(this.pos);
	}
}
