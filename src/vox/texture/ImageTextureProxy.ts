/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ITexDataT from "../../vox/texture/ITexData";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as ImgTexDataT from "../../vox/texture/ImgTexData";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";
import * as TextureProxyT from "../../vox/texture/TextureProxy";

import ITexData = ITexDataT.vox.texture.ITexData;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import ImgTexData = ImgTexDataT.vox.texture.ImgTexData;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;

export namespace vox
{
    export namespace texture
    {
        export class ImageTextureProxy extends TextureProxy
        {
            constructor(slot:ITextureSlot, texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(slot,texWidth,texHeight,powerof2Boo);
                this.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
                this.m_type = TextureProxyType.Image;
            }
            private m_texData:ImgTexData = null;
            private m_texDatas:ITexData[] = null;
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
                            td = this.m_texDatas[miplevel] as ImgTexData;
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
                        if(this.isGpuEnabled() && this.m_texData.data != null)
                        {
                            this.m_slot.addRenderBuffer(this, this.getResUid());
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
                    this.updateTexData(gl,this.m_texData, this.m_texDatas);
                }
            }
            __$updateToGpu(rc:RenderProxy):void
            {
                if(this.isGpuEnabled())
                {
                    if(this.m_dataChanged)
                    {
                        if(this.m_texData != null)
                        {
                            let gl:any = rc.RContext;
                            this.__$updateToGpuBegin(rc);
                            this.updateTexData(gl,this.m_texData, this.m_texDatas);                            
                            this.__$buildParam(gl);
                            this.m_generateMipmap = true;
                        }
                        this.m_dataChanged = false;
                    }
                }
            }
            __$destroy():void
            {
                if(!this.isGpuEnabled())
                {
                    if(this.m_texDatas != null)
                    {
                        for(let i:number = 0;i<this.m_texDatasLen;++i)
                        {
                            ImgTexData.Restore(this.m_texDatas[i] as ImgTexData);
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
                    super.__$destroy();
                }
            }
            toString():string
            {
                return "[ImageTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
        }
    }
}