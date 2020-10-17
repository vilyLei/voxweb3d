/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace texture
    {
        
        export class FloatCubeTextureProxy extends TextureProxy
        {
            private m_imgDataList:any[] = null;
            constructor(texList:TextureProxy[], texWidth:number,texHeight:number)
            {
                super(texList, texWidth,texHeight,false);
                this.m_texTarget = TextureTarget.TEXTURE_CUBE;
                this.m_type = TextureConst.TEX_PROXY2D;
                this.internalFormat = TextureFormat.RGBA16F;
                this.dataType = TextureDataType.FLOAT;
                this.mipmapEnabled = true;
            }
            
            uploadFromBytesCubeFaceAt(index:number,bytes:Float32Array,pw:number,ph:number, miplevel:number = 0)
            {
                if(this.m_imgDataList == null)
                {
                    this.m_imgDataList = [null,null,null, null,null,null];
                }
                if(this.m_texBuf == null && pw > 0 && ph > 0)
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
            
            protected uploadData(rc:RenderProxy):void
            {
                let gl:any = rc.RContext;
                let imo:any = null;
                for(let i:number = 0; i < 6; ++i)
                {
                    imo = this.m_imgDataList[i];
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.m_miplevel, TextureFormat.ToGL(gl,this.internalFormat),this.getWidth(),this.getWidth(),0,TextureFormat.ToGL(gl,this.srcFormat),  TextureDataType.ToGL(gl, this.dataType), imo.imgData);

                }
            }
            toString():string
            {
                return "[FloatCubeTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
            __$destroy(rc:RenderProxy):void
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
                    console.log("FloatCubeTextureProxy::destroy(), destroy a FloatCubeTextureProxy instance...");
                    super.__$destroy(rc);
                }
            }
        }
    }
}