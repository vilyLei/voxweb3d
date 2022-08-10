/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
interface IAABB {

	min: IVector3D;
	max: IVector3D;
	version: number;
	radius: number;
	radius2: number;
	center: IVector3D;
	
	containsV(v: IVector3D): boolean;
	// 是否包含某一点(同一坐标空间的点)
	containsXY(vx: number, vy: number): boolean;
	// 是否包含某一点(同一坐标空间的点)
	containsXZ(vx: number, vz: number): boolean;
	// 是否包含某一点(同一坐标空间的点)
	containsYZ(vy: number, vz: number): boolean;

	getLong(): number;
	getWidth(): number;
	getHeight(): number;

	copyFrom(ab: IAABB): IAABB;
	expand(bias: IVector3D): IAABB;
	union(ab: IAABB): IAABB;
	reset(): void;
	update(): void;
	updateFast(): void;
	updateVolume(): IAABB;
	
}

export { IAABB }