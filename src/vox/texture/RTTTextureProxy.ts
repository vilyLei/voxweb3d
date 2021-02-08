/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ROTextureResourceT from '../../vox/render/ROTextureResource';
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";
import * as TextureProxyT from "../../vox/texture/TextureProxy";

import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;

export namespace vox
{
    export namespace texture
    {
        export class RTTTextureProxy extends TextureProxy
        {
            constructor(slot:ITextureSlot, texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(slot,texWidth,texHeight,powerof2Boo);
            }
            to2DTexture():void
            {
                this.m_texTarget = TextureTarget.TEXTURE_2D;
            }
            toCubeTexture():void
            {
                this.m_texTarget = TextureTarget.TEXTURE_CUBE;
            }
            uploadFromFbo(texResource:ROTextureResource, fboWidth:number, fboHeight:number):void
            {
                let gl:any = texResource.getRC();
                this.m_texTarget = this.getTargetType();

				if(this.m_texBuf == null)
				{
                    this.m_samplerTarget = TextureTarget.GetValue(gl,this.m_texTarget);
                    
                    this.createTexBuf(texResource);
                    this.bindTexture(gl,fboWidth,fboHeight);

                    //this.m_uploadBoo = false;
                    this.m_haveRData = true;
				}
				else if(this.getBufWidth() != fboWidth || this.getBufHeight() != fboHeight)
				{
					this.bindTexture(gl,fboWidth,fboHeight);
                }
                
                this.m_texWidth = fboWidth;
                this.m_texHeight = fboHeight;
                this.__$buildParam(gl);
            }
            
			private bindTexture(rgl:any, fboWidth:number, fboHeight:number):void
			{

				let interType:number = TextureFormat.ToGL(rgl, this.internalFormat);
				let format:number = TextureFormat.ToGL(rgl, this.srcFormat);
				let type:number = TextureDataType.ToGL(rgl, this.dataType);
				
				rgl.bindTexture(this.m_samplerTarget, this.m_texBuf);
				
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