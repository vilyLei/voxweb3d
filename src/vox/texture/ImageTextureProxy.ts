/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RenderBufferUpdaterT from "../../vox/render/RenderBufferUpdater";

import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RenderBufferUpdater = RenderBufferUpdaterT.vox.render.RenderBufferUpdater;

export namespace vox
{
    export namespace texture
    {
        export class ImageTextureProxy extends TextureProxy
        {
            
            protected m_imgData:any = null;
            protected uploadData(rc:RenderProxy):void
            {
                if(this.m_imgData != null)
                {
                    let gl:any = rc.RContext;
                    gl.texImage2D(this.m_samplerTarget, this.m_miplevel, TextureFormat.ToGL(gl,this.internalFormat),TextureFormat.ToGL(gl,this.srcFormat), TextureDataType.ToGL(gl, this.dataType), this.m_imgData);
                }
            }
            getImageData():any
            {
                return this.m_imgData;
            }
            /**
             * @param img              html Image or canvas or orther html elements
            */
            uploadFromImage(img:any, miplevel:number = 0):void
            {
                if(img != null && img != this.m_imgData && img.width > 0 && img.height > 0)
                {
                    if(this.m_texBuf != null)
                    {
                        this.m_imgData = img;
                        this.m_miplevel = miplevel;
                        if(!this.m_dataChanged)
                        {
                            this.m_dataChanged = true;
                            RenderBufferUpdater.GetInstance().__$addBuf(this);
                        }
                    }
                    else
                    {
                        this.m_texWidth = img.width;
                        this.m_texHeight = img.height;
                        this.m_imgData = img;
                        this.m_miplevel = miplevel;
                        this.m_haveRData = true;
                    }
                }
            }
            
            __$updateToGpu(rc:RenderProxy):void
            {
                if(this.m_texBuf != null)
                {
                    if(this.m_dataChanged)
                    {
                        if(this.m_imgData != null)
                        {
                            let gl:any = rc.RContext;
                            gl.bindTexture (this.m_samplerTarget, this.m_texBuf);
                            if(this.m_texWidth < this.m_imgData.width || this.m_texHeight < this.m_imgData.height)
                            {
                                this.m_texWidth = this.m_imgData.width;
                                this.m_texHeight = this.m_imgData.height;
                                gl.texImage2D(this.m_samplerTarget, this.m_miplevel, TextureFormat.ToGL(gl,this.internalFormat),TextureFormat.ToGL(gl,this.srcFormat), TextureDataType.ToGL(gl, this.dataType), this.m_imgData);
                            }
                            else
                            {
                                gl.texSubImage2D(this.m_samplerTarget, this.m_miplevel, 0, 0, TextureFormat.ToGL(gl,this.srcFormat), TextureDataType.ToGL(gl, this.dataType), this.m_imgData);
                            }
                            this.___buildParam(gl);
                        }
                        this.m_dataChanged = false;
                    }                    
                }
            }
            
            upload(rc:RenderProxy):void
            {
                if(this.m_uploadBoo)
                {
                    if(this.m_haveRData)
                    {
                        let gl:any = rc.RContext;
                        this.m_samplerTarget = TextureTarget.GetValue(gl,this.m_texTarget);
                        //  console.log("TextureProxy::upload(), tex: "+this);
                        //  console.log("TextureProxy::upload(), this.m_imgData: "+this.m_imgData);
                        this.m_texBuf = gl.createTexture();
                        gl.bindTexture (this.m_samplerTarget, this.m_texBuf);
                        this.uploadData(rc);
                        this.___buildParam(gl);
                        this.m_uploadBoo = false;
                    }
                }
            }
            __$destroy(rc:RenderProxy):void
            {
                if(!this.isGpuEnabled())
                {
                    this.m_imgData = null;
                    super.__$destroy(rc);
                }
            }
            toString():string
            {
                return "[ImageTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
        }
    }
}