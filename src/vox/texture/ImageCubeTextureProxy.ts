/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import {TextureProxyType,TextureFormat,TextureDataType,TextureTarget} from "../../vox/texture/TextureConst";
import IRenderResource from "../../vox/render/IRenderResource";
import TextureProxy from "../../vox/texture/TextureProxy";

class ImageCubeTextureProxy extends TextureProxy
{
    private m_imgDataList:any[] = null;
    constructor(texWidth:number,texHeight:number)
    {
        super(texWidth,texHeight,false);
        this.m_texTarget = TextureTarget.TEXTURE_CUBE;
        this.m_type = TextureProxyType.ImageCube;
        this.internalFormat = TextureFormat.RGBA;
        this.srcFormat = TextureFormat.RGBA;
        this.dataType = TextureDataType.UNSIGNED_BYTE;
        this.mipmapEnabled = true;
    }
    
    setDataFromImageToFaceAt(index:number,img:any, miplevel:number = 0)
    {
        if(img != null)
        {
            if(this.m_imgDataList == null)
            {
                this.m_imgDataList = [null,null,null, null,null,null];
            }
            if(img.width > 0 && img.height > 0)
            {
                if(index == 0)
                {
                    this.m_texWidth = img.width;
                    this.m_texHeight = img.height;
                    this.m_miplevel = miplevel;
                }
                this.m_imgDataList[index] = {imgData:img,miplevel:miplevel};                
                this.m_haveRData = this.m_imgDataList[index] != null;
            }
        }
    }
    
    protected uploadData(texRes:IRenderResource):void
    {
        let gl:any = texRes.getRC();
        let imo:any = null;
        for(let i:number = 0; i < 6; ++i)
        {
            imo = this.m_imgDataList[i];
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.m_miplevel, TextureFormat.ToGL(gl,this.internalFormat),TextureFormat.ToGL(gl,this.srcFormat), TextureDataType.ToGL(gl, this.dataType), imo.imgData);
        }
    }
    toString():string
    {
        return "[ImageCubeTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
    }
    __$destroy():void
    {
        if(this.getAttachCount() < 1)
        {
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
            console.log("ImageCubeTextureProxy::destroy(), destroy a ImageCubeTextureProxy instance...");
            super.__$destroy();
        }
    }
}
export default ImageCubeTextureProxy;