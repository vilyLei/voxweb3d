/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAABBBox from "./IAABBBox";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

export default class AABBBox implements IAABBBox {

	uid: number = -1;
	pos: IVector3D = CoMath.createVec3();

	min: IVector3D = CoMath.createVec3();
	max: IVector3D = CoMath.createVec3();

	radius: number = 0;

	long: number = 0;
	width: number = 0;
	height: number = 0;

	// getLong(): number {
	// 	return 0;
	// }
	// getWdith(): number {
	// 	return 0;
	// }
	// getHeight(): number {
	// 	return 0;
	// }

	reset(): void {

		let v0 = Number.MIN_VALUE;
		let v1 = Number.MAX_VALUE;
		this.min.setXYZ(v1, v1, v1);
		this.min.setXYZ(v0, v0, v0);
		this.pos.setXYZ(0, 0, 0);
	}
	update(): void {}
}
