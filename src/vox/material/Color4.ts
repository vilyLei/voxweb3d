/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "./IColor4";

const __$mcv = 1e-5;

function lerp(x: number, y: number, t: number): number {
	return (1 - t) * x + t * y;
}
function euclideanModulo(n: number, m: number): number {
	return ((n % m) + m) % m;
}
function clamp(value: number, min: number, max: number): number {
	return Math.max(Math.min(value, max), min);
}

function hue2rgb(p: number, q: number, t: number): number {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
	return p;
}

function srgbToLinear(c: number): number {
	return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
}

function linearToSRGB(c: number): number {
	return c < 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 0.41666) - 0.055;
}
function getHexStr(v: number): string {
	let t = Math.floor(v * 255.0);
	if (t < 0xf) {
		return "0" + t.toString(16);
	} else {
		return "" + t.toString(16);
	}
}

export default class Color4 implements IColor4 {
	private static s_c0 = new Color4();
	private static s_c1 = new Color4();

	r: number;
	g: number;
	b: number;
	a: number;

	h = 0.0;
	s = 0.0;
	l = 0.0;
	v = 0.0;

	c = 0.0;
	m = 0.0;
	y = 0.0;
	k = 0.0;
	constructor(pr: number = 1.0, pg: number = 1.0, pb: number = 1.0, pa: number = 1.0) {
		this.r = pr;
		this.g = pg;
		this.b = pb;
		this.a = pa;
	}
	clone(): Color4 {
		return new Color4(this.r, this.g, this.b, this.a);
	}
	gammaCorrect(): Color4 {
		const f = 1.0 / 2.2;
		this.r = Math.pow(this.r, f);
		this.g = Math.pow(this.g, f);
		this.b = Math.pow(this.b, f);
		return this;
	}
	fromArray4(arr: number[] | Float32Array, offset: number = 0): Color4 {
		this.r = arr[offset];
		this.g = arr[offset + 1];
		this.b = arr[offset + 2];
		this.a = arr[offset + 3];
		return this;
	}
	toArray4(arr: number[] | Float32Array, offset: number = 0): Color4 {
		arr[offset] = this.r;
		arr[offset + 1] = this.g;
		arr[offset + 2] = this.b;
		arr[offset + 3] = this.a;
		return this;
	}
	fromArray3(arr: number[] | Float32Array, offset: number = 0): Color4 {
		this.r = arr[offset];
		this.g = arr[offset + 1];
		this.b = arr[offset + 2];
		return this;
	}
	toArray3(arr: number[] | Float32Array, offset: number = 0): Color4 {
		arr[offset] = this.r;
		arr[offset + 1] = this.g;
		arr[offset + 2] = this.b;
		return this;
	}

	fromBytesArray3(arr: number[] | Float32Array, offset: number = 0): Color4 {
		this.setRGB3Bytes(arr[offset], arr[offset + 1], arr[offset + 2]);
		return this;
	}
	toBytesArray3(arr: number[] | Float32Array, offset: number = 0): Color4 {
		arr[offset] = Math.round(this.r * 255);
		arr[offset + 1] = Math.round(this.g * 255);
		arr[offset + 2] = Math.round(this.b * 255);
		return this;
	}
	setRGB3f(r: number, g: number, b: number): Color4 {
		this.r = r;
		this.g = g;
		this.b = b;
		return this;
	}
	setRGB3Bytes(uint8R: number, uint8G: number, uint8B: number): Color4 {
		const k = 1.0 / 255.0;
		this.r = uint8R * k;
		this.g = uint8G * k;
		this.b = uint8B * k;
		return this;
		// return this.setRGB3Bytes(r,g,b);
	}
	setRGBUint24(rgbUint24: number): Color4 {
		const bit = 0xff;
		this.r = ((rgbUint24 >> 16) & bit) / 255.0;
		this.g = ((rgbUint24 >> 8) & bit) / 255.0;
		this.b = (rgbUint24 & bit) / 255.0;
		return this;
	}
	getRGBUint24(): number {
		return (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255);
	}

	/**
	 * @param argbUint32 example: 0xFFFF88cc
	 */
	setARGBUint32(argbUint32: number): IColor4 {
		const bit = 0xff;
		this.r = ((argbUint32 >> 16) & bit) / 255.0;
		this.g = ((argbUint32 >> 8) & bit) / 255.0;
		this.b = (argbUint32 & bit) / 255.0;
		this.a = ((argbUint32 >> 24) & bit) / 255.0;
		return this;
	}
	getARGBUint32(): number {
		return (Math.round(this.a * 255) << 24) + (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255);
	}
	setRGBA4f(r: number, g: number, b: number, a: number): Color4 {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		return this;
	}

	setAlpha(a: number): Color4 {
		this.a = a;
		return this;
	}
	/**
	 *
	 * @param contrast its value range is [-50.0, 100.0]
	 */
	setContrast(contrast: number): Color4 {
		/*
			//限制参数p;
			if(p>0){p=p+1;}//当p>0时,函数图像无限趋近于垂直
			else{p=1/(1-p);}//当p<0时,函数图像无限趋近于水平
			//使函数图像绕(0.5,0.5)为中心旋转;
			x=p*(x-0.5)+0.5;
			//返回x限制在0-1之间的值;
			return clamp(x, 0.0, 1.0);
		*/
		/*
			//限制参数p;
			if(p>0){p=p+1;}//当p>0时,函数图像无限趋近于垂直
			else{p=1/(1-p);}//当p<0时,函数图像无限趋近于水平
			//R通道运算;
			if(x.x>0.5){x.x=1-pow((2-x.x*2),p)/2;}
			else{x.x=pow((x.x*2),p)/2;}
			//G通道运算;
			if(x.y>0.5){x.y=1-pow((2-2*x.y),p)/2;}
			else{x.y=pow((2*x.y),p)/2;}
			//B通道运算;
			if(x.z>0.5){x.z=1-pow((2-2*x.z),p)/2;}
			else{x.z=pow((2*x.z),p)/2;}
			//返回值;
			return x;
			// thanks: https://zhuanlan.zhihu.com/p/415198746
		*/
		const factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
		const pr = 255.0 * this.r;
		const pg = 255.0 * this.g;
		const pb = 255.0 * this.b;
		this.r = clamp(factor * (pr - 128.0) + 128.0, 0.0, 255.0) / 255.0;
		this.g = clamp(factor * (pg - 128.0) + 128.0, 0.0, 255.0) / 255.0;
		this.b = clamp(factor * (pb - 128.0) + 128.0, 0.0, 255.0) / 255.0;
		return this;
	}
	toGray(): Color4 {
		this.r *= 0.2126;
		this.g *= 0.7152;
		this.b *= 0.0722;
		return this;
	}
	setHSL(h: number, s: number, l: number): Color4 {
		// h,s,l ranges are in 0.0 - 1.0
		h = euclideanModulo(h, 1);
		s = clamp(s, 0, 1);
		l = clamp(l, 0, 1);

		if (s === 0) {
			this.r = this.g = this.b = l;
		} else {
			const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
			const q = 2 * l - p;

			this.r = hue2rgb(q, p, h + 1 / 3);
			this.g = hue2rgb(q, p, h);
			this.b = hue2rgb(q, p, h - 1 / 3);
		}
		return this;
	}

	getHSL(target: Color4 = null): Color4 {
		// h,s,l ranges are in 0.0 - 1.0
		if (!target) {
			target = new Color4();
		}
		const r = this.r,
			g = this.g,
			b = this.b;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);

		let hue, saturation;
		const lightness = (min + max) / 2.0;

		if (min === max) {
			hue = 0;
			saturation = 0;
		} else {
			const delta = max - min;

			saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

			switch (max) {
				case r:
					hue = (g - b) / delta + (g < b ? 6 : 0);
					break;
				case g:
					hue = (b - r) / delta + 2;
					break;
				case b:
					hue = (r - g) / delta + 4;
					break;
			}

			hue /= 6;
		}

		target.h = hue;
		target.s = saturation;
		target.l = lightness;

		return target;
	}

	lerp(color: Color4, factor: number): Color4 {
		this.r += (color.r - this.r) * factor;
		this.g += (color.g - this.g) * factor;
		this.b += (color.b - this.b) * factor;
		return this;
	}

	lerpColors(color1: Color4, color2: Color4, factor: number): Color4 {
		this.r = color1.r + (color2.r - color1.r) * factor;
		this.g = color1.g + (color2.g - color1.g) * factor;
		this.b = color1.b + (color2.b - color1.b) * factor;

		return this;
	}
	lerpHSL(color: Color4, factor: number): Color4 {
		const c0 = Color4.s_c0;
		const c1 = Color4.s_c1;
		this.getHSL(c0);
		color.getHSL(c1);

		const h = lerp(c0.h, c1.h, factor);
		const s = lerp(c0.s, c1.s, factor);
		const l = lerp(c0.l, c1.l, factor);

		this.setHSL(h, s, l);

		return this;
	}
	copyFrom(c: Color4): Color4 {
		this.r = c.r;
		this.g = c.g;
		this.b = c.b;
		this.a = c.a;
		return this;
	}
	copyFromRGB(c: Color4): Color4 {
		this.r = c.r;
		this.g = c.g;
		this.b = c.b;
		return this;
	}
	scaleBy(s: number): Color4 {
		this.r *= s;
		this.g *= s;
		this.b *= s;
		return this;
	}
	inverseRGB(): Color4 {
		this.r = 1.0 - this.r;
		this.g = 1.0 - this.g;
		this.b = 1.0 - this.b;
		return this;
	}
	randomRGB(density: number = 1.0, bias: number = 0.0): Color4 {
		this.r = Math.random() * density + bias;
		this.g = Math.random() * density + bias;
		this.b = Math.random() * density + bias;
		return this;
	}
	normalizeRandom(density: number = 1.0, bias: number = 0.0): Color4 {
		this.r = Math.random();
		this.g = Math.random();
		this.b = Math.random();
		let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
		if (d > __$mcv) {
			this.r = (density * this.r) / d;
			this.g = (density * this.g) / d;
			this.b = (density * this.b) / d;
		}
		this.r += bias;
		this.g += bias;
		this.b += bias;
		return this;
	}
	normalize(density: number): Color4 {
		if (density == undefined) density = 1.0;
		let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
		if (d > __$mcv) {
			this.r = (density * this.r) / d;
			this.g = (density * this.g) / d;
			this.b = (density * this.b) / d;
		}
		return this;
	}
	rgbSizeTo(size: number): Color4 {
		let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
		d = size / d;
		this.r *= d;
		this.g *= d;
		this.b *= d;
		return this;
	}

	copySRGBToLinear(color: Color4): Color4 {
		this.r = srgbToLinear(color.r);
		this.g = srgbToLinear(color.g);
		this.b = srgbToLinear(color.b);

		return this;
	}

	copyLinearToSRGB(color: Color4): Color4 {
		this.r = linearToSRGB(color.r);
		this.g = linearToSRGB(color.g);
		this.b = linearToSRGB(color.b);

		return this;
	}

	convertSRGBToLinear(): Color4 {
		return this.copySRGBToLinear(this);
	}

	convertLinearToSRGB(): Color4 {
		return this.copyLinearToSRGB(this);
	}
	/**
	 * @returns for example: rgba(255,255,255,1.0)
	 */
	getCSSDecRGBAColor(): string {
		let pr = Math.floor(this.r * 255.0);
		let pg = Math.floor(this.g * 255.0);
		let pb = Math.floor(this.b * 255.0);
		let pa = this.a;
		return "rgba(" + pr + "," + pg + "," + pb + "," + pa + ")";
	}
	/**
	 * @returns for example: #350b7e
	 */
	getCSSHeXRGBColor(keyStr = "#"): string {
		let str = keyStr;
		str += getHexStr(this.r);
		str += getHexStr(this.g);
		str += getHexStr(this.b);
		return str;
	}
	toString(): string {
		return "[Color4(r=" + this.r + ", g=" + this.g + ",b=" + this.b + ",a=" + this.a + ")]";
	}
}
