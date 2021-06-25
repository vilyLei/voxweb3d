/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import { TextureProxyType, TextureFormat, TextureDataType, TextureTarget, TextureConst } from "../../vox/texture/TextureConst";
import IRenderResource from "../../vox/render/IRenderResource";
import TextureProxy from "../../vox/texture/TextureProxy";

class FloatCubeTextureProxy extends TextureProxy {
    private m_imgDataList: any[] = null;
    constructor(texWidth: number, texHeight: number) {
        super(texWidth, texHeight, false);
        this.m_texTarget = TextureTarget.TEXTURE_CUBE;
        this.m_type = TextureProxyType.FloatCube;
        this.internalFormat = TextureFormat.RGBA16F;
        this.dataType = TextureDataType.FLOAT;
        this.mipmapEnabled = true;
    }
    toRGBFormat(): void {
        this.unpackAlignment = 1;
        this.srcFormat = TextureFormat.RGB;
        this.internalFormat = TextureFormat.RGB16F;
        this.minFilter = TextureConst.NEAREST;
        this.magFilter = TextureConst.NEAREST;
        this.mipmapEnabled = false;
    }
    toRGBFormatFloat32F(): void {
        this.unpackAlignment = 1;
        this.srcFormat = TextureFormat.RGB;
        this.internalFormat = TextureFormat.RGB32F;
        this.minFilter = TextureConst.NEAREST;
        this.magFilter = TextureConst.NEAREST;
        this.mipmapEnabled = false;
    }
    toRGBAFormat(): void {
        this.unpackAlignment = 4;
        this.srcFormat = TextureFormat.RGBA;
        this.internalFormat = TextureFormat.RGBA16F;
    }
    toRGBAFormatFloat32F(): void {
        this.unpackAlignment = 4;
        this.srcFormat = TextureFormat.RGBA;
        this.internalFormat = TextureFormat.RGBA32F;
    }
    toRGBAFormatHalfFloat(): void {
        this.unpackAlignment = 1;
        this.srcFormat = TextureFormat.RGBA;
        this.dataType = TextureDataType.HALF_FLOAT;
        this.internalFormat = TextureFormat.RGBA16F;
    }
    setDataFromBytesToFaceAt(index: number, bytes: Float32Array, pw: number, ph: number, miplevel: number = 0) {
        if (this.m_imgDataList == null) {
            this.m_imgDataList = [null, null, null, null, null, null];
        }
        if (pw > 0 && ph > 0) {
            if (index == 0 && miplevel < 1) {
                this.m_texWidth = pw;
                this.m_texHeight = ph;
                this.m_miplevel = miplevel;
            }
            if (this.m_imgDataList[index] == null) {
                this.m_imgDataList[index] = new Array(16);
            }
            let arr: any[] = this.m_imgDataList[index];
            arr[miplevel] = { width: pw, height: ph, imgData: bytes, miplevel: miplevel };
            
            this.m_haveRData = arr[miplevel].imgData != null;
        }
    }

    protected uploadData(texRes: IRenderResource): void {
        let gl: any = texRes.getRC();
        let imo: any = null;
        let width: number = this.getWidth();
        let height: number = this.getHeight();
        let pw: number;
        let ph: number;
        for (let i: number = 0; i < 6; ++i) {

            let arr: any[] = this.m_imgDataList[i];
            if (this.mipmapEnabled && this.m_generateMipmap) {
                imo = arr[0];
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, TextureFormat.ToGL(gl, this.internalFormat), width, height, 0, TextureFormat.ToGL(gl, this.srcFormat), TextureDataType.ToGL(gl, this.dataType), imo.imgData);
            } else {
                pw = width;
                ph = height;
                let j: number = 0;
                for (; (pw > 0 || ph > 0);) {
                    if (arr[j] != null) {
                        imo = arr[j];
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, TextureFormat.ToGL(gl, this.internalFormat), pw, ph, 0, TextureFormat.ToGL(gl, this.srcFormat), TextureDataType.ToGL(gl, this.dataType), imo.imgData);
                    }
                    if (pw > 0) pw >>= 1;
                    if (ph > 0) ph >>= 1;
                    ++j;
                }
            }
        }
        this.version = 0;
    }
    toString(): string {
        return "[FloatCubeTextureProxy(name:" + this.name + ",uid=" + this.getUid() + ",width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
    }
    __$destroy(): void {
        if (this.getAttachCount() < 1) {
            if (this.m_imgDataList != null) {
                for (let i: number = 0; i < 6; ++i) {
                    if (this.m_imgDataList[i] != null) {
                        this.m_imgDataList[i].imgData = null;
                    }
                }
            }
            console.log("FloatCubeTextureProxy::destroy(), destroy a FloatCubeTextureProxy instance...");
            super.__$destroy();
        }
    }
}
export default FloatCubeTextureProxy;