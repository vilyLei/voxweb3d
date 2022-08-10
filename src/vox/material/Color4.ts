/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "./IColor4";

const MATH_MIN_POSITIVE: number = 1e-5;

class Color4 implements IColor4{
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(pr: number = 1.0, pg: number = 1.0, pb: number = 1.0, pa: number = 1.0) {
        this.r = pr;
        this.g = pg;
        this.b = pb;
        this.a = pa;
    }
    
    fromArray(arr: number[], offset?: number): IColor4 {
        this.r = arr[offset];
        this.g = arr[offset + 1];
        this.b = arr[offset + 2];
        return this;

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
    getRGBUint24(): number {
        return (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255);
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
    copyFromRGB(c: Color4): void {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
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
    randomRGB(density: number = 1.0, bias: number = 0.0): void {
        this.r = Math.random() * density;
        this.g = Math.random() * density;
        this.b = Math.random() * density;
        this.r += bias;
        this.g += bias;
        this.b += bias;
    }
    normalizeRandom(density: number = 1.0, bias: number = 0.0): void {
        this.r = Math.random();
        this.g = Math.random();
        this.b = Math.random();
        let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
        if (d > MATH_MIN_POSITIVE) {
            this.r = density * this.r / d;
            this.g = density * this.g / d;
            this.b = density * this.b / d;
        }
        this.r += bias;
        this.g += bias;
        this.b += bias;
    }
    normalize(density: number): void {
        if (density == undefined) density = 1.0;
        let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
        if (d > MATH_MIN_POSITIVE) {
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
