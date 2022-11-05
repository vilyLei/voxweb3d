/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import IAABB from "../../vox/geom/IAABB";

class AABB implements IAABB {
	private m_long = 100.0;
	private m_width = 100.0;
	private m_height = 100.0;
	private m_halfLong = 50.0;
	private m_halfWidth = 50.0;
	private m_halfHeight = 50.0;
	private m_tempV = new Vector3D();
	private m_resetFlag = true;
	min = new Vector3D();
	max = new Vector3D();
	version = -1;
	radius = 50;
	radius2 = 2500;
	center = new Vector3D(0.0, 0.0, 0.0);
	constructor() {
		this.reset();
	}
	getLong(): number {
		return this.m_long;
	}
	getWidth(): number {
		return this.m_width;
	}
	getHeight(): number {
		return this.m_height;
	}
	reset(v: Vector3D = null): void {

		const min = this.min;
		const max = this.max;

		this.m_resetFlag = v == null;

		if (v != null) {
			min.copyFrom(v);
			max.copyFrom(v);
		} else {
			v = min;
			v.x = v.y = v.z = MathConst.MATH_MAX_POSITIVE;
			v = max;
			v.x = v.y = v.z = MathConst.MATH_MIN_NEGATIVE;
		}
	}
	equals(ab: IAABB): boolean {
		return this.min.equalsXYZ(ab.min) && this.max.equalsXYZ(ab.max);
	}
	setVolume(width: number, height: number, long: number): void {
		this.m_width = width;
		this.m_height = height;
		this.m_long = long;
		//
		this.m_halfLong = 0.5 * this.m_long;
		this.m_halfWidth = 0.5 * this.m_width;
		this.m_halfHeight = 0.5 * this.m_height;
		//
		this.max.x = this.center.x + this.m_halfWidth;
		this.max.y = this.center.y + this.m_halfHeight;
		this.max.z = this.center.z + this.m_halfLong;
		//
		this.min.x = this.center.x - this.m_halfWidth;
		this.min.y = this.center.y - this.m_halfHeight;
		this.min.z = this.center.z - this.m_halfLong;
		this.radius2 = this.m_halfWidth * this.m_halfWidth + this.m_halfHeight * this.m_halfHeight + this.m_halfLong * this.m_halfLong;
		this.radius = Math.sqrt(this.radius2);
	}
	union(ab: IAABB): AABB {
		this.addPosition(ab.min);
		this.addPosition(ab.max);
		return this;
	}
	addPosition(pv: Vector3D): void {
		// if (this.min.x > pv.x) this.min.x = pv.x;
		// if (this.min.y > pv.y) this.min.y = pv.y;
		// if (this.min.z > pv.z) this.min.z = pv.z;
		// if (this.max.x < pv.x) this.max.x = pv.x;
		// if (this.max.y < pv.y) this.max.y = pv.y;
		// if (this.max.z < pv.z) this.max.z = pv.z;
		this.addXYZ(pv.x, pv.y, pv.z);
	}
	addXYZ(pvx: number, pvy: number, pvz: number): void {
		const min = this.min;
		const max = this.max;
		if (min.x > pvx) min.x = pvx;
		if (max.x < pvx) max.x = pvx;

		if (min.y > pvy) min.y = pvy;
		if (max.y < pvy) max.y = pvy;

		if (min.z > pvz) min.z = pvz;
		if (max.z < pvz) max.z = pvz;

		// let v = this.min.x > pvx ? this.min : this.max;
		// v.x = pvx;
		// v = this.min.y > pvy ? this.min : this.max;
		// v.y = pvy;
		// v = this.min.z > pvz ? this.min : this.max;
		// v.z = pvz;
	}
	/**
	 * must reset a position vector3d object before one time, example: aabb.reset(new Vector3D(1,2,3))
	 */
	addXYZFast(pvx: number, pvy: number, pvz: number): void {
		const min = this.min;
		const max = this.max;
		let v = min.x > pvx ? min : max;
		v.x = pvx;
		v = min.y > pvy ? min : max;
		v.y = pvy;
		v = min.z > pvz ? min : max;
		v.z = pvz;
	}
	addXYZFloat32Arr(vs: Float32Array, step: number = 3): void {

		let len = vs.length;
		let i = 0;
		// let pvx = 0.0;
		// let pvy = 0.0;
		// let pvz = 0.0;
		// const min = this.min;
		// const max = this.max;
		// let v = min;
		// if(this.m_resetFlag) {
		// 	this.m_resetFlag = false;
		// 	min.setXYZ(vs[i], vs[i + 1], vs[i + 2]);
		// 	max.copyFrom(min);
		// 	i += step;
		// }
		for (; i < len;) {
			this.addXYZ(vs[i], vs[i + 1], vs[i + 2]);
			// pvx = vs[i];
			// pvy = vs[i + 1];
			// pvz = vs[i + 2];

			// v = min.x > pvx ? min : max;
			// v.x = pvx;
			// v = min.y > pvy ? min : max;
			// v.y = pvy;
			// v = min.z > pvz ? min : max;
			// v.z = pvz;
			i += step;
			// if (this.min.x > pvx) this.min.x = pvx;
			// if (this.min.y > pvy) this.min.y = pvy;
			// if (this.min.z > pvz) this.min.z = pvz;
			// if (this.max.x < pvx) this.max.x = pvx;
			// if (this.max.y < pvy) this.max.y = pvy;
			// if (this.max.z < pvz) this.max.z = pvz;
		}
	}

	addXYZFloat32AndIndicesArr(vs: Float32Array, indices: Uint16Array | Uint32Array): void {

		let len: number = indices.length;
		let ivs = indices;
		// let pvx: number = 0.0;
		// let pvy: number = 0.0;
		// let pvz: number = 0.0;
		let i: number;
		for (let k = 0; k < len; k++) {
			i = k * 3;
			this.addXYZ(vs[ivs[i++]], vs[ivs[i++]], vs[ivs[i]]);

			// pvx = vs[i++];
			// pvy = vs[i++];
			// pvz = vs[i];
			// if (this.min.x > pvx) this.min.x = pvx;
			// if (this.min.y > pvy) this.min.y = pvy;
			// if (this.min.z > pvz) this.min.z = pvz;
			// if (this.max.x < pvx) this.max.x = pvx;
			// if (this.max.y < pvy) this.max.y = pvy;
			// if (this.max.z < pvz) this.max.z = pvz;
		}
	}
	getClosePosition(in_pos: Vector3D, out_pos: Vector3D, bias: number = 0.0): void {
		out_pos.copyFrom(in_pos);
		if (out_pos.x < this.min.x) {
			out_pos.x = this.min.x + bias;
		}
		else if (out_pos.x > this.max.x) {
			out_pos.x = this.max.x - bias;
		}
		if (out_pos.y < this.min.y) {
			out_pos.y = this.min.y + bias;
		}
		else if (out_pos.y > this.max.y) {
			out_pos.y = this.max.y - bias;
		}
		if (out_pos.z < this.min.z) {
			out_pos.z = this.min.z + bias;
		}
		else if (out_pos.z > this.max.z) {
			out_pos.z = this.max.z - bias;
		}
	}
	// @param	v	Vector3D instance
	containsV(v: Vector3D): boolean {
		if (v.x < this.max.x || v.x > this.max.x) return false;
		if (v.y < this.max.y || v.y > this.max.y) return false;
		if (v.z < this.max.z || v.z > this.max.z) return false;
		return true;
	}
	// 是否包含某一点(同一坐标空间的点)
	containsXY(vx: number, vy: number): boolean {
		if (vx < this.min.x || vx > this.max.x) return false;
		if (vy < this.min.y || vy > this.max.y) return false;
		return true;
	}
	// 是否包含某一点(同一坐标空间的点)
	containsXZ(vx: number, vz: number): boolean {
		if (vx < this.min.x || vx > this.max.x) return false;
		if (vz < this.min.z || vz > this.max.z) return false;
		return true;
	}
	// 是否包含某一点(同一坐标空间的点)
	containsYZ(vy: number, vz: number): boolean {
		if (vy < this.min.y || vy > this.max.y) return false;
		if (vz < this.min.z || vz > this.max.z) return false;
		return true;
	}

	copyFrom(ab: IAABB): AABB {
		//this.setRadius(ab.getRadius());
		this.radius = ab.radius;
		this.radius2 = ab.radius2;
		//this.setRadiusSquared(ab.getRadiusSquared());
		this.min.copyFrom(ab.min);
		this.max.copyFrom(ab.max);
		//this.getOCenter().copyFrom(ab.getOCenter());
		this.center.copyFrom(ab.center);
		this.updateVolume();
		return this;
	}
	expand(bias: Vector3D): AABB {
		this.min.subtractBy(bias);
		this.max.addBy(bias);
		return this;
	}
	updateVolume(): AABB {

		this.m_width = this.max.x - this.min.x;
		this.m_height = this.max.y - this.min.y;
		this.m_long = this.max.z - this.min.z;

		this.m_halfLong = 0.5 * this.m_long;
		this.m_halfWidth = 0.5 * this.m_width;
		this.m_halfHeight = 0.5 * this.m_height;

		++this.version;
		return this;
	}

	private updateThis(): void {

		this.center.x = 0.5 * this.m_width;
		this.center.y = 0.5 * this.m_height;
		this.center.z = 0.5 * this.m_long;

		this.m_halfLong = this.center.z;
		this.m_halfWidth = this.center.x;
		this.m_halfHeight = this.center.y;

		this.radius2 = this.m_halfWidth * this.m_halfWidth + this.m_halfHeight * this.m_halfHeight + this.m_halfLong * this.m_halfLong;
		this.radius = Math.sqrt(this.radius2);

		this.center.addBy(this.min);
		// this.center.x += this.min.x;
		// this.center.y += this.min.y;
		// this.center.z += this.min.z;

		++this.version;
	}
	update(): void {
		// x
		this.m_width = this.max.x;
		if (this.min.x > this.max.x) {
			this.max.x = this.min.x;
			this.min.x = this.m_width;
		}
		this.m_width = this.max.x - this.min.x;
		// y
		this.m_height = this.max.y;
		if (this.min.y > this.max.y) {
			this.max.y = this.min.y;
			this.min.y = this.m_height;
		}
		this.m_height = this.max.y - this.min.y;
		// z
		this.m_long = this.max.z;
		if (this.min.z > this.max.z) {
			this.max.z = this.min.z;
			this.min.z = this.m_long;
		}
		this.m_long = this.max.z - this.min.z;

		this.updateThis();
	}
	updateFast(): void {

		this.m_width = this.max.x - this.min.x;
		this.m_height = this.max.y - this.min.y;
		this.m_long = this.max.z - this.min.z;

		this.updateThis();
	}
	toString(): string {
		return "[AABB(min->" + this.min + ",size(" + this.m_width + "," + this.m_height + "," + this.m_long + "))]";
	}
	// max vecs sphere range intersect calc
	sphereIntersect(centerV: Vector3D, radius: number): boolean {
		this.m_tempV.x = this.center.x - centerV.x;
		this.m_tempV.y = this.center.y - centerV.y;
		this.m_tempV.z = this.center.z - centerV.z;
		let dis: number = this.m_tempV.getLengthSquared();
		if (dis < this.radius2) {
			return true;
		}
		radius += this.radius;
		radius *= radius;
		return radius >= dis;
	}
	/*
	intersectRL(ltv: Vector3D, lpv: Vector3D): boolean {
		let f: number = 0;
		let tmin: number = (this.min.x - lpv.x) / ltv.x;
		let tmax: number = (this.max.x - lpv.x) / ltv.x;
		//console.log("AABB::IntersectRL uses...");
		if (tmin > tmax) {
			f = tmax;
			tmax = tmin;
			tmin = f;
		}
		//	console.log("\n");
		//	console.log("tmin: "+tmin+",tmax: "+tmax);
		let tymin: number = (this.min.y - lpv.y) / ltv.y;
		let tymax: number = (this.max.y - lpv.y) / ltv.y;

		//	console.log("tymin: "+tymin+",tymax: "+tymax);
		if (tymin > tymax) {
			f = tymax;
			tymax = tymin;
			tymin = f;
		}

		if ((tmin > tymax) || (tymin > tmax))
			return false;

		if (tymin > tmin)
			tmin = tymin;

		if (tymax < tmax)
			tmax = tymax;

		let tzmin: number = (this.min.z - lpv.z) / ltv.z;
		let tzmax: number = (this.max.z - lpv.z) / ltv.z;

		//	console.log("tzmin: "+tzmin+",tzmax: "+tzmax);
		//	console.log("\n");
		if (tzmin > tzmax) {
			f = tzmax;
			tzmax = tzmin;
			tzmin = f;
		}

		if ((tmin > tzmax) || (tzmin > tmax))
			return false;

		if (tzmin > tmin)
			tmin = tzmin;

		if (tzmax < tmax)
			tmax = tzmax;
		return true;
	}
	//*/
	/*
	static IntersectionRL3(vecs:Vector3D[],rsigns:Uint8Array,ltInvtv:Vector3D, ltv:Vector3D, lpv:Vector3D,outV:Vector3D):boolean
	{ 
		let tmin:number, tmax:number, tymin:number, tymax:number;//, tzmin:number, tzmax:number; 
		
		tmin = (vecs[rsigns[0]].x - lpv.x) * ltInvtv.x;
		tmax = (vecs[1-rsigns[0]].x - lpv.x) * ltInvtv.x;
		tymin = (vecs[rsigns[1]].y - lpv.y) * ltInvtv.y;
		tymax = (vecs[1-rsigns[1]].y - lpv.y) * ltInvtv.y;
		if ((tmin > tymax) || (tymin > tmax))
			return false;
		if (tymin > tmin)
			tmin = tymin;
		if (tymax < tmax)
			tmax = tymax;
		
		tymin = (vecs[rsigns[2]].z - lpv.z) * ltInvtv.z;
		tymax = (vecs[1-rsigns[2]].z - lpv.z) * ltInvtv.z;			
		if ((tmin > tymax) || (tymin > tmax))
			return false;		
		if (tymin > tmin)
			tmin = tymin;
		if (tymax < tmax)
			tmax = tymax;
			
		outV.copyFrom(ltv);
		outV.scaleBy(tmin);
		outV.addBy(lpv);
		console.log("T Hit outV: "+outV.toString());
		return true; 
	}
	//*/

	/*
	static IntersectionRL3(vecs: Vector3D[], rsigns: Uint8Array, ltInvtv: Vector3D, ltv: Vector3D, lpv: Vector3D, outV: Vector3D): boolean {
		ltInvtv.w = (vecs[rsigns[0]].x - lpv.x) * ltInvtv.x;
		ltv.w = (vecs[1 - rsigns[0]].x - lpv.x) * ltInvtv.x;
		outV.x = (vecs[rsigns[1]].y - lpv.y) * ltInvtv.y;
		outV.y = (vecs[1 - rsigns[1]].y - lpv.y) * ltInvtv.y;
		if ((ltInvtv.w > outV.y) || (outV.x > ltv.w))
			return false;
		if (outV.x > ltInvtv.w)
			ltInvtv.w = outV.x;
		if (outV.y < ltv.w)
			ltv.w = outV.y;

		outV.x = (vecs[rsigns[2]].z - lpv.z) * ltInvtv.z;
		outV.y = (vecs[1 - rsigns[2]].z - lpv.z) * ltInvtv.z;
		if (ltInvtv.w > outV.y || outV.x > ltv.w)
			return false;
		if (outV.x > ltInvtv.w)
			ltInvtv.w = outV.x;
		if (outV.y < ltv.w)
			ltv.w = outV.y;

		outV.copyFrom(ltv);
		outV.scaleBy(ltInvtv.w);
		outV.addBy(lpv);
		ltv.w = 1.0;
		//console.log("T Hit outV: "+outV.toString());
		return true;
	}

	static IntersectionRL1(ltv: Vector3D, lpv: Vector3D, ab: AABB, outV: Vector3D): boolean {
		let f: number = 0;
		let tmin: number = (ab.min.x - lpv.x) / ltv.x;
		let tmax: number = (ab.max.x - lpv.x) / ltv.x;
		//console.log("AABB::IntersectRL uses...");
		if (tmin > tmax) {
			f = tmax;
			tmax = tmin;
			tmin = f;
		}
		//	console.log("\n");
		//	console.log("tmin: "+tmin+",tmax: "+tmax);
		let tymin: number = (ab.min.y - lpv.y) / ltv.y;
		let tymax: number = (ab.max.y - lpv.y) / ltv.y;

		//	console.log("tymin: "+tymin+",tymax: "+tymax);
		if (tymin > tymax) {
			f = tymax;
			tymax = tymin;
			tymin = f;
		}

		if ((tmin > tymax) || (tymin > tmax))
			return false;

		if (tymin > tmin)
			tmin = tymin;

		if (tymax < tmax)
			tmax = tymax;

		let tzmin: number = (ab.min.z - lpv.z) / ltv.z;
		let tzmax: number = (ab.max.z - lpv.z) / ltv.z;

		//	console.log("tzmin: "+tzmin+",tzmax: "+tzmax);
		//	console.log("\n");
		if (tzmin > tzmax) {
			f = tzmax;
			tzmax = tzmin;
			tzmin = f;
		}

		if ((tmin > tzmax) || (tzmin > tmax))
			return false;

		if (tzmin > tmin)
			tmin = tzmin;

		if (tzmax < tmax)
			tmax = tzmax;

		//	console.log("XXXXXXXXX tmin: "+tmin+",tmax: "+tmax);
		outV.copyFrom(ltv);
		outV.scaleBy(tmin);
		outV.addBy(lpv);
		// console.log("L Hit outV: " + outV.toString());
		//outV.copyFrom(ltv);
		//outV.scaleBy(tmax);
		//outV.addBy(lpv);
		//console.log("tmax outV: "+outV.toString());
		return true;
	}
	//*/
	/*
	// 检测射线和AABB是否相交,如果相交计算出交点存放于 outV 中, 这个检测计算是精准高效的
	// @param				ltv		射线的切向
	// @param				lpv		射线上的一点
	// @param				ab		updateFast() 过的 AABB 实例
	// @param				outV	存放交点的 Vector3D实例
	//
	static IntersectionRL2(ltv: Vector3D, lpv: Vector3D, ab: AABB, outV: Vector3D): boolean {
		// 计算包围球
		//let dis:number = StraightLine.CalcPVSquaredDis2(ltv, lpv, ab.center);
		outV.x = ab.center.x - lpv.x;
		outV.y = ab.center.y - lpv.y;
		outV.z = ab.center.z - lpv.z;
		//
		let dis: number = outV.dot(ltv);

		outV.x -= dis * ltv.x;
		outV.y -= dis * ltv.y;
		outV.z -= dis * ltv.z;
		if (outV.getLengthSquared() > ab.radius2) {
			//console.log("Hit shp failure.");
			return false;
		}
		// 包含起点，则一定相交
		if (ab.containsV(lpv)) {
			outV.copyFrom(lpv);
			return true;
		}
		// 确定 x 轴线
		if (lpv.x < ab.min.x) {
			// 说明 起点在 ab 的 -x 侧
			if (ltv.x > 0.0) {
				// 有可能和min x面相交
				dis = (ab.min.x - lpv.x) / ltv.x;
				outV.copyFrom(ltv);
				outV.scaleBy(dis);
				outV.addBy(lpv);
				if (ab.containsYZ(outV.y, outV.z)) {
					return true;
				}
			}
		}
		else if (lpv.x > ab.max.x) {
			// 说明 起点在 ab 的 +x 侧
			if (ltv.x < 0.0) {
				// 有可能和max x面相交
				dis = (ab.max.x - lpv.x) / ltv.x;
				outV.copyFrom(ltv);
				outV.scaleBy(dis);
				outV.addBy(lpv);
				if (ab.containsYZ(outV.y, outV.z)) {
					return true;
				}
			}
		}
		// 确定 y 轴线
		if (lpv.y < ab.min.y) {
			// 说明 起点在 ab 的 -y 侧
			if (ltv.y > 0.0) {
				// 有可能和min y面相交
				dis = (ab.min.y - lpv.y) / ltv.y;
				outV.copyFrom(ltv);
				outV.scaleBy(dis);
				outV.addBy(lpv);
				if (ab.containsXZ(outV.x, outV.z)) {
					return true;
				}
			}
		}
		else if (lpv.y > ab.max.y) {
			// 说明 起点在 ab 的 +y 侧
			if (ltv.y < 0.0) {
				// 有可能和max y面相交
				dis = ab.max.y;
				dis = (ab.max.y - lpv.y) / ltv.y;
				outV.copyFrom(ltv);
				outV.scaleBy(dis);
				outV.addBy(lpv);
				if (ab.containsXZ(outV.x, outV.z)) {
					return true;
				}
			}
		}
		// 确定 z 轴线
		if (lpv.z < ab.min.z) {
			// 说明 起点在 ab 的 -z 侧
			if (ltv.z > 0.0) {
				// 有可能和min y面相交
				dis = (ab.min.z - lpv.z) / ltv.z;
				outV.copyFrom(ltv);
				outV.scaleBy(dis);
				outV.addBy(lpv);
				if (ab.containsXY(outV.x, outV.y)) {
					return true;
				}
			}
		}
		else if (lpv.z > ab.max.z) {
			// 说明 起点在 ab 的 +z 侧
			if (ltv.z < 0.0) {
				// 有可能和max z面相交
				dis = (ab.max.z - lpv.z) / ltv.z;
				outV.copyFrom(ltv);
				outV.scaleBy(dis);
				outV.addBy(lpv);
				if (ab.containsXY(outV.x, outV.y)) {
					return true;
				}
			}
		}

		return false;
	}
	//*/
}

export default AABB;