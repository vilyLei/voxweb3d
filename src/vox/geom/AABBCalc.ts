/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import { IAABB } from "../../vox/geom/IAABB";
class AABBCalc {
	
	IntersectRL(ltv: Vector3D, lpv: Vector3D, ab: IAABB): boolean {
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
		return true;
	}
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

	static IntersectionRL1(ltv: Vector3D, lpv: Vector3D, ab: IAABB, outV: Vector3D): boolean {
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
	//
	// 检测射线和AABB是否相交,如果相交计算出交点存放于 outV 中, 这个检测计算是精准高效的
	// @param				ltv		射线的切向
	// @param				lpv		射线上的一点
	// @param				ab		updateFast() 过的 AABB 实例
	// @param				outV	存放交点的 Vector3D实例
	//
	static IntersectionRL2(ltv: Vector3D, lpv: Vector3D, ab: IAABB, outV: Vector3D): boolean {
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
}

export { AABBCalc }