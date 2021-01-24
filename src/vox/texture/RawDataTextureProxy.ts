/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TextureDataT from "../../vox/texture/RawTexData";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RenderBufferUpdaterT from "../../vox/render/RenderBufferUpdater";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import RawTexData = TextureDataT.vox.texture.RawTexData;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RenderBufferUpdater = RenderBufferUpdaterT.vox.render.RenderBufferUpdater;

export namespace vox
{
    export namespace texture
    {
        export class RawDataTextureProxy extends TextureProxy
        {
            private m_bytes:Uint8Array | Uint16Array | Float32Array = null;
            private m_subDataList:RawTexData[] = null;
            private m_texDatasLen:number = 0;
            constructor(texList:TextureProxy[], texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(texList, texWidth,texHeight,powerof2Boo);
                this.m_type = TextureConst.TEX_PROXY2D;
                this.minFilter = TextureConst.LINEAR;
            }
            private m_texData:RawTexData = null;
            private m_texDatas:RawTexData[] = null;
            uploadFromBytes(bytes:Uint8Array | Uint16Array | Float32Array, miplevel:number = 0,imgWidth:number = -1,imgHeight:number = -1,offsetx:number = 0,offsety:number = 0,rebuild:boolean = false):void
            {
                if(bytes != null && imgWidth > 0 && imgHeight > 0)
                {
                    if(miplevel < 0) miplevel = 0;
                    if(miplevel > 15) miplevel = 15;
                    if(miplevel >= this.m_texDatasLen)
                    {
                        this.m_texDatasLen = miplevel+1;
                    }
                    this.m_haveRData = true;
                    let td:RawTexData = this.m_texData;
                    if(td != null)
                    {
                        if(this.m_texData.miplevel != miplevel)
                        {
                            if(this.m_texDatas == null) this.m_texDatas = [this.m_texData,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
                            td = this.m_texDatas[miplevel];
                            if(td == null)
                            {
                                td = RawTexData.Create();
                                td.miplevel = miplevel;
                                rebuild = true;
                                this.m_texDatas[miplevel] = td;
                            }
                        }
                    }
                    else
                    {
                        this.m_texData = td = RawTexData.Create();
                        td.miplevel = miplevel;
                        rebuild = true;
                    }
                    
                    if(td.data != bytes || td.offsetx != offsetx || td.offsety != offsety)
                    {
                        if(miplevel == 0)
                        {
                            this.m_texWidth = imgWidth;
                            this.m_texHeight = imgHeight;
                            this.m_bytes = bytes;
                        }
                        if(this.m_texBuf != null && this.m_texData.data != null)
                        {
                            if(!this.m_dataChanged)
                            {
                                this.m_dataChanged = true;
                                RenderBufferUpdater.GetInstance().__$addBuf(this);
                            }
                        }
                        td.data = bytes;
                        td.status = 0;// 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新
                        if(td.width < imgWidth || td.height < imgHeight || rebuild)
                        {
                            td.width = imgWidth;
                            td.height = imgHeight;
                            td.status = 1;
                        }
                        td.offsetx = offsetx;
                        td.offsety = offsety;
                    }
                }
                else
                {
                    console.error("bytes != null: "+(bytes != null)+",imgWidth > 0: "+(imgWidth > 0)+",imgHeight > 0: "+(imgHeight > 0));
                }
            }
            
            protected uploadData(rc:RenderProxy):void
            {
                if(this.m_texData != null)
                {
                    let gl:any = rc.RContext;
                    let d:RawTexData = this.m_texData;
                    let interType:any = TextureFormat.ToGL(gl,this.internalFormat);
                    let format:any = TextureFormat.ToGL(gl,this.srcFormat);
                    let type:any = TextureDataType.ToGL(gl, this.dataType);
                    if(this.m_texDatas == null)
                    {
                        d.updateToGpu(gl,this.m_samplerTarget,interType,format,type);
                    }
                    else
                    {
                        let ds:RawTexData[] = this.m_texDatas;
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
                        let gl:any = rc.RContext;
                        let len:number = this.m_subDataList != null?this.m_subDataList.length:0;
                        let d:RawTexData = null;

                        let interType:any = TextureFormat.ToGL(gl,this.internalFormat);
                        let format:any = TextureFormat.ToGL(gl,this.srcFormat);
                        let type:any = TextureDataType.ToGL(gl, this.dataType);
                        this.__$updateToGpuBegin(gl);
                        let i:number = 0;
                        if(len > 0)
                        {
                            for(; i < len; ++i)
                            {
                                d = this.m_subDataList.pop();
                                d.updateToGpu(gl,this.m_samplerTarget,interType,format,type);
                                RawTexData.Restore(d);
                            }
                            //concole.log("#####upload sub texture pix data!");
                        }
                        if(this.m_texData != null)
                        {
                            let d:RawTexData = this.m_texData;
                            if(this.m_texDatas == null)
                            {
                                if(d.status > -1)d.updateToGpu(gl,this.m_samplerTarget,interType,format,type);
                            }
                            else
                            {
                                let ds:RawTexData[] = this.m_texDatas;
                                for(; i < this.m_texDatasLen; ++i)
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
                        this.__$updateToGpuEnd(gl);
                        this.m_dataChanged = false;
                    }
                }
            }
            
            // 对mipmap level 的纹理数据的更新
        	updateSubBytes(bytes:Uint8Array | Uint16Array | Float32Array,px:number,py:number,twidth:number,theight:number, miplevel:number = 0):void
            {
                if(this.m_subDataList == null)
                {
                    this.m_subDataList = [];
                }
                let d:RawTexData = RawTexData.Create();
                d.data = bytes;
                d.status = 0;
                d.miplevel = miplevel;
                d.offsetx = px;
                d.offsety = py;
                d.width = twidth;
                d.height = theight;
                this.m_subDataList.push(d);
                if(!this.m_dataChanged)
                {
                    this.m_dataChanged = true;
                    RenderBufferUpdater.GetInstance().__$addBuf(this);
                }
            }
            getPixels(px:number,py:number, pw:number,ph:number,outBytes:Uint8Array | Uint16Array | Float32Array):void
            {
                if(this.m_bytes != null && outBytes != null)
                {
                    let segSize:number = this.unpackAlignment;
                    let s:number = pw * ph * segSize;
                    if(outBytes.length == s)
                    {
                        let i:number = py;
                        let j:number = px;
                        let i_max:number = i + ph;
                        let j_max:number = j + pw;
                        let k:number = 0;
                        switch(this.srcFormat)
                        {
                            case TextureFormat.ALPHA:
                                for(; i < i_max; ++i)
                                {
                                    for(j = px; j < j_max; ++j)
                                    {
                                        s = (i * this.m_texWidth + j);
                                        outBytes[k] = this.m_bytes[s];
                                        k++;
                                    }
                                }
                            break;
                            case TextureFormat.RGBA:
                                //trace("RawDataTextureProxy::getPixels(), >>>>>>>>>>>>>>>>>>>TextureFormat.RGBA...");
                                for(; i < i_max; ++i)
                                {
                                    for(j = px; j < j_max; ++j)
                                    {
                                        s = (i *  this.m_texWidth + j) * segSize;
                                        outBytes[k] =  this.m_bytes[s];
                                        outBytes[k+1] =  this.m_bytes[s+1];
                                        outBytes[k+2] =  this.m_bytes[s+2];
                                        outBytes[k+3] =  this.m_bytes[s+3];
                                        k++;
                                    }
                                }
                            break;
                            case TextureFormat.RGB:
                                //trace("RawDataTextureProxy::getPixels(), >>>>>>>>>>>>>>>>>>>TextureFormat.RGB...");
                                for(; i < i_max; ++i)
                                {
                                    for(j = px; j < j_max; ++j)
                                    {
                                        s = (i *  this.m_texWidth + j) * segSize;
                                        outBytes[k] =  this.m_bytes[s];
                                        outBytes[k+1] =  this.m_bytes[s+1];
                                        outBytes[k+2] =  this.m_bytes[s+2];
                                        k++;
                                    }
                                }
                            break;
                            default:
                                break;
                        }
                    }
                    else
                    {
                        console.warn("outBytes.length != (pw * ph * pixelSegSize)");
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
                            RawTexData.Restore(this.m_texDatas[i]);
                        }
                        this.m_texDatasLen = 0;
                        this.m_texDatas = null;
                        this.m_texData = null;
                    }
                    if(this.m_texData != null)
                    {
                        RawTexData.Restore(this.m_texData);
                        this.m_texData = null;
                    }
                    this.m_bytes = null;
                    console.log("RawDataTextureProxy::destroy(), destroy a RawDataTextureProxy instance...");
                    super.__$destroy(rc);
                }
            }
            toString():string
            {
                return "[RawDataTextureProxy(width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
            
        }
    }
}