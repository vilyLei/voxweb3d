/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { TextureProxyType } from "../../vox/texture/TextureProxyType";
import TextureFormat from "../../vox/texture/TextureFormat";
import RawDataTextureProxy from "../../vox/texture/RawDataTextureProxy";
import { IBytesTexture } from "../../vox/render/texture/IBytesTexture";

class BytesTextureProxy extends RawDataTextureProxy implements IBytesTexture {
    constructor(texWidth: number, texHeight: number, powerof2Boo: boolean = false) {
        super(texWidth, texHeight, powerof2Boo);
        this.m_type = TextureProxyType.Bytes;
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
        this.internalFormat = TextureFormat.RGB;
        this.unpackAlignment = 3;
    }
    toRGBAFormat(): void {
        this.srcFormat = TextureFormat.RGBA;
        this.internalFormat = TextureFormat.RGBA;
        this.unpackAlignment = 4;
    }
    
    setDataFromBytes(bytes: Uint8Array, miplevel: number = 0, imgWidth: number = -1, imgHeight: number = -1, offsetx: number = 0, offsety: number = 0, rebuild: boolean = false): void {
        super.setDataFromBytes(bytes, miplevel, imgWidth, imgHeight, offsetx, offsety, rebuild);
    }
    setPartDataFromeBytes(bytes: Uint8Array, px: number, py: number, twidth: number, theight: number, miplevel: number = 0): void {
        super.setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel);
    }
    getPixels(px: number, py: number, pw: number, ph: number, outBytes: Uint8Array): void {
        super.getPixels(px, py, pw, ph, outBytes);
    }
}
export default BytesTextureProxy;