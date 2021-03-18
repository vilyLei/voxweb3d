/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../../vox/math/Vector3D";
import * as BaseMotionT from "../../../vox/motion/base/BaseMotion";
import Vector3D = Vector3DT.vox.math.Vector3D;
import BaseMotion = BaseMotionT.vox.motion.base.BaseMotion;

export namespace vox
{
    export namespace motion
    {
        export namespace mcase
        {
			/**
			 * ec3d.anim.ctr.FixPosProjYMotion
			 * 实现 垂直于 xoz 平面指定起点和终点的抛体运动, 可设置高度和两点间的移动速度
			 * @author Vily
			 */
			export class FixPosProjYMotion extends BaseMotion
			{
				// 两点间直线运动的速度大小
				speed:number = 3.0;
				// 抛起来的时候比起点位置高的最大高度值
				projMaxH:number = 100;
				// 正常抛起的标准距离,有这个距离来最终调整抛起的高度,只有当实际两点间的距离小于这个值的时候才会起作用
				// 避免出现太近的时候抛得太高
				projNormalDis:number = 200;
				// 加速度参数
				gk:number = -0.5;
				// y方向额初速度
				private m_ySpdV0:number = 3;
				// 重力加速度值的一半
				private m_halfGK:number = 0;
				// 需要移动的次数
				private m_times:number = 0;
				// 分步序号
				private m_i:number = 0;
				// 记录初始位置
				private m_startX:number = 0;
				private m_startY:number = 0;
				private m_startZ:number = 0;
				// 三个轴向的变化量
				private m_dX:number = 0;
				private m_dY:number = 0;
				private m_dZ:number = 0;
				private m_k:number;
				private m_py:number;
				constructor(px:number = 0,py:number=0,pz:number=0,pw:number=0) 
				{
					super(px,py,pz,pw);
				}
				isMoving():boolean
				{
					return this.m_moving;
				}
				/**
				 * 是否已经到达目标位置
				 */
				isArrived():boolean
				{
					return this.m_arrived;
				}
				/**
				 * 从自身当前位置做抛体运动到目标位置
				 * 速度大小由 speed 属性定义, 注意这个属性定义的速度大小实际是 xoy平面上的速度大小
				 */
				setDstXYZ(px:number, py:number, pz:number):void
				{
					this.m_arrived = false;
					this.m_moving = true;
					// 检测当前位置和目标点之间的空间距离
					this.m_py = Vector3D.DistanceXYZ(this.x, this.y, this.z, px, py, pz);

					// 如果距离过近
					if (this.m_py < 1.5 * this.speed)
					{
						this.setTo(px,py,pz);
						this.m_arrived = true;
						this.m_moving = false;
						return;
					}			
					this.m_dX = this.m_py / this.projNormalDis;
					if (this.m_dX > 1.0)
					{
						this.m_dX = 1.0;
					}
					// 计算步数
					this.m_times = this.m_py / this.speed;
					// 半加速度值
					this.m_halfGK = 0.5 * this.gk;
					// 高度差,实际上就是z轴上的位移
					this.m_dY = py - this.y;
					// 计算出初速度(基于抛体运动方程)
					this.m_ySpdV0 = (this.m_dY - this.m_halfGK * this.m_times * this.m_times) / this.m_times;
					// 计算出最大的高度
					this.m_py = Math.abs(this.m_ySpdV0 / this.gk);
					this.m_py = this.m_ySpdV0 * this.m_py + this.m_py * this.m_py * this.m_halfGK;

					// 如果抛起的高度太高重新计算速度
					if (this.m_py > 0.0)
					{
						this.m_py = this.m_dX * this.projMaxH / this.m_py;
						if (this.m_py < 1.0) {
							this.m_halfGK *= this.m_py;
							this.m_ySpdV0 = (this.m_dY - this.m_halfGK * this.m_times * this.m_times) / this.m_times;
						}
					}
					this.m_startX = this.x;
					this.m_startY = this.y;
					this.m_startZ = this.z;
					//
					this.m_dX = px - this.m_startX;
					this.m_dY = 0;
					this.m_dZ = pz - this.m_startZ;
					//
					this.m_i = 0;
					this.m_py = 1.0 / this.m_times;
					this.m_moving = true;
				}
				/**
				 * 此函数由外部不停的调用,以实现运动控制
				 */
				run():void
				{			
					if (this.m_moving) {
						this.m_i++;
						if (this.m_i < this.m_times)
						{
							this.m_i++;
						}
						else
						{
							this.m_i = this.m_times;
							this.m_moving = false;
							this.m_arrived = true;
						}
						this.m_k = this.m_i * this.m_py;
						this.m_dY = (this.m_k * this.m_times);
						this.m_dY = this.m_startY + this.m_dY * (this.m_ySpdV0 + this.m_dY * this.m_halfGK);
						this.setTo(this.m_startX + this.m_k * this.m_dX, this.m_dY, this.m_startZ + this.m_k * this.m_dZ);
					}
				}
			}
		}
	}
}