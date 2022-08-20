/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IGeomEntity from "./IGeomEntity";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

export default class GeomEntity implements IGeomEntity {

	uid: number = -1;
	pos: IVector3D = CoMath.createVec3();

	reset(): void {
	}
	update(): void {

	}
}
