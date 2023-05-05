/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAGeomEntity from "./IAGeomEntity";
import { Intersection } from "./Intersection";
import ILine from "./ILine";
import IRayLine from "./IRayLine";

export default interface IPlane extends IAGeomEntity {

	/**
	 * plane normal
	 */
	nv: IVector3D;
	/**
	 * 相交的状态, 取值于 Intersection
	 */
	intersection: Intersection;
	/**
	 * set plane distance
	 */
	setDistance(dis: number): IPlane;
	/**
	 * get plane distance
	 */
	getDistance(): number;
	setXYZ(px: number, py: number, pz: number): IPlane
	/**
	 * 直线和平面的关系: 平行(parallel)，包含(contain, 也属于hit)，相交(hit)
	 */
	intersectLinePos(line: ILine, outV: IVector3D): boolean;
	/**
	 * 直线和平面的关系: 平行(parallel)，包含(contain, 也属于hit)，相交(hit)
	 */
	intersectLinePos2(sl_pos: IVector3D, sl_tv: IVector3D, outV: IVector3D): boolean;

	intersectRayLinePos(rl: IRayLine, outV: IVector3D): boolean;
	intersectRayLinePos2(rl_pos: IVector3D, rl_tv: IVector3D, outV: IVector3D): boolean;

	containsPoint(pos: IVector3D): Intersection;
	intersectSphere(cv: IVector3D, radius: number): boolean;
	intersectAABB(minV: IVector3D, maxV: IVector3D): boolean;
	/**
	 * 判断一个球体是否和一个平面的负空间相交
	 * @param cv sphere center position
	 * @param radius sphere radius;
	 * @returns intersection yse or no
	 */
	intersectSphNegSpace(cv: IVector3D, radius: number): boolean;
	/**
	 * check whether the plane is the same as this
	 * @param plane a IPlane instance
	 * @returns true or false
	 */
	isEqual(plane: IPlane): boolean;

	/**
	 * check whether the plane is parallel to this
	 * @param plane a IPlane instance
	 * @returns true or false
	 */
	isParallel(plane: IPlane): boolean;

}
