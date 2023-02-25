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
	/**
	 * @param in_pos dst position
	 * @param out_pos result position
	 * @param bias the default value is 0.0
	 */
	getClosePosition(in_pos: IVector3D, out_pos: IVector3D, bias?: number): void;
	addPosition(pv: IVector3D): IAABB;
	addXYZ(pvx: number, pvy: number, pvz: number): void;
	/**
	 * 
	 * @param vs a Float32Array instance
	 * @param indices indices Uint32Array or Uint16Aray data 
	 * @param step the default value is 3
	 */
	addFloat32AndIndices(vs: Float32Array | number[], indices: Uint16Array | Uint32Array, step?: number): void;
	/**
	 * @param vs a Float32Array instance
	 * @param step the default value is 3
	 */
	addFloat32Arr(vs: Float32Array | number[], step?: number): void;

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

export default IAABB;