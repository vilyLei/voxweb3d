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

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RenderBufferUpdater = RenderBufferUpdaterT.vox.render.RenderBufferUpdater;

export namespace vox
{
    export namespace texture
    {
        class TexSubBytesData
        {
            private static s_list:TexSubBytesData[] = [];
            private constructor()
            {
            }
            bytes:Uint8Array = null;
        	subX:number = 0.0;
        	subY:number = 0.0;
            subImgWidth:number = 0.0;
            subImgHeight:number = 0.0;
            static Create():TexSubBytesData
            {
                if(TexSubBytesData.s_list.length > 0)
                {
                    return TexSubBytesData.s_list.pop();
                }
                return new TexSubBytesData();
            }
            static Restore(tsd:TexSubBytesData):void
            {
                tsd.bytes = null;
                TexSubBytesData.s_list.push(tsd);
            }
        }
        export class BytesTextureProxy extends TextureProxy
        {
            private m_bytes:Uint8Array = null;
            private m_bytesChanged:boolean = false;
            private m_subDataList:TexSubBytesData[] = null;
            constructor(texList:TextureProxy[], texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(texList, texWidth,texHeight,powerof2Boo);
                this.m_type = TextureConst.TEX_PROXY2D;
                this.minFilter = TextureConst.LINEAR;
            }
            toAlphaFormat():void
            {
                this.srcFormat = TextureFormat.ALPHA;
                this.internalFormat = TextureFormat.ALPHA; 
            }
            __$updateToGpu(rc:RenderProxy):void
            {
                if(this.m_texBuf != null)
                {
                    if(this.m_dataChanged)
                    {
                        let gl:any = rc.RContext;
                        let len:number = this.m_subDataList.length;

                        //  gl.bindTexture(this.m_samplerTarget, this.m_texBuf);
                        //  if(this.srcFormat == TextureFormat.ALPHA)
                        //  {
                        //      gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
                        //  }
                        this.__$updateToGpuBegin(gl);
                        if(len > 0)
                        {
                            let tsd:TexSubBytesData = null;
                            let i:number = 0;
                            for(; i < len; ++i)
                            {
                                tsd = this.m_subDataList.pop();
                                gl.texSubImage2D(this.m_samplerTarget, 0, tsd.subX, tsd.subY, tsd.subImgWidth, tsd.subImgHeight, TextureFormat.ToGL(gl,this.srcFormat), TextureDataType.ToGL(gl, this.dataType), tsd.bytes);
                                
                                TexSubBytesData.Restore(tsd);
                            }
                            //concole.log("#####upload sub texture pix data!");
                        }
                        else if(this.m_bytesChanged)
                        {
                            this.m_bytesChanged = false;

                            let width:number = this.m_texWidth;
                            let height:number  = this.m_texHeight;

                            //  if(this.m_miplevel > 0)
                            //  {
                            //      width = this.m_texWidth >> this.m_miplevel;
                            //      height = this.m_texHeight >> this.m_miplevel;
                            //      if (width == 0 && height == 0)
                            //      {
                            //          return;
                            //      }
                            //      if (width < 1)
                            //      {
                            //          width = 1;
                            //      }
                            //      if (height < 1)
                            //      {
                            //          height = 1;
                            //      }
                            //  }
                            gl.texSubImage2D(this.m_samplerTarget, 0, 0, 0, width, height, TextureFormat.ToGL(gl,this.srcFormat), TextureDataType.ToGL(gl, this.dataType), this.m_bytes);

                        }
                        //  if(this.srcFormat == TextureFormat.ALPHA)
                        //  {
                        //      gl.pixelStorei(gl.PACK_ALIGNMENT,4);
                        //  }
                        this.__$updateToGpuEnd(gl);
                        this.m_dataChanged = false;
                    }                    
                }
            }
            protected uploadData(rc:RenderProxy):void
            {
                let gl:any = rc.RContext;
                if(this.m_bytes != null)
                {
                    let width:number = this.m_texWidth;
                    let height:number  = this.m_texHeight;
                    
                    //  if(this.m_miplevel > 0)
                    //  {
                    //      width = this.m_texWidth >> this.m_miplevel;
                    //      height = this.m_texHeight >> this.m_miplevel;
                    //      if (width == 0 && height == 0)
                    //      {
                    //          return;
                    //      }
                    //      if (width < 1)
                    //      {
                    //          width = 1;
                    //      }
                    //      if (height < 1)
                    //      {
                    //          height = 1;
                    //      }
                    //  }
                    if(this.srcFormat == TextureFormat.ALPHA)
                    {
                        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
                    }
                    gl.texImage2D(this.m_samplerTarget, this.m_miplevel, TextureFormat.ToGL(gl,this.internalFormat),width,height,0,TextureFormat.ToGL(gl,this.srcFormat),  TextureDataType.ToGL(gl, this.dataType), this.m_bytes);
                    if(this.srcFormat == TextureFormat.ALPHA)
                    {
                        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
                    }
                    if(this.m_subDataList != null)
                    {
                        this.m_dataChanged = true;
                        this.__$updateToGpu(rc);
                        this.m_dataChanged = false;
                    }
                }
            }
            
            uploadFromBytes(bytes:Uint8Array, miplevel:number = 0,pw:number = -1,ph:number = -1):void
            {
                if(bytes != null)
                {
                    this.m_bytes = bytes;
                    if( pw > 0 && ph > 0)
                    {
                        this.m_texWidth = pw;
                        this.m_texHeight = ph;
                    }
                    if(this.m_texBuf == null)
                    {
                        this.m_miplevel = miplevel;
                        this.m_haveRData = true;
                    }
                    else
                    {
                        this.m_miplevel = miplevel;                            
                        if(!this.m_dataChanged)
                        {
                            this.m_dataChanged = true;
                            this.m_bytesChanged = true;
                            RenderBufferUpdater.GetInstance().__$addBuf(this);
                        }
                    }
                }
            }
        	updateSubBytes(bytes:Uint8Array,px:number,py:number,twidth:number,theight:number,offset:number = 0):void
            {
                //if(this.m_texBuf != null)
                //{
                    if(this.m_subDataList == null)
                    {
                        this.m_subDataList = [];
                    }
                    let tsd:TexSubBytesData = TexSubBytesData.Create();
                    tsd.bytes = bytes;
                    tsd.subX = px;
                    tsd.subY = py;
                    tsd.subImgWidth = twidth;
                    tsd.subImgHeight = theight;
                    this.m_subDataList.push(tsd);
                    if(!this.m_dataChanged)
                    {
                        this.m_dataChanged = true;
                        RenderBufferUpdater.GetInstance().__$addBuf(this);
                    }
                //}
            }
            getPixels(px:number,py:number, pw:number,ph:number,outBytes:Uint8Array):void
            {
                if(this.m_bytes != null && outBytes != null)
                {
                    let segSize:number = 1;
                    switch(this.srcFormat)
                    {
                        case TextureFormat.ALPHA:
                        break;
                        case TextureFormat.RGBA:
                        segSize = 4;
                        break;
                    }
                    let s:number = pw * ph * segSize;
                    if(outBytes.length == s)
                    {
                        //let pixels:Uint8Array = outBytes;//new Uint8Array(s);
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
                                //trace("BytesTextureProxy::getPixels(), >>>>>>>>>>>>>>>>>>>TextureFormat.RGBA...");
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
                        }
                    }
                }
            }
            __$destroy(rc:RenderProxy):void
            {
                if(!this.isGpuEnabled())
                {
                    this.m_bytes = null;
                    if(this.m_subDataList != null)
                    {
                        for(let i:number = 0; i < this.m_subDataList.length; ++i)
                        {
                            TexSubBytesData.Restore(this.m_subDataList[i]);
                        }
                        this.m_subDataList = null;
                    }
                    console.log("BytesTextureProxy::destroy(), destroy a BytesTextureProxy instance...");
                    super.__$destroy(rc);
                }
            }
            toString():string
            {
                return "[BytesTextureProxy(width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
            
        }
    }
}