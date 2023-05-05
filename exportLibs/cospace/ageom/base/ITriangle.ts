/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IPlane from "./IPlane";
import ISegmentLine from "./ISegmentLine";

export default interface ITriangle extends IPlane {

	vertex0: IVector3D;
	vertex1: IVector3D;
	vertex2: IVector3D;
	/**
	 * vertex0 to vertex1 edge
	 */
	edge0: ISegmentLine;
	/**
	 * vertex1 to vertex2 edge
	 */
	edge1: ISegmentLine;
	/**
	 * vertex2 to vertex0 edge
	 */
	edge2: ISegmentLine;

	radius:number;
	radiusSquared:number;
}
