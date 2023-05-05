/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAGeomEntity from "./IAGeomEntity";

export default interface IOBBBox extends IAGeomEntity {

	direc: IVector3D;

	radius: number;

	long: number;
	width: number;
	height: number;
}
