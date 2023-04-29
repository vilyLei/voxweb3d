/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";

/**
 * 运动轨迹控制的接口
 * 
 * @author Vily
 */
interface IMotion {

	isMoving(): boolean;

	isArrived(): boolean;
	run(): void
	getSpdV(outV: Vector3D): void;
}

export { IMotion }