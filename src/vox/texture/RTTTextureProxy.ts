/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderResourceT from '../../vox/render/IRenderResource';
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TextureProxyT from "../../vox/texture/TextureProxy";

import IRenderResource = IRenderResourceT.vox.render.IRenderResource;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;

export namespace vox
{
    export namespace texture
    {
        export class RTTTextureProxy extends TextureProxy
        {
            constructor(texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(texWidth,texHeight,powerof2Boo);
                this.m_type = TextureProxyType.RTT;
                this.minFilter = TextureConst.NEAREST;
                this.magFilter = TextureConst.NEAREST;
            }
            to2DTexture():void
            {
                this.m_texTarget = TextureTarget.TEXTURE_2D;
            }
            toCubeTexture():void
            {
                this.m_texTarget = TextureTarget.TEXTURE_CUBE;
            }
            uploadFromFbo(texResource:IRenderResource, fboWidth:number, fboHeight:number):void
            {
                let gl:any = texResource.getRC();

				if(!texResource.hasResUid(this.getResUid()))
				{
                    this.m_sampler = TextureTarget.GetValue(gl,this.m_texTarget);
                    
                    this.createTexBuf(texResource);
                    texResource.bindToGpu(this.getResUid());
                    this.bindTexture(gl,fboWidth,fboHeight);

                    this.m_haveRData = true;

                    this.m_texWidth = fboWidth;
                    this.m_texHeight = fboHeight;
                    this.__$buildParam(gl);
				}
				else if(this.getBufWidth() != fboWidth || this.getBufHeight() != fboHeight)
				{
                    texResource.bindToGpu(this.getResUid());
					this.bindTexture(gl,fboWidth,fboHeight);
                    
                    this.m_texWidth = fboWidth;
                    this.m_texHeight = fboHeight;
                    this.__$buildParam(gl);
                }
                
            }
            
			private bindTexture(rgl:any, fboWidth:number, fboHeight:number):void
			{

				let interType:number = TextureFormat.ToGL(rgl, this.internalFormat);
				let format:number = TextureFormat.ToGL(rgl, this.srcFormat);
				let type:number = TextureDataType.ToGL(rgl, this.dataType);
				
				//rgl.bindTexture(this.m_sampler, this.m_texBuf);
				
				switch( this.m_texTarget)
				{
				case TextureTarget.TEXTURE_2D:
					rgl.texImage2D(rgl.TEXTURE_2D, 0,interType,fboWidth,fboHeight,0,format,type, null);
					break;
				case TextureTarget.TEXTURE_CUBE:
					for (let i:number = 0; i < 6; ++i)
					{
						rgl.texImage2D(rgl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, interType,fboWidth,fboHeight,0,format, type, null);
					}
					break;
				case TextureTarget.TEXTURE_SHADOW_2D:
					rgl.texImage2D(rgl.TEXTURE_2D, 0, rgl.DEPTH_COMPONENT16, fboWidth, fboHeight, 0, rgl.DEPTH_COMPONENT, rgl.FLOAT, null);
					break;
				default:
					break;
				}
			}
            toString():string
            {
                return "[RTTTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
        }
    }
}