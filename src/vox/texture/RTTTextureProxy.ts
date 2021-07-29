/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderResource from '../../vox/render/IRenderResource';
import {TextureConst,TextureFormat,TextureDataType,TextureTarget,TextureProxyType} from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";
class RTTTextureProxy extends TextureProxy
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
    
    enableMipmap():void
    {
        this.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        this.magFilter = TextureConst.LINEAR;
        this.mipmapEnabled = true;
    }
    disableMipmap():void
    {
        this.minFilter = TextureConst.NEAREST;
        this.magFilter = TextureConst.NEAREST;
        this.mipmapEnabled = false;
    }
    toCubeTexture():void
    {
        this.m_texTarget = TextureTarget.TEXTURE_CUBE;
    }
    setSize(fboTextureWidth:number, fboTextureHeight:number): void {
        this.m_texWidth = fboTextureWidth;
        this.m_texHeight = fboTextureHeight;
    }
    uploadFromFbo(texResource:IRenderResource, fboWidth:number, fboHeight:number):void
    {
        let gl:any = texResource.getRC();
        let mEnabled: boolean = this.mipmapEnabled;
        this.mipmapEnabled = false;
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
        this.mipmapEnabled = mEnabled;
        
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
export default RTTTextureProxy;