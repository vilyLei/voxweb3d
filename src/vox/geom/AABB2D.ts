/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";


export default class AABB2D
{
    private m_right: number = 100;
	private m_top: number = 100;
	
    x: number = 0;
    y: number = 0;
    width: number = 100;
	height: number = 100;
	
	constructor(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0)
	{
		this.x = px;
		this.y = py;
		this.width = pheight;
		this.height = pheight;

		this.update();
	}
	/**
	 * 当前矩形是否包含某一点(同一坐标空间的点)
	 * @param x坐标
	 * @param y坐标
	 * @returns 返回当前矩形是否包含这个坐标位置
	 */
	containsXY(vx:number,vy:number):boolean
	{
		if (vx < this.x || vx > this.m_right) return false;
		if (vy < this.y || vy > this.m_top) return false;
		return true;
	}
	/**
	 * 当前矩形是否包含目标矩形
	 * @param dst 目标矩形
	 * @returns 返回当前矩形是否包含目标矩形
	 */
	contains(dst: AABB2D):boolean
	{
		if(dst.x >= this.x && dst.m_right <= this.m_right) {
			if(dst.y >= this.y && dst.m_top <= this.m_top) {
				return true;
			}
		}
		return true;
	}
	/**
	 * 当前矩形是否和目标矩形相交
	 * @param dst 目标矩形
	 * @returns 返回当前矩形是否和目标矩形相交
	 */
	intersect(dst: AABB2D): boolean {

		if(dst.x > this.m_right) return false;
		if(dst.m_right < this.x) return false;
		if(dst.y > this.m_top) return false;
		if(dst.m_top < this.y) return false;
		return true;
	}
	update(): void {
		this.m_right = this.width + this.x;
		this.m_top = this.height + this.y;
	}
	getX(): number {
		return this.x;
	}
	getY(): number {
		return this.y;
	}
	getRight(): number {
		return this.m_right;
	}
	getTop(): number {
		return this.m_top;
	}
}