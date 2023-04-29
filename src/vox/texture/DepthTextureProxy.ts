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
import IRenderResource from "../../vox/render/IRenderResource";
import { IDepthTexture } from "../../vox/render/texture/IDepthTexture";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";

class DepthTextureProxy extends RTTTextureProxy implements IDepthTexture {

    constructor(texWidth: number, texHeight: number, powerof2Boo: boolean = false) {
        super(texWidth, texHeight, powerof2Boo);
        this.minFilter = TextureConst.NEAREST;
        this.magFilter = TextureConst.NEAREST;
        this.srcFormat = TextureFormat.DEPTH_COMPONENT;
        this.internalFormat = TextureFormat.DEPTH_COMPONENT;
        this.dataType = TextureDataType.UNSIGNED_SHORT;
        this.m_generateMipmap = false;
        this.m_haveRData = true;
        this.mipmapEnabled = false;
        this.m_type = TextureProxyType.Depth;
    }

    toDepthUnsignedInt(): void {
        this.minFilter = TextureConst.NEAREST;
        this.magFilter = TextureConst.NEAREST;
        this.srcFormat = TextureFormat.DEPTH_COMPONENT;
        this.internalFormat = TextureFormat.DEPTH_COMPONENT;
        this.dataType = TextureDataType.UNSIGNED_INT;
        this.m_generateMipmap = false;
        this.m_haveRData = true;
        this.mipmapEnabled = false;
    }
    toDepthUnsignedShort(): void {
        this.minFilter = TextureConst.NEAREST;
        this.magFilter = TextureConst.NEAREST;
        this.srcFormat = TextureFormat.DEPTH_COMPONENT;
        this.internalFormat = TextureFormat.DEPTH_COMPONENT;
        this.dataType = TextureDataType.UNSIGNED_SHORT;
        this.m_generateMipmap = false;
        this.m_haveRData = true;
        this.mipmapEnabled = false;
    }
    toDepthAndStencil(): void {
        this.minFilter = TextureConst.NEAREST;
        this.magFilter = TextureConst.NEAREST;
        this.srcFormat = TextureFormat.DEPTH_STENCIL;
        this.internalFormat = TextureFormat.DEPTH_STENCIL;
        this.dataType = TextureDataType.UNSIGNED_INT_24_8_WEBGL;
        this.m_generateMipmap = false;
        this.mipmapEnabled = false;
        this.m_haveRData = true;
    }
    protected uploadData(texRes: IRenderResource): void {
        console.log("DepthTextureProxy uploadData()...");
        let gl: any = texRes.getRC();
        gl.texImage2D(this.m_sampler, 0, TextureFormat.ToGL(gl, this.internalFormat), this.m_texWidth, this.m_texHeight, 0, TextureFormat.ToGL(gl, this.srcFormat), TextureDataType.ToGL(gl, this.dataType), null);
    }
}
export default DepthTextureProxy;