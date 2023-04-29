/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface IBytesCubeTexture extends IRenderTexture {
    
    toAlphaFormat(): void;
    toRedFormat(): void;
    toRGBFormat(): void;
    toRGBAFormat(): void;
    /**
     * 
     * @param index cube face index(its value includes 0 -> 5)
     * @param bytes texture image uint8 format bytes data
     * @param pw texture image width
     * @param ph texture image height
     * @param miplevel the default value is 0
     */
    setDataFromBytesToFaceAt(index: number, bytes: Uint8Array, pw: number, ph: number, miplevel: number): void;
}
export { IBytesCubeTexture };