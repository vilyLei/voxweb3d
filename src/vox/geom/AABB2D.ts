/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3D from "../math/Vector3D";
import IAABB2D from "./IAABB2D";

export default class AABB2D implements IAABB2D {

	private m_right = 100;
	private m_top = 100;
	private m_cx = 0;
	private m_cy = 0;

	x = 0;
	y = 0;
	width = 100;
	height = 100;

	constructor(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0) {

		this.x = px;
		this.y = py;
		this.width = pwidth;
		this.height = pheight;

		this.update();
	}
	moveCenterTo(px: number, py: number): IAABB2D {
		this.x += px - this.m_cx;
		this.y += py - this.m_cy;
		this.update();
		return this;
	}
	scaleBy(s: number): IAABB2D {
		this.x *= s;
		this.y *= s;
		this.width *= s;
		this.height *= s;
		this.m_right = this.x + this.width;
		this.m_top = this.y + this.height;
		return this;
	}
	union(r: IAABB2D): IAABB2D {
		this.addXY(r.x, r.y);
		this.addXY(r.getRight(), r.getTop());
		return this;
	}
	addXY(pvx: number, pvy: number): IAABB2D {

		if (this.x > pvx) this.x = pvx;
		if (this.m_right < pvx) this.m_right = pvx;

		if (this.y > pvy) this.y = pvy;
		if (this.m_top < pvy) this.m_top = pvy;

		this.width = this.m_right - this.x;
		this.height = this.m_top - this.y;
		this.m_cx = this.x + this.width * 0.5;
		this.m_cy = this.y + this.height * 0.5;
		return this;
	}
	reset(): IAABB2D {
		this.x = this.y = 0xfffffff;
		this.m_right = this.m_top = -0xfffffff;
		this.width = this.height = 0;
		this.m_cx = 0;
		this.m_cy = 0;
		return this;
	}
	copyFrom(src: AABB2D): IAABB2D {

		this.x = src.x;
		this.y = src.y;
		this.width = src.width;
		this.height = src.height;

		this.m_right = src.m_right;
		this.m_top = src.m_top;

		this.m_cx = src.m_cx;
		this.m_cy = src.m_cy;

		return this;
	}
	clone(): AABB2D {
		return new AABB2D(this.x, this.y, this.width, this.height);
	}
	/**
	 * 当前矩形是否包含某一点(同一坐标空间的点)
	 * @param x坐标
	 * @param y坐标
	 * @returns 返回当前矩形是否包含这个坐标位置
	 */
	containsXY(vx: number, vy: number): boolean {
		if (vx < this.x || vx > this.m_right) return false;
		if (vy < this.y || vy > this.m_top) return false;
		return true;
	}
	/**
	 * 当前矩形是否包含目标矩形
	 * @param src 目标矩形
	 * @returns 返回当前矩形是否包含目标矩形
	 */
	contains(src: AABB2D): boolean {
		if (src.x >= this.x && src.m_right <= this.m_right) {
			if (src.y >= this.y && src.m_top <= this.m_top) {
				return true;
			}
		}
		return true;
	}
	/**
	 * 当前矩形是否和目标矩形相交
	 * @param src 目标矩形
	 * @returns 返回当前矩形是否和目标矩形相交
	 */
	intersect(src: AABB2D): boolean {

		if (src.x > this.m_right) return false;
		if (src.m_right < this.x) return false;
		if (src.y > this.m_top) return false;
		if (src.m_top < this.y) return false;
		return true;
	}
	setTo(x: number, y: number, width: number, height: number): IAABB2D {

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.m_right = this.width + this.x;
		this.m_top = this.height + this.y;
		this.m_cx = this.x + this.width * 0.5;
		this.m_cy = this.y + this.height * 0.5;
		return this;
	}

	setSize(width: number, height: number): IAABB2D {

		this.width = width;
		this.height = height;
		this.m_right = this.width + this.x;
		this.m_top = this.height + this.y;
		this.m_cx = this.x + this.width * 0.5;
		this.m_cy = this.y + this.height * 0.5;
		return this;
	}

    testEqual(src: AABB2D): boolean {
        return this.x != src.x || this.y != src.y || this.width != src.width || this.height != src.height;
    }
    testEqualWithParams(px: number, py: number, pw: number, ph: number): boolean {
        return this.x != px || this.y != py || this.width != pw || this.height != ph;
    }
	update(): IAABB2D {
		this.m_right = this.width + this.x;
		this.m_top = this.height + this.y;
		this.m_cx = this.x + this.width * 0.5;
		this.m_cy = this.y + this.height * 0.5;
		return this;
	}
	flipY(height: number): IAABB2D {
		this.y = height - this.y;
		this.update();
		return this;
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
