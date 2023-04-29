/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface IFloatCubeTexture extends IRenderTexture {
    
    toAlphaFormat(): void;
    toRedFormat(): void;
    toRGBFormat(): void;
    toRGBAFormat(): void;

    toRGBFormatFloat32F(): void;
    toRGBAFormatFloat32F(): void;
    toRGBAFormatHalfFloat(): void;
    
    /**
     * 
     * @param index cube face index(its value includes 0 -> 5)
     * @param bytes texture image float32 format bytes data
     * @param pw texture image width
     * @param ph texture image height
     * @param miplevel the default value is 0
     */
    setDataFromBytesToFaceAt(index: number, bytes: Float32Array, pw: number, ph: number, miplevel: number): void;
}
export { IFloatCubeTexture };