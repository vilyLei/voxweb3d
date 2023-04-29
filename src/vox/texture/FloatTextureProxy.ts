/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { TextureProxyType } from "../../vox/texture/TextureProxyType";
import TextureConst from "../../vox/texture/TextureConst";
import TextureFormat from "../../vox/texture/TextureFormat";
import TextureDataType from "../../vox/texture/TextureDataType";
import RawDataTextureProxy from "../../vox/texture/RawDataTextureProxy";
import { IFloatTexture } from "../../vox/render/texture/IFloatTexture";

class FloatTextureProxy extends RawDataTextureProxy implements IFloatTexture {
    constructor(texWidth: number, texHeight: number, powerof2Boo: boolean = false) {
        super(texWidth, texHeight, powerof2Boo);
        this.m_type = TextureProxyType.Float;
        this.minFilter = TextureConst.LINEAR;
        this.internalFormat = TextureFormat.RGBA16F;
        this.dataType = TextureDataType.FLOAT;
        this.unpackAlignment = 4;
    }
    toAlphaFormat(): void {
        this.srcFormat = TextureFormat.ALPHA;
        this.internalFormat = TextureFormat.ALPHA;
        this.unpackAlignment = 1;
    }
    toRedFormat(): void {
        this.srcFormat = TextureFormat.RED;
        this.internalFormat = TextureFormat.RED;
        this.unpackAlignment = 1;
    }
    toRGBFormat(): void {
        this.srcFormat = TextureFormat.RGB;
        this.internalFormat = TextureFormat.RGB16F;
        this.unpackAlignment = 1;
    }
    toRGBAFormat(): void {
        this.srcFormat = TextureFormat.RGBA;
        this.internalFormat = TextureFormat.RGBA;
        this.unpackAlignment = 4;
    }
    toRGBAFloatFormat(): void {
        this.srcFormat = TextureFormat.RGBA;
        this.internalFormat = TextureFormat.RGBA16F;
        this.unpackAlignment = 4;
    }

    setDataFromBytes(bytes: Float32Array, miplevel: number = 0, imgWidth: number = -1, imgHeight: number = -1, offsetx: number = 0, offsety: number = 0, rebuild: boolean = false): void {
        super.setDataFromBytes(bytes, miplevel, imgWidth, imgHeight, offsetx, offsety, rebuild);
    }
    setPartDataFromeBytes(bytes: Float32Array, px: number, py: number, twidth: number, theight: number, miplevel: number = 0): void {
        super.setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel);
    }
    getPixels(px: number, py: number, pw: number, ph: number, outBytes: Float32Array): void {
        super.getPixels(px, py, pw, ph, outBytes);
    }

    toString(): string {
        return "[FloatTextureProxy(width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
    }
}
export default FloatTextureProxy;