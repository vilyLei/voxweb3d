/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureConstT from "../../vox/texture/TextureConst";
import * as RTTTextureProxyT from "../../vox/texture/RTTTextureProxy";
import * as DepthTextureProxyT from "../../vox/texture/DepthTextureProxy";
import * as WrapperTextureProxyT from "../../vox/texture/WrapperTextureProxy";
import * as TextureSlotT from "../../vox/texture/TextureSlot";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import RTTTextureProxy = RTTTextureProxyT.vox.texture.RTTTextureProxy;
import DepthTextureProxy = DepthTextureProxyT.vox.texture.DepthTextureProxy;
import WrapperTextureProxy = WrapperTextureProxyT.vox.texture.WrapperTextureProxy;
import TextureSlot = TextureSlotT.vox.texture.TextureSlot;

export namespace vox
{
    export namespace texture
    {
        /**
         * 本类作为所有RTT纹理对象的管理类
         */
        export class RTTTextureStore
        {
            private m_textureSlot:TextureSlot = null;
            constructor(textureSlot:TextureSlot)
            {
                this.m_textureSlot = textureSlot;
            }
            getTextureSlot():TextureSlot
            {
                return this.m_textureSlot;
            }
            createWrapperTex(pw:number,ph:number,powerof2Boo:boolean = false):WrapperTextureProxy
            {
                let tex:WrapperTextureProxy = new WrapperTextureProxy(this.m_textureSlot,pw,ph,powerof2Boo);
                this.m_textureSlot.addTexture(tex);
                return tex;
            }
            createRTTTex2D(pw:number,ph:number,powerof2Boo:boolean = false):RTTTextureProxy
            {
                let tex:RTTTextureProxy = new RTTTextureProxy(this.m_textureSlot,pw,ph,powerof2Boo);
                this.m_textureSlot.addTexture(tex);
                return tex;
            }
            createDepthTex2D(pw:number,ph:number,powerof2Boo:boolean = false):DepthTextureProxy
            {
                let tex:DepthTextureProxy = new DepthTextureProxy(this.m_textureSlot,pw,ph,powerof2Boo);
                this.m_textureSlot.addTexture(tex);
                return tex;
            }
            // reusable rtt texture resources for one renderer context
            private m_rttTexs:RTTTextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            private m_rttCubeTexs:RTTTextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            private m_rttFloatTexs:RTTTextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            private m_rttDepTexs:DepthTextureProxy[] = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
            getCubeRTTTextureAt(i:number):RTTTextureProxy
	        {
	        	if (this.m_rttCubeTexs[i] != null)
	        	{
                    this.m_rttCubeTexs[i].__$setSlot(this.m_textureSlot);
	        		return this.m_rttCubeTexs[i];
                }
                this.m_rttCubeTexs[i] = this.createRTTTex2D(32, 32);
                this.m_rttCubeTexs[i].toCubeTexture();
                this.m_rttCubeTexs[i].name = "sys_cube_rttTex_"+i;
                this.m_rttCubeTexs[i].minFilter = TextureConst.LINEAR;
                this.m_rttCubeTexs[i].magFilter = TextureConst.LINEAR;

	        	return this.m_rttCubeTexs[i];
            }
            createCubeRTTTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                pw = pw > 1?pw:1;
                ph = ph > 1?ph:1;
	        	if (this.m_rttCubeTexs[i] != null)
	        	{
                    this.m_rttCubeTexs[i].__$setSlot(this.m_textureSlot);
	        		return this.m_rttCubeTexs[i];
                }
                this.m_rttCubeTexs[i] = this.createRTTTex2D(pw, ph);
                this.m_rttCubeTexs[i].toCubeTexture();
                this.m_rttCubeTexs[i].name = "sys_cube_rttTex_"+i;
                this.m_rttCubeTexs[i].minFilter = TextureConst.LINEAR;
                this.m_rttCubeTexs[i].magFilter = TextureConst.LINEAR;

	        	return this.m_rttCubeTexs[i];
            }

            getRTTTextureAt(i:number):RTTTextureProxy
	        {
	        	if (this.m_rttTexs[i] != null)
	        	{
                    this.m_rttTexs[i].__$setSlot(this.m_textureSlot);
	        		return this.m_rttTexs[i] as RTTTextureProxy;
                }
                this.m_rttTexs[i] = this.createRTTTex2D(32, 32);
                this.m_rttTexs[i].to2DTexture();
                this.m_rttTexs[i].name = "sys_rttTex_"+i;
                this.m_rttTexs[i].minFilter = TextureConst.LINEAR;
                this.m_rttTexs[i].magFilter = TextureConst.LINEAR;
	        	return this.m_rttTexs[i];
            }
            createRTTTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                pw = pw > 1?pw:1;
                ph = ph > 1?ph:1;
	        	if (this.m_rttTexs[i] != null)
	        	{
                    this.m_rttTexs[i].__$setSlot(this.m_textureSlot);
	        		return this.m_rttTexs[i];
                }
                this.m_rttTexs[i] = this.createRTTTex2D(pw, ph);
                this.m_rttTexs[i].to2DTexture();
                this.m_rttTexs[i].name = "sys_rttTex_"+i;
                this.m_rttTexs[i].minFilter = TextureConst.LINEAR;
                this.m_rttTexs[i].magFilter = TextureConst.LINEAR;
	        	return this.m_rttTexs[i];
            }
            getDepthTextureAt(i:number):DepthTextureProxy
	        {
	        	if (this.m_rttDepTexs[i] != null)
	        	{
                    this.m_rttDepTexs[i].__$setSlot(this.m_textureSlot);
	        		return this.m_rttDepTexs[i];
                }
                this.m_rttDepTexs[i] = this.createDepthTex2D(64, 64);
                this.m_rttDepTexs[i].to2DTexture();
                this.m_rttDepTexs[i].name = "sys_depthTex_"+i;
                this.m_rttDepTexs[i].minFilter = TextureConst.LINEAR;
                this.m_rttDepTexs[i].magFilter = TextureConst.LINEAR;
	        	return this.m_rttDepTexs[i];
            }
            createDepthTextureAt(i:number,pw:number,ph:number):DepthTextureProxy
	        {
                pw = pw > 1?pw:1;
                ph = ph > 1?ph:1;
	        	if (this.m_rttDepTexs[i] != null)
	        	{
                    this.m_rttDepTexs[i].__$setSlot(this.m_textureSlot);
	        		return this.m_rttDepTexs[i];
                }
                this.m_rttDepTexs[i] = this.createDepthTex2D(pw,ph);
                this.m_rttDepTexs[i].to2DTexture();
                this.m_rttDepTexs[i].name = "sys_depthTex_"+i;
                this.m_rttDepTexs[i].minFilter = TextureConst.LINEAR;
                this.m_rttDepTexs[i].magFilter = TextureConst.LINEAR;
	        	return this.m_rttDepTexs[i];
            }
            getRTTFloatTextureAt(i:number):RTTTextureProxy
	        {
	        	if (this.m_rttFloatTexs[i] != null)
	        	{
                    this.m_rttFloatTexs[i].__$setSlot(this.m_textureSlot);
	        		return this.m_rttFloatTexs[i];
                }
                let tex:RTTTextureProxy = this.createRTTTex2D(64, 64);
                tex.to2DTexture();
                this.m_rttFloatTexs[i].name = "sys_rttFloatTex_"+i;
	        	this.m_rttFloatTexs[i] = tex;
                tex.internalFormat = TextureFormat.RGBA16F;
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.FLOAT;
                tex.magFilter = TextureConst.NEAREST;
	        	return tex;
            }
            createRTTFloatTextureAt(i:number,pw:number,ph:number):RTTTextureProxy
	        {
                pw = pw > 1?pw:1;
                ph = ph > 1?ph:1;
	        	if (this.m_rttFloatTexs[i] != null)
	        	{
                    this.m_rttFloatTexs[i].__$setSlot(this.m_textureSlot);
	        		return this.m_rttFloatTexs[i];
                }
                let tex:RTTTextureProxy = this.createRTTTex2D(pw, ph);
                tex.to2DTexture();
                this.m_rttFloatTexs[i].name = "sys_rttFloatTex_"+i;
	        	this.m_rttFloatTexs[i] = tex;
                tex.internalFormat = TextureFormat.RGBA16F;
                tex.srcFormat = TextureFormat.RGBA;
                tex.dataType = TextureDataType.FLOAT;
                tex.magFilter = TextureConst.NEAREST;
	        	return tex;
            }
        }
    }
}