/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {TextureConst,TextureFormat,TextureDataType,TextureTarget,TextureProxyType} from "../../vox/texture/TextureConst";
import MathConst from "../../vox/math/MathConst";

import ITexData from "../../vox/texture/ITexData";
import RenderProxy from "../../vox/render/RenderProxy";
import IRenderResource from "../../vox/render/IRenderResource";
import IRenderTexture from "../../vox/render/IRenderTexture";
import TextureResSlot from "../../vox/texture/TextureResSlot";

/**
 * Texture cpu memory data object
 */
export class TextureProxy implements IRenderTexture
{
    private m_uid:number = -1;
    // 自身的引用计数器
    private m_attachCount:number = 0;
    protected m_renderProxy:RenderProxy = null;
    protected m_slot:TextureResSlot = null;
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
    /**
     * the value contains (1,2,4,8) 
     */
    unpackAlignment:number = 4;
    minFilter:number = TextureConst.LINEAR_MIPMAP_LINEAR;
    // webgl1环境下,这个参数值为LINEAR会报错:
    // [.WebGL-0BC70EE8]RENDER WARNING: texture bound to texture unit 1 is not renderable. It maybe non-power-of-2 and have incompatible texture filtering.
    magFilter:number = TextureConst.LINEAR;
    // 用于记录自身变换的版本号，例如数据变换
    version:number = 0;
    constructor(texWidth:number,texHeight:number,powerof2Boo:boolean = false)
    {
        this.m_slot = TextureResSlot.GetInstance();
        this.m_uid = this.m_slot.getFreeUid();
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
        this.m_slot.__$$addTexture(this);
    }
    /**
     * This function only be be called by the renderer inner system.
     */
    __$$use(resTex:IRenderResource):void
    {
        resTex.bindToGpu(this.getResUid());
    }
    __$setRenderProxy(rc:RenderProxy):void
    {
        if(this.m_slot != null)
        {
            this.m_renderProxy = rc;
        }
        else
        {
            // 这样处理可能有错误
            this.m_slot = TextureResSlot.GetInstance();
            this.m_uid = this.m_slot.getFreeUid();
            this.m_slot.__$$addTexture(this);
            this.m_renderProxy = rc;
        }
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
        //console.log("TextureProxy::__$attachThis() this(uid="+this.getUid()+").attachCount: "+this.m_attachCount);
    }
    /**
     * 被引用计数减一
     */
    __$detachThis():void
    {
        if(this.m_attachCount > 0)
        {
            --this.m_attachCount;
            //console.log("TextureProxy::__$detachThis() this(uid="+this.getUid()+").attachCount: "+this.m_attachCount);
            if(this.m_attachCount < 1)
            {
                this.m_attachCount = -1;
                this.m_slot.addFreeUid(this.getUid());
                //console.log("TextureProxy::__$detachThis() this.m_attachCount value is 0.");
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
     * 注意，这个返回值在多 renderer instance的时候，如果renderer instance 共享了这个texture，则此返回值和TextureSlot相关
     * @returns the texture gpu resource is enabled or not.
     */
    isGpuEnabled():boolean
    {
        return this.m_renderProxy != null && this.m_renderProxy.Texture.hasResUid(this.getResUid());
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
    // gpu texture buf size
    getBufWidth():number{return this.m_texBufW;}
    getBufHeight():number{return this.m_texBufH;}
    // logic texture size
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
        //  if (this.mipmapEnabled && MathConst.IsPowerOf2(this.m_texWidth) && MathConst.IsPowerOf2(this.m_texHeight))
        //  {
        //      if(this.m_texTarget == TextureTarget.TEXTURE_3D)
        //      {
        //          gl.texParameteri(this.m_sampler, gl.TEXTURE_WRAP_R, TextureConst.GetConst(gl,this.wrap_r));
        //      }
        //      //gl.DONT_CARE
        //      //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
        //      //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.FASTEST);
        //  }
        if(this.m_texTarget == TextureTarget.TEXTURE_3D)
        {
            gl.texParameteri(this.m_sampler, gl.TEXTURE_WRAP_R, TextureConst.GetConst(gl,this.wrap_r));
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(this.m_texWidth));
        }
        if(this.mipmapEnabled && this.m_generateMipmap)
        {
            gl.generateMipmap(this.m_sampler);
        }
    }
    // sub class override
    protected uploadData(texRes:IRenderResource):void
    {
    }
    
    // sub class override
    __$updateToGpu(texRes:IRenderResource):void
    {
    }
    /**
     * 准备将数据更新到当前的 Gpu context,这是一个异步过程，在渲染运行时才会真正的提交给gpu
     * 这个函数由用户主动调用
     * 这个函数不能被子类覆盖
     */
    updateDataToGpu(rc:RenderProxy = null,deferred:boolean = true):void
    {
        if(rc != null) this.m_renderProxy = rc;
        if(this.m_renderProxy != null)
        {
            this.m_renderProxy.MaterialUpdater.updateTextureData(this, deferred);
        }
    }
    protected createTexBuf(texResource:IRenderResource):boolean
    {
        if(!texResource.hasResUid(this.getResUid()))
        {
            this.m_sampler = TextureTarget.GetValue(texResource.getRC(),this.m_texTarget);
            texResource.createResByParams3(this.getResUid(), this.getWidth(),this.getHeight(),this.m_sampler);
            return true;
        }
        return false;
    }
    /**
     * This function only be be called by the renderer inner system.
     * if sub class override this function, it must does call this function.
     */
    __$$upload(texRes:IRenderResource):void
    {
        if(this.m_haveRData && this.m_slot != null)
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
    protected dataUploadToGpu(gl:any,texData:ITexData,texDatas:ITexData[],force:boolean = false):void
    {
        this.version = 0;
        let interType:any = TextureFormat.ToGL(gl,this.internalFormat);
        let format:any = TextureFormat.ToGL(gl,this.srcFormat);
        let type:any = TextureDataType.ToGL(gl, this.dataType);
        let d:ITexData = texData;
        if(texDatas == null)
        {
            if(d.status > -1 || force)d.updateToGpu(gl,this.m_sampler,interType,format,type, force);
        }
        else
        {
            let ds:ITexData[] = texDatas;
            for(let i:number = 0, len:number = ds.length; i < len; ++i)
            {
                d = ds[i];
                if(d != null)
                {
                    if(d.status > -1 || force)d.updateToGpu(gl,this.m_sampler,interType,format,type, force);
                }
            }
            this.m_generateMipmap = false;
        }
    }
    protected __$updateToGpuBegin(texRes:IRenderResource):void
    {
        let gl:any = texRes.getRC();
        texRes.bindToGpu(this.getResUid());
        
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
            this.m_haveRData = false;
            this.m_texWidth = 1;
            this.m_texHeight = 1;
            this.m_renderProxy = null;
            //console.log("TextureProxy::destroy(), destroy a textureProxy instance(uid="+this.getUid()+")...");
        }
    }
    /**
     * 移除之后则不能再正常使用了
     */
    __$$removeFromSlot():void
    {
        if(this.m_slot != null && this.getAttachCount() == -2)
        {
            // this.m_slot.__$$removeTexture(this);
            // this.m_slot 不能随便等于null,因为当前textureProxy实例还会通过this.m_slot来重复使用
            // 如果 this.m_slot 要等于 null, 则这个textureProxy实例及其uid需要回收
            this.m_slot = null;
            this.m_renderProxy = null;
            this.m_uid = -1;
            //console.log("TextureProxy::RemoveFromSlot(), destroy a textureProxy instance(uid="+this.getUid()+")...");
        }
    }
    toString():string
    {
        return "[TextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
    }
}

export default TextureProxy;