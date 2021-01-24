/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace texture
    {
        export class DepthTextureProxy extends TextureProxy
        {
            constructor(texList:TextureProxy[], texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(texList,texWidth,texHeight,powerof2Boo);
                this.minFilter = TextureConst.NEAREST;
                this.magFilter = TextureConst.NEAREST;
                this.srcFormat = TextureFormat.DEPTH_COMPONENT;
                this.internalFormat = TextureFormat.DEPTH_COMPONENT;
                this.dataType = TextureDataType.UNSIGNED_SHORT;
                this.m_generateMipmap = false;
                this.m_haveRData = true;
                this.mipmapEnabled = false;
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
            protected uploadData(rc:RenderProxy):void
            {
                let gl:any = rc.RContext;
                gl.texImage2D(this.m_samplerTarget, 0,TextureFormat.ToGL(gl,this.internalFormat),this.m_texWidth,this.m_texHeight,0,TextureFormat.ToGL(gl,this.srcFormat),TextureDataType.ToGL(gl, this.dataType), null);
                
            }
            toString():string
            {
                return "[DepthTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
        }
    }
}