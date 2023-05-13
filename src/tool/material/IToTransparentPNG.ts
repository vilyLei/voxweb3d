/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IToTransparentPNG {
    mapLodEnabled: boolean;
	fixScreen: boolean;
    /**
     * @param p 色彩透明度强度值
     */
    setColorAlphaStrength(p: number): void;
    getColorAlphaStrength(): number;
    /**
     * @param p 颜色强度值
     */
	setColorStrength(p: number): void;
	getColorStrength(): number;
    /**
     * @param p 背景剔除比例值
     */
	setAlphaDiscardFactor(p: number): void;
	getAlphaDiscardFactor(): number;
    /**
     * @param boo true 表示显示原图, false 表示显示剔除之后的结果
     */
	setShowInitImg(boo: boolean): void;
	getShowInitImg(): boolean;
    /**
     * 计算颜色透明情况的阈值
     * @param r 0.0, -> 1.0
     */
    setDiscardRadius(r: number): void;
    getDiscardRadius(): number;
    /**
     * @param boo true or false
     */
    setInvertAlpha(boo: boolean): void;
    getInvertAlpha(): boolean;
    /**
     * @param boo true or false
     */
    setInvertRGB(boo: boolean): void;
    getInvertRGB(): boolean;
	setSeparateAlpha(v: number): void;
	getSeparateAlpha(): number;
	setInvertDiscard(boo: boolean): void;
	getInvertDiscard(): boolean;
	paramCopyFrom(dst: IToTransparentPNG): void;
	setDiscardDstRGB(r: number, g: number, b: number): void;
	setInitAlphaFactor(f: number): void;
	getInitAlphaFactor(): number;
	cloneData(): Float32Array;
	/**
	 * @param clone the default value is false
	 * @returns Float32Array type data
	 */
	getData(clone?: boolean): Float32Array;
	/**
	 * @param ds Float32Array type data
	 * @param i the default value is 0
	 */
	setData(ds: Float32Array, i?: number): void;
}
