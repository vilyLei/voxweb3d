/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ISphere from "./ISphere";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

export default class Sphere implements ISphere {
	uid: number = -1;
	/**
	 * sphere center position
	 */
	pos: IVector3D = CoMath.createVec3();
	radius: number = 0;

	setXYZ(px: number, py: number, pz: number): void {
		this.pos.setXYZ(px, py, pz);
	}
	reset(): void {
		this.pos.setXYZ(0, 0, 0);
		this.radius = 0;
	}
	update(): void {}
}
