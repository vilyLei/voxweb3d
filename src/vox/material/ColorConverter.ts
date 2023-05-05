/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import Color4 from "./Color4";
let __$hsl = new Color4();
export default class ColorConverter {
	static setHSV(color: Color4, h: number, s: number, v: number) {
		// thanks: https://gist.github.com/xpansive/1337890#file-index-js

		h = MathConst.EuclideanModulo(h, 1);
		s = MathConst.Clamp(s, 0, 1);
		v = MathConst.Clamp(v, 0, 1);

		return color.setHSL(h, (s * v) / ((h = (2 - s) * v) < 1 ? h : 2 - h), h * 0.5);
	}

	static getHSV(color: Color4, target: Color4 = null): Color4 {
		if (!target) {
			target = new Color4();
		}

		color.getHSL(__$hsl);

		// thanks: https://gist.github.com/xpansive/1337890#file-index-js
		__$hsl.s *= __$hsl.l < 0.5 ? __$hsl.l : 1 - __$hsl.l;

		target.h = __$hsl.h;
		target.s = (2 * __$hsl.s) / (__$hsl.l + __$hsl.s);
		target.v = __$hsl.l + __$hsl.s;

		return target;
	}

	// where c, m, y, k is between 0 and 1
	static setCMYK(color: Color4, c: number, m: number, y: number, k: number): Color4 {
		const r = (1 - c) * (1 - k);
		const g = (1 - m) * (1 - k);
		const b = (1 - y) * (1 - k);

		return color.setRGB3f(r, g, b);
	}

	static getCMYK(color: Color4, target: Color4 = null): Color4 {
		if (!target) {
			target = new Color4();
		}

		const r = color.r;
		const g = color.g;
		const b = color.b;

		const k = 1 - Math.max(r, g, b);
		const c = (1 - r - k) / (1 - k);
		const m = (1 - g - k) / (1 - k);
		const y = (1 - b - k) / (1 - k);

		target.c = c;
		target.m = m;
		target.y = y;
		target.k = k;

		return target;
	}
}
