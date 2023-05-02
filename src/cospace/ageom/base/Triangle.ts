/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ISegmentLine from "./ISegmentLine";
import SegmentLine from "./SegmentLine";
import ITriangle from "./ITriangle";
import Plane from "./Plane";
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

export default class Triangle extends Plane implements ITriangle {

	vertex0: IVector3D = CoMath.createVec3();
	vertex1: IVector3D = CoMath.createVec3();
	vertex2: IVector3D = CoMath.createVec3();
	edge0: ISegmentLine = new SegmentLine();
	edge1: ISegmentLine = new SegmentLine();
	edge2: ISegmentLine = new SegmentLine();

	radius: number = 0;
	radiusSquared: number = 0;

	reset(): void {
		super.reset();
		this.radius = this.radiusSquared = 0;
	}
	update(): void {

		const pos = this.pos;
		const v0 = this.vertex0;
		const v1 = this.vertex1;
		const v2 = this.vertex2;
		const e0 = this.edge0;
		const e1 = this.edge1;
		const e2 = this.edge2;

		pos.addVecsTo(v0, v1).addBy(v2).scaleBy( 1.0 / 3.0 );
		const nv = this.nv;
		nv.subVecsTo(pos, v0);

		this.radiusSquared = nv.getLengthSquared();
		this.radius = Math.sqrt(this.radiusSquared);

		e0.setTo(v0, v1).update();
		e1.setTo(v1, v2).update();
		e2.setTo(v2, v0).update();

		CoMath.Vector3D.Cross(e0.tv, e1.tv, this.nv);

		super.update();
	}
}
