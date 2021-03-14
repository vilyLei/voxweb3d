/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as AbsGeomBaseT from "../../vox/geom/AbsGeomBase";
import * as LineT from "../../vox/geom/Line";
import * as PlaneCalcT from "../../vox/geom/PlaneCalc";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import AbsGeomBase = AbsGeomBaseT.vox.geom.AbsGeomBase;
import StraightLine = LineT.vox.geom.StraightLine;
import PlaneCalc = PlaneCalcT.vox.geom.PlaneCalc;

export namespace vox
{
    export namespace geom
    {
		
		export class InfiniteCone extends AbsGeomBase
		{
			private static __cotV0:Vector3D = new Vector3D();
			private static __cotV1:Vector3D = new Vector3D();
			private static __cotV2:Vector3D = new Vector3D();
			// position为圆锥锥体尖端的空间位置
			// 朝向圆锥锥体大端的锥体轴线方向单位矢量
			tv:Vector3D = new Vector3D(1.0,0.0,0.0);
			// 锥体沿着轴线方向的高
			height:number = 100.0;
			// 圆锥底面的半径
			radius:number = 100.0;
			// 底面半径和沿中轴线长度(高度)的比值
			rhk:number = 1.0;
			// 圆锥中轴线和顶点到底面边缘连线的夹角的余弦值
			mcos:number = 1.0;
			// 圆锥中轴线和顶点到底面边缘连线的夹角的余弦值的平方
			mcos2:number = 1.0;
			// 判断一个点是否包含在圆锥体之内
			containsPos(pv:Vector3D):boolean
			{
				let v3:Vector3D = InfiniteCone.__cotV0;
				v3.x = pv.x - this.position.x;
				v3.y = pv.y - this.position.y;
				v3.z = pv.z - this.position.z;
				v3.w = v3.dot(this.tv);
				//console.log("v3.w: "+v3.w+", this.height: "+this.height);
				if(v3.w > 0.0)
				{
					v3.normalize();
					//console.log("v3.dot(this.tv): "+v3.dot(this.tv));
					//console.log("this.mcos: "+this.mcos);
					return v3.dot(this.tv) >= (this.mcos - MathConst.MATH_MIN_POSITIVE);
				}
				else if(v3.getLengthSquared() < MathConst.MATH_MIN_POSITIVE)
				{
					return true;
				}
				return false;
			}
			//	intersectSLTest(slpv:Vector3D, sltv:Vector3D):boolean
			//	{
			//		let pnv:Vector3D = Cone.__cotV0;
			//		let opv:Vector3D = Cone.__cotV1;
			//		opv.copyFrom(this.position);
			//		opv.subtractBy(slpv);
			//		Vector3D.Cross(sltv, opv, pnv);
			//		pnv.normalize();
			//		let planeDis:number = pnv.dot(slpv);
			//		opv.copyFrom(this.tv);
			//		opv.scaleBy(this.height);
			//		opv.addBy(this.position);
			//		let opv2:Vector3D = Cone.__cotV2;
			//		PlaneCalc.CalcPVCloseV(pnv,planeDis,opv, opv2);
			//		opv2.subtractBy(this.position);
			//		opv2.normalize();
			//		return opv2.dot(this.tv) >= (this.mcos - MathConst.MATH_MIN_POSITIVE);
			//	}
			// 判断锥体是否和一个直线相交
			intersectionRL(slpv:Vector3D, sltv:Vector3D, outV0:Vector3D, outV1:Vector3D):boolean
			{
				//come from: http://lousodrome.net/blog/light/2017/01/03/intersection-of-a-ray-and-a-cone/
				let psltv:Vector3D = InfiniteCone.__cotV1;
				psltv.copyFrom(sltv);
				psltv.negate();
				sltv = sltv.dot(this.tv) > 0.0?sltv:psltv;
				let coDV:Vector3D = InfiniteCone.__cotV0;
				coDV.copyFrom(slpv);
				coDV.subtractBy(this.position);
				let pb:number = sltv.dot(this.tv);
				let pa:number = pb * pb - this.mcos2;
				let pc:number = coDV.dot(this.tv);
				pb = 2.0 * (pb * pc - coDV.dot(sltv) * this.mcos2);
				pc = pc * pc - coDV.dot(coDV) * this.mcos2;
				let pt:number = pb * pb - 4.0 * pa * pc;
				console.log("pt: "+pt);
				if(pt >= MathConst.MATH_MAX_NEGATIVE)
				{
					pa = 1.0 / (2.0 * pa);
					if(pt > MathConst.MATH_MIN_POSITIVE)
					{
						pt = Math.sqrt(pt);
						outV0.w = (-pb - pt) * pa;
						outV1.w = (-pb + pt) * pa;
						
						console.log("AAA outV0.w: "+outV0.w);
						console.log("AAA outV1.w: "+outV1.w);
						pt = -1.0;
						outV0.copyFrom(sltv);
						outV0.scaleBy(outV0.w);
						outV0.addBy(slpv);
						outV0.w = 0.0;

						let v3:Vector3D = InfiniteCone.__cotV2;
						v3.x = outV0.x - this.position.x;
						v3.y = outV0.y - this.position.y;
						v3.z = outV0.z - this.position.z;
						v3.w = v3.dot(this.tv);
						if(v3.w > 0.0)
						{
							v3.normalize();
							if(v3.dot(this.tv) >= (this.mcos - MathConst.MATH_MIN_POSITIVE))
							{
								pt = 1.0;
								outV0.w = 1.0;
							}
						}
						outV1.copyFrom(sltv);
						outV1.scaleBy(outV1.w);
						outV1.addBy(slpv);
						outV1.w = 0.0;
						
						v3.x = outV1.x - this.position.x;
						v3.y = outV1.y - this.position.y;
						v3.z = outV1.z - this.position.z;
						v3.w = v3.dot(this.tv);
						if(v3.w > 0.0)
						{
							v3.normalize();
							if(v3.dot(this.tv) >= (this.mcos - MathConst.MATH_MIN_POSITIVE))
							{
								pt = 1.0;
								outV1.w = 1.0;
							}
						}
					}
					else
					{
						// 穿过锥体顶端 或者 和锥体腰部刚好相交只有一个交点
						
						if(sltv.dot(this.tv) > this.mcos)
						{
							console.log("BBB 过锥顶.");
						}
						else
						{
							console.log("BBB 过锥顶,但是不和锥体相交, 或在锥面只有唯一交点, 可以认为和锥体不相交.");
						}
						outV0.w = -pb * pa;
						console.log("BBB outV0.w: "+outV0.w);
						pt = -1.0;
						outV0.copyFrom(sltv);
						outV0.scaleBy(outV0.w);
						outV0.addBy(slpv);
						outV0.w = 0.0;
						if(this.containsPos(outV0))
						{
							pt = 1.0;
							outV0.w = 1.0;
						}
					}
				}
				return pt >= 0.0;
			}
			getRadiusByHeight(ph:number):number
			{
				return this.rhk * ph;
			}
			update():void
			{
				this.rhk = this.radius / this.height;
				this.mcos = this.height/Math.sqrt(this.height * this.height + this.radius * this.radius);
				this.mcos2 = this.mcos * this.mcos;
			}

		}
		export class Cone extends AbsGeomBase
		{
			private static __cotV0:Vector3D = new Vector3D();
			//private static __cotV1:Vector3D = new Vector3D();
			//private static __cotV2:Vector3D = new Vector3D();
			// position为圆锥锥体尖端的空间位置
			// 朝向圆锥锥体大端的锥体轴线方向单位矢量
			tv:Vector3D = new Vector3D(1.0,0.0,0.0);
			// 锥体沿着轴线方向的高
			height:number = 100.0;
			// 圆锥底面的半径
			radius:number = 100.0;
			// 底面半径和沿中轴线长度(高度)的比值
			rhk:number = 1.0;
			// 圆锥中轴线和顶点到底面边缘连线的夹角的余弦值
			mcos:number = 1.0;
			// 圆锥中轴线和顶点到底面边缘连线的夹角的余弦值的平方
			mcos2:number = 1.0;
			// 判断一个点是否包含在圆锥体之内
			containsPos(pv:Vector3D):boolean
			{
				let v3:Vector3D = Cone.__cotV0;
				v3.x = pv.x - this.position.x;
				v3.y = pv.y - this.position.y;
				v3.z = pv.z - this.position.z;
				v3.w = v3.dot(this.tv);
				//console.log("v3.w: "+v3.w+", this.height: "+this.height);
				if(v3.w > 0.0 && v3.w <= this.height)
				{
					v3.normalize();
					//console.log("v3.dot(this.tv): "+v3.dot(this.tv));
					//console.log("this.mcos: "+this.mcos);
					return v3.dot(this.tv) >= (this.mcos - MathConst.MATH_MIN_POSITIVE);
				}
				else if(v3.getLengthSquared() < MathConst.MATH_MIN_POSITIVE)
				{
					return true;
				}
				return false;
			}
			//	intersectSLTest(slpv:Vector3D, sltv:Vector3D):boolean
			//	{
			//		let pnv:Vector3D = Cone.__cotV0;
			//		let opv:Vector3D = Cone.__cotV1;
			//		opv.copyFrom(this.position);
			//		opv.subtractBy(slpv);
			//		Vector3D.Cross(sltv, opv, pnv);
			//		pnv.normalize();
			//		let planeDis:number = pnv.dot(slpv);
			//		opv.copyFrom(this.tv);
			//		opv.scaleBy(this.height);
			//		opv.addBy(this.position);
			//		let opv2:Vector3D = Cone.__cotV2;
			//		PlaneCalc.CalcPVCloseV(pnv,planeDis,opv, opv2);
			//		opv2.subtractBy(this.position);
			//		opv2.normalize();
			//		return opv2.dot(this.tv) >= (this.mcos - MathConst.MATH_MIN_POSITIVE);
			//	}
			// 判断锥体是否和一个直线相交
			intersectionRL(slpv:Vector3D, sltv:Vector3D, outV0:Vector3D, outV1:Vector3D):boolean
			{
				//come from: http://lousodrome.net/blog/light/2017/01/03/intersection-of-a-ray-and-a-cone/
				let coDV:Vector3D = Cone.__cotV0;
				coDV.copyFrom(slpv);
				coDV.subtractBy(this.position);
				let pb:number = sltv.dot(this.tv);
				let pa:number = pb * pb - this.mcos2;
				let pc:number = coDV.dot(this.tv);
				pb = 2.0 * (pb * pc - coDV.dot(sltv) * this.mcos2);
				pc = pc * pc - coDV.dot(coDV) * this.mcos2;
				let pt:number = pb * pb - 4.0 * pa * pc;
				console.log("pt: "+pt);
				if(pt >= MathConst.MATH_MAX_NEGATIVE)
				{
					pa = 1.0 / (2.0 * pa);
					if(pt > MathConst.MATH_MIN_POSITIVE)
					{
						pt = Math.sqrt(pt);
						outV0.w = (-pb - pt) * pa;
						outV1.w = (-pb + pt) * pa;
						
						console.log("AAA outV0.w: "+outV0.w);
						console.log("AAA outV1.w: "+outV1.w);
						pt = -1.0;
						outV0.copyFrom(sltv);
						outV0.scaleBy(outV0.w);
						outV0.addBy(slpv);
						outV0.w = 0.0;
						if(this.containsPos(outV0))
						{
							pt = 1.0;
							outV0.w = 1.0;
						}
						outV1.copyFrom(sltv);
						outV1.scaleBy(outV1.w);
						outV1.addBy(slpv);
						outV1.w = 0.0;
						if(this.containsPos(outV1))
						{
							pt = 1.0;
							outV1.w = 1.0;
						}
					}
					else
					{
						// 穿过锥体顶端 或者 和锥体腰部刚好相交只有一个交点
						outV0.w = -pb * pa;
						console.log("BBB outV0.w: "+outV0.w);
						pt = -1.0;
						outV0.copyFrom(sltv);
						outV0.scaleBy(outV0.w);
						outV0.addBy(slpv);
						outV0.w = 0.0;
						if(this.containsPos(outV0))
						{
							pt = 1.0;
							outV0.w = 1.0;
						}
					}
				}
				return pt >= 0.0;
			}
			//	// 判断锥体是否和一个直线相交
			//	intersectionRL(slpv:Vector3D, sltv:Vector3D, outV0:Vector3D, outV1:Vector3D):boolean
			//	{
			//		let v3:Vector3D = Cone.__cotV0;
			//		StraightLine.CalcTwoSLCloseV2(slpv, sltv, this.position, this.tv, v3);
			//		outV0.copyFrom(v3);
			//		v3.subtractBy(this.position);
			//		v3.w = v3.dot(this.tv);
			//		if(v3.w <= this.height)
			//		{
			//			v3.normalize();
			//			return v3.dot(this.tv) >= this.mcos;
			//		}
			//		return false;
			//	}
			getRadiusByHeight(ph:number):number
			{
				return this.rhk * ph;
			}
			update():void
			{
				this.rhk = this.radius / this.height;
				this.mcos = this.height/Math.sqrt(this.height * this.height + this.radius * this.radius);
				this.mcos2 = this.mcos * this.mcos;
			}

		}
	}
}