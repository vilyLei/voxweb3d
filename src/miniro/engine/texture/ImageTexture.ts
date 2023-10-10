/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ITexData from "./ITexData";
import ImgTexData from "./ImgTexData";
import { TextureType } from "./TextureType";
import Texture from "./Texture";

class ImageTexture extends Texture {
    constructor(gl:any, texWidth: number = 128, texHeight: number = 128) {
        super(gl, texWidth, texHeight);
        this.mipmapEnabled = true;
        this.minFilter = gl.LINEAR_MIPMAP_LINEAR;
        this.mType = TextureType.Image;
    }
    private mTexData: ImgTexData = null;
    private mTexDatas: ITexData[] = null;
    private mTexDatasLen = 0;
    getTexData(): ImgTexData {
        return this.mTexData;
    }
    /**
     * 设置纹理原始数据，可以对纹理局部或者整体(rebuild = true)更新
     * @param img value from: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap
     * @param miplevel mipmaps level
    */
    setDataFromImage(img: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, miplevel: number = 0, offsetx: number = 0, offsety: number = 0, rebuild: boolean = false): void {
        if (img && img.width > 0 && img.height > 0) {
            this.mHaveRData = true;
            if (miplevel < 0) miplevel = 0;
            if (miplevel > 15) miplevel = 15;
            if (miplevel >= this.mTexDatasLen) {
                this.mTexDatasLen = miplevel + 1;
            }
            let td: ImgTexData = this.mTexData;
            if (td != null) {
                if (this.mTexData.miplevel != miplevel) {
                    if (this.mTexDatas == null) {
                        this.mTexDatas = [this.mTexData, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
                    }
                    td = this.mTexDatas[miplevel] as ImgTexData;
                    if (td == null) {
                        td = ImgTexData.Create();
                        td.miplevel = miplevel;
                        rebuild = true;
                        this.mTexDatas[miplevel] = td;
                    }
                }
                else if (this.isGpuEnabled()) {
                    td.status = 0;
                }
            }
            else {
                td = this.mTexData = ImgTexData.Create();
                td.miplevel = miplevel;
                rebuild = true;
                this.mTexWidth = img.width;
                this.mTexHeight = img.height;
            }

            if (td.data != img || td.offsetx != offsetx || td.offsety != offsety) {
                if (miplevel == 0) {
                    this.mTexWidth = img.width;
                    this.mTexHeight = img.height;
                }
                td.data = img;
                td.status = 0;// 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新
                if (td.width < img.width || td.height < img.height || rebuild) {
                    td.width = img.width;
                    td.height = img.height;
                    td.status = 1;
                }
                td.offsetx = offsetx;
                td.offsety = offsety;
            }
            this.version++;
			this.testDataEnough();
        }
    }
    protected uploadData(gl: any): void {
        if (this.mTexData) {
            this.dataUploadToGpu(gl, this.mTexData, this.mTexDatas, true);
        }
        this.version = 0;
    }
    __$updateToGpu(gl: any): void {
        // 这里之所以用这种方式判断，是为了运行时支持多 gpu context
        if (this.version > 0) {
            if (this.mTexData) {
                this.__$updateToGpuBegin(gl);
                this.dataUploadToGpu(gl, this.mTexData, this.mTexDatas);
                this.__$buildParam(gl);
                this.mGenerateMipmap = true;
            }
        }
    }
    __$destroy(): void {
        this.version = 0;
            if (this.mTexDatas != null) {
                for (let i = 0; i < this.mTexDatasLen; ++i) {
                    ImgTexData.Restore(this.mTexDatas[i] as ImgTexData);
                }
                this.mTexDatasLen = 0;
                this.mTexDatas = null;
                this.mTexData = null;
            }
            if (this.mTexData != null) {
                ImgTexData.Restore(this.mTexData);
                this.mTexData = null;
            }
            super.__$destroy();
    }
}
export {ImageTexture};
