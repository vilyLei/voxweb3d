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
import * as FloatTextureProxyT from "../../vox/texture/FloatTextureProxy";
import * as FloatCubeTextureProxyT from "../../vox/texture/FloatCubeTextureProxy";
import * as BytesCubeTextureProxyT from "../../vox/texture/BytesCubeTextureProxy";
import * as CubeTextureProxyT from "../../vox/texture/CubeTextureProxy";
import * as Texture3DProxyT from "../../vox/texture/Texture3DProxy";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import Color4 = Color4T.vox.material.Color4;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;
import BytesTextureProxy = BytesTextureProxyT.vox.texture.BytesTextureProxy;
import FloatTextureProxy = FloatTextureProxyT.vox.texture.FloatTextureProxy;
import FloatCubeTextureProxy = FloatCubeTextureProxyT.vox.texture.FloatCubeTextureProxy;
import BytesCubeTextureProxy = BytesCubeTextureProxyT.vox.texture.BytesCubeTextureProxy;
import CubeTextureProxy = CubeTextureProxyT.vox.texture.CubeTextureProxy;
import Texture3DProxy = Texture3DProxyT.vox.texture.Texture3DProxy;

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
            private m_timeDelay:number = 7;
            destroyTest(rc:RenderProxy):void
            {
                --this.m_timeDelay;
                if(this.m_timeDelay < 1)
                {
                    this.m_timeDelay = 7;

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
                                case TextureConst.TEX_CUBE:
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
            private static __s_texUidStore:TexUidStore = new TexUidStore();
            private static s_texList:TextureProxy[] = [];
            
            static CreateTex2D(pw:number,ph:number,powerof2Boo:boolean = false):TextureProxy
            {
                let texUid:number = TextureStore.__s_texUidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid);
                }
                let tex:TextureProxy = new TextureProxy(TextureStore.s_texList,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            
            static CreateImageTex2D(pw:number,ph:number,powerof2Boo:boolean = false):ImageTextureProxy
            {
                let texUid:number = TextureStore.__s_texUidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as ImageTextureProxy;
                }
                let tex:ImageTextureProxy = new ImageTextureProxy(TextureStore.s_texList,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            
            static CreateHalfFloatTex2D(pw:number,ph:number,powerof2Boo:boolean = false):FloatTextureProxy
            {
                let texUid:number = TextureStore.__s_texUidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as FloatTextureProxy;
                }
                let tex:FloatTextureProxy = new FloatTextureProxy(TextureStore.s_texList,pw,ph,powerof2Boo);
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.HALF_FLOAT_OES;
                //tex.srcFormat = TextureFormat.RGBA16F;
                //tex.dataType = TextureDataType.FLOAT;
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateFloatTex2D(pw:number,ph:number,powerof2Boo:boolean = false):FloatTextureProxy
            {
                let texUid:number = TextureStore.__s_texUidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as FloatTextureProxy;
                }
                let tex:FloatTextureProxy = new FloatTextureProxy(TextureStore.s_texList,pw,ph,powerof2Boo);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateFloatCubeTex(pw:number,ph:number,powerof2Boo:boolean = false):FloatCubeTextureProxy
            {
                let texUid:number = TextureStore.__s_texUidStore.getTex2DUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as FloatCubeTextureProxy;
                }
                let tex:FloatCubeTextureProxy = new FloatCubeTextureProxy(TextureStore.s_texList,pw,ph);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateBytesTex(texW:number,texH:number):BytesTextureProxy
            {
                let texUid:number = TextureStore.__s_texUidStore.getBytesTexUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as BytesTextureProxy;
                }
                let tex:BytesTextureProxy = new BytesTextureProxy(TextureStore.s_texList,texW,texH);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            //BytesCubeTextureProxy
            static CreateBytesCubeTex(texW:number,texH:number):BytesCubeTextureProxy
            {
                let texUid:number = TextureStore.__s_texUidStore.getCubeTexUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as BytesCubeTextureProxy;
                }
                let tex:BytesCubeTextureProxy = new BytesCubeTextureProxy(TextureStore.s_texList,texW,texH);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateCubeTex(texW:number,texH:number):CubeTextureProxy
            {
                let texUid:number = TextureStore.__s_texUidStore.getCubeTexUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as CubeTextureProxy;
                }
                let tex:CubeTextureProxy = new CubeTextureProxy(TextureStore.s_texList,texW,texH);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static CreateTex3D(texW:number,texH:number, depth:number = 1):Texture3DProxy
            {
                if(depth < 1)
                {
                    depth = 1;
                }
                let texUid:number = TextureStore.__s_texUidStore.getCubeTexUid();
                if(texUid >= 0)
                {
                    return TextureStore.GetTexByUid(texUid) as Texture3DProxy;
                }
                let tex:Texture3DProxy = new Texture3DProxy(TextureStore.s_texList,texW,texH,depth);
                TextureStore.s_texList.push(tex);
                return tex;
            }
            static GetTexByUid(texUid:number):TextureProxy
            {
                return TextureStore.s_texList[texUid];
            }
            
            static __$AttachTex(tex:TextureProxy):void
            {
                TextureStore.__s_texUidStore.useTexAt(tex.getUid());
            }
            static __$DetachTex(tex:TextureProxy):void
            {
                TextureStore.__s_texUidStore.detachTexAt(tex.getUid());
            }
            static __$GetexAttachCount(tex:TextureProxy):number
            {
                return TextureStore.__s_texUidStore.getAttachCountAt(tex.getUid());
            }
            static __$AttachTexAt(texUid:number):void
            {
                TextureStore.__s_texUidStore.useTexAt(texUid);
            }
            static __$DetachTexAt(texUid:number):void
            {
                TextureStore.__s_texUidStore.detachTexAt(texUid);
            }
            static __$GetexAttachCountAt(texUid:number):number
            {
                return TextureStore.__s_texUidStore.getAttachCountAt(texUid);
            }
            static RenderBegin(rc:RenderProxy):void
            {
                TextureStore.__s_texUidStore.destroyTest(rc);
            }
            
            static CreateRGBATex2D(pw:number,ph:number,color:Color4):BytesTextureProxy
            {
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
            private static s_rttTexs:TextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            private static s_rttFloatTexs:TextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            static GetRTTTextureAt(i:number):TextureProxy
	        {
	        	if (TextureStore.s_rttTexs[i] != null)
	        	{
	        		return TextureStore.s_rttTexs[i];
                }
                TextureStore.s_rttTexs[i] = TextureStore.CreateTex2D(64, 64);
                TextureStore.s_rttTexs[i].min_filter = TextureConst.LINEAR;
	        	return TextureStore.s_rttTexs[i];
            }
            static GetRTTFloatTextureAt(i:number):TextureProxy
	        {
	        	if (TextureStore.s_rttFloatTexs[i] != null)
	        	{
	        		return TextureStore.s_rttFloatTexs[i];
                }
                let tex:TextureProxy = TextureStore.CreateTex2D(64, 64);
	        	TextureStore.s_rttFloatTexs[i] = tex;
                tex.internalFormat = TextureFormat.RGBA16F;
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.FLOAT;
                tex.mag_filter = TextureConst.NEAREST;
	        	return tex;
            }
        }
    }
}