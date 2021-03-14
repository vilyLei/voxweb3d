/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../..//vox/math/Vector3D";

import Vector3D = Vector3DT.vox.math.Vector3D;

export namespace vox
{
    export namespace motion
    {
        export namespace base
        {
			/**
			 * 
			 * 运动轨迹控制的接口
			 * 
			 * @author Vily
			 */
			export interface IMotion
			{
				
				isMoving():boolean;
				
				isArrived():boolean;
				run():void
				getSpdV(outV:Vector3D):void;
			}
		}
	}
}