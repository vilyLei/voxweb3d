/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import AbsGeomBase from "../../vox/geom/AbsGeomBase";
import PlaneCalc from "../../vox/geom/PlaneCalc";

class LineSegment extends AbsGeomBase
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

export default LineSegment;