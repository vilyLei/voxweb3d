/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as Color4T from "../../vox/material/Color4";
import * as IRunnableT from "../../vox/base/IRunnable";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TexturePoolT from "../../vox/texture/TexturePool";
import * as ImageTextureProxyT from "../../vox/texture/ImageTextureProxy";
import * as BytesTextureProxyT from "../../vox/texture/BytesTextureProxy";
import * as Uint16TextureProxyT from "../../vox/texture/Uint16TextureProxy";
import * as FloatTextureProxyT from "../../vox/texture/FloatTextureProxy";
import * as FloatCubeTextureProxyT from "../../vox/texture/FloatCubeTextureProxy";
import * as BytesCubeTextureProxyT from "../../vox/texture/BytesCubeTextureProxy";
import * as ImageCubeTextureProxyT from "../../vox/texture/ImageCubeTextureProxy";
import * as Texture3DProxyT from "../../vox/texture/Texture3DProxy";
import * as RTTTextureProxyT from "../../vox/texture/RTTTextureProxy";
import * as DepthTextureProxyT from "../../vox/texture/DepthTextureProxy";
import * as WrapperTextureProxyT from "../../vox/texture/WrapperTextureProxy";
import * as RendererInstanceT from "../../vox/scene/RendererInstance";
import * as TextureResSlotT from "../../vox/texture/TextureResSlot";
import * as RTTTextureStoreT from "../../vox/texture/RTTTextureStore";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import Color4 = Color4T.vox.material.Color4;
import IRunnable = IRunnableT.vox.base.IRunnable;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexturePool = TexturePoolT.vox.texture.TexturePool;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;
import BytesTextureProxy = BytesTextureProxyT.vox.texture.BytesTextureProxy;
import Uint16TextureProxy = Uint16TextureProxyT.vox.texture.Uint16TextureProxy;
import FloatTextureProxy = FloatTextureProxyT.vox.texture.FloatTextureProxy;
import FloatCubeTextureProxy = FloatCubeTextureProxyT.vox.texture.FloatCubeTextureProxy;
import BytesCubeTextureProxy = BytesCubeTextureProxyT.vox.texture.BytesCubeTextureProxy;
import ImageCubeTextureProxy = ImageCubeTextureProxyT.vox.texture.ImageCubeTextureProxy;
import Texture3DProxy = Texture3DProxyT.vox.texture.Texture3DProxy;
import RTTTextureProxy = RTTTextureProxyT.vox.texture.RTTTextureProxy;
import DepthTextureProxy = DepthTextureProxyT.vox.texture.DepthTextureProxy;
import WrapperTextureProxy = WrapperTextureProxyT.vox.texture.WrapperTextureProxy;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import TextureResSlot = TextureResSlotT.vox.texture.TextureResSlot;
import RTTTextureStore = RTTTextureStoreT.vox.texture.RTTTextureStore;

export namespace vox
{
    export namespace texture
    {
        /**
         * 本类作为所有基础纹理对象的管理类,只允许在RendererInstance之上的类中使用
         */
        export class TextureBlock
        {
            private m_texPool:TexturePool = new TexturePool();
            private m_rttStore:RTTTextureStore = null;
            private m_renderer:RendererInstance = null;
            private m_texLoaders:IRunnable[] = [];
            addTexLoader(texLoader:IRunnable):void
            {
                if(texLoader != null)
                {
                    let i:number = 0;
                    let il:number = this.m_texLoaders.length
                    for(; i < il;++i)
                    {
                        if(texLoader == this.m_texLoaders[i])
                        {
                            break;
                        }
                    }
                    if(i >= il)
                    {
                        this.m_texLoaders.push(texLoader);
                    }
                }
            }
            removeTexLoader(texLoader:IRunnable):void
            {
                if(texLoader != null)
                {
                    let i:number = 0;
                    let il:number = this.m_texLoaders.length
                    for(; i < il;++i)
                    {
                        if(texLoader == this.m_texLoaders[i])
                        {
                            this.m_texLoaders.slice(i,1);
                            break;
                        }
                    }
                }
            }
            /**
             * 设置当前的渲染器
             * @param renderer 当前的渲染器
             */
            setRenderer(renderer:RendererInstance):void
            {
                this.m_renderer = renderer;
                TextureResSlot.GetInstance().setRenderProxy(renderer.getRenderProxy());
                if(this.m_rttStore == null && renderer != null)
                {
                    this.m_rttStore = new RTTTextureStore(renderer.getRenderProxy());
                }
            }
            getRTTStrore():RTTTextureStore
            {
                return this.m_rttStore;
            }
            createWrapperTex(pw:number,ph:number,powerof2Boo:boolean = false):WrapperTextureProxy
            {
                let tex:WrapperTextureProxy = new WrapperTextureProxy(pw,ph,powerof2Boo);
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }

            createRTTTex2D(pw:number,ph:number,powerof2Boo:boolean = false):RTTTextureProxy
            {
                let tex:RTTTextureProxy = new RTTTextureProxy(pw,ph,powerof2Boo);
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }
            createImageTex2D(pw:number,ph:number,powerof2Boo:boolean = false):ImageTextureProxy
            {
                let tex:ImageTextureProxy = this.m_texPool.getTexture(TextureProxyType.Image) as ImageTextureProxy;
                if(tex == null)
                {
                    tex = new ImageTextureProxy(pw,ph,powerof2Boo);
                }
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                tex.mipmapEnabled = true;
                tex.setWrap(TextureConst.WRAP_REPEAT);
                return tex;
            }
            
            createHalfFloatTex2D(pw:number,ph:number,powerof2Boo:boolean = false):FloatTextureProxy
            {
                let tex:FloatTextureProxy = this.m_texPool.getTexture(TextureProxyType.Float) as FloatTextureProxy;
                if(tex == null)
                {
                    tex = new FloatTextureProxy(pw,ph,powerof2Boo);
                }                
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.HALF_FLOAT_OES;
                //tex.srcFormat = TextureFormat.RGBA16F;
                //tex.dataType = TextureDataType.FLOAT;
                return tex;
            }
            createFloatTex2D(pw:number,ph:number,powerof2Boo:boolean = false):FloatTextureProxy
            {
                let tex:FloatTextureProxy = this.m_texPool.getTexture(TextureProxyType.Float) as FloatTextureProxy;
                
                if(tex == null)
                {
                    tex = new FloatTextureProxy(pw,ph,powerof2Boo);
                }
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }
            createUint16Tex2D(pw:number,ph:number,powerof2Boo:boolean = false):Uint16TextureProxy
            {
                return new Uint16TextureProxy(pw,ph,powerof2Boo);
            }
            createFloatCubeTex(pw:number,ph:number,powerof2Boo:boolean = false):FloatCubeTextureProxy
            {
                return new FloatCubeTextureProxy(pw,ph);
            }
            createBytesTex(texW:number,texH:number):BytesTextureProxy
            {
                let tex:BytesTextureProxy = this.m_texPool.getTexture(TextureProxyType.Bytes) as BytesTextureProxy;
                if(tex == null)
                {
                    tex = new BytesTextureProxy(texW,texH);
                }
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }
            
            createBytesCubeTex(texW:number,texH:number):BytesCubeTextureProxy
            {
                let tex:BytesCubeTextureProxy = new BytesCubeTextureProxy(texW,texH);
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }
            createImageCubeTex(texW:number,texH:number):ImageCubeTextureProxy
            {
                let tex:ImageCubeTextureProxy = new ImageCubeTextureProxy(texW,texH);
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }
            createTex3D(texW:number,texH:number, depth:number = 1):Texture3DProxy
            {
                if(depth < 1)
                {
                    depth = 1;
                }
                let tex:Texture3DProxy = new Texture3DProxy(texW,texH,depth);
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }
            createRGBATex2D(pw:number,ph:number,color:Color4):BytesTextureProxy
            {
                pw = pw > 1 ? pw:1;
                ph = ph > 1 ? ph:1;

                let tot:number = pw * ph;
                let tex:BytesTextureProxy = this.createBytesTex(pw,ph);
                let bytes:Uint8Array = new Uint8Array(tot * 4);
                let pr:number = Math.round(color.r * 255.0);
                let pg:number = Math.round(color.g * 255.0);
                let pb:number = Math.round(color.b * 255.0);
                let pa:number = Math.round(color.a * 255.0);
                let k:number = 0;
                let fs:number[] = [pr,pg,pb,pa];
                for(let i:number = 0; i < tot; ++i)
                {
                    bytes.set(fs,k);
                    k += 4;
                }
                tex.setDataFromBytes(bytes,0, pw,ph);
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
                return tex;
            }
            createAlphaTex2D(pw:number,ph:number,alpha:number):BytesTextureProxy
            {
                pw = pw > 1 ? pw:1;
                ph = ph > 1 ? ph:1;
                let size:number = pw * ph;
                let tex:BytesTextureProxy = this.createBytesTex(pw,ph);
                tex.toAlphaFormat();
                let bytes:Uint8Array = new Uint8Array(size);
                let value:number = Math.round(alpha * 255.0);
                bytes.fill(value,0,size);
                tex.setDataFromBytes(bytes,0, pw,ph);
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }
            createAlphaTexBytes2D(pw:number,ph:number,bytes:Uint8Array):BytesTextureProxy
            {
                let tex:BytesTextureProxy = this.createBytesTex(pw,ph);             
                tex.setDataFromBytes(bytes, 0, pw, ph);
                tex.toAlphaFormat();
                tex.__$setRenderProxy(this.m_renderer.getRenderProxy());
                return tex;
            }
            

            // reusable rtt texture resources for one renderer context
            getCubeRTTTextureAt(i:number):RTTTextureProxy
	        {
                return this.m_rttStore.getCubeRTTTextureAt(i);
            }
            createCubeRTTTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                return this.m_rttStore.createCubeRTTTextureAt(i,pw,ph);
            }
            getRTTTextureAt(i:number):RTTTextureProxy
	        {
                return this.m_rttStore.getRTTTextureAt(i);
            }
            createRTTTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                return this.m_rttStore.createRTTTextureAt(i,pw,ph);
            }
            getDepthTextureAt(i:number):DepthTextureProxy
	        {
                return this.m_rttStore.getDepthTextureAt(i);
            }
            createDepthTextureAt(i:number,pw:number,ph:number):DepthTextureProxy
	        {
                return this.m_rttStore.createDepthTextureAt(i,pw,ph);
            }
            getRTTFloatTextureAt(i:number):RTTTextureProxy
	        {
                return this.m_rttStore.getRTTFloatTextureAt(i);
            }
            createRTTFloatTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                return this.m_rttStore.createRTTFloatTextureAt(i,pw,ph);
            }

            private m_clearDelay:number = 128;
            run():void
            {
                let i:number = 0;
                let il:number = this.m_texLoaders.length;
                for(; i < il;++i)
                {
                    this.m_texLoaders[i].run();
                }
                if(this.m_clearDelay < 1)
                {
                    /**
                     * 准备释放回收 texture resource.
                     */
                    let tex:TextureProxy;
                    this.m_clearDelay = 128;
                    
                    let freeMap:Map<number,number> = TextureResSlot.GetInstance().getFreeResUidMap();
                    let total:number = 32;
                    for(const [key,value] of freeMap)
                    {
                        if(total < 1)
                        {
                            break;
                        }
                        total--;
                        if(value > 2)
                        {
                            freeMap.delete(key);
                            tex = TextureResSlot.GetInstance().removeTextureByUid(key) as TextureProxy;
                            if(tex != null)
                            {
                                this.m_texPool.addTexture(tex);
                            }
                            else
                            {
                                console.warn("TextureBlock remove a texture(uid="+key+") error.");
                            }
                            console.log("TextureBlock remove a texture: ",tex);
                        }
                        else
                        {
                            freeMap.set(key,value + 1);
                        }
                    }
                }
                this.m_clearDelay --;
            }
            
        }
    }
}