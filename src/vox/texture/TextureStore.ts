/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as Color4T from "../../vox/material/Color4";
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

import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import Color4 = Color4T.vox.material.Color4;
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
         * 这里类是将要废除的类
         */
        export class TextureStore
        {
            private static s_texPool:TexturePool = new TexturePool();
            private static s_rttStore:RTTTextureStore = null;
            private static s_renderer:RendererInstance = null;
            /**
             * 设置当前的渲染器
             * @param renderer 当前的渲染器
             */
            static SetRenderer(renderer:RendererInstance):void
            {
                TextureStore.s_renderer = renderer;
                if(TextureStore.s_rttStore == null && renderer != null)
                {
                    TextureStore.s_rttStore = new RTTTextureStore(renderer.getRenderProxy());
                }
                TextureResSlot.GetInstance().setRenderProxy(renderer.getRenderProxy());
            }
            
            static CreateWrapperTex(pw:number,ph:number,powerof2Boo:boolean = false):WrapperTextureProxy
            {
                let tex:WrapperTextureProxy = new WrapperTextureProxy(pw,ph,powerof2Boo);
                return tex;
            }

            static CreateRTTTex2D(pw:number,ph:number,powerof2Boo:boolean = false):RTTTextureProxy
            {
                let tex:RTTTextureProxy = new RTTTextureProxy(pw,ph,powerof2Boo);
                return tex;
            }
            static CreateImageTex2D(pw:number,ph:number,powerof2Boo:boolean = false):ImageTextureProxy
            {
                let tex:ImageTextureProxy = TextureStore.s_texPool.getTexture(TextureProxyType.Image) as ImageTextureProxy;
                if(tex == null)
                {
                    tex = new ImageTextureProxy(pw,ph,powerof2Boo);
                }
                return tex;
            }
            
            static CreateHalfFloatTex2D(pw:number,ph:number,powerof2Boo:boolean = false):FloatTextureProxy
            {
                let tex:FloatTextureProxy = TextureStore.s_texPool.getTexture(TextureProxyType.Float) as FloatTextureProxy;
                if(tex == null)
                {
                    tex = new FloatTextureProxy(pw,ph,powerof2Boo);
                }
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.HALF_FLOAT_OES;
                //tex.srcFormat = TextureFormat.RGBA16F;
                //tex.dataType = TextureDataType.FLOAT;
                return tex;
            }
            static CreateFloatTex2D(pw:number,ph:number,powerof2Boo:boolean = false):FloatTextureProxy
            {
                let tex:FloatTextureProxy = TextureStore.s_texPool.getTexture(TextureProxyType.Float) as FloatTextureProxy;
                
                if(tex == null)
                {
                    tex = new FloatTextureProxy(pw,ph,powerof2Boo);
                }
                return tex;
            }
            static CreateUint16Tex2D(pw:number,ph:number,powerof2Boo:boolean = false):Uint16TextureProxy
            {
                let tex:Uint16TextureProxy = new Uint16TextureProxy(pw,ph,powerof2Boo);
                return tex;
            }
            static CreateFloatCubeTex(pw:number,ph:number,powerof2Boo:boolean = false):FloatCubeTextureProxy
            {
                let tex:FloatCubeTextureProxy = new FloatCubeTextureProxy(pw,ph);
                return tex;
            }
            static CreateBytesTex(texW:number,texH:number):BytesTextureProxy
            {
                let tex:BytesTextureProxy = TextureStore.s_texPool.getTexture(TextureProxyType.Bytes) as BytesTextureProxy;
                if(tex == null)
                {
                    tex = new BytesTextureProxy(texW,texH);
                }
                else
                {
                    console.log("repeat use bytes texture from the texture pool.");
                    tex.__$setRenderProxy(TextureStore.s_renderer.getRenderProxy());
                }
                return tex;
            }
            
            static CreateBytesCubeTex(texW:number,texH:number):BytesCubeTextureProxy
            {
                let tex:BytesCubeTextureProxy = new BytesCubeTextureProxy(texW,texH);
                return tex;
            }
            static CreateImageCubeTex(texW:number,texH:number):ImageCubeTextureProxy
            {
                let tex:ImageCubeTextureProxy = new ImageCubeTextureProxy(texW,texH);
                return tex;
            }
            static CreateTex3D(texW:number,texH:number, depth:number = 1):Texture3DProxy
            {
                if(depth < 1)
                {
                    depth = 1;
                }
                let tex:Texture3DProxy = new Texture3DProxy(texW,texH,depth);
                return tex;
            }
            static CreateRGBATex2D(pw:number,ph:number,color:Color4):BytesTextureProxy
            {
                pw = pw > 1 ? pw:1;
                ph = ph > 1 ? ph:1;

                let tot:number = pw * ph;
                let tex:BytesTextureProxy = TextureStore.CreateBytesTex(pw,ph);
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
                return tex;
            }
            static CreateAlphaTex2D(pw:number,ph:number,alpha:number):BytesTextureProxy
            {
                pw = pw > 1 ? pw:1;
                ph = ph > 1 ? ph:1;
                let size:number = pw * ph;
                let tex:BytesTextureProxy = TextureStore.CreateBytesTex(pw,ph);
                tex.toAlphaFormat();
                let bytes:Uint8Array = new Uint8Array(size);
                let value:number = Math.round(alpha * 255.0);
                bytes.fill(value,0,size);
                tex.setDataFromBytes(bytes,0, pw,ph);
                return tex;
            }
            static CreateAlphaTexBytes2D(pw:number,ph:number,bytes:Uint8Array):BytesTextureProxy
            {
                let tex:BytesTextureProxy = TextureStore.CreateBytesTex(pw,ph);             
                tex.setDataFromBytes(bytes, 0, pw, ph);
                tex.toAlphaFormat();
                return tex;
            }
            

            // reusable rtt texture resources for one renderer context
            static GetCubeRTTTextureAt(i:number):RTTTextureProxy
	        {
                return TextureStore.s_rttStore.getCubeRTTTextureAt(i);
            }
            static CreateCubeRTTTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                return TextureStore.s_rttStore.createCubeRTTTextureAt(i,pw,ph);
            }
            static GetRTTTextureAt(i:number):RTTTextureProxy
	        {
                return TextureStore.s_rttStore.getRTTTextureAt(i);
            }
            static CreateRTTTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                return TextureStore.s_rttStore.createRTTTextureAt(i,pw,ph);
            }
            static GetDepthTextureAt(i:number):DepthTextureProxy
	        {
                return TextureStore.s_rttStore.getDepthTextureAt(i);
            }
            static CreateDepthTextureAt(i:number,pw:number,ph:number):DepthTextureProxy
	        {
                return TextureStore.s_rttStore.createDepthTextureAt(i,pw,ph);
            }
            static GetRTTFloatTextureAt(i:number):RTTTextureProxy
	        {
                return TextureStore.s_rttStore.getRTTFloatTextureAt(i);
            }
            static CreateRTTFloatTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                return TextureStore.s_rttStore.createRTTFloatTextureAt(i,pw,ph);
            }

            private static s_dlearDelay:number = 256;
            static Update():void
            {
                if(TextureStore.s_dlearDelay < 1)
                {
                    /**
                     * 准备释放回收 texture resource.
                     */
                    let tex:TextureProxy;
                    TextureStore.s_dlearDelay = 256;
                    
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
                                TextureStore.s_texPool.addTexture(tex);                                
                            }
                            else
                            {
                                console.error("TextureStore remove a texture(uid="+key+") error.");
                            }
                            console.log("TextureStore remove a texture: ",tex);
                        }
                        else
                        {
                            freeMap.set(key,value + 1);
                        }
                    }
                }
                TextureStore.s_dlearDelay --;
            }
            
        }
    }
}