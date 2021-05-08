/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import * as IMotionT from "../../../vox/motion/base/IMotion";

//import Vector3D = Vector3DT.vox.math.Vector3D;
import IMotion = IMotionT.vox.motion.base.IMotion;

export namespace vox
{
    export namespace motion
    {
        export namespace base
        {
			/**
			 * 运动轨迹控制的基类
			 * 
			 * @author Vily
			 */
			export class BaseMotion extends Vector3D implements IMotion
			{
				// 记录自身是否在运动
				protected m_moving:boolean = false;
				// 记录自身是否已经到达目标位置
				protected m_arrived:boolean = false;
				//
				constructor(px:number=0,py:number=0,pz:number=0,pw:number=0) 
				{
					super(px,py,pz,pw);
				}
				/**
				 * 是否正在运动
				 * */
				isMoving():boolean 
				{
					return this.m_moving;
				}
				/**
				 * 是否已经到达目标位置
				 * */
				isArrived():boolean
				{
					return this.m_arrived;
				}
				/**
				 * 不停执行的位置改变函数
				 * */
				run():void
				{

				}
				/**
				 * 获取当前的速度
				 * */
				getSpdV(outV:Vector3D):void
				{
				}		
			}
		}
	}
}