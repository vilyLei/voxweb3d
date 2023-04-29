/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IAABB2D {

	x: number;
	y: number;
	width: number;
	height: number;

	copyFrom(dst: IAABB2D): void;
	clone(): IAABB2D;
	/**
	 * 当前矩形是否包含某一点(同一坐标空间的点)
	 * @param x坐标
	 * @param y坐标
	 * @returns 返回当前矩形是否包含这个坐标位置
	 */
	containsXY(vx: number, vy: number): boolean;
	/**
	 * 当前矩形是否包含目标矩形
	 * @param dst 目标矩形
	 * @returns 返回当前矩形是否包含目标矩形
	 */
	contains(dst: IAABB2D): boolean;
	/**
	 * 当前矩形是否和目标矩形相交
	 * @param dst 目标矩形
	 * @returns 返回当前矩形是否和目标矩形相交
	 */
	intersect(dst: IAABB2D): boolean;
	setTo(x: number, y: number, width: number, height: number): void;

	setSize(width: number, height: number): void;

    testEqual(dst: IAABB2D): boolean;
    testEqualWithParams(px: number, py: number, pw: number, ph: number): boolean;
	update(): void;
	flipY(height: number): void;
	getX(): number;
	getY(): number;
	getRight(): number;
	getTop(): number;
	getCenterX(): number;
	getCenterY(): number;
}
