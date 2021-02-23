/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as MathConstT from "../../vox/utils/MathConst";

import * as ITexDataT from "../../vox/texture/ITexData";
import * as ROTextureResourceT from '../../vox/render/ROTextureResource';
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import MathConst = MathConstT.vox.utils.MathConst;

import ITexData = ITexDataT.vox.texture.ITexData;
import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;
import GpuTexObect = ROTextureResourceT.vox.render.GpuTexObect;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;
export namespace vox
{
    export namespace texture
    {
        
        /**
         * Texture cpu memory data object
         */
        export class TextureProxy implements IRenderBuffer
        {
            private static s_uid:number = 0;
            private m_uid:number = -1;
            // 自身的引用计数器
            private m_attachCount:number = 0;
            protected m_texBuf:any = null;
            protected m_slot:ITextureSlot = null;

            protected m_miplevel:number = -1;
            protected m_texWidth:number = 128;
            protected m_texHeight:number = 128;
            protected m_texBufW:number = 128;
            protected m_texBufH:number = 128;
            protected m_texTarget:number = TextureTarget.TEXTURE_2D;
            // The fragment processor texture sampler type.
            protected m_sampler:number = -1;

            // have render useable data
            protected m_haveRData:boolean = false;
            protected m_type:TextureProxyType = TextureProxyType.Default;
            protected m_generateMipmap:boolean = true;
            
            name:string = "TextureProxy";
            internalFormat:number = TextureFormat.RGBA;
            srcFormat:number = TextureFormat.RGBA;
            dataType:number = TextureDataType.UNSIGNED_BYTE;
            wrap_s:number = TextureConst.WRAP_CLAMP_TO_EDGE;
            wrap_t:number = TextureConst.WRAP_CLAMP_TO_EDGE;
            wrap_r:number = TextureConst.WRAP_CLAMP_TO_EDGE;
            
            mipmapEnabled:boolean = false;
            flipY:boolean = false;
            premultiplyAlpha:boolean = false;
            unpackAlignment:number = 4;
            minFilter:number = TextureConst.LINEAR_MIPMAP_LINEAR;
            // webgl1环境下,这个参数值为LINEAR会报错:
            // [.WebGL-0BC70EE8]RENDER WARNING: texture bound to texture unit 1 is not renderable. It maybe non-power-of-2 and have incompatible texture filtering.
            magFilter:number = TextureConst.LINEAR;
            constructor(slot:ITextureSlot, texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                if(slot == null)
                {
                    throw Error("create a new textureProxy instance Error!!!");
                }
                this.m_slot = slot;
                this.m_uid = TextureProxy.s_uid++;

                if(texWidth  < 1) texWidth = 128;
                if(texHeight  < 1) texHeight = 128;
                if(powerof2Boo)
                {
                    this.m_texWidth = MathConst.CalcNearestCeilPow2(texWidth);
                    this.m_texHeight = MathConst.CalcNearestCeilPow2(texHeight);
                }
                else
                {
                    this.m_texWidth = texWidth;
                    this.m_texHeight = texHeight;
                }
            }
            __$setSlot(slot:ITextureSlot):void
            {
                if(this.m_slot == null && slot != null)
                {
                    this.m_attachCount = 0;
                    this.m_slot = slot;
                }
            }
            /**
             * This function only be be called by the renderer inner system.
             */
            __$$use(resTex:ROTextureResource):void
            {
                resTex.bindTexture(this.getResUid());
            }
            /**
             * 被引用计数加一
             */
            __$attachThis():void
            {
                if(this.m_attachCount == -1)
                {
                    this.m_slot.removeFreeUid(this.getUid());
                    this.m_attachCount = 0;
                }
                ++this.m_attachCount;
            }
            /**
             * 被引用计数减一
             */
            __$detachThis():void
            {
                if(this.m_attachCount > 0)
                {
                    --this.m_attachCount;
                    console.log("TextureProxy::__$detachThis() this(uid="+this.getUid()+").attachCount: "+this.m_attachCount);
                    if(this.m_attachCount < 1)
                    {
                        this.m_attachCount = -1;
                        this.m_slot.addFreeUid(this.getUid());
                        console.log("TextureProxy::__$detachThis() this.m_attachCount value is 0.");
                    }
                }
            }

            /**
             * @returns 获得引用计数值
             */
            getAttachCount():number
            {
                return this.m_attachCount;
            }
            /**
             * @returns 返回true, 表示当前纹理对象是渲染直接使用其对应的显存资源的对象
             *          返回false, 表示不能直接使用对应的显存资源
             */
            isDirect():boolean
            {
                return true;
            }
            /**
             * @returns 返回自己的纹理类型(value: TextureProxyType)
             */
            getType():TextureProxyType
            {
                return this.m_type;
            }
            /**
             * @returns 返回自己的 纹理资源 unique id, 这个id会被对应的资源管理器使用, 此方法子类可以依据需求覆盖
             */
            getResUid():number
            {
                return this.m_uid;
            }
            /**
             * @returns 返回自己的 unique id, 此方法不允许子类覆盖
             */
            getUid():number
            {
                return this.m_uid;
            }
            setWrap(wrap:number):void
            {
                this.wrap_s =  this.wrap_t = this.wrap_r = wrap;
            }
            /**
             * @returns the texture gpu resource is enabled or not.
             */
            isGpuEnabled():boolean
            {
                return this.m_slot.isGpuEnabledByResUid(this.getResUid());
            }
            /**
             * @returns The fragment processor texture sampler type.
             */
            getSampler():number
            {
                return this.m_sampler;
            }
            /**
             * @returns return value is TextureConst.TEXTURE_2D or TextureConst.TEXTURE_CUBE or TextureConst.TEXTURE_3D
             */
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
            /**
             * @returns the texture data is enough or not.
             */
            isDataEnough():boolean{return this.m_haveRData;}
            
            protected __$buildParam(gl:any):void
            {
                this.m_texBufW = this.m_texWidth;
                this.m_texBufH = this.m_texHeight;
                // texture wrap
                gl.texParameteri(this.m_sampler, gl.TEXTURE_WRAP_S, TextureConst.GetConst(gl,this.wrap_s));
                gl.texParameteri(this.m_sampler, gl.TEXTURE_WRAP_T, TextureConst.GetConst(gl,this.wrap_t));
                // texture filter
                gl.texParameteri(this.m_sampler, gl.TEXTURE_MIN_FILTER, TextureConst.GetConst(gl,this.minFilter));
                gl.texParameteri(this.m_sampler, gl.TEXTURE_MAG_FILTER, TextureConst.GetConst(gl,this.magFilter));

                if (this.mipmapEnabled && MathConst.IsPowerOf2(this.m_texWidth) && MathConst.IsPowerOf2(this.m_texHeight))
                {
                    if(this.m_texTarget == TextureTarget.TEXTURE_3D)
                    {
                        gl.texParameteri(this.m_sampler, gl.TEXTURE_WRAP_R, TextureConst.GetConst(gl,this.wrap_r));
                    }
                    //gl.DONT_CARE
                    //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
                    //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.FASTEST);
                    if(this.m_generateMipmap)
                    {
                        gl.generateMipmap(this.m_sampler);
                    }
                }
                
                if(this.m_texTarget == TextureTarget.TEXTURE_3D)
                {
                    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
                    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(this.m_texWidth));
                }
            }
            // sub class override
            protected uploadData(texRes:ROTextureResource):void
            {
            }
            
            // sub class override
            __$updateToGpu(rc:RenderProxy):void
            {
            }
            /**
             * 准备将数据更新到当前的 Gpu context,这是一个异步过程，在渲染运行时才会真正的提交给gpu
             * 这个函数由用户主动调用
             */
            updateDataToGpu():void
            {
                if(this.isGpuEnabled())
                {
                    console.log("AAAAAA updateDataToGpu...this.getResUid(): "+this.getResUid());
                    this.m_slot.addRenderBuffer(this, this.getResUid());
                }
            }
            protected createTexBuf(texResource:ROTextureResource):boolean
            {
                let obj:GpuTexObect = texResource.getTextureRes(this.getResUid());
                if(obj == null)
                {
                    this.m_sampler = TextureTarget.GetValue(texResource.getRC(),this.m_texTarget);
                    obj = new GpuTexObect();
                    obj.rcuid = texResource.getRCUid();
                    obj.resUid = this.getResUid();
                    obj.width = this.getWidth();
                    obj.height = this.getHeight();
                    obj.sampler = this.getSampler();
                    obj.texBuf = texResource.createBuf();
                    texResource.addTextureRes(obj);
                    this.m_texBuf = obj.texBuf;
                    return true;
                }
                return false;
            }
            /**
             * This function only be be called by the renderer inner system.
             * if sub class override this function, it must does call this function.
             */
            __$$upload(texRes:ROTextureResource):void
            {
                if(this.m_haveRData)
                {
                    let buildStatus:boolean = this.createTexBuf(texRes);
                    if(buildStatus)
                    {
                        this.__$updateToGpuBegin(texRes);
                        this.uploadData(texRes);
                        this.__$buildParam(texRes.getRC());
                        this.m_generateMipmap = true;
                    }
                }
            }
            /**
             * sub class can not override!!!!
             */
            protected dataUploadToGpu(gl:any,texData:ITexData,texDatas:ITexData[]):void
            {                
                let interType:any = TextureFormat.ToGL(gl,this.internalFormat);
                let format:any = TextureFormat.ToGL(gl,this.srcFormat);
                let type:any = TextureDataType.ToGL(gl, this.dataType);
                let d:ITexData = texData;
                if(texDatas == null)
                {
                    if(d.status > -1)d.updateToGpu(gl,this.m_sampler,interType,format,type);
                }
                else
                {
                    let ds:ITexData[] = texDatas;
                    for(let i:number = 0, len:number = ds.length; i < len; ++i)
                    {
                        d = ds[i];
                        if(d != null)
                        {
                            if(d.status > -1)d.updateToGpu(gl,this.m_sampler,interType,format,type);
                        }
                    }
                    this.m_generateMipmap = false;
                }
            }
            protected __$updateToGpuBegin(texRes:ROTextureResource):void
            {
                let gl:any = texRes.getRC();
                texRes.bindTexture(this.getResUid());
                
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.unpackAlignment);
            }
            protected __$updateToGpuEnd(gl:any):void
            {
            }
            /**
             * @returns This textureProxy instance has been destroyed.
             */
            isDestroyed():boolean
            {
                return this.m_attachCount < -1;
            }
            __$destroy():void
            {
                if(this.getAttachCount() < 1)
                {
                    this.m_attachCount = -2;
                    this.m_texBuf = null;
                    this.m_haveRData = false;
                    this.m_texWidth = 1;
                    this.m_texHeight = 1;
                    this.m_slot = null;
                    console.log("TextureProxy::destroy(), destroy a textureProxy instance(uid="+this.getUid()+")...");
                }
            }
            toString():string
            {
                return "[TextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
        }
    }
}