
import {TextureConst,TextureFormat} from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import RendererInstanceContext from "../../../vox/scene/RendererInstanceContext";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RendererScene from "../../../vox/scene/RendererScene";


export namespace advancedDemo
{
    export namespace depthLight
    {
        export namespace scene
        {
        export class FogFBOMana
        {
            constructor()
            {
            }

            private m_rc:RendererScene = null;
            private m_rct:RendererInstanceContext = null;
            private m_texLoader:ImageTextureLoader;
            getImageTexByUrl(pns:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getImageTexByUrl("static/voxgl/assets/"+pns);
                tex.mipmapEnabled = true;
                return tex;
            }
            private m_texs:RTTTextureProxy[] = [null,null,null,null,null,null];
            public getTextureAt(index:number):RTTTextureProxy
	        {
                if(this.m_texs[index] != null)
                {
                    return this.m_texs[index];
                }
                this.m_texs[index] = this.m_rc.textureBlock.createRTTTex2D(this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight(), false) as any;
                this.m_texs[index].internalFormat = TextureFormat.RGBA;
                this.m_texs[index].srcFormat = TextureFormat.RGBA;
                this.m_texs[index].magFilter = TextureConst.NEAREST;
                this.m_texs[index].minFilter = TextureConst.LINEAR;
                //this.m_texs[index].magFilter = TextureConst.LINEAR;
                return this.m_texs[index];                
            }
            private m_middleFBO:FBOInstance = null;
            private m_parFBO:FBOInstance = null;
            private m_factorFBO:FBOInstance = null;
            createMiddleFBO(rpids:number[]):FBOInstance
            {
                this.m_middleFBO = this.m_rc.createFBOInstance();
                this.m_middleFBO.setClearRGBAColor4f(0.0,0.0,0.0,1.0);
                //this.m_middleFBO.createFBOAt(0,this.m_rct.getViewWidth(), this.m_rct.getViewHeight(),true,false);
                this.m_middleFBO.createViewportSizeFBOAt(0,true,false);
                this.m_middleFBO.setClearState(true,true,false);
                this.m_middleFBO.setRenderToTexture(this.getTextureAt(0), 0);// color
                this.m_middleFBO.setRenderToTexture(this.getTextureAt(1), 1);// depth
                this.m_middleFBO.setRProcessIDList(rpids);
                return this.m_middleFBO;
            }
            createParFBO(rpids:number[]):FBOInstance
            {
                this.m_parFBO = this.m_middleFBO.clone();
                this.m_parFBO.setRenderToTexture(this.getTextureAt(0), 0);
                this.m_parFBO.setClearState(false,false,false);
                this.m_parFBO.setRProcessIDList(rpids);
                return this.m_parFBO;
            }
            createFactorFBO(rpids:number[]):FBOInstance
            {
                this.m_factorFBO = this.m_rc.createFBOInstance();
                this.m_factorFBO.setClearRGBAColor4f(0.0,0.0,0.0,0.0);
                //this.m_factorFBO.createFBOAt(1,this.m_rct.getViewWidth(), this.m_rct.getViewHeight(),false,false);
                this.m_factorFBO.createViewportSizeFBOAt(1,false,false);
                this.m_factorFBO.setClearState(true,true,false);
                this.m_factorFBO.setRenderToTexture(this.getTextureAt(2), 0);
                this.m_factorFBO.setRenderToTexture(this.getTextureAt(3), 1);
                this.m_factorFBO.setRProcessIDList(rpids);

                return this.m_factorFBO;
            }
            initialize(rc: RendererScene):void
            {
                //console.log("FogFBOMana::initialize()......");
                if(this.m_rc == null)
                {
                    this.m_rc = rc;
                    this.m_rct = this.m_rc.getRendererContext();                    
                }
            }
        }
    }
}
}