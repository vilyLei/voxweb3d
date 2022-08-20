/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IGeomEntity from "./IGeomEntity";

export default interface IPlane extends IGeomEntity {

	/**
	 * plane normal
	 */
	nv: IVector3D;
	/**
	 * set plane distance
	 */
	setDistance(dis: number): IPlane;
	/**
	 * get plane distance
	 */
	getDistance(): number;
}
