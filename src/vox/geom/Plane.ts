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

class Plane extends AbsGeomBase
{
	static IntersectBoo:boolean = false;
	static IntersectSatus:number = 0;
	nv:Vector3D = new Vector3D(0.0,1.0,0.0);
	distance:number = 0.0;
	intersectBoo:boolean = false;
	intersectStraightLinePos(straightL:StraightLine, outV:Vector3D):number
	{
	
		// intersection or parallel
		let td = this.nv.dot(straightL.tv);
		if (td > MathConst.MATH_MIN_POSITIVE || td < MathConst.MATH_MAX_NEGATIVE)
		{
			// intersection
			let dis = this.nv.dot(straightL.position) - this.distance;
		
			outV.x = straightL.tv.x * 100000.0 + straightL.position.x;
			outV.y = straightL.tv.y * 100000.0 + straightL.position.y;
			outV.z = straightL.tv.z * 100000.0 + straightL.position.z;
			//
			td = this.nv.dot(outV) - this.distance;
		
			td = dis / (dis - td);
		
			outV.subtractBy(straightL.position);
			outV.scaleBy(td);
			outV.addBy(straightL.position);
			return 1;
		}
		td = this.nv.dot(straightL.position) - this.distance;
		if (td <= MathConst.MATH_MIN_POSITIVE || td >= MathConst.MATH_MAX_NEGATIVE)
		{
			// plane contains line
			outV.copyFrom(straightL.position);
			return 2;
		}
	
		return 0;
	}
	intersectStraightLinePos2(sl_pos:Vector3D, sl_tv:Vector3D, outV:Vector3D):number
	{
		// intersection or parallel
		let td:number = this.nv.dot(sl_tv);
		if (td > MathConst.MATH_MIN_POSITIVE || td < MathConst.MATH_MAX_NEGATIVE)
		{
			// intersection
			let dis = this.nv.dot(sl_pos) - this.distance;
		
			outV.x = sl_tv.x * 100000.0 + sl_pos.x;
			outV.y = sl_tv.y * 100000.0 + sl_pos.y;
			outV.z = sl_tv.z * 100000.0 + sl_pos.z;
			//
			td = this.nv.dot(outV) - this.distance;
		
			td = dis / (dis - td);
		
			outV.subtractBy(sl_pos);
			outV.scaleBy(td);
			outV.addBy(sl_pos);
			return 1;
		}
		td = this.nv.dot(sl_pos) - this.distance;
		if (td <= MathConst.MATH_MIN_POSITIVE || td >= MathConst.MATH_MAX_NEGATIVE)
		{
			// plane contains line
			outV.copyFrom(sl_pos);
			return 2;
		}                
	
		return 0;
	}
	intersectRadialLinePos(radL:RadialLine, outV:Vector3D):number
	{
		let dis:number = this.nv.dot(radL.position) - this.distance;
		if (dis > MathConst.MATH_MIN_POSITIVE) {
			// radL position in plane positive space
			let td:number = this.nv.dot(radL.tv);
			if (td < 0.0) {
				// calc intersection position
				return this.intersectStraightLinePos2(radL.position, radL.tv, outV);
			}
		}
		else if(dis < MathConst.MATH_MAX_NEGATIVE)
		{
			// radL position in plane negative space
			let td2:number = this.nv.dot(radL.tv);
			if (td2 > 0.0) {
				// calc intersection position
				return this.intersectStraightLinePos2(radL.position, radL.tv, outV);
			}
		}
		else {
			let td3:number = this.nv.dot(radL.tv);
			if (td3 > MathConst.MATH_MIN_POSITIVE || td3 < MathConst.MATH_MAX_NEGATIVE)
			{
				outV.copyFrom(radL.position);
				return 1;
			}
			outV.copyFrom(radL.position);
			return 2;
		}
		return -1;
	}
	intersectRadialLinePos2(rl_pos:Vector3D, rl_tv:Vector3D, outV:Vector3D):number
	{
		let dis:number = this.nv.dot(rl_pos) - this.distance;
		if (dis > MathConst.MATH_MIN_POSITIVE) {
			// radL position in plane positive space
			let td:number = this.nv.dot(rl_tv);
			if (td < 0.0)
			{
				// calc intersection position
				return this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
			}
		}
		else if (dis < MathConst.MATH_MAX_NEGATIVE)
		{
			// radL position in plane negative space
			let td:number = this.nv.dot(rl_tv);
			if (td > 0.0)
			{
				// calc intersection position
				return this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
			}
		}
		else {
			let td3:number = this.nv.dot(rl_tv);
			if (td3 > MathConst.MATH_MIN_POSITIVE || td3 < MathConst.MATH_MAX_NEGATIVE)
			{
				outV.copyFrom(rl_pos);
				return 1;
			}
			outV.copyFrom(rl_pos);
			return 2;
		}
	
		return -1;
	}
	containsPoint(pos:Vector3D):number
	{
		let f:number = this.nv.dot(pos) - this.distance;
		if (f > MathConst.MATH_MIN_POSITIVE)
		{
			return 1;
		}else if(f < MathConst.MATH_MAX_NEGATIVE)
		{
			return -1;
		}
		return 0;
	}
	intersectSphere(cv:Vector3D,radius:number):number
	{
		this.intersectBoo = false;
		let f:number = this.nv.dot(cv) - this.distance;
		if (f > MathConst.MATH_MIN_POSITIVE)
		{
			this.intersectBoo = f <= radius;
			return 1;
		}else if(f < MathConst.MATH_MAX_NEGATIVE)
		{
			this.intersectBoo = -f <= radius;
			return -1;
		}
		return 0;
	}
	// 判断一个球体是否和一个平面的负空间相交
	intersectSphNegSpace(cv:Vector3D,radius:number):void
	{
		//this.intersectBoo = (this.nv.dot(cv) - this.distance - radius) < MathConst.MATH_MIN_POSITIVE;				
		//this.intersectBoo = (this.nv.dot(cv) - this.distance) < radius;				
		this.intersectBoo = (Math.abs(this.nv.dot(cv) - this.distance) < radius);				
	}
	update():void
	{
		this.nv.normalize();
	}
	updateFast():void
	{
		this.nv.normalize();
	}
	
	static PlaneIntersectSphere(pnv:Vector3D, pdis:number, cv:Vector3D,radius:number):void
	{
		Plane.IntersectBoo = false;
		Plane.IntersectSatus = 0;
		pdis = pnv.dot(cv) - pdis;
		if (pdis > MathConst.MATH_MIN_POSITIVE)
		{
			Plane.IntersectBoo = pdis <= radius;
			Plane.IntersectSatus = 1;
		}else if(pdis < MathConst.MATH_MAX_NEGATIVE)
		{
			Plane.IntersectBoo = -pdis <= radius;
			Plane.IntersectSatus = -1;
		}
	}
	static CalcPVCloseV(plane:Plane, posV:Vector3D, outV:Vector3D):void
	{
		let value:number = plane.distance - posV.dot( plane.nv );
		outV.setTo(value * plane.nv.x, value * plane.nv.y, value * plane.nv.z);
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
	toString():string
	{
		return "Plane(position="+this.position.toString()+", nv="+this.nv.toString()+")";
	}
}
export class Triangle extends Plane
{
	// triangle three vertexes, use ccw sort
    v0:Vector3D = new Vector3D(100.0,0,0);
    v1:Vector3D = new Vector3D(0,0,-100.0);
	v2:Vector3D = new Vector3D(0,0,0);
	// triangle three adges: LineSegment ls01, ls12, ls20;
	ls01:LineSegment = new LineSegment();
	ls12:LineSegment = new LineSegment();
	ls20:LineSegment = new LineSegment();
	// bounds sphere squared radius
	radiusSquared:number = 100.0;
	getRandomPosition(outV:Vector3D):void
	{
		let dis:number = this.ls01.length * Math.random();
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
	triIntersectStraightLinePos(sL:StraightLine, outV:Vector3D):number
    {
        let flag:number = this.intersectStraightLinePos(sL, outV);
        if (flag == 1) {
            flag = this.triContainsPoint(outV);
            if (flag > 0)
                return 1;
        }
        else if (flag == 2)
        {
            // plane contains line
            // test line intersect triangle
        }
        return -1;
    }
    triIntersectRadialLinePos(radL:RadialLine, outV:Vector3D):number
    {
        let flag:number = this.intersectRadialLinePos(radL, outV);
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
    triIntersectStraightLinePos2(sl_pos:Vector3D, sl_tv:Vector3D, outV:Vector3D):number
    {
        let flag:number = this.intersectStraightLinePos2(sl_pos, sl_tv, outV);
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
	triIntersectRadialLinePos2(rl_pos:Vector3D, rl_tv:Vector3D, outV:Vector3D):number
	{
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
	triContainsPoint(pos:Vector3D):number
	{
	    let f:number = this.nv.dot(pos) - this.distance;
	    if (f > MathConst.MATH_MIN_POSITIVE || f < MathConst.MATH_MAX_NEGATIVE)
	    {
	        return -1;
	    }
	    //
	    AbsGeomBase.__tV0.x = pos.x - this.v0.x;
	    AbsGeomBase.__tV0.y = pos.y - this.v0.y;
	    AbsGeomBase.__tV0.z = pos.z - this.v0.z;
	    Vector3D.Cross(this.ls01.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
	    //float f = this.nv.dot(AbsGeomBase.__tV1);
	    if (this.nv.dot(AbsGeomBase.__tV1) < 0)
	    {
	        return -1;
	    }
	    AbsGeomBase.__tV0.x = pos.x - this.v1.x;
	    AbsGeomBase.__tV0.y = pos.y - this.v1.y;
	    AbsGeomBase.__tV0.z = pos.z - this.v1.z;
	    Vector3D.Cross(this.ls12.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
	    //f = this.nv.dot(AbsGeomBase.__tV1);
	    if (this.nv.dot(AbsGeomBase.__tV1) < 0)
	    {
	        return -1;
	    }
	    AbsGeomBase.__tV0.x = pos.x - this.v2.x;
	    AbsGeomBase.__tV0.y = pos.y - this.v2.y;
	    AbsGeomBase.__tV0.z = pos.z - this.v2.z;
	    Vector3D.Cross(this.ls20.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
	    //f = this.nv.dot(AbsGeomBase.__tV1);
	    if (this.nv.dot(AbsGeomBase.__tV1) < 0)
	    {
	        return -1;
	    }
	    return 1;
	}
	update():void
	{
	    //
	    let k:number = 1.0 / 3.0;
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
	updateFast():void
	{
		this.update();
	}
}
export default Plane;