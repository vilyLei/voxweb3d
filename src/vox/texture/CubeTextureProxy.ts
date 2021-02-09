/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";

import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;

export namespace vox
{
    export namespace texture
    {
        
        export class CubeTextureProxy extends TextureProxy
        {
            private m_imgDataList:any[] = null;
            constructor(slot:ITextureSlot, texWidth:number,texHeight:number)
            {
                super(slot, texWidth,texHeight,false);
                this.m_texTarget = TextureTarget.TEXTURE_CUBE;
                this.m_type = TextureProxyType.ImageCube;
            }
            
            uploadFromImageCubeFaceAt(index:number,img:any, miplevel:number = 0)
            {
                if(this.m_imgDataList == null)
                {
                    this.m_imgDataList = [null,null,null, null,null,null];
                }
                if(this.isGpuEnabled() && img.width > 0 && img.height > 0)
                {
                    if(index == 0)
                    {
                        this.m_texWidth = img.width;
                        this.m_texHeight = img.height;
                        this.m_miplevel = miplevel;
                    }
                    this.m_imgDataList[index] = {imgData:img,miplevel:miplevel};
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
            
            protected uploadData(rc:RenderProxy):void
            {
                let gl:any = rc.RContext;
                let imo:any = null;
                for(let i:number = 0; i < 6; ++i)
                {
                    imo = this.m_imgDataList[i];
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.m_miplevel, TextureFormat.ToGL(gl,this.internalFormat),TextureFormat.ToGL(gl,this.srcFormat), TextureDataType.ToGL(gl, this.dataType), imo.imgData);
                }
            }
            toString():string
            {
                return "[CubeTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
            __$destroy():void
            {
                if(!this.isGpuEnabled())
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
                    console.log("CubeTextureProxy::destroy(), destroy a CubeTextureProxy instance...");
                    super.__$destroy();
                }
            }
        }
    }
}