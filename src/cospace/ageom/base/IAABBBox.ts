/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IGeomEntity from "./IGeomEntity";

export default interface IAABBBox extends IGeomEntity {

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
