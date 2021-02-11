/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import * as TextureConstT from "../../vox/texture/TextureConst";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";
import * as RawDataTextureProxyT from "../../vox/texture/RawDataTextureProxy";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;
import RawDataTextureProxy = RawDataTextureProxyT.vox.texture.RawDataTextureProxy;

export namespace vox
{
    export namespace texture
    {
        export class FloatTextureProxy extends RawDataTextureProxy
        {
            constructor(slot:ITextureSlot, texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(slot, texWidth,texHeight,powerof2Boo);
                this.m_type = TextureProxyType.Float;
                this.minFilter = TextureConst.LINEAR;
                this.internalFormat = TextureFormat.RGBA16F;
                this.dataType = TextureDataType.FLOAT;
                this.unpackAlignment = 4;
            }
            toAlphaFormat():void
            {
                this.srcFormat = TextureFormat.ALPHA;
                this.internalFormat = TextureFormat.ALPHA;
                this.unpackAlignment = 1;
            }
            toRedFormat():void
            {
                this.srcFormat = TextureFormat.RED;
                this.internalFormat = TextureFormat.RED;
                this.unpackAlignment = 1;
            }
            toRGBFormat():void
            {
                this.srcFormat = TextureFormat.RGB;
                this.internalFormat = TextureFormat.RGB;
                this.unpackAlignment = 3;
            }
            toRGBAFormat():void
            {
                this.srcFormat = TextureFormat.RGBA;
                this.internalFormat = TextureFormat.RGBA;
                this.unpackAlignment = 4;
            }
            uploadFromBytes(bytes:Float32Array, miplevel:number = 0,imgWidth:number = -1,imgHeight:number = -1,offsetx:number = 0,offsety:number = 0,rebuild:boolean = false):void
            {
                super.setDataFromBytes(bytes, miplevel, imgWidth, imgHeight, offsetx, offsety, rebuild);
            }
            setPartDataFromeBytes(bytes:Float32Array,px:number,py:number,twidth:number,theight:number, miplevel:number = 0):void
            {
                super.setPartDataFromeBytes(bytes, px,py, twidth,theight, miplevel);
            }
            getPixels(px:number,py:number, pw:number,ph:number,outBytes:Float32Array):void
            {
                super.getPixels(px,py, pw,ph, outBytes);
            }
            toString():string
            {
                return "[FloatTextureProxy(width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
        }
    }
}