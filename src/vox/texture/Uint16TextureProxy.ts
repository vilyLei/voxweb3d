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
import { IUint16Texture } from "../../vox/render/texture/IUint16Texture";

class Uint16TextureProxy extends RawDataTextureProxy implements IUint16Texture {
    constructor(texWidth: number, texHeight: number, powerof2Boo: boolean = false) {
        super(texWidth, texHeight, powerof2Boo);
        this.m_type = TextureProxyType.Uint16;
        this.minFilter = TextureConst.LINEAR;
        this.dataType = TextureDataType.UNSIGNED_SHORT;
    }
    //  OES_texture_half_float, HALF_FLOAT_OES
    toHalfFloatOes(): void {
        this.srcFormat = TextureFormat.RGBA;
        this.internalFormat = TextureFormat.RGBA;
        this.unpackAlignment = 4;// 8 bytes
        this.dataType = TextureDataType.HALF_FLOAT_OES;
    }
    toUShort565(): void {
        this.srcFormat = TextureFormat.RGB;
        this.internalFormat = TextureFormat.RGB;
        //UNSIGNED_SHORT_5_6_5
        this.unpackAlignment = 3;// 2 bytes
        this.dataType = TextureDataType.UNSIGNED_SHORT_5_6_5;
    }
    toUShort4444(): void {
        this.srcFormat = TextureFormat.RGBA;
        this.internalFormat = TextureFormat.RGBA;
        //UNSIGNED_SHORT_4_4_4_4
        this.unpackAlignment = 4;// 2 bytes
        this.dataType = TextureDataType.UNSIGNED_SHORT_4_4_4_4;
    }
    toUShort5551(): void {
        //UNSIGNED_SHORT_5_5_5_1
        this.unpackAlignment = 4;// 2 bytes
        this.dataType = TextureDataType.UNSIGNED_SHORT_5_5_5_1;
    }
    toUShort(): void {
        this.srcFormat = TextureFormat.RGBA;
        this.internalFormat = TextureFormat.RGBA;
        this.dataType = TextureDataType.UNSIGNED_SHORT;
        //UNSIGNED_SHORT
    }
    toAlphaFormat(): void {
        if (this.dataType == TextureDataType.UNSIGNED_SHORT) {
            this.srcFormat = TextureFormat.ALPHA;
            this.internalFormat = TextureFormat.ALPHA;
            this.unpackAlignment = 1;
        }
    }
    toRedFormat(): void {
        if (this.dataType == TextureDataType.UNSIGNED_SHORT) {
            this.srcFormat = TextureFormat.RED;
            this.internalFormat = TextureFormat.RED;
            this.unpackAlignment = 1;
        }
    }
    toRGBFormat(): void {
        if (this.dataType == TextureDataType.UNSIGNED_SHORT) {
            this.srcFormat = TextureFormat.RGB;
            this.internalFormat = TextureFormat.RGB;
            this.unpackAlignment = 3;
        }
    }
    toRGBAFormat(): void {
        if (this.dataType == TextureDataType.UNSIGNED_SHORT) {
            this.srcFormat = TextureFormat.RGBA;
            this.internalFormat = TextureFormat.RGBA;
            this.unpackAlignment = 4;
        }
    }

    uploadFromBytes(bytes: Uint16Array, miplevel: number = 0, imgWidth: number = -1, imgHeight: number = -1, offsetx: number = 0, offsety: number = 0, rebuild: boolean = false): void {
        super.setDataFromBytes(bytes, miplevel, imgWidth, imgHeight, offsetx, offsety, rebuild);
    }
    setPartDataFromeBytes(bytes: Uint16Array, px: number, py: number, twidth: number, theight: number, miplevel: number = 0): void {
        super.setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel);
    }
    getPixels(px: number, py: number, pw: number, ph: number, outBytes: Uint16Array): void {
        super.getPixels(px, py, pw, ph, outBytes);
    }

    toString(): string {
        return "[Uint16TextureProxy(width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
    }
}
export default Uint16TextureProxy;