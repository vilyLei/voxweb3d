/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

//import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as AbsGeomBaseT from "../../vox/geom/AbsGeomBase";

//import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import AbsGeomBase = AbsGeomBaseT.vox.geom.AbsGeomBase;

export namespace vox
{
    export namespace geom
    {
		export class Sphere extends AbsGeomBase
		{
			radius:number = 100.0;
			
			static __sphAv:Vector3D = new Vector3D();
			static __sphBv:Vector3D = new Vector3D();
			/**
			 * 判定射线是否和球体相交,如果相交则将距离射线起点最近的交点记录在 outV 中
			 * @param			lpv			直线上的一点
			 * @param			ltv			直线的切向
			 * @param			spCV		球心点
			 * @param			spRadius	球体半径
			 * @param			outV		存放距离射线发射点最近的这个点
			 * @return			返回 true 表示相交, 返回false 表示不相交
			 * */
			static IntersectionRLByV2(lpv:Vector3D, ltv:Vector3D, spCV:Vector3D,spRadius:number,outV:Vector3D):Boolean
			{
				let bv:Vector3D = Sphere.__sphBv;
				bv.copyFrom(spCV);
				bv.subtractBy(lpv);
				// 判定lpv是否包含在球体内
				spRadius *= spRadius;
				if(bv.getLengthSquared() <= spRadius)
				{
					outV.copyFrom(lpv);
					return true;
				}
				if(bv.dot(ltv) > 0.0)
				{
					outV.x = spCV.x - lpv.x;
					outV.y = spCV.y - lpv.y;
					outV.z = spCV.z - lpv.z;
					let f:number = outV.dot(ltv);
					outV.x = f * ltv.x + lpv.x;
					outV.y = f * ltv.y + lpv.y;
					outV.z = f * ltv.z + lpv.z;
					
					bv.copyFrom(outV);
					bv.subtractBy(spCV);
					f = bv.getLengthSquared();
					if (f <= spRadius) {
						// outV 是射线上的点
						bv.copyFrom(ltv);
						// 因为这里是直角三角形，所以才这么计算(已知斜边和距离最近的两点之间的直角边)
						f = Math.sqrt(spRadius - f);
						bv.scaleBy(f);
						outV.subtractBy(bv);
						return true;
					}
				}
				return false;
			}
			/**
			 * 判定射线是否和球体相交,如果相交则将距离射线起点最近的交点记录在 outV 中
			 * @param			lpv			直线上的一点
			 * @param			ltv			直线的切向
			 * @param			spCV		球心点
			 * @param			spRadius	球体半径
			 * @param			outV		存放距离射线发射点最近的这个点
			 * @param			outV		如果有两个交点存放距离射线发射点较远的这个点
			 * @return			返回 true 表示相交, 返回false 表示不相交
			 * */
			static IntersectionTwoRLByV2(lpv:Vector3D, ltv:Vector3D, spCV:Vector3D,spRadius:number,outV:Vector3D,outV2:Vector3D):Boolean
			{
				let bv:Vector3D = Sphere.__sphBv;
				bv.copyFrom(spCV);
				bv.subtractBy(lpv);
				// 判定lpv是否包含在球体内
				spRadius *= spRadius;
				if(bv.getLengthSquared() <= spRadius)
				{
					outV.copyFrom(lpv);
					return true;
				}
				if(bv.dot(ltv) > 0.0)
				{
					outV.x = spCV.x - lpv.x;
					outV.y = spCV.y - lpv.y;
					outV.z = spCV.z - lpv.z;
					let f:number = outV.dot(ltv);
					outV.x = f * ltv.x + lpv.x;
					outV.y = f * ltv.y + lpv.y;
					outV.z = f * ltv.z + lpv.z;
					
					bv.copyFrom(outV);
					bv.subtractBy(spCV);
					f = bv.getLengthSquared();
					if (f <= spRadius) {
						// outV 是射线上的点
						bv.copyFrom(ltv);
						// 因为这里是直角三角形，所以才这么计算
						f = Math.sqrt(spRadius - f);
						bv.scaleBy(f);
						outV2.copyFrom(outV);
						outV.subtractBy(bv);
						outV2.addBy(bv);
						return true;
					}
				}
				return false;
			}
		}
	}
}