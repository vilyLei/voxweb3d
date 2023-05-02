/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ISegmentLine from "./ISegmentLine";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

export default class SegmentLine implements ISegmentLine {
	uid: number = -1;
	/**
	 * segment line center position
	 */
	pos: IVector3D = CoMath.createVec3();
	/**
	 * segment line begin position
	 */
	begin: IVector3D = CoMath.createVec3();
	/**
	 * segment line end position
	 */
	end: IVector3D = CoMath.createVec3(0);

	tv: IVector3D = CoMath.createVec3(1);
	length: number = 0;
	radius: number = 0;

	setTo(begin: IVector3D, end: IVector3D): ISegmentLine {
		this.begin.copyFrom(begin);
		this.end.copyFrom(end);
		return this;
	}
	reset(): void {
		this.pos.setXYZ(0, 0, 0);
		this.begin.setXYZ(0, 0, 0);
		this.end.setXYZ(0, 0, 0);
		this.tv.setXYZ(1, 0, 0);
		this.length = 0;
		this.radius = 0;
	}
	update(): void {
		this.tv.subVecsTo(this.end, this.begin);
		this.length = this.tv.getLength();
		this.radius = 0.5 * this.length;
		this.tv.normalize();
		this.pos
			.copyFrom(this.tv)
			.scaleBy(this.radius)
			.addBy(this.pos);
	}
}
