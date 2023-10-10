/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ITexData from "./ITexData";

export default class ImgTexData implements ITexData {
    private static sList: ImgTexData[] = [];
    width = 0;
    height = 0;
    data: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap | null = null;
    miplevel = 0;
    // 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新
    status = 1;
    offsetx = 0;
    offsety = 0;
    constructor() {
    }
    updateToGpu(gl: any, samplerTarget: number, interType: number, format: number, type: number, force: boolean): void {
        if (this.status == 1 || force) {
            gl.texImage2D(samplerTarget, this.miplevel, interType, format, type, this.data);
        }
        else if (this.status == 0) {
            gl.texSubImage2D(samplerTarget, this.miplevel, this.offsetx, this.offsety, format, type, this.data);
        }
        this.status = -1;
    }
    static Create(): ImgTexData {
        if (ImgTexData.sList.length > 0) {
            return ImgTexData.sList.pop();
        }
        return new ImgTexData();
    }
    static Restore(tsd: ImgTexData): void {
        if (tsd != null) {
            tsd.data = null;
            ImgTexData.sList.push(tsd);
        }
    }
}
