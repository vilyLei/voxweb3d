/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface IUint16Texture extends IRenderTexture {

    toHalfFloatOes(): void;
    toUShort565(): void;
    toUShort4444(): void;
    toUShort5551(): void;
    toUShort(): void;
    toAlphaFormat(): void;
    toRedFormat(): void;
    toRGBFormat(): void;
    toRGBAFormat(): void;
    /**
     * 
     * @param bytes uint16 format data bytes texture data
     * @param miplevel mipmap level, the default value is 0
     * @param imgWidth the default value is -1
     * @param imgHeight the default value is -1
     * @param offsetx the default value is 0
     * @param offsety the default value is 0
     * @param rebuild the default value is false
     */
    setDataFromBytes(bytes: Uint16Array, miplevel?: number, imgWidth?: number, imgHeight?: number, offsetx?: number, offsety?: number, rebuild?: boolean): void;
    /**
     * 
     * @param bytes uint16 format data bytes texture data
     * @param px x-axis offset value
     * @param py y-axis offset value
     * @param twidth texture width of the mipmap level texture
     * @param theight texture height of the mipmap level texture
     * @param miplevel mipmap level, the default value is 0
     */
    setPartDataFromeBytes(bytes: Uint16Array, px: number, py: number, twidth: number, theight: number, miplevel?: number): void;
    getPixels(px: number, py: number, pw: number, ph: number, outBytes: Uint16Array): void;
    
}
export { IUint16Texture }