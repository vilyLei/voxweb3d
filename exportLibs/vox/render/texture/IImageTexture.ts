/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface IImageTexture extends IRenderTexture {
    /**
     * 
     * @param img html image data
     * @param miplevel miplevel mipmap level, the default value is 0
     * @param offsetx the default value is 0
     * @param offsety the default value is 0
     * @param rebuild the default value is false
     */
    setDataFromImage(img: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, miplevel?: number, offsetx?: number, offsety?: number, rebuild?: boolean): void
}
export { IImageTexture }