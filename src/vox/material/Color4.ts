/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "./IColor4";

const __$mcv: number = 1e-5;

class Color4 implements IColor4 {
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
    clone(): Color4 {
        return new Color4(this.r, this.g, this.b, this.a);
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
    // setRGB3Bytes(uint8R: number, uint8G: number, uint8B: number): Color4 {
    //     let k = 1.0 / 255.0;
    //     this.r = uint8R * k;
    //     this.g = uint8G * k;
    //     this.b = uint8B * k;
    //     return this;
    // }
    setRGBUint24(rgbUint24: number): Color4 {
        this.r = ((rgbUint24 >> 16) & 0x0000ff) / 255.0;
        this.g = ((rgbUint24 >> 8) & 0x0000ff) / 255.0;
        this.b = (rgbUint24 & 0x0000ff) / 255.0;
        return this;
    }
    getRGBUint24(): number {
        return (Math.round(this.r * 255) << 16) + (Math.round(this.g * 255) << 8) + Math.round(this.b * 255);
    }
    setRGBA4f(r: number, g: number, b: number, a: number): Color4 {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
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
            this.r = density * this.r / d;
            this.g = density * this.g / d;
            this.b = density * this.b / d;
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
            this.r = density * this.r / d;
            this.g = density * this.g / d;
            this.b = density * this.b / d;
        }
        return this;
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
        let str = "#";
        let t = Math.floor(this.r * 255.0);
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
