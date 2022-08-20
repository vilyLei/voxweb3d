/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ILine from "./ILine";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

export default class Line implements ILine{

	uid: number = -1;
	pos: IVector3D = CoMath.createVec3();
	tv: IVector3D = CoMath.createVec3(1);

	reset(): void {
		this.pos.setXYZ(0,0,0);
		this.tv.setXYZ(1,0,0);
	}
	update(): void {
	}
}
