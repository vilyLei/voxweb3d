/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as MathConstT from "../../vox/utils/MathConst";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";

import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import MathConst = MathConstT.vox.utils.MathConst;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;
export namespace vox
{
    export namespace texture
    {
        export class TextureProxy implements IRenderBuffer
        {
            private static __s_uid:number = 0;
            private m_uid:number = -1;
            name:string = "TextureProxy";
            
            internalFormat:number = TextureFormat.RGBA;
            srcFormat:number = TextureFormat.RGBA;
            dataType:number = TextureDataType.UNSIGNED_BYTE;
            mipmapEnabled:boolean = false;
            wrap_s:number = TextureConst.WRAP_CLAMP_TO_EDGE;
            wrap_t:number = TextureConst.WRAP_CLAMP_TO_EDGE;
            wrap_r:number = TextureConst.WRAP_CLAMP_TO_EDGE;
            //
            flipY:boolean = false;
            premultiplyAlpha:boolean = false;
            unpackAlignment:number = 4;
            minFilter:number = TextureConst.LINEAR_MIPMAP_LINEAR;
            // QQ浏览器这个参数值为LINEAR会报错:
            // [.WebGL-0BC70EE8]RENDER WARNING: texture bound to texture unit 1 is not renderable. It maybe non-power-of-2 and have incompatible texture filtering.
            magFilter:number = TextureConst.LINEAR;
            protected m_miplevel:number = -1;
            protected m_texWidth:number = 128;
            protected m_texHeight:number = 128;
            protected m_texBufW:number = 128;
            protected m_texBufH:number = 128;
            protected m_uploadBoo:boolean = true;
            protected m_texBuf:any = null;
            protected m_texTarget:number = TextureTarget.TEXTURE_2D;
            protected m_samplerTarget:number = -1;
            // have render useable data
            protected m_haveRData:boolean = false;
            protected m_type:number = TextureConst.TEX_PROXY2D;
            constructor(texList:TextureProxy[], texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                this.m_uid = TextureProxy.__s_uid++;
                if(this.m_uid != texList.length)
                {
                    throw Error("new a TextureProxy instance Error!!!");
                }
                this.___construct(texWidth,texHeight,powerof2Boo);
            }
            getType():number
            {
                return this.m_type;
            }
            getUid():number
            {
                return this.m_uid;
            }
            setWrap(wrap:number):void
            {
                this.wrap_s =  this.wrap_t = this.wrap_r = wrap;
            }

	        private ___construct(pwidth:number,pheight:number, powerof2Boo:boolean = false):void
            {
                if(pwidth  < 1) pwidth = 128;
                if(pheight  < 1) pheight = 128;
                if(powerof2Boo)
                {
                    this.m_texWidth = MathConst.CalcNearestCeilPow2(pwidth);
                    this.m_texHeight = MathConst.CalcNearestCeilPow2(pheight);
                }
                else
                {
                    this.m_texWidth = pwidth;
                    this.m_texHeight = pheight;
                }
            }
            /////////////////////////////////////////////
            __$setTexBuf(gl:any,pTexBuf:any,ptexTarget:number,pw:number = 0,ph:number = 0):void
            {
                if(this.m_texBuf == null)
                {
                    if(pw > 0)this.m_texWidth = pw;
                    if(ph > 0)this.m_texHeight = ph;
                    this.m_texBuf = pTexBuf;
                    this.m_texTarget = ptexTarget;
                    this.m_samplerTarget = TextureTarget.GetValue(gl,this.m_texTarget);
                    this.m_uploadBoo = false;
                    this.m_haveRData = true;
                    this.___buildParam(gl);
                }
                else if(this.m_texBuf == pTexBuf)
                {
                    if(pw > 0 && ph > 0)
                    {
                        this.m_texWidth = pw;
                        this.m_texHeight = ph;
                        this.___buildParam(gl);
                    }
                }
            }
            __$gpuBuf():any
            {
                return this.m_texBuf;
            }
            isGpuEnabled():boolean
            {
                return this.m_texBuf != null;
            }
            getSamplerType():number
            {
                return this.m_samplerTarget;
            }
            // TextureConst.TEXTURE_2D or TextureConst.TEXTURE_CUBE or TextureConst.TEXTURE_3D
            getTargetType():number
            {
                return this.m_texTarget;
            }
            // gpu tex buf size
            getBufWidth():number{return this.m_texBufW;}
            getBufHeight():number{return this.m_texBufH;}
            // logic tex size
            getWidth():number{return this.m_texWidth;}
            getHeight():number{return this.m_texHeight;}
            dataEnough():boolean{return this.m_haveRData;}
            //
            ___buildParam(gl:any):void
            {
                this.m_texBufW = this.m_texWidth;
                this.m_texBufH = this.m_texHeight;
                if (this.mipmapEnabled && MathConst.IsPowerOf2(this.m_texWidth) && MathConst.IsPowerOf2(this.m_texHeight))
                {
                    gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_WRAP_S, TextureConst.GetConst(gl,this.wrap_s));
                    gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_WRAP_T, TextureConst.GetConst(gl,this.wrap_t));//REPEAT
                    if(this.m_texTarget == TextureTarget.TEXTURE_3D)
                    {
                        gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_WRAP_R, TextureConst.GetConst(gl,this.wrap_r));//REPEAT
                        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
                        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(this.m_texWidth));
                    }
                    //gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_minFilter, gl.LINEAR_MIPMAP_LINEAR);
                    gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_MIN_FILTER, TextureConst.GetConst(gl,this.minFilter));
                    gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_MAG_FILTER, TextureConst.GetConst(gl,this.magFilter));
                    //gl.DONT_CARE
                    //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
                    //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.FASTEST);
                    gl.generateMipmap(this.m_samplerTarget);
                }
                else
                {
                    gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_WRAP_S, TextureConst.GetConst(gl,this.wrap_s));
                    gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_WRAP_T, TextureConst.GetConst(gl,this.wrap_t));//REPEAT
                    if(this.m_texTarget == TextureTarget.TEXTURE_3D)
                    {
                        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
                        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(this.m_texWidth));
                    }
                    gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_MIN_FILTER, TextureConst.GetConst(gl,this.minFilter));
                    gl.texParameteri(this.m_samplerTarget, gl.TEXTURE_MAG_FILTER, TextureConst.GetConst(gl,this.magFilter));
                }
            }
            // sub class override
            protected uploadData(rc:RenderProxy):void
            {
            }
            
            private m_updateStatus:number = -1;
            protected m_dataChanged:boolean = false;
            __$setUpdateStatus(s:number):void
            {
                this.m_updateStatus = s;
            }
            __$getUpdateStatus():number
            {
                return this.m_updateStatus;
            }
            // sub class override
            __$updateToGpu(rc:RenderProxy):void
            {
            }
            //  sub class can not override!!!!
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
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
                        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
                        gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.unpackAlignment);
                        this.uploadData(rc);
                        this.___buildParam(gl);
                        this.m_uploadBoo = false;
                    }
                }
            }
            
            toString():string
            {
                return "[TextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
            __$disposeGpu(rc:RenderProxy):void
            {
                if(this.isGpuEnabled())
                {
                    this.m_uploadBoo = true;
                    rc.RContext.deleteTexture(this.m_texBuf);
                    this.m_texBuf = null;
                    //console.log("TextureProxy::__$disposeGpu(), tex: "+this);
                }
            }
            protected __$updateToGpuBegin(gl:any):void
            {
                gl.bindTexture(this.m_samplerTarget, this.m_texBuf);
                switch(this.srcFormat)
                {
                    case TextureFormat.RGBA:
                        gl.pixelStorei(gl.UNPACK_ALIGNMENT,4);
                    break;
                    case TextureFormat.RGB:
                        gl.pixelStorei(gl.UNPACK_ALIGNMENT,3);
                    break;
                    case TextureFormat.ALPHA:
                        gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
                    break;
                    default:                        
                        gl.pixelStorei(gl.UNPACK_ALIGNMENT,4);
                }
            }
            protected __$updateToGpuEnd(gl:any):void
            {
                if(this.srcFormat != TextureFormat.RGBA)
                {
                    gl.pixelStorei(gl.UNPACK_ALIGNMENT,4);
                }
            }
            __$destroy(rc:RenderProxy):void
            {
                if(!this.isGpuEnabled())
                {
                    //this.m_imgData = null;
                    this.m_uploadBoo = true;
                    this.m_haveRData = false;                    
                    this.m_texWidth = 1;
                    this.m_texHeight = 1;
                    console.log("TextureProxy::destroy(), destroy a TextureProxy instance...");
                }
            }
        }
    }
}