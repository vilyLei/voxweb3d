
import * as Vector3DT from "../../../vox/geom/Vector3";
import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as Color4T from "../../../vox/material/Color4";
import * as RenderConstT from "../../../vox/render/RenderConst";
import * as RendererStateT from "../../../vox/render/RendererState";
import * as RendererParamT from "../../../vox/scene/RendererParam";
import * as TextureConstT from "../../../vox/texture/TextureConst";
import * as TextureProxyT from "../../../vox/texture/TextureProxy";
import * as RTTTextureProxyT from "../../../vox/texture/RTTTextureProxy";
import * as TextureStoreT from "../../../vox/texture/TextureStore";
import * as TexResLoaderT from "../../../vox/texture/TexResLoader";
import * as RendererInstanceContextT from "../../../vox/scene/RendererInstanceContext";
import * as FrameBufferTypeT from "../../../vox/render/FrameBufferType";
import * as FBOInstanceT from "../../../vox/scene/FBOInstance";
import * as RendererSceneT from "../../../vox/scene/RendererScene";
import * as MouseEventT from "../../../vox/event/MouseEvent";
import * as H5FontSysT from "../../../vox/text/H5FontSys";

import * as Box3DEntityT from "../../../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../../../vox/entity/Sphere3DEntity";
import * as Plane3DEntityT from "../../../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../../../vox/entity/Axis3DEntity";
import * as ProfileInstanceT from "../../../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../../../vox/view/CameraTrack";
import * as FogSphDepthMaterialT from "../../../advancedDemo/depthFog4/material/FogSphDepthMaterial";
import * as FogSphShowMaterialT from "../../../advancedDemo/depthFog4/material/FogSphShowMaterial";
import * as BoxSpaceMotionerT from "../../../voxmotion/primtive/BoxSpaceMotioner";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RTTTextureProxy = RTTTextureProxyT.vox.texture.RTTTextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import FBOInstance = FBOInstanceT.vox.scene.FBOInstance;
import RendererScene = RendererSceneT.vox.scene.RendererScene;


export namespace advancedDemo
{
    export namespace depthFog4
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
            private m_texLoader:TexResLoader = new TexResLoader();
            getImageTexByUrl(pns:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/voxgl/assets/"+pns);
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
                this.m_texs[index] = TextureStore.CreateRTTTex2D(this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight());
                this.m_texs[index].internalFormat = TextureFormat.RGBA;
                this.m_texs[index].srcFormat = TextureFormat.RGBA;
                //this.m_texs[index].magFilter = TextureConst.NEAREST;
                this.m_texs[index].minFilter = TextureConst.LINEAR;
                this.m_texs[index].magFilter = TextureConst.LINEAR;
                return this.m_texs[index];
            }
            private m_middleFBO:FBOInstance = null;
            private m_parFBO:FBOInstance = null;
            private m_factorFBO:FBOInstance = null;
            createMiddleFBO(rpids:number[]):FBOInstance
            {
                this.m_middleFBO = this.m_rc.createFBOInstance();
                this.m_middleFBO.setClearRGBAColor4f(0.0,0.0,0.0,1.0);
                this.m_middleFBO.createFBOAt(0,this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight(),true,false);
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
                //this.m_factorFBO.setFBOSizeFactorWithViewPort(0.5);
                this.m_factorFBO.setClearRGBAColor4f(0.0,0.0,0.0,0.0);
                this.m_factorFBO.createFBOAt(1,this.m_rct.getViewportWidth(), this.m_rct.getViewportHeight(),false,false);
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