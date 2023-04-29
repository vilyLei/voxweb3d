/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";

class PlaneCalc
{
	static IntersectBoo:boolean = false;
	static IntersectSatus:number = 0;
	static PlaneCalcIntersectSphere(pnv:Vector3D, pdis:number, cv:Vector3D,radius:number):void
	{
		PlaneCalc.IntersectBoo = false;
		PlaneCalc.IntersectSatus = 0;
		pdis = pnv.dot(cv) - pdis;
		if (pdis > MathConst.MATH_MIN_POSITIVE)
		{
			PlaneCalc.IntersectBoo = pdis <= radius;
			PlaneCalc.IntersectSatus = 1;
		}else if(pdis < MathConst.MATH_MAX_NEGATIVE)
		{
			PlaneCalc.IntersectBoo = -pdis <= radius;
			PlaneCalc.IntersectSatus = -1;
		}
	}
	static CalcPVCloseV(planeNV:Vector3D, planeDis:number, posV:Vector3D, outV:Vector3D):void
	{
		let value:number = planeDis - posV.dot( planeNV );
		outV.setTo(value * planeNV.x, value * planeNV.y, value * planeNV.z);
		outV.addBy(posV);			
	}
	static CalcPVCloseV2(pnv:Vector3D, pd:number, posV:Vector3D, outV:Vector3D):void
	{
		let value:number = pd - posV.dot( pnv );
		outV.setTo(value * pnv.x, value * pnv.y, value * pnv.z);
		//outV.scaleBy(value);
		outV.addBy(posV);
	}
	static IntersectionSLV2(planeNV:Vector3D, planeDis:number, sl_pos:Vector3D, sl_tv:Vector3D, outV:Vector3D):number
	{
		// intersection or parallel
		let td:number = planeNV.dot(sl_tv);
		if (td > MathConst.MATH_MIN_POSITIVE || td < MathConst.MATH_MAX_NEGATIVE)
		{
			// intersection
			let dis:number = planeNV.dot(sl_pos) - planeDis;
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
		if (td <= MathConst.MATH_MIN_POSITIVE || td >= MathConst.MATH_MAX_NEGATIVE)
		{
			// plane contains line
			outV.copyFrom(sl_pos);
			return 2;
		}
		return 0;
	}
}

export default PlaneCalc;