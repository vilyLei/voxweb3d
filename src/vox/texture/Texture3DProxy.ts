/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { TextureProxyType } from "../../vox/texture/TextureProxyType";
import { TextureFormat, TextureTarget } from "../../vox/texture/TextureConst";
import IRenderResource from "../../vox/render/IRenderResource";
import TextureProxy from "../../vox/texture/TextureProxy";
import { ITexture3D } from "../../vox/render/texture/ITexture3D";

class Texture3DProxy extends TextureProxy implements ITexture3D {
    
    private m_bytes: Uint8Array = null;
    private m_tex3DDepth: number = 1;
    constructor(texWidth: number, texHeight: number, tex3DDepth: number = 1, powerof2Boo: boolean = false) {
        super(texWidth, texHeight, powerof2Boo);
        this.internalFormat = TextureFormat.R8;
        this.srcFormat = TextureFormat.RED;
        this.m_tex3DDepth = tex3DDepth;
        this.m_texTarget = TextureTarget.TEXTURE_3D;
        this.m_type = TextureProxyType.Texture3D;
        this.unpackAlignment = 1;
    }
    getDepth(): number { return this.m_tex3DDepth; }
    uploadFromTypedArray(bytesData: Uint8Array, miplevel: number = 0): void {
        if (!this.isGpuEnabled()) {
            this.m_bytes = bytesData;
            this.m_miplevel = miplevel;
            this.m_haveRData = true;
        }
    }
    protected uploadData(texRes: IRenderResource): void {
        if (this.m_bytes != null) {
            let gl: any = texRes.getRC();
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            gl.texImage3D(
                gl.TEXTURE_3D,                                                  // target
                0,                                                              // level
                TextureFormat.ToGL(gl, this.internalFormat),                    // internalformat,DEFAULT: gl.R8
                this.m_texWidth,                                                // width
                this.m_texHeight,                                               // height
                this.m_tex3DDepth,                                              // depth
                0,                                                              // border
                TextureFormat.ToGL(gl, this.srcFormat),                         // format,DEFAULT: gl.RED
                gl.UNSIGNED_BYTE,                                               // type
                this.m_bytes                                                    // pixels
            );
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
        }
    }
    __$destroy(): void {
        if (this.getAttachCount() < 1) {
            this.m_bytes = null;
            console.log("Texture3DProxy::destroy(), destroy a Texture3DProxy instance...");
            super.__$destroy();
        }
    }
    toString(): string {
        return "[Texture3DProxy(width=" + this.getWidth() + ",height=" + this.getHeight() + ",depth=" + this.getDepth() + ")]";
    }
}
export default Texture3DProxy;