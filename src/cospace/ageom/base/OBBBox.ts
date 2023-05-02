/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IOBBBox from "./IOBBBox";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

export default class OBBBox implements IOBBBox {

	uid: number = -1;

	pos: IVector3D = CoMath.createVec3();
	direc: IVector3D = CoMath.createVec3(1);

	radius: number = 0;

	long: number = 0;
	width: number = 0;
	height: number = 0;

	reset(): void {
		this.direc.setXYZ(1, 0, 0);
	}
	update(): void {}
}
