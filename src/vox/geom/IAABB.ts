/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
interface IAABB {

	min: Vector3D;
	max: Vector3D;
	version: number;
	radius: number;
	radius2: number;
	center: Vector3D;
	
	containsV(v: Vector3D): boolean;
	// 是否包含某一点(同一坐标空间的点)
	containsXY(vx: number, vy: number): boolean;
	// 是否包含某一点(同一坐标空间的点)
	containsXZ(vx: number, vz: number): boolean;
	// 是否包含某一点(同一坐标空间的点)
	containsYZ(vy: number, vz: number): boolean;
	
}

export { IAABB }