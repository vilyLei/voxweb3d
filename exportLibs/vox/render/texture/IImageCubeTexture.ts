/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface IImageCubeTexture extends IRenderTexture {
    /**
     * 
     * @param index cube face index(its value includes 0 -> 5)
     * @param img html image data
     * @param miplevel mipmap level, the default value is 0
     */
    setDataFromImageToFaceAt(index: number, img: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, miplevel: number): void;
}
export { IImageCubeTexture }