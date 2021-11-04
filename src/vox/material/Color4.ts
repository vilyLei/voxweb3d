/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import MathConst from "../../vox/math/MathConst";
class Color4 {
    r: number = 1.0;
    g: number = 1.0;
    b: number = 1.0;
    a: number = 1.0;
    constructor(pr: number = 1.0, pg: number = 1.0, pb: number = 1.0, pa: number = 1.0) {
        this.r = pr;
        this.g = pg;
        this.b = pb;
        this.a = pa;
    }
    setRGB3Bytes(r: number, g: number, b: number): void {
        this.r = r / 255.0;
        this.g = g / 255.0;
        this.b = b / 255.0;
    }
    setRGB3f(r: number, g: number, b: number): void {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    setRGBUint24(rgbUint24: number): void {
        this.r = ((rgbUint24 >> 16) & 0x0000ff) / 255.0;
        this.g = ((rgbUint24 >> 8) & 0x0000ff) / 255.0;
        this.b = (rgbUint24 & 0x0000ff) / 255.0;
    }
    setRGBA4f(r: number, g: number, b: number, a: number): void {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    copyFrom(c: Color4): void {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
    }
    scaleBy(s: number): void {
        this.r *= s;
        this.g *= s;
        this.b *= s;
    }
    inverseRGB(): void {
        this.r = 1.0 - this.r;
        this.g = 1.0 - this.g;
        this.b = 1.0 - this.b;
    }
    randomRGB(density: number = 1.0): void {
        this.r = Math.random() * density;
        this.g = Math.random() * density;
        this.b = Math.random() * density;
    }
    normalizeRandom(density: number = 1.0): void {
        this.r = Math.random();
        this.g = Math.random();
        this.b = Math.random();
        let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
        if (d > MathConst.MATH_MIN_POSITIVE) {
            this.r = density * this.r / d;
            this.g = density * this.g / d;
            this.b = density * this.b / d;
        }
    }
    normalize(density: number): void {
        if (density == undefined) density = 1.0;
        let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
        if (d > MathConst.MATH_MIN_POSITIVE) {
            this.r = density * this.r / d;
            this.g = density * this.g / d;
            this.b = density * this.b / d;
        }
    }

    /**
     * @returns for example: rgba(255,255,255,1.0)
     */
    getCSSDecRGBAColor(): string {
        let pr: number = Math.floor(this.r * 255.0);
        let pg: number = Math.floor(this.g * 255.0);
        let pb: number = Math.floor(this.b * 255.0);
        let pa = this.a;
        // pr = MathConst.Clamp(pr, 0, 255);
        // pg = MathConst.Clamp(pg, 0, 255);
        // pb = MathConst.Clamp(pb, 0, 255);
        // let pa = MathConst.Clamp(this.a, 0.0, 1.0);
        return "rgba(" + pr + "," + pg + "," + pb + "," + pa + ")";
    }
    /**
     * @returns for example: #350b7e
     */
    getCSSHeXRGBColor(): string {
        let str: string = "#";
        let t: number = Math.floor(this.r * 255.0);
        if (t < 0xf) {
            str += "0" + t.toString(16);
        }
        else {
            str += "" + t.toString(16);
        }

        t = Math.floor(this.g * 255.0);
        if (t < 0xf) {
            str += "0" + t.toString(16);
        }
        else {
            str += "" + t.toString(16);
        }
        t = Math.floor(this.b * 255.0);
        if (t < 0xf) {
            str += "0" + t.toString(16);
        }
        else {
            str += "" + t.toString(16);
        }
        return str;
    }
    toString(): string {
        return "[Color4(r=" + this.r + ", g=" + this.g + ",b=" + this.b + ",a=" + this.a + ")]";
    }
}
export default Color4;