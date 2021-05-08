/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import {TextureProxyType,TextureFormat,TextureDataType,TextureTarget} from "../../vox/texture/TextureConst";
import IRenderResource from '../../vox/render/IRenderResource';
import TextureProxy from "../../vox/texture/TextureProxy";

class BytesCubeTextureProxy extends TextureProxy
{
    private m_imgDataList:any[] = null;
    constructor(texWidth:number,texHeight:number)
    {
        super(texWidth,texHeight,false);
        this.m_texTarget = TextureTarget.TEXTURE_CUBE;
        this.mipmapEnabled = true;
        this.m_type = TextureProxyType.BytesCube;
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
    setDataFromBytesToFaceAt(index:number,bytes:Uint8Array,pw:number,ph:number, miplevel:number = 0)
    {
        if(this.m_imgDataList == null)
        {
            this.m_imgDataList = [null,null,null, null,null,null];
        }
        if(pw > 0 && ph > 0)
        {
            if(index == 0)
            {
                this.m_texWidth = pw;
                this.m_texHeight = ph;
                this.m_miplevel = miplevel;
            }
            this.m_imgDataList[index] = {imgData:bytes,miplevel:miplevel};
            let k:number = 5;
            for(; k >= 0; --k)
            {
                if(this.m_imgDataList[k] == null)
                {
                    break;
                }
            }
            this.m_haveRData = k<0;
        }
    }
    
    protected uploadData(texRes:IRenderResource):void
    {
        let gl:any = texRes.getRC();
        let imo:any = null;
        for(let i:number = 0; i < 6; ++i)
        {
            imo = this.m_imgDataList[i];
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.m_miplevel, TextureFormat.ToGL(gl,this.internalFormat),this.getWidth(),this.getWidth(),0,TextureFormat.ToGL(gl,this.srcFormat),  TextureDataType.ToGL(gl, this.dataType), imo.imgData);
        }
        this.version = 0;
    }
    toString():string
    {
        return "[BytesCubeTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
    }
    __$destroy():void
    {
        if(this.getAttachCount() < 1)
        {
            this.version = 0;
            if( this.m_imgDataList != null)
            {
                for(let i:number = 0; i < 6; ++i)
                {
                    if( this.m_imgDataList[i] != null)
                    {
                        this.m_imgDataList[i].imgData = null;
                    }
                }
            }
            console.log("BytesCubeTextureProxy::destroy(), destroy a BytesCubeTextureProxy instance...");
            super.__$destroy();
        }
    }
}
export default BytesCubeTextureProxy;