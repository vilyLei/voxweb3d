/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAGeomEntity from "./IAGeomEntity";

export default interface IPlane extends IAGeomEntity {

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
	// /**
	//  * set plane distance
	//  */
	// setDistanceAndNv(dis: number, nv: IVector3D): IPlane;
}
