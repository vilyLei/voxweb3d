/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAGeomEntity from "./IAGeomEntity";

export default interface IAABBBox extends IAGeomEntity {

	min: IVector3D;
	max: IVector3D;

	radius: number;

	long: number;
	width: number;
	height: number;
	// getLong(): number;
	// getWdith(): number;
	// getHeight(): number;
}
