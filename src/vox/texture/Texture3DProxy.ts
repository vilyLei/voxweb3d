/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureConstT from "../../vox/texture/TextureConst";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";
import * as TextureProxyT from "../../vox/texture/TextureProxy";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;

export namespace vox
{
    export namespace texture
    {
        export class Texture3DProxy extends TextureProxy
        {
            private m_bytes:Uint8Array = null;
            private m_tex3DDepth:number = 1;
            constructor(slot:ITextureSlot, texWidth:number,texHeight:number,tex3DDepth:number = 1,powerof2Boo:boolean = false)
            {
                super(slot, texWidth,texHeight,powerof2Boo);        
                this.internalFormat = TextureFormat.R8;
                this.srcFormat = TextureFormat.RED;
                this.m_tex3DDepth = tex3DDepth;
                this.m_texTarget = TextureTarget.TEXTURE_3D;
                this.m_type = TextureProxyType.Texture3D;
            }
            getDepth():number{return this.m_tex3DDepth;}
            uploadFromTypedArray(bytesData:Uint8Array, miplevel:number = 0):void
            {
                if(!this.isGpuEnabled())
                {
                    this.m_bytes = bytesData;
                    this.m_miplevel = miplevel;
                    this.m_haveRData = true;
                }
            }
            protected uploadData(rc:RenderProxy):void
            {
                let gl:any = rc.RContext;
                if(this.m_bytes != null)
                {
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
            __$destroy():void
            {
                if(!this.isGpuEnabled())
                {
                    this.m_bytes = null;
                    console.log("Texture3DProxy::destroy(), destroy a Texture3DProxy instance...");
                    super.__$destroy();
                }
            }
            toString():string
            {
                return "[Texture3DProxy(width="+this.getWidth()+",height="+this.getHeight()+",depth="+this.getDepth()+")]";
            }
        }
    }
}