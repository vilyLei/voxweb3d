/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as Color4T from "../../vox/material/Color4";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
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
import * as ROBufferUpdaterT from "../../vox/render/ROBufferUpdater";
import * as TextureSlotT from "../../vox/texture/TextureSlot";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import Color4 = Color4T.vox.material.Color4;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
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
import ROBufferUpdater = ROBufferUpdaterT.vox.render.ROBufferUpdater;
import TextureSlot = TextureSlotT.vox.texture.TextureSlot;

export namespace vox
{
    export namespace texture
    {
        // 注意这里只会管理gpu相关的资源
        class TexUidStore
        {
            private m_useidList:number[] = [];
            private m_removeidList:number[] = [];
            private m_tex2DUids:number[] = [];
            private m_cubeTexUids:number[] = [];
            private m_bytesTexUids:number[] = [];
            private m_tex3DUids:number[] = [];
            constructor()
            {
            }
            getTex2DUid():number
            {
                if(this.m_tex2DUids.length > 0)return this.m_tex2DUids.pop();
                return -1;
            }
            getCubeTexUid():number
            {
                if(this.m_cubeTexUids.length > 0)return this.m_cubeTexUids.pop();
                return -1;
            }
            getBytesTexUid():number
            {
                if(this.m_bytesTexUids.length > 0)return this.m_bytesTexUids.pop();
                return -1;
            }
            getTex3DUid():number
            {
                if(this.m_tex3DUids.length > 0)return this.m_tex3DUids.pop();
                return -1;
            }
            useTexAt(index:number):void
            {
                if(index < this.m_useidList.length)
                {
                    ++this.m_useidList[index];
                }
                else
                {
                    let i:number = this.m_useidList.length;
                    for(; i <= index; ++i)
                    {
                        this.m_useidList.push(0);
                    }
                    ++this.m_useidList[index];
                }
                //console.log("TexUidStore::useTexAt() this.m_useidList["+index+"]: "+this.m_useidList[index]);
            }
            detachTexAt(index:number):void
            {
                --this.m_useidList[index];
                if(this.m_useidList[index] < 1)
                {
                    this.m_useidList[index] = 0;
                    console.log("TexUidStore::detachTexAt("+index+") tex useCount value is 0.");
                    this.m_removeidList.push(index);
                }
            }
            getAttachCountAt(index:number):number
            {
                if(index < this.m_useidList.length)
                {
                    return this.m_useidList[index];
                }
                return 0;
            }
            getAttachAllCount():number
            {
                let total:number = 0;
                let i:number = 0;
                let len:number = this.m_useidList.length;
                for(; i < len; ++i)
                {
                    if(this.m_useidList[i] > 0)
                    {
                        ++total;
                    }
                }
                return total;
            }
            private m_timeDelay:number = 70;
            destroyTest(rc:RenderProxy):void
            {
                --this.m_timeDelay;
                if(this.m_timeDelay < 1)
                {
                    this.m_timeDelay = 70;

                    if(this.m_removeidList.length > 0)
                    {
                        let texUid:number = this.m_removeidList.pop();
                        if(this.getAttachCountAt(texUid) < 1)
                        {
                            let tex:TextureProxy = TextureStore.GetTexByUid(texUid);
                            switch(tex.getType())
                            {
                                case TextureConst.TEX_PROXY2D:
                                    this.m_tex2DUids.push(tex.getUid());
                                    break;
                                case TextureConst.TEX_PROXYCUBE:
                                    this.m_cubeTexUids.push(tex.getUid());
                                    break;
                                case TextureConst.TEX_BYTES2D:
                                    this.m_bytesTexUids.push(tex.getUid());
                                    break;
                                case TextureConst.TEX_PROXY3D:
                                    this.m_tex3DUids.push(tex.getUid());
                                    break;
                                default:
                                console.log("Error: tex.getType() value: "+tex.getType()+" is undefined.");
                                break;
                            }
                            console.log("TexUidStore::destroyTest() destroy tes uid: "+texUid);
                            tex.__$destroy(rc);
                        }
                    }
                }
            }
        }
        export class TextureStore
        {
            private static s_uidStore:TexUidStore = new TexUidStore();
            private static s_texList:TextureProxy[] = [];
            private static s_textureSlot:TextureSlot = new TextureSlot();

            static SetRenderProxy(renderProxy:RenderProxy):void
            {
                TextureStore.s_textureSlot.setRenderProxy(renderProxy);
            }
            static SetBufferUpdater(bufferUpdater:ROBufferUpdater):void
            {
                TextureStore.s_textureSlot.setBufferUpdater(bufferUpdater);
            }
            
            private static CreateDepthTex2D(pw:number,ph:number,powerof2Boo:boolean = false):DepthTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as DepthTextureProxy;
                }
                let tex:DepthTextureProxy = new DepthTextureProxy(TextureStore.s_textureSlot,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }

            static CreateWrapperTex(pw:number,ph:number,powerof2Boo:boolean = false):WrapperTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as WrapperTextureProxy;
                }
                let tex:WrapperTextureProxy = new WrapperTextureProxy(TextureStore.s_textureSlot,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }

            static CreateTex2D(pw:number,ph:number,powerof2Boo:boolean = false):TextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid);
                }
                let tex:TextureProxy = new TextureProxy(TextureStore.s_textureSlot,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            
            static CreateRTTTex2D(pw:number,ph:number,powerof2Boo:boolean = false):RTTTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as RTTTextureProxy;
                }
                let tex:RTTTextureProxy = new RTTTextureProxy(TextureStore.s_textureSlot,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateImageTex2D(pw:number,ph:number,powerof2Boo:boolean = false):ImageTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as ImageTextureProxy;
                }
                let tex:ImageTextureProxy = new ImageTextureProxy(TextureStore.s_textureSlot,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            
            static CreateHalfFloatTex2D(pw:number,ph:number,powerof2Boo:boolean = false):FloatTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as FloatTextureProxy;
                }
                let tex:FloatTextureProxy = new FloatTextureProxy(TextureStore.s_textureSlot,pw,ph,powerof2Boo);
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.HALF_FLOAT_OES;
                //tex.srcFormat = TextureFormat.RGBA16F;
                //tex.dataType = TextureDataType.FLOAT;
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateFloatTex2D(pw:number,ph:number,powerof2Boo:boolean = false):FloatTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as FloatTextureProxy;
                }
                let tex:FloatTextureProxy = new FloatTextureProxy(TextureStore.s_textureSlot,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateUint16Tex2D(pw:number,ph:number,powerof2Boo:boolean = false):Uint16TextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as Uint16TextureProxy;
                }
                let tex:Uint16TextureProxy = new Uint16TextureProxy(TextureStore.s_textureSlot,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateFloatCubeTex(pw:number,ph:number,powerof2Boo:boolean = false):FloatCubeTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as FloatCubeTextureProxy;
                }
                let tex:FloatCubeTextureProxy = new FloatCubeTextureProxy(TextureStore.s_textureSlot,pw,ph);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateBytesTex(texW:number,texH:number):BytesTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as BytesTextureProxy;
                }
                let tex:BytesTextureProxy = new BytesTextureProxy(TextureStore.s_textureSlot,texW,texH);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            
            static CreateBytesCubeTex(texW:number,texH:number):BytesCubeTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getCubeTexUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as BytesCubeTextureProxy;
                }
                let tex:BytesCubeTextureProxy = new BytesCubeTextureProxy(TextureStore.s_textureSlot,texW,texH);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateImageCubeTex(texW:number,texH:number):ImageCubeTextureProxy
            {
                let texUid:number = TextureStore.s_uidStore.getCubeTexUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as ImageCubeTextureProxy;
                }
                let tex:ImageCubeTextureProxy = new ImageCubeTextureProxy(TextureStore.s_textureSlot,texW,texH);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateTex3D(texW:number,texH:number, depth:number = 1):Texture3DProxy
            {
                if(depth < 1)
                {
                    depth = 1;
                }
                let texUid:number = TextureStore.s_uidStore.getCubeTexUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as Texture3DProxy;
                }
                let tex:Texture3DProxy = new Texture3DProxy(TextureStore.s_textureSlot,texW,texH,depth);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static GetTexByUid(texUid:number):TextureProxy
            {
                return TextureStore.s_texList[texUid];
            }
            
            static __$AttachTex(tex:TextureProxy):void
            {
                TextureStore.s_uidStore.useTexAt(tex.getUid());
            }
            static __$DetachTex(tex:TextureProxy):void
            {
                TextureStore.s_uidStore.detachTexAt(tex.getUid());
            }
            static __$GetexAttachCount(tex:TextureProxy):number
            {
                return TextureStore.s_uidStore.getAttachCountAt(tex.getUid());
            }
            static __$AttachTexAt(texUid:number):void
            {
                TextureStore.s_uidStore.useTexAt(texUid);
            }
            static __$DetachTexAt(texUid:number):void
            {
                TextureStore.s_uidStore.detachTexAt(texUid);
            }
            //static __$GetexAttachCountAt(texUid:number):number
            //{
            //    return TextureStore.s_uidStore.getAttachCountAt(texUid);
            //}
            static RenderBegin(rc:RenderProxy):void
            {
                //  TextureStore.s_uidStore.destroyTest(rc);
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
                tex.uploadFromBytes(bytes,0);
                return tex;
            }
            static CreateAlphaTex2D(pw:number,ph:number,alpha:number):BytesTextureProxy
            {
                pw = pw > 1 ? pw:1;
                ph = ph > 1 ? ph:1;
                let tot:number = pw * ph;
                let tex:BytesTextureProxy = TextureStore.CreateBytesTex(pw,ph);
                let bytes:Uint8Array = new Uint8Array(tot);
                let pa:number = Math.round(alpha * 255.0);
                bytes.fill(pa,0,tot);
                tex.toAlphaFormat();
                return tex;
            }
            static CreateAlphaTexBytes2D(pw:number,ph:number,bytes:Uint8Array):BytesTextureProxy
            {
                let tot:number = pw * ph;
                let tex:BytesTextureProxy = TextureStore.CreateBytesTex(pw,ph);             
                tex.uploadFromBytes(bytes,0);
                tex.toAlphaFormat();
                return tex;
            }
            private static s_rttTexs:RTTTextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            private static s_rttCubeTexs:RTTTextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            private static s_rttFloatTexs:RTTTextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            private static s_rttDepTexs:DepthTextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            static GetCubeRTTTextureAt(i:number):RTTTextureProxy
	        {
	        	if (TextureStore.s_rttCubeTexs[i] != null)
	        	{
	        		return TextureStore.s_rttCubeTexs[i] as RTTTextureProxy;
                }
                TextureStore.s_rttCubeTexs[i] = TextureStore.CreateRTTTex2D(32, 32);
                TextureStore.s_rttCubeTexs[i].toCubeTexture();
                TextureStore.s_rttCubeTexs[i].name = "sys_cube_rttTex_"+i;
                TextureStore.s_rttCubeTexs[i].minFilter = TextureConst.LINEAR;
                TextureStore.s_rttCubeTexs[i].magFilter = TextureConst.LINEAR;
	        	return TextureStore.s_rttCubeTexs[i];
            }
            static CreateCubeRTTTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                pw = pw > 1?pw:1;
                ph = ph > 1?ph:1;
	        	if (TextureStore.s_rttCubeTexs[i] != null)
	        	{
	        		return TextureStore.s_rttCubeTexs[i];
                }
                TextureStore.s_rttCubeTexs[i] = TextureStore.CreateRTTTex2D(pw, ph);
                TextureStore.s_rttCubeTexs[i].toCubeTexture();
                TextureStore.s_rttCubeTexs[i].name = "sys_cube_rttTex_"+i;
                TextureStore.s_rttCubeTexs[i].minFilter = TextureConst.LINEAR;
                TextureStore.s_rttCubeTexs[i].magFilter = TextureConst.LINEAR;
	        	return TextureStore.s_rttCubeTexs[i];
            }

            static GetRTTTextureAt(i:number):RTTTextureProxy
	        {
	        	if (TextureStore.s_rttTexs[i] != null)
	        	{
	        		return TextureStore.s_rttTexs[i] as RTTTextureProxy;
                }
                TextureStore.s_rttTexs[i] = TextureStore.CreateRTTTex2D(32, 32);
                TextureStore.s_rttTexs[i].to2DTexture();
                TextureStore.s_rttTexs[i].name = "sys_rttTex_"+i;
                TextureStore.s_rttTexs[i].minFilter = TextureConst.LINEAR;
                TextureStore.s_rttTexs[i].magFilter = TextureConst.LINEAR;
	        	return TextureStore.s_rttTexs[i];
            }
            static CreateRTTTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                pw = pw > 1?pw:1;
                ph = ph > 1?ph:1;
	        	if (TextureStore.s_rttTexs[i] != null)
	        	{
	        		return TextureStore.s_rttTexs[i];
                }
                TextureStore.s_rttTexs[i] = TextureStore.CreateRTTTex2D(pw, ph);
                TextureStore.s_rttTexs[i].to2DTexture();
                TextureStore.s_rttTexs[i].name = "sys_rttTex_"+i;
                TextureStore.s_rttTexs[i].minFilter = TextureConst.LINEAR;
                TextureStore.s_rttTexs[i].magFilter = TextureConst.LINEAR;
	        	return TextureStore.s_rttTexs[i];
            }
            static GetDepthTextureAt(i:number):DepthTextureProxy
	        {
	        	if (TextureStore.s_rttDepTexs[i] != null)
	        	{
	        		return TextureStore.s_rttDepTexs[i];
                }
                TextureStore.s_rttDepTexs[i] = TextureStore.CreateDepthTex2D(64, 64);
                TextureStore.s_rttDepTexs[i].to2DTexture();
                TextureStore.s_rttDepTexs[i].name = "sys_depthTex_"+i;
                TextureStore.s_rttDepTexs[i].minFilter = TextureConst.LINEAR;
                TextureStore.s_rttDepTexs[i].magFilter = TextureConst.LINEAR;
	        	return TextureStore.s_rttDepTexs[i];
            }
            static CreateDepthTextureAt(i:number,pw:number,ph:number):DepthTextureProxy
	        {
                pw = pw > 1?pw:1;
                ph = ph > 1?ph:1;
	        	if (TextureStore.s_rttDepTexs[i] != null)
	        	{
	        		return TextureStore.s_rttDepTexs[i];
                }
                TextureStore.s_rttDepTexs[i] = TextureStore.CreateDepthTex2D(pw,ph);
                TextureStore.s_rttDepTexs[i].to2DTexture();
                TextureStore.s_rttDepTexs[i].name = "sys_depthTex_"+i;
                TextureStore.s_rttDepTexs[i].minFilter = TextureConst.LINEAR;
                TextureStore.s_rttDepTexs[i].magFilter = TextureConst.LINEAR;
	        	return TextureStore.s_rttDepTexs[i];
            }
            static GetRTTFloatTextureAt(i:number):RTTTextureProxy
	        {
	        	if (TextureStore.s_rttFloatTexs[i] != null)
	        	{
	        		return TextureStore.s_rttFloatTexs[i] as RTTTextureProxy;
                }
                let tex:RTTTextureProxy = TextureStore.CreateDepthTex2D(64, 64);
                tex.to2DTexture();
                TextureStore.s_rttFloatTexs[i].name = "sys_rttFloatTex_"+i;
	        	TextureStore.s_rttFloatTexs[i] = tex;
                tex.internalFormat = TextureFormat.RGBA16F;
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.FLOAT;
                tex.magFilter = TextureConst.NEAREST;
	        	return tex;
            }
            static CreateRTTFloatTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                pw = pw > 1?pw:1;
                ph = ph > 1?ph:1;
	        	if (TextureStore.s_rttFloatTexs[i] != null)
	        	{
	        		return TextureStore.s_rttFloatTexs[i] as RTTTextureProxy;
                }
                let tex:RTTTextureProxy = TextureStore.CreateDepthTex2D(pw, ph);
                tex.to2DTexture();
                TextureStore.s_rttFloatTexs[i].name = "sys_rttFloatTex_"+i;
	        	TextureStore.s_rttFloatTexs[i] = tex;
                tex.internalFormat = TextureFormat.RGBA16F;
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.FLOAT;
                tex.magFilter = TextureConst.NEAREST;
	        	return tex;
            }
        }
    }
}