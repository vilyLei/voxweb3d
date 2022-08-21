import IVector3D from "../../vox/math/IVector3D";
import ILine from "./base/ILine";
import IRayLine from "./base/IRayLine";
import ISegmentLine from "./base/ISegmentLine";
import IPlane from "./base/IPlane";
import ISphere from "./base/ISphere";

interface CoLine {
	
	/**
	 * 计算空间中一点到空间某直线的距离的平方
	 * @param ltv 空间直线的朝向
	 * @param lpv 空间直线上的某一点
	 * @param spCV 空间中的一点
	 * @returns
	 */
	CalcPVSquaredDis2(ltv: IVector3D, lpv: IVector3D, spCV: IVector3D): number;
	/**
	 * 计算空间中一点到空间某直线的距离
	 * @param ltv 空间直线的朝向
	 * @param lpv 空间直线上的某一点
	 * @param spCV 空间中的一点
	 * @returns
	 */
	CalcPVDis(ltv: IVector3D, lpv: IVector3D, spCV: IVector3D): number;

	/**
	 * 计算空间中一点到空间直线最近的点
	 * @param			lpv		直线上的某一点
	 * @param			ltv		直线的切向
	 * @param			spCV			空间中的一点
	 * */
	CalcPVCloseV2(lpv: IVector3D, ltv: IVector3D, spCV: IVector3D, outV: IVector3D): void;
	/**
	 * calculate intersection point of two straight line in the same plane
	 * @param lapv pv of line a
	 * @param latv tv of line a
	 * @param lbpv pv of line b
	 * @param lbtv tv of line b
	 * @param outV intersection position
	 */
	IntersectionCopSLV2(lapv: IVector3D, latv: IVector3D, lbpv: IVector3D, lbtv: IVector3D, outV: IVector3D): void;
	/**
	 * 计算两条异面直线距离最近的点,而且这个点落在空间直线b线上
	 * @param lapv 直线 a 上的一个点
	 * @param latv 直线 a 的朝向
	 * @param lbpv 直线 b 上的一个点
	 * @param lbtv 直线 b 的朝向
	 * @param outV 落于直线 b 上的 最近点
	 */
	CalcTwoSLCloseV2(lapv: IVector3D, latv: IVector3D, lbpv: IVector3D, lbtv: IVector3D, outV: IVector3D): void;
	// 计算两条异面直线距离最近的点,而且这个点落在这两个空间直线上
	CalcTwoSLDualCloseV2(lapv: IVector3D, latv: IVector3D, lbpv: IVector3D, lbtv: IVector3D, outVa: IVector3D, outVb: IVector3D): void
}

interface CoRayLine {
	
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
	IntersectSegmentLine(rlpv: IVector3D,rltv: IVector3D,lspva: IVector3D,lspvb: IVector3D,outV: IVector3D,radius?: number): boolean;

	/**
	 * 检测射线是否和球体相交，如果相交，得到距离起点最近的交点
	 * @param rlpv 射线起点
	 * @param rltv 标准化后射线朝向矢量
	 * @param cv 球心坐标
	 * @param radius 球体半径
	 * @param outV 存放距离起点最近的交点
	 * @returns true表示相交, false表示不相交
	 */
	IntersectSphereNearPos(rlpv: IVector3D, rltv: IVector3D, cv: IVector3D, radius: number, outV: IVector3D): boolean;
	IntersectSphere(rlpv: IVector3D, rltv: IVector3D, cv: IVector3D, radius: number): boolean;
}

interface CoPlaneUtils {
	/**
	 * 记录相交的状态
	 */
	readonly Intersection: number;
	CalcPVCloseV(planeNV: IVector3D, planeDis: number, posV: IVector3D, outV: IVector3D): void;
	/**
	 * 直线和平面的关系: 平行(parallel)，包含(contain, 也属于hit)，相交(hit)
	 */
	IntersectLinePos2(pnv: IVector3D, pdis: number, sl_pos: IVector3D, sl_tv: IVector3D, outV: IVector3D): boolean;
}

interface ICoAGeom {

	Line: CoLine;
	RayLine: CoRayLine;
	PlaneUtils: CoPlaneUtils;
	/**
	 * create a algorithm geometry 3D Space Line Instance
	 */
	createLine(): ILine;
	/**
	 * create a algorithm geometry 3D Space Line Instance
	 */
	createRayLine(): IRayLine;
	/**
	 * create a algorithm geometry 3D Space Segment RayLine Instance
	 */
	createSegmentLine(): ISegmentLine;
	/**
	 * create a algorithm geometry 3D Space Plane Instance
	 */
	createPlane(): IPlane;
	/**
	 * create a algorithm geometry 3D Space Sphere Instance
	 */
	createSphere(): ISphere;
}
export { ICoAGeom };
