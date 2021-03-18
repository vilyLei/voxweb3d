/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3DT from "../../vox/math/Vector3D";
import * as AbsGeomBaseT from "../../vox/geom/AbsGeomBase";
import * as PlaneCalcT from "../../vox/geom/PlaneCalc";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import AbsGeomBase = AbsGeomBaseT.vox.geom.AbsGeomBase;
import PlaneCalc = PlaneCalcT.vox.geom.PlaneCalc;

export namespace vox
{
    export namespace geom
    {
		
		export class RadialLine extends AbsGeomBase
		{
			static __tAv:Vector3D = new Vector3D();
			tv:Vector3D = new Vector3D(1.0,0.0,0.0);
			
			update():void
			{
				this.tv.normalize();
			}
			updateFast():void
			{
				this.tv.normalize();
			}
			// 射线和三个点表示的三角形是否相交
			static IntersectionTri(rlpv:Vector3D,rltv:Vector3D, triva:Vector3D, trivb:Vector3D, trivc:Vector3D, outV:Vector3D):number
			{
				return 0;
			}
			// 射线和两个点表示的线段是否相交
			static IntersectionLS(rlpv:Vector3D,rltv:Vector3D,lspva:Vector3D, lspvb:Vector3D, outV:Vector3D,radius:number = 1.0):number
			{
				let pv:Vector3D = StraightLine.__tAv;
				pv.copyFrom(lspvb);
				pv.subtractBy(lspva);
				pv.normalize();

				Vector3D.Cross(rltv, pv, outV);
				outV.normalize();
				pv.w = outV.dot(rlpv) - outV.dot(lspvb);
				if(Math.abs(pv.w) <= radius)
				{
					// 两条直线已经相交
					// outV 和 rlpv rltv 计算构成了一个平面
					outV.crossBy(rltv);
					outV.normalize();
					outV.w = outV.dot(rlpv);
					// 计算 lspva 所在的直线与平面的交点
					//let tv2:Vector3D = AbsGeomBase.__tV1;
					pv.w = (outV.w - outV.dot(lspva))/(pv.dot(outV));
					outV.copyFrom(pv);
					outV.scaleBy(pv.w);
					outV.addBy(lspva);

					pv.copyFrom(outV);
					pv.subtractBy(lspva);
					let pv1:Vector3D = AbsGeomBase.__tV1;
					pv1.copyFrom(outV);
					pv1.subtractBy(lspvb);
					if(pv.dot(pv1) <= 0.0)
					{
						return 1;
					}

				}
				return 0;
			}
			// @return 检测得到距离射线起点最近的点, 1表示相交,1表示不相交
			static IntersectioNearSphere2(rlpv:Vector3D,rltv:Vector3D,cv:Vector3D,radius:number,outV:Vector3D):number
			{
				let pv:Vector3D = StraightLine.__tAv;
				pv.x = cv.x - rlpv.x;
				pv.y = cv.y - rlpv.y;
				pv.z = cv.z - rlpv.z;
				
				pv.w = pv.dot(rltv);
				radius *= radius;
				if(pv.w > MathConst.MATH_MIN_POSITIVE)
				{
					outV.copyFrom(rltv);
					outV.scaleBy(pv.w);
					outV.subtractBy(pv);
					pv.x = outV.getLengthSquared();
					
					if(pv.x <= radius)
					{
						// 远距离
						//outV.w = pv.w + Math.sqrt(radius * radius - outV.getLengthSquared());
						// 取近距离
						pv.w -= Math.sqrt(radius - pv.x);
						outV.copyFrom(rltv);
						outV.scaleBy(pv.w);
						outV.addBy(rlpv);
						outV.w = 1.0;
						return 1;
					}
				}
				else if(pv.getLengthSquared() <= radius)
				{
					outV.copyFrom(rltv);
					outV.scaleBy(pv.w);
					outV.subtractBy(pv);
					pv.x = outV.getLengthSquared();
					
					if(pv.x <= radius)
					{
						// 取远距离
						pv.w += Math.sqrt(radius - pv.x);
						outV.copyFrom(rltv);
						outV.scaleBy(pv.w);
						outV.addBy(rlpv);
						outV.w = 1.0;
						return 1;
					}
				}
				return 0;
			}
			// @return 检测得到距离射线起点最近的点, 1表示相交,0表示不相交
			static IntersectioNearSphere(rlpv:Vector3D,rltv:Vector3D,cv:Vector3D,radius:number,outV:Vector3D):number
			{
				let pv:Vector3D = StraightLine.__tAv;
				pv.x = cv.x - rlpv.x;
				pv.y = cv.y - rlpv.y;
				pv.z = cv.z - rlpv.z;
				pv.w = pv.dot(rltv);
				if(pv.w > MathConst.MATH_MIN_POSITIVE)
				{
					outV.x = pv.x - pv.w * rltv.x;
					outV.y = pv.y - pv.w * rltv.y;
					outV.z = pv.z - pv.w * rltv.z;
					outV.x = outV.getLengthSquared();
					outV.w = radius * radius;
					if(outV.x <= outV.w)
					{
						// rlpv到远交点记作XP, rlpv到球心记作CP, CP到远交点记作RP
						// 通过余弦定律得到一元二次方程得并且解这个方程得到 XP 的距离
						// 获得CP距离的平方值
						outV.x = pv.getLengthSquared();
						// RP距离的平方值 减去 CP距离的平方值
						outV.z = outV.w - outV.x;
						//	// 获得CP距离值
						//	outV.w = Math.sqrt(outV.x);
						// 准备计算 CP和XP 之间夹角a的余弦值, cos(a)值
						pv.normalize();
						// cos(a) 值 和 CP距离值相乘
						//pv.y = pv.dot(rltv) * outV.w;
						outV.y = pv.dot(rltv) * Math.sqrt(outV.x);
						// 求解方程的根,得到近些的距离
						pv.w = (-outV.y + Math.sqrt(outV.y * outV.y + 4.0 * outV.z)) * 0.5;
						outV.copyFrom(rltv);
						outV.scaleBy(pv.w);
						outV.addBy(rlpv);
						outV.w = 1.0;
						return 1;
					}
				}
				else
				{
					outV.x = pv.getLengthSquared();
					outV.w = radius * radius;
					if(outV.x <= outV.w)
					{
						outV.z = outV.w - outV.x;
						pv.normalize();
						outV.y = pv.dot(rltv) * Math.sqrt(outV.x);
						// 求解方程的根,得到远些的距离
						pv.w = (-outV.y + Math.sqrt(outV.y * outV.y + 4.0 * outV.z)) * 0.5;
						outV.copyFrom(rltv);
						outV.scaleBy(pv.w);
						outV.addBy(rlpv);
						outV.w = 1.0;
						return 1;
					}
				}
				return 0;
			}
			static IntersectSphere(rlpv:Vector3D,rltv:Vector3D,cv:Vector3D,radius:number):boolean
			{
				let pv:Vector3D = StraightLine.__tAv;
				pv.x = cv.x - rlpv.x;
				pv.y = cv.y - rlpv.y;
				pv.z = cv.z - rlpv.z;
				pv.w = pv.dot(rltv);
				if(pv.w < MathConst.MATH_MIN_POSITIVE)
				{
					return pv.getLengthSquared() <= (radius * radius);
				}
				pv.x -= pv.w * rltv.x;
				pv.y -= pv.w * rltv.y;
				pv.z -= pv.w * rltv.z;		
				return pv.getLengthSquared() <= (radius * radius);
			}
		}
		export class StraightLine extends AbsGeomBase
		{
			static __tAv:Vector3D = new Vector3D();
			tv = new Vector3D(1.0,0.0,0.0);
			update()
			{
				this.tv.normalize();
			}
			updateFast()
			{
				this.tv.normalize();
			}

			//
			//计算空间中一点到空间某直线的距离的平方
			//@param			ltv	空间直线的切向
			//@param			lpv	空间直线上的某一点
			//@param			spCV		空间中的一点
			//
			static CalcPVSquaredDis2(ltv:Vector3D,lpv:Vector3D,spCV:Vector3D):number
			{
				let pv:Vector3D = StraightLine.__tAv;
				pv.x = spCV.x - lpv.x;
				pv.y = spCV.y - lpv.y;
				pv.z = spCV.z - lpv.z;
				pv.w = pv.dot(ltv);
				pv.x -= pv.w * ltv.x;
				pv.y -= pv.w * ltv.y;
				pv.z -= pv.w * ltv.z;		
				return pv.getLengthSquared();
			}
			//计算空间中一点到空间某直线的距离
			static CalcPVDis(ltv:Vector3D,lpv:Vector3D,spCV:Vector3D):number
			{
				let pv:Vector3D = StraightLine.__tAv;
				pv.x = spCV.x - lpv.x;
				pv.y = spCV.y - lpv.y;
				pv.z = spCV.z - lpv.z;
				//
				let da:number = pv.dot(ltv);
				pv.x = da * ltv.x + lpv.x;
				pv.y = da * ltv.y + lpv.y;
				pv.z = da * ltv.z + lpv.z;
				//
				pv.x = spCV.x - pv.x;
				pv.y = spCV.y - pv.y;
				pv.z = spCV.z - pv.z;			
				return pv.getLength();			
			}
			
			/**
			 * 计算空间中一点到空间直线最近的点
			 * @param			lpv		直线上的某一点
			 * @param			ltv		直线的切向
			 * @param			spCV			空间中的一点
			 * */
			static CalcPVCloseV2(lpv:Vector3D, ltv:Vector3D,spCV:Vector3D, outV:Vector3D):void
			{
				outV.x = spCV.x - lpv.x;
				outV.y = spCV.y - lpv.y;
				outV.z = spCV.z - lpv.z;
				let da:number = outV.dot(ltv);
				outV.x = da * ltv.x + lpv.x;
				outV.y = da * ltv.y + lpv.y;
				outV.z = da * ltv.z + lpv.z;
			}
			/**
			 * calculate intersection point of two straight line in the same plane
			 * @param			latv	tv of line a
			 * @param			lapv	pv of line a
			 * @param			lbtv	tv of line b
			 * @param			lbpv	Sphere.__tsAv of line b
			 * @param			outV	result: intersection point
			 */
			static IntersectionCopSLV2(lapv:Vector3D, latv:Vector3D, lbpv:Vector3D, lbtv:Vector3D, outV:Vector3D):void
			{
				Vector3D.Cross(latv, lbtv, AbsGeomBase.__tV1);
				Vector3D.Cross(latv, AbsGeomBase.__tV1, AbsGeomBase.__tV2);
				AbsGeomBase.__tV2.normalize();
				PlaneCalc.IntersectionSLV2(AbsGeomBase.__tV2, AbsGeomBase.__tV2.dot(lapv), lbpv, lbtv, outV);
			}
			// 计算两条异面直线距离最近的点,而且这个点落在空间直线b线上
			static CalcTwoSLCloseV2(lapv:Vector3D, latv:Vector3D, lbpv:Vector3D, lbtv:Vector3D, outV:Vector3D):void
			{
				Vector3D.Cross(latv, lbtv, AbsGeomBase.__tV1);
				Vector3D.Cross(latv, AbsGeomBase.__tV1, AbsGeomBase.__tV2);
				AbsGeomBase.__tV2.normalize();
				PlaneCalc.IntersectionSLV2(AbsGeomBase.__tV2, AbsGeomBase.__tV2.dot(lapv), lbpv, lbtv, outV);
				// 计算点在空间直线a上的投影
				outV.subtractBy(lapv);
				outV.w = outV.dot(latv);
				outV.x = outV.w * latv.x + lapv.x;
				outV.y = outV.w * latv.y + lapv.y;
				outV.z = outV.w * latv.z + lapv.z;
				outV.w = 1.0;
			}
			// 计算两条异面直线距离最近的点,而且这个点落在这两个空间直线上
			static CalcTwoSLDualCloseV2(lapv:Vector3D, latv:Vector3D, lbpv:Vector3D, lbtv:Vector3D, outVa:Vector3D,outVb:Vector3D):void
			{
				Vector3D.Cross(latv, lbtv, AbsGeomBase.__tV1);
				Vector3D.Cross(latv, AbsGeomBase.__tV1, AbsGeomBase.__tV2);
				AbsGeomBase.__tV2.normalize();
				PlaneCalc.IntersectionSLV2(AbsGeomBase.__tV2, AbsGeomBase.__tV2.dot(lapv), lbpv, lbtv, outVa);
				outVb.copyFrom(lbpv);
				// 计算点在空间直线a上的投影
				outVa.subtractBy(lapv);
				outVa.w = outVa.dot(latv);
				outVa.x = outVa.w * latv.x + lapv.x;
				outVa.y = outVa.w * latv.y + lapv.y;
				outVa.z = outVa.w * latv.z + lapv.z;
				outVa.w = 1.0;
				// 计算点在空间直线b上的投影
				//AbsGeomBase.__tV1.normalize();
				outVb.subtractBy(outVa);
				outVb.w = outVb.dot(AbsGeomBase.__tV1);
				outVb.x = outVb.w * AbsGeomBase.__tV1.x + outVa.x;
				outVb.y = outVb.w * AbsGeomBase.__tV1.y + outVa.y;
				outVb.z = outVb.w * AbsGeomBase.__tV1.z + outVa.z;
				outVb.w = 1.0;
			}
		}
		export class LineSegment extends AbsGeomBase
		{
			// bounds sphere squared radius
			radiusSquared:number = 2500.0;
			//
			tv:Vector3D = new Vector3D(1.0,0.0,0.0);
			// segment line's center
			center:Vector3D = new Vector3D(50.0,0.0,0.0);
			// a 3d point's another position in straightLine
			anotherPosition:Vector3D = new Vector3D(100, 0.0, 0.0);
			//
			length:number = 100.0;
			//
			intersectionCopSLV2(lsbpv:Vector3D, lsbtv:Vector3D, outV:Vector3D):void
			{
				Vector3D.Cross(this.tv, lsbtv, AbsGeomBase.__tV1);
				Vector3D.Cross(this.tv, AbsGeomBase.__tV1, AbsGeomBase.__tV2);
				AbsGeomBase.__tV2.normalize();
				PlaneCalc.IntersectionSLV2(AbsGeomBase.__tV2, AbsGeomBase.__tV2.dot(this.position), lsbpv, lsbtv, outV);
				AbsGeomBase.__tV2.x = outV.x - this.position.x;
				AbsGeomBase.__tV2.y = outV.y - this.position.y;
				AbsGeomBase.__tV2.z = outV.z - this.position.z;
				let dis = AbsGeomBase.__tV2.dot(this.tv);
				if(dis < 0.0) outV.copyFrom(this.position);
				else if(dis > this.length) outV.copyFrom(this.anotherPosition);
			}
			update():void
			{
				this.tv.x = this.anotherPosition.x - this.position.x;
				this.tv.y = this.anotherPosition.y - this.position.y;
				this.tv.z = this.anotherPosition.z - this.position.z;
				//
				this.length = this.tv.getLength();
				//
				this.tv.x *= 0.5;
		        this.tv.y *= 0.5;
				this.tv.z *= 0.5;
				//
				this.center.x = this.position.x + this.tv.x;
				this.center.y = this.position.y + this.tv.y;
				this.center.z = this.position.z + this.tv.z;
				//
		        this.radiusSquared = this.tv.getLengthSquared();
		        this.tv.normalize();
			}
			updateFast():void
			{
				this.update();
			}
		}
	}
}