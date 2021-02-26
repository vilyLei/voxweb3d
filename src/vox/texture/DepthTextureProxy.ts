/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureConstT from "../../vox/texture/TextureConst";
import * as IRenderResourceT from "../../vox/render/IRenderResource";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";
import * as RTTTextureProxyT from "../../vox/texture/RTTTextureProxy";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import IRenderResource = IRenderResourceT.vox.render.IRenderResource;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;
import RTTTextureProxy = RTTTextureProxyT.vox.texture.RTTTextureProxy;

export namespace vox
{
    export namespace texture
    {
        export class DepthTextureProxy extends RTTTextureProxy
        {
            constructor(slot:ITextureSlot, texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(slot,texWidth,texHeight,powerof2Boo);
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
            
            toDepthUnsignedInt():void
            {
                this.minFilter = TextureConst.NEAREST;
                this.magFilter = TextureConst.NEAREST;
                this.srcFormat = TextureFormat.DEPTH_COMPONENT;
                this.internalFormat = TextureFormat.DEPTH_COMPONENT;
                this.dataType = TextureDataType.UNSIGNED_INT;
                this.m_generateMipmap = false;
                this.m_haveRData = true;
                this.mipmapEnabled = false;
            }
            toDepthUnsignedShort():void
            {
                this.minFilter = TextureConst.NEAREST;
                this.magFilter = TextureConst.NEAREST;
                this.srcFormat = TextureFormat.DEPTH_COMPONENT;
                this.internalFormat = TextureFormat.DEPTH_COMPONENT;
                this.dataType = TextureDataType.UNSIGNED_SHORT;
                this.m_generateMipmap = false;
                this.m_haveRData = true;
                this.mipmapEnabled = false;
            }
            toDepthAndStencil():void
            {
                this.minFilter = TextureConst.NEAREST;
                this.magFilter = TextureConst.NEAREST;
                this.srcFormat = TextureFormat.DEPTH_STENCIL;
                this.internalFormat = TextureFormat.DEPTH_STENCIL;
                this.dataType = TextureDataType.UNSIGNED_INT_24_8_WEBGL;
                this.m_generateMipmap = false;
                this.mipmapEnabled = false;
                this.m_haveRData = true;
            }
            protected uploadData(texRes:IRenderResource):void
            {
                let gl:any = texRes.getRC();
                gl.texImage2D(this.m_sampler, 0,TextureFormat.ToGL(gl,this.internalFormat),this.m_texWidth,this.m_texHeight,0,TextureFormat.ToGL(gl,this.srcFormat),TextureDataType.ToGL(gl, this.dataType), null);
            }
            toString():string
            {
                return "[DepthTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
        }
    }
}