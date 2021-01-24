/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureConstT from "../../vox/texture/TextureConst";
import * as ImgTexDataT from "../../vox/texture/ImgTexData";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RenderBufferUpdaterT from "../../vox/render/RenderBufferUpdater";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import ImgTexData = ImgTexDataT.vox.texture.ImgTexData;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RenderBufferUpdater = RenderBufferUpdaterT.vox.render.RenderBufferUpdater;

export namespace vox
{
    export namespace texture
    {
        export class ImageTextureProxy extends TextureProxy
        {
            constructor(texList:TextureProxy[], texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(texList,texWidth,texHeight,powerof2Boo);
                this.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            }
            private m_texData:ImgTexData = null;
            private m_texDatas:ImgTexData[] = null;
            private m_texDatasLen:number = 0;
            getTexData():ImgTexData
            {
                return this.m_texData;
            }
            /**设置纹理原始数据，可以对纹理局部或者整体(rebuild = true)更新
             * @param img              html Image or canvas or orther html elements
            */
            uploadFromImage(img:any, miplevel:number = 0,offsetx:number = 0,offsety:number = 0,rebuild:boolean = false):void
            {
                if(img != null && img.width > 0 && img.height > 0)
                {
                    this.m_haveRData = true;
                    if(miplevel < 0) miplevel = 0;
                    if(miplevel > 15) miplevel = 15;
                    if(miplevel >= this.m_texDatasLen)
                    {
                        this.m_texDatasLen = miplevel+1;
                    }
                    let td:ImgTexData = this.m_texData;
                    if(td != null)
                    {
                        if(this.m_texData.miplevel != miplevel)
                        {
                            if(this.m_texDatas == null)
                            {
                                this.m_texDatas = [this.m_texData,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
                            }
                            td = this.m_texDatas[miplevel];
                            if(td == null)
                            {
                                td = ImgTexData.Create();
                                td.miplevel = miplevel;
                                rebuild = true;
                                this.m_texDatas[miplevel] = td;
                            }
                        }
                    }
                    else
                    {
                        td = this.m_texData = ImgTexData.Create();
                        td.miplevel = miplevel;
                        rebuild = true;
                        this.m_texWidth = img.width;
                        this.m_texHeight = img.height;
                    }
                    
                    if(td.data != img || td.offsetx != offsetx || td.offsety != offsety)
                    {
                        if(miplevel == 0)
                        {
                            this.m_texWidth = img.width;
                            this.m_texHeight = img.height;
                        }
                        if(this.m_texBuf != null && this.m_texData.data != null)
                        {
                            if(!this.m_dataChanged)
                            {
                                this.m_dataChanged = true;
                                RenderBufferUpdater.GetInstance().__$addBuf(this);
                            }
                        }
                        td.data = img;
                        td.status = 0;// 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新
                        if(td.width < img.width || td.height < img.height || rebuild)
                        {
                            td.width = img.width;
                            td.height = img.height;
                            td.status = 1;
                        }
                        td.offsetx = offsetx;
                        td.offsety = offsety;
                    }
                }
            }
            protected uploadData(rc:RenderProxy):void
            {
                if(this.m_texData != null)
                {
                    let gl:any = rc.RContext;
                    let interType:any = TextureFormat.ToGL(gl,this.internalFormat);
                    let format:any = TextureFormat.ToGL(gl,this.srcFormat);
                    let type:any = TextureDataType.ToGL(gl, this.dataType);
                    let d:ImgTexData = this.m_texData;
                    if(this.m_texDatas == null)
                    {                       
                        d.updateToGpu(gl,this.m_samplerTarget,interType,format,type);
                    }
                    else
                    {
                        let ds:ImgTexData[] = this.m_texDatas;
                        for(let i:number = 0; i < this.m_texDatasLen; ++i)
                        {
                            d = ds[i];
                            if(d != null)
                            {
                                d.updateToGpu(gl,this.m_samplerTarget,interType,format,type);
                            }
                        }
                        this.m_generateMipmap = false;
                    }
                }
            }
            __$updateToGpu(rc:RenderProxy):void
            {
                if(this.m_texBuf != null)
                {
                    if(this.m_dataChanged)
                    {
                        if(this.m_texData != null)
                        {
                            let gl:any = rc.RContext;
                            gl.bindTexture (this.m_samplerTarget, this.m_texBuf);
                            this.__$updateToGpuBegin(gl);
                            let interType:any = TextureFormat.ToGL(gl,this.internalFormat);
                            let format:any = TextureFormat.ToGL(gl,this.srcFormat);
                            let type:any = TextureDataType.ToGL(gl, this.dataType);
                            let d:ImgTexData = this.m_texData;
                            if(this.m_texDatas == null)
                            {
                                if(d.status > -1)d.updateToGpu(gl,this.m_samplerTarget,interType,format,type);
                            }
                            else
                            {
                                let ds:ImgTexData[] = this.m_texDatas;
                                for(let i:number = 0; i < this.m_texDatasLen; ++i)
                                {
                                    d = ds[i];
                                    if(d != null)
                                    {
                                        if(d.status > -1)d.updateToGpu(gl,this.m_samplerTarget,interType,format,type);
                                    }
                                }
                                this.m_generateMipmap = false;
                            }
                            this.__$buildParam(gl);
                            this.m_generateMipmap = true;
                        }
                        this.m_dataChanged = false;
                    }
                }
            }
            
            __$destroy(rc:RenderProxy):void
            {
                if(!this.isGpuEnabled())
                {
                    if(this.m_texDatas != null)
                    {
                        for(let i:number = 0;i<this.m_texDatasLen;++i)
                        {
                            ImgTexData.Restore(this.m_texDatas[i]);
                        }
                        this.m_texDatasLen = 0;
                        this.m_texDatas = null;
                        this.m_texData = null;
                    }
                    if(this.m_texData != null)
                    {
                        ImgTexData.Restore(this.m_texData);
                        this.m_texData = null;
                    }
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