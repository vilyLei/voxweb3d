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

	addPosition(pv: IVector3D): void;
	addXYZ(pvx: number, pvy: number, pvz: number): void;
	addXYZFast(pvx: number, pvy: number, pvz: number): void;
	addXYZFloat32AndIndicesArr(vs: Float32Array, indices: Uint16Array | Uint32Array): void;
	/**
	 * @param vs Float32Array instance
	 * @param step the default value is 3
	 */
	addXYZFloat32Arr(vs: Float32Array, step?: number): void;

	getLong(): number;
	getWidth(): number;
	getHeight(): number;

	copyFrom(ab: IAABB): IAABB;
	expand(bias: IVector3D): IAABB;
	union(ab: IAABB): IAABB;
	/**
	 * @param pv the default value is null
	 */
	reset(pv?: IVector3D): void;
	update(): void;
	updateFast(): void;
	updateVolume(): IAABB;

}

export default IAABB;