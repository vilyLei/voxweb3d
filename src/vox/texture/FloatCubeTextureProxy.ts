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
    }
    setDataFromBytesToFaceAt(index: number, bytes: Float32Array, pw: number, ph: number, miplevel: number = 0) {
        if (this.m_imgDataList == null) {
            this.m_imgDataList = [null, null, null, null, null, null];
        }
        if (pw > 0 && ph > 0) {
            if (index == 0) {
                this.m_texWidth = pw;
                this.m_texHeight = ph;
                this.m_miplevel = miplevel;
            }
            this.m_imgDataList[index] = { imgData: bytes, miplevel: miplevel };
            let k: number = 5;
            for (; k >= 0; --k) {
                if (this.m_imgDataList[k] == null) {
                    break;
                }
            }
            this.m_haveRData = k < 0;
        }
    }

    protected uploadData(texRes: IRenderResource): void {
        let gl: any = texRes.getRC();
        let imo: any = null;
        for (let i: number = 0; i < 6; ++i) {
            imo = this.m_imgDataList[i];
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.m_miplevel, TextureFormat.ToGL(gl, this.internalFormat), this.getWidth(), this.getWidth(), 0, TextureFormat.ToGL(gl, this.srcFormat), TextureDataType.ToGL(gl, this.dataType), imo.imgData);
        }
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