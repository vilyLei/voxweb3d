/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface IFloatTexture extends IRenderTexture {
    toAlphaFormat(): void;
    toRedFormat(): void;
    toRGBFormat(): void;
    toRGBAFormat(): void;
    /**
     * 
     * @param bytes float format data bytes texture data
     * @param miplevel mipmap level, the default value is 0
     * @param imgWidth the default value is -1
     * @param imgHeight the default value is -1
     * @param offsetx the default value is 0
     * @param offsety the default value is 0
     * @param rebuild the default value is false
     */
    setDataFromBytes(bytes: Float32Array, miplevel: number, imgWidth: number, imgHeight: number, offsetx: number, offsety: number, rebuild: boolean): void;
    /**
     * 
     * @param bytes float format data bytes texture data
     * @param px x-axis offset value
     * @param py y-axis offset value
     * @param twidth texture width of the mipmap level texture
     * @param theight texture height of the mipmap level texture
     * @param miplevel mipmap level, the default value is 0
     */
    setPartDataFromeBytes(bytes: Float32Array, px: number, py: number, twidth: number, theight: number, miplevel: number): void;
    getPixels(px: number, py: number, pw: number, ph: number, outBytes: Float32Array): void;
    
}
export { IFloatTexture }