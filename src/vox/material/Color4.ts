/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as MathConstT from "../../vox/utils/MathConst";
import MathConst = MathConstT.vox.utils.MathConst;

export namespace vox
{
    export namespace material
    {
        export class Color4
        {
            r:number = 1.0;
            g:number = 1.0;
            b:number = 1.0;
            a:number = 1.0;
            constructor(pr:number = 1.0,pg:number = 1.0,pb:number = 1.0,pa:number = 1.0)
            {
                this.r = pr;
                this.g = pg;
                this.b = pb;
                this.a = pa;
            }
            setRGB3Bytes(r:number,g:number,b:number):void
            {
                this.r = r/255.0;
                this.g = g/255.0;
                this.b = b/255.0;
            }
            setRGB3f(r:number,g:number,b:number):void
            {
                this.r = r;
                this.g = g;
                this.b = b;
            }
            setRGBUint24(rgbUint24:number):void
            {
                this.r = ((rgbUint24 >> 16) & 0x0000ff)/255.0;
                this.g = ((rgbUint24 >> 8) & 0x0000ff)/255.0;
                this.b = (rgbUint24 & 0x0000ff)/255.0;
            }
            setRGBA4f(r:number,g:number,b:number,a:number):void
            {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
            copyFrom(c:Color4):void
            {
                this.r = c.r;
                this.g = c.g;
                this.b = c.b;
                this.a = c.a;
            }
            scaleBy(s:number):void
            {
                this.r *= s;
                this.g *= s;
                this.b *= s;
            }
            randomRGB(density:number = 1.0):void
            {
                this.r = Math.random() * density;
                this.g = Math.random() * density;
                this.b = Math.random() * density;
            }
            normalizeRandom(density:number = 1.0):void
            {
                this.r = Math.random() * density;
                this.g = Math.random() * density;
                this.b = Math.random() * density;
                let d = Math.sqrt(this.r*this.r + this.g*this.g + this.b*this.b);
                if (d > MathConst.MATH_MIN_POSITIVE)
                {
                    this.r = density * this.r/d;
                    this.g = density * this.g/d;
                    this.b = density * this.b/d;
                }       
            }
            normalize(density:number):void
            {
                if(density == undefined) density = 1.0;
                let d = Math.sqrt(this.r*this.r + this.g*this.g + this.b*this.b);
                if (d > MathConst.MATH_MIN_POSITIVE)
                {
                    this.r = density * this.r/d;
                    this.g = density * this.g/d;
                    this.b = density * this.b/d;
                }
            }
            toString():string
            {
                return "[Color4(r="+this.r+", g="+this.g+",b="+this.b+",a="+this.a+")]";
            }
        }
    }
}