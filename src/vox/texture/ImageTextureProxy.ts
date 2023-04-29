/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ITexData from "../../vox/texture/ITexData";
import { TextureProxyType } from "../../vox/texture/TextureProxyType";
import TextureConst from "../../vox/texture/TextureConst";
import ImgTexData from "../../vox/texture/ImgTexData";
import IRenderResource from "../../vox/render/IRenderResource";
import TextureProxy from "../../vox/texture/TextureProxy";
import { IImageTexture } from "../../vox/render/texture/IImageTexture";

class ImageTextureProxy extends TextureProxy implements IImageTexture {
    constructor(texWidth: number, texHeight: number, powerof2Boo: boolean = false) {
        super(texWidth, texHeight, powerof2Boo);
        this.mipmapEnabled = true;
        this.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        this.m_type = TextureProxyType.Image;
    }
    private m_texData: ImgTexData = null;
    private m_texDatas: ITexData[] = null;
    private m_texDatasLen: number = 0;
    getTexData(): ImgTexData {
        return this.m_texData;
    }
    /**
     * 设置纹理原始数据，可以对纹理局部或者整体(rebuild = true)更新
     * @param img value from: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap
     * @param miplevel mipmaps level
    */
    setDataFromImage(img: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, miplevel: number = 0, offsetx: number = 0, offsety: number = 0, rebuild: boolean = false): void {
        if (img && img.width > 0 && img.height > 0) {
            this.m_haveRData = true;
            if (miplevel < 0) miplevel = 0;
            if (miplevel > 15) miplevel = 15;
            if (miplevel >= this.m_texDatasLen) {
                this.m_texDatasLen = miplevel + 1;
            }
            let td: ImgTexData = this.m_texData;
            if (td != null) {
                if (this.m_texData.miplevel != miplevel) {
                    if (this.m_texDatas == null) {
                        this.m_texDatas = [this.m_texData, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
                    }
                    td = this.m_texDatas[miplevel] as ImgTexData;
                    if (td == null) {
                        td = ImgTexData.Create();
                        td.miplevel = miplevel;
                        rebuild = true;
                        this.m_texDatas[miplevel] = td;
                    }
                }
                else if (this.isGpuEnabled()) {
                    td.status = 0;
                }
            }
            else {
                td = this.m_texData = ImgTexData.Create();
                td.miplevel = miplevel;
                rebuild = true;
                this.m_texWidth = img.width;
                this.m_texHeight = img.height;
            }

            if (td.data != img || td.offsetx != offsetx || td.offsety != offsety) {
                if (miplevel == 0) {
                    this.m_texWidth = img.width;
                    this.m_texHeight = img.height;
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
    protected uploadData(texRes: IRenderResource): void {
        if (this.m_texData != null) {
            this.dataUploadToGpu(texRes.getRC(), this.m_texData, this.m_texDatas, true);
        }
        this.version = 0;
    }
    __$updateToGpu(texRes: IRenderResource): void {
        // 这里之所以用这种方式判断，是为了运行时支持多 gpu context
        if (this.version > 0 && texRes.hasResUid(this.getResUid())) {
            if (this.m_texData != null) {
                let gl: any = texRes.getRC();
                this.__$updateToGpuBegin(texRes);
                this.dataUploadToGpu(gl, this.m_texData, this.m_texDatas);
                this.__$buildParam(gl);
                this.m_generateMipmap = true;
            }
        }
    }
    __$destroy(): void {
        if (this.getAttachCount() < 1) {
            this.version = 0;
            if (this.m_texDatas != null) {
                for (let i: number = 0; i < this.m_texDatasLen; ++i) {
                    ImgTexData.Restore(this.m_texDatas[i] as ImgTexData);
                }
                this.m_texDatasLen = 0;
                this.m_texDatas = null;
                this.m_texData = null;
            }
            if (this.m_texData != null) {
                ImgTexData.Restore(this.m_texData);
                this.m_texData = null;
            }
            super.__$destroy();
        }
    }
}
export default ImageTextureProxy;
