/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import AbsGeomBase from "../../vox/geom/AbsGeomBase";
import RadialLine from "../../vox/geom/RadialLine";
import StraightLine from "../../vox/geom/StraightLine";

class Plane extends AbsGeomBase {
	static IntersectBoo: boolean = false;
	static IntersectSatus: number = 0;
	nv: Vector3D = new Vector3D(0.0, 1.0, 0.0);
	distance: number = 0.0;
	intersectBoo: boolean = false;
	intersectStraightLinePos(straightL: StraightLine, outV: Vector3D): number {

		// intersection or parallel
		let td = this.nv.dot(straightL.tv);
		if (td > MathConst.MATH_MIN_POSITIVE || td < MathConst.MATH_MAX_NEGATIVE) {
			// intersection
			let dis = this.nv.dot(straightL.position) - this.distance;

			outV.x = straightL.tv.x * 100000.0 + straightL.position.x;
			outV.y = straightL.tv.y * 100000.0 + straightL.position.y;
			outV.z = straightL.tv.z * 100000.0 + straightL.position.z;
			//
			td = this.nv.dot(outV) - this.distance;

			td = dis / (dis - td);

			outV.subtractBy(straightL.position);
			outV.scaleBy(td);
			outV.addBy(straightL.position);
			return 1;
		}
		td = this.nv.dot(straightL.position) - this.distance;
		if (td <= MathConst.MATH_MIN_POSITIVE || td >= MathConst.MATH_MAX_NEGATIVE) {
			// plane contains line
			outV.copyFrom(straightL.position);
			return 2;
		}

		return 0;
	}
	intersectStraightLinePos2(sl_pos: Vector3D, sl_tv: Vector3D, outV: Vector3D): number {
		// intersection or parallel
		let td: number = this.nv.dot(sl_tv);
		if (td > MathConst.MATH_MIN_POSITIVE || td < MathConst.MATH_MAX_NEGATIVE) {
			// intersection
			let dis = this.nv.dot(sl_pos) - this.distance;

			outV.x = sl_tv.x * 100000.0 + sl_pos.x;
			outV.y = sl_tv.y * 100000.0 + sl_pos.y;
			outV.z = sl_tv.z * 100000.0 + sl_pos.z;
			//
			td = this.nv.dot(outV) - this.distance;

			td = dis / (dis - td);

			outV.subtractBy(sl_pos);
			outV.scaleBy(td);
			outV.addBy(sl_pos);
			return 1;
		}
		td = this.nv.dot(sl_pos) - this.distance;
		if (td <= MathConst.MATH_MIN_POSITIVE || td >= MathConst.MATH_MAX_NEGATIVE) {
			// plane contains line
			outV.copyFrom(sl_pos);
			return 2;
		}

		return 0;
	}
	intersectRadialLinePos(radL: RadialLine, outV: Vector3D): number {
		let dis: number = this.nv.dot(radL.position) - this.distance;
		if (dis > MathConst.MATH_MIN_POSITIVE) {
			// radL position in plane positive space
			let td: number = this.nv.dot(radL.tv);
			if (td < 0.0) {
				// calc intersection position
				return this.intersectStraightLinePos2(radL.position, radL.tv, outV);
			}
		}
		else if (dis < MathConst.MATH_MAX_NEGATIVE) {
			// radL position in plane negative space
			let td2: number = this.nv.dot(radL.tv);
			if (td2 > 0.0) {
				// calc intersection position
				return this.intersectStraightLinePos2(radL.position, radL.tv, outV);
			}
		}
		else {
			let td3: number = this.nv.dot(radL.tv);
			if (td3 > MathConst.MATH_MIN_POSITIVE || td3 < MathConst.MATH_MAX_NEGATIVE) {
				outV.copyFrom(radL.position);
				return 1;
			}
			outV.copyFrom(radL.position);
			return 2;
		}
		return -1;
	}
	intersectRadialLinePos2(rl_pos: Vector3D, rl_tv: Vector3D, outV: Vector3D): number {
		let dis: number = this.nv.dot(rl_pos) - this.distance;
		if (dis > MathConst.MATH_MIN_POSITIVE) {
			// radL position in plane positive space
			let td: number = this.nv.dot(rl_tv);
			if (td < 0.0) {
				// calc intersection position
				return this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
			}
		}
		else if (dis < MathConst.MATH_MAX_NEGATIVE) {
			// radL position in plane negative space
			let td: number = this.nv.dot(rl_tv);
			if (td > 0.0) {
				// calc intersection position
				return this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
			}
		}
		else {
			let td3: number = this.nv.dot(rl_tv);
			if (td3 > MathConst.MATH_MIN_POSITIVE || td3 < MathConst.MATH_MAX_NEGATIVE) {
				outV.copyFrom(rl_pos);
				return 1;
			}
			outV.copyFrom(rl_pos);
			return 2;
		}

		return -1;
	}
	containsPoint(pos: Vector3D): number {
		let f: number = this.nv.dot(pos) - this.distance;
		if (f > MathConst.MATH_MIN_POSITIVE) {
			return 1;
		} else if (f < MathConst.MATH_MAX_NEGATIVE) {
			return -1;
		}
		return 0;
	}
	intersectSphere(cv: Vector3D, radius: number): number {
		this.intersectBoo = false;
		let f: number = this.nv.dot(cv) - this.distance;
		if (f > MathConst.MATH_MIN_POSITIVE) {
			this.intersectBoo = f <= radius;
			return 1;
		} else if (f < MathConst.MATH_MAX_NEGATIVE) {
			this.intersectBoo = -f <= radius;
			return -1;
		}
		return 0;
	}
	intersectAABB(minV: Vector3D, maxV: Vector3D): number {

		this.intersectBoo = false;

		let pv: Vector3D = AbsGeomBase.__tV0;
		
		pv.setXYZ(maxV.x, minV.y, maxV.z);
		let flag: number = this.containsPoint( pv );
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

		this.intersectBoo = flag < 8;
		if(flag < -7) return -1;
		if(flag > 7) return 1;		
		return 0;
	}
	// 判断一个球体是否和一个平面的负空间相交
	intersectSphNegSpace(cv: Vector3D, radius: number): void {
		//this.intersectBoo = (this.nv.dot(cv) - this.distance - radius) < MathConst.MATH_MIN_POSITIVE;				
		//this.intersectBoo = (this.nv.dot(cv) - this.distance) < radius;				
		this.intersectBoo = (Math.abs(this.nv.dot(cv) - this.distance) < radius);
	}
	update(): void {
		this.nv.normalize();
	}
	updateFast(): void {
		this.nv.normalize();
	}

	static PlaneIntersectSphere(pnv: Vector3D, pdis: number, cv: Vector3D, radius: number): void {
		Plane.IntersectBoo = false;
		Plane.IntersectSatus = 0;
		pdis = pnv.dot(cv) - pdis;
		if (pdis > MathConst.MATH_MIN_POSITIVE) {
			Plane.IntersectBoo = pdis <= radius;
			Plane.IntersectSatus = 1;
		} else if (pdis < MathConst.MATH_MAX_NEGATIVE) {
			Plane.IntersectBoo = -pdis <= radius;
			Plane.IntersectSatus = -1;
		}
	}
	static CalcPVCloseV(plane: Plane, posV: Vector3D, outV: Vector3D): void {
		let value: number = plane.distance - posV.dot(plane.nv);
		outV.setTo(value * plane.nv.x, value * plane.nv.y, value * plane.nv.z);
		outV.addBy(posV);
	}
	static CalcPVCloseV2(pnv: Vector3D, pd: number, posV: Vector3D, outV: Vector3D): void {
		let value: number = pd - posV.dot(pnv);
		outV.setTo(value * pnv.x, value * pnv.y, value * pnv.z);
		//outV.scaleBy(value);
		outV.addBy(posV);
	}
	static IntersectionSLV2(planeNV: Vector3D, planeDis: number, sl_pos: Vector3D, sl_tv: Vector3D, outV: Vector3D): number {
		// intersection or parallel
		let td: number = planeNV.dot(sl_tv);
		if (td > MathConst.MATH_MIN_POSITIVE || td < MathConst.MATH_MAX_NEGATIVE) {
			// intersection
			let dis: number = planeNV.dot(sl_pos) - planeDis;
			outV.x = sl_tv.x * 100000.0 + sl_pos.x;
			outV.y = sl_tv.y * 100000.0 + sl_pos.y;
			outV.z = sl_tv.z * 100000.0 + sl_pos.z;
			//
			td = planeNV.dot(outV) - planeDis;
			td = dis / (dis - td);
			outV.subtractBy(sl_pos);
			outV.scaleBy(td);
			outV.addBy(sl_pos);
			return 1;
		}
		td = planeNV.dot(sl_pos) - planeDis;
		if (td <= MathConst.MATH_MIN_POSITIVE || td >= MathConst.MATH_MAX_NEGATIVE) {
			// plane contains line
			outV.copyFrom(sl_pos);
			return 2;
		}
		return 0;
	}
	toString(): string {
		return "Plane(position=" + this.position.toString() + ", nv=" + this.nv.toString() + ")";
	}
}
export default Plane;