
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RendererInstanceContextT from "../../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../../vox/scene/RendererInstance";
import * as Plane3DEntityT from "../../vox/entity/Plane3DEntity";
import * as RTTTextureProxyT from "../../vox/texture/RTTTextureProxy";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TextureBlockT from "../../vox/texture/TextureBlock";
import * as ScrDepBaseMaterialT from "../material/ScrDepBaseMaterial";
import * as ScrDepBlurMaterialT from "../material/ScrDepBlurMaterial";
import * as ScreenPlaneMaterialT from "../../vox/material/mcase/ScreenPlaneMaterial";
import * as PingpongBlurT from "../../renderingtoy/mcase/PingpongBlur";
import * as CameraTrackT from "../../vox/view/CameraTrack";
import * as EntityManagerT from "./EntityManager";
import * as ImageTextureLoaderT from "../../vox/texture/ImageTextureLoader";

import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import RTTTextureProxy = RTTTextureProxyT.vox.texture.RTTTextureProxy;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import TextureDataType = TextureConstT.vox.texture.TextureDataType;
import TextureBlock = TextureBlockT.vox.texture.TextureBlock;
import ScrDepBaseMaterial = ScrDepBaseMaterialT.demo.material.ScrDepBaseMaterial;
import ScrDepBlurMaterial = ScrDepBlurMaterialT.demo.material.ScrDepBlurMaterial;
import ScreenPlaneMaterial = ScreenPlaneMaterialT.vox.material.mcase.ScreenPlaneMaterial;
import PingpongBlur = PingpongBlurT.renderingtoy.mcase.PingpongBlur;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import EntityManager = EntityManagerT.demo.depthBlur.EntityManager;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;

export namespace demo
{
    export namespace depthBlur
    {
        export class DispScene
        {
            private m_blurModule:PingpongBlur = null;
            private m_scrDepMaterial:ScrDepBaseMaterial = new ScrDepBaseMaterial();
            private m_renderer:RendererInstance = null;
            private m_rcontext:RendererInstanceContext = null;
            private m_renderAdapter:RenderAdapter = null;
            private m_camTrack:CameraTrack = null;
            private m_entityMana:EntityManager = new EntityManager();
            
            private m_texLoader:ImageTextureLoader;
            private m_texBlock:TextureBlock;
            constructor()
            {
            }
            initialize(renderer:RendererInstance):void
            {
                this.m_renderer = renderer;
                
                //TextureStore.SetRenderer( this.m_renderer );
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();

                
                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer( this.m_renderer );
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
                this.m_entityMana.setTextureLoader(this.m_texLoader);
                this.m_rcontext = this.m_renderer.getRendererContext();
                this.m_renderAdapter = this.m_rcontext.getRenderAdapter();
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);

                this.m_blurModule = new PingpongBlur(renderer);
                this.m_blurModule.bindSrcProcessId(2);
                this.m_blurModule.setBackbufferVisible(false);

                this.initScene();
            }
            private initScene():void
            {
                let renderer:RendererInstance = this.m_renderer;
                this.m_scrDepMaterial.__$attachThis();
                let scrColorPlane:Plane3DEntity = new Plane3DEntity();
                scrColorPlane.name = "scrColorPlane";
                scrColorPlane.flipVerticalUV = true;
                scrColorPlane.setMaterial(new ScreenPlaneMaterial());
                scrColorPlane.initializeXOY(-1.0,-1.0,2.0,2.0,[this.getTextureAt(1)]);
                renderer.addEntity(scrColorPlane,2);

                let scrPlane:Plane3DEntity = new Plane3DEntity();
                scrPlane.name = "scrPlane";
                scrPlane.setMaterial(new ScrDepBlurMaterial());
                scrPlane.initializeXOY(-1.0,-1.0,2.0,2.0,[this.m_blurModule.getDstTexture(),this.getTextureAt(0),this.getTextureAt(1)]);
                renderer.addEntity(scrPlane,4);

                this.m_entityMana.initialize(renderer);
            }
            run():void
            {
                this.runThis();
                this.renderThis();
            }
            
            private runThis():void
            {
                this.m_texLoader.run();
                this.m_entityMana.run();
            }
            private renderThis():void
            {
                this.renderBegin();
                this.drawDepthScene();
                this.drawColorScene();
                this.blurColorScene();
                this.showScene();
                this.renderEnd();
            }
            private renderBegin():void
            {
                this.m_rcontext.updateCamera();
                this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
                this.m_rcontext.unlockRenderState();
                this.m_rcontext.unlockMaterial();
                this.m_rcontext.renderBegin();
                this.m_renderer.update();
                this.m_renderAdapter.synFBOSizeWithViewport();
            }
            private renderEnd():void
            {
                this.m_rcontext.runEnd();
            }
            private drawDepthScene():void
            {
                this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
                this.m_renderAdapter.setRenderToTexture(this.getTextureAt(0), true, false, 0);
                this.m_renderAdapter.useFBO(true, true, false);
                // use global material
                this.m_rcontext.useGlobalMaterial(this.m_scrDepMaterial);
                this.m_rcontext.useGlobalRenderState(RendererState.NORMAL_STATE);
                // draw call for depth rendering
                this.m_renderer.runAt(0);
            }
            private drawColorScene():void
            {
                this.m_renderAdapter.setRenderToTexture(this.getTextureAt(1), true, false, 0);
                this.m_renderAdapter.useFBO(true, true, false);
                this.m_rcontext.unlockMaterial();
                this.m_rcontext.unlockRenderState();
                this.m_renderer.runAt(0);
                this.m_renderer.runAt(1);
            }
            private blurColorScene():void
            {
                this.m_blurModule.run();
            }
            private showScene():void
            {
                //this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
                this.m_rcontext.setRenderToBackBuffer();
                this.m_rcontext.unlockMaterial();
                this.m_rcontext.unlockRenderState();
                this.m_renderer.runAt(4);
            }
            private m_texs:RTTTextureProxy[] = [null,null];
            private getTextureAt(index:number):RTTTextureProxy
	        {
                if(this.m_texs[index] != null)
                {
                    return this.m_texs[index];
                }
                switch(index)
                {
                    case 0:
                        this.m_texs[index] = this.m_texBlock.getRTTTextureAt(0)
                        this.m_texs[index].internalFormat = TextureFormat.RGBA16F;
                        this.m_texs[index].srcFormat = TextureFormat.RGBA;
                        this.m_texs[index].dataType = TextureDataType.FLOAT;
                        return this.m_texs[index];
                    break;

                    case 1:
                        this.m_texs[index] = this.m_texBlock.getRTTTextureAt(1)
                        this.m_texs[index].internalFormat = TextureFormat.RGBA;
                        this.m_texs[index].srcFormat = TextureFormat.RGBA;
                        return this.m_texs[index];
                    break;
                    default:
                        break;
                }
                return null;
            }
            
        }
        
    }
}