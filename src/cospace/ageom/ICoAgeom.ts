import IVector3D from "../../vox/math/IVector3D";
import ILine from "./base/ILine";

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

interface ICoAGeom {

	Line: CoLine;

	createLine(): ILine;
}
export { ICoAGeom };
