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
import LineSegment from "../../vox/geom/LineSegment";
import Plane from "../../vox/geom/Plane";

export class Triangle extends Plane {
	// triangle three vertexes, use ccw sort
	v0: Vector3D = new Vector3D(100.0, 0, 0);
	v1: Vector3D = new Vector3D(0, 0, -100.0);
	v2: Vector3D = new Vector3D(0, 0, 0);
	// triangle three adges: LineSegment ls01, ls12, ls20;
	ls01: LineSegment = new LineSegment();
	ls12: LineSegment = new LineSegment();
	ls20: LineSegment = new LineSegment();
	// bounds sphere squared radius
	radiusSquared: number = 100.0;
	getRandomPosition(outV: Vector3D): void {
		let dis: number = this.ls01.length * Math.random();
		outV.x = this.ls01.position.x + dis * this.ls01.tv.x;
		outV.y = this.ls01.position.y + dis * this.ls01.tv.y;
		outV.z = this.ls01.position.z + dis * this.ls01.tv.z;
		//
		dis = this.ls12.length * Math.random();
		outV.x += this.ls12.position.x + dis * this.ls12.tv.x;
		outV.y += this.ls12.position.y + dis * this.ls12.tv.y;
		outV.z += this.ls12.position.z + dis * this.ls12.tv.z;
		//
		dis = this.ls20.length * Math.random();
		outV.x += this.ls20.position.x + dis * this.ls20.tv.x;
		outV.y += this.ls20.position.y + dis * this.ls20.tv.y;
		outV.z += this.ls20.position.z + dis * this.ls20.tv.z;
		//
		outV.x *= 0.33333;
		outV.y *= 0.33333;
		outV.z *= 0.33333;
	}
	triIntersectStraightLinePos(sL: StraightLine, outV: Vector3D): number {
		let flag: number = this.intersectStraightLinePos(sL, outV);
		if (flag == 1) {
			flag = this.triContainsPoint(outV);
			if (flag > 0)
				return 1;
		}
		else if (flag == 2) {
			// plane contains line
			// test line intersect triangle
		}
		return -1;
	}
	triIntersectRadialLinePos(radL: RadialLine, outV: Vector3D): number {
		let flag: number = this.intersectRadialLinePos(radL, outV);
		if (flag == 1) {
			flag = this.triContainsPoint(outV);
			if (flag > 0)
				return 1;
		}
		//	else if (flag == 2)
		//	{
		//	    // plane contains line
		//	    // test line intersect triangle
		//	}
		return -1;
	}
	triIntersectStraightLinePos2(sl_pos: Vector3D, sl_tv: Vector3D, outV: Vector3D): number {
		let flag: number = this.intersectStraightLinePos2(sl_pos, sl_tv, outV);
		if (flag == 1) {
			flag = this.triContainsPoint(outV);
			if (flag > 0)
				return 1;
		}
		//	else if (flag == 2)
		//	{
		//	    // plane contains line
		//	    // test line intersect triangle
		//	}
		return -1;
	}
	triIntersectRadialLinePos2(rl_pos: Vector3D, rl_tv: Vector3D, outV: Vector3D): number {
		let flag = this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
		if (flag == 1) {
			flag = this.triContainsPoint(outV);
			if (flag > 0)
				return 1;
		}
		//	else if (flag == 2)
		//	{
		//	    // plane contains line
		//	}
		return -1;
	}
	triContainsPoint(pos: Vector3D): number {
		let f: number = this.nv.dot(pos) - this.distance;
		if (f > MathConst.MATH_MIN_POSITIVE || f < MathConst.MATH_MAX_NEGATIVE) {
			return -1;
		}
		//
		AbsGeomBase.__tV0.x = pos.x - this.v0.x;
		AbsGeomBase.__tV0.y = pos.y - this.v0.y;
		AbsGeomBase.__tV0.z = pos.z - this.v0.z;
		Vector3D.Cross(this.ls01.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
		//float f = this.nv.dot(AbsGeomBase.__tV1);
		if (this.nv.dot(AbsGeomBase.__tV1) < 0) {
			return -1;
		}
		AbsGeomBase.__tV0.x = pos.x - this.v1.x;
		AbsGeomBase.__tV0.y = pos.y - this.v1.y;
		AbsGeomBase.__tV0.z = pos.z - this.v1.z;
		Vector3D.Cross(this.ls12.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
		//f = this.nv.dot(AbsGeomBase.__tV1);
		if (this.nv.dot(AbsGeomBase.__tV1) < 0) {
			return -1;
		}
		AbsGeomBase.__tV0.x = pos.x - this.v2.x;
		AbsGeomBase.__tV0.y = pos.y - this.v2.y;
		AbsGeomBase.__tV0.z = pos.z - this.v2.z;
		Vector3D.Cross(this.ls20.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
		//f = this.nv.dot(AbsGeomBase.__tV1);
		if (this.nv.dot(AbsGeomBase.__tV1) < 0) {
			return -1;
		}
		return 1;
	}
	update(): void {
		//
		let k: number = 1.0 / 3.0;
		this.position.x = k * (this.v0.x + this.v1.x + this.v2.x);
		this.position.y = k * (this.v0.y + this.v1.y + this.v2.y);
		this.position.z = k * (this.v0.z + this.v1.z + this.v2.z);
		this.nv.x = this.position.x - this.v0.x;
		this.nv.y = this.position.y - this.v0.y;
		this.nv.z = this.position.z - this.v0.z;
		this.radiusSquared = this.nv.getLengthSquared();
		//
		this.ls01.position.copyFrom(this.v0);
		this.ls01.anotherPosition.copyFrom(this.v1);
		this.ls12.position.copyFrom(this.v1);
		this.ls12.anotherPosition.copyFrom(this.v2);
		this.ls20.position.copyFrom(this.v2);
		this.ls20.anotherPosition.copyFrom(this.v0);
		//trace("tri update center: "+this.position);
		this.ls01.update();
		this.ls12.update();
		this.ls20.update();
		//
		Vector3D.Cross(this.ls01.tv, this.ls12.tv, this.nv);
		this.nv.normalize();
		this.distance = this.nv.dot(this.v0);
		//trace("Triangle::update() nv: ", this.nv,", distance: ", this.distance);
	}
	updateFast(): void {
		this.update();
	}
}
export default Triangle;