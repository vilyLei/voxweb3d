/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import {TextureConst,TextureFormat,TextureDataType,TextureProxyType} from "../../vox/texture/TextureConst";
import RawDataTextureProxy from "../../vox/texture/RawDataTextureProxy";

//import RawDataTextureProxy = RawDataTextureProxyT.vox.texture.RawDataTextureProxy;

class FloatTextureProxy extends RawDataTextureProxy
{
    constructor(texWidth:number,texHeight:number,powerof2Boo:boolean = false)
    {
        super(texWidth,texHeight,powerof2Boo);
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
        this.internalFormat = TextureFormat.RGB16F;
        this.unpackAlignment = 1;
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
export default FloatTextureProxy;