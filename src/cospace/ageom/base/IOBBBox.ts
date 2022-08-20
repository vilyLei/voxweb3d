/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IGeomEntity from "./IGeomEntity";

export default interface IOBBBox extends IGeomEntity {

	direc: IVector3D;

	radius: number;

	long: number;
	width: number;
	height: number;
}
