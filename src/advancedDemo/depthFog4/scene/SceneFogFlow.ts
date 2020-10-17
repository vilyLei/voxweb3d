
import * as Vector3DT from "../../../vox/geom/Vector3";
import * as Color4T from "../../../vox/material/Color4";
import * as RenderConstT from "../../../vox/render/RenderConst";
import * as RendererStateT from "../../../vox/render/RendererState";
import * as TextureConstT from "../../../vox/texture/TextureConst";
import * as TextureProxyT from "../../../vox/texture/TextureProxy";
import * as TexResLoaderT from "../../../vox/texture/TexResLoader";
import * as RendererInstanceContextT from "../../../vox/scene/RendererInstanceContext";
import * as FBOInstanceT from "../../../vox/scene/FBOInstance";
import * as RendererSceneT from "../../../vox/scene/RendererScene";
import * as MouseEventT from "../../../vox/event/MouseEvent";

import * as Plane3DEntityT from "../../../vox/entity/Plane3DEntity";
import * as ProfileInstanceT from "../../../voxprofile/entity/ProfileInstance";
//import * as FogSphShowMaterialT from "../../../advancedDemo/depthFog4/material/FogSphShowMaterial";
import * as FogSphShow2MaterialT from "../../../advancedDemo/depthFog4/material/FogSphShow2Material";
import * as BoxSpaceMotionerT from "../../../voxmotion/primtive/BoxSpaceMotioner";
import * as FogFBOManaT from "../../../advancedDemo/depthFog4/scene/FogFBOMana";
import * as RoleSceneT from "../../../advancedDemo/depthFog4/scene/RoleScene";
//import * as FogSystemT from "../../../advancedDemo/depthFog4/scene/FogSystem";
import * as FogSphSystemT from "../../../advancedDemo/depthFog4/scene/FogSphSystem";
import * as BillParticleT from "../../../advancedDemo/depthFog4/scene/BillParticle";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import FBOInstance = FBOInstanceT.vox.scene.FBOInstance;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import MouseEvent = MouseEventT.vox.event.MouseEvent;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import FogSphShow2Material = FogSphShow2MaterialT.advancedDemo.depthFog4.material.FogSphShow2Material;
import BoxSpaceMotioner = BoxSpaceMotionerT.voxmotion.primitive.BoxSpaceMotioner;
import FogFBOMana = FogFBOManaT.advancedDemo.depthFog4.scene.FogFBOMana;
import RoleScene = RoleSceneT.advancedDemo.depthFog4.scene.RoleScene;
//import FogSystem = FogSystemT.advancedDemo.depthFog4.scene.FogSystem;
import FogSphSystem = FogSphSystemT.advancedDemo.depthFog4.scene.FogSphSystem;
import BillParticleGroup = BillParticleT.advancedDemo.depthFog4.scene.BillParticleGroup;

export namespace advancedDemo
{
    export namespace depthFog4
    {
        export namespace scene
        {
        export class SceneFogFlow
        {
            constructor()
            {
            }

            private m_rc:RendererScene = null;
            private m_rct:RendererInstanceContext = null;
            private m_texLoader:TexResLoader = new TexResLoader();
            private m_profileInstance:ProfileInstance = null;
            //private m_fogSys:FogSystem = null;
            private m_fogSys:FogSphSystem = null;
            private m_roleSc:RoleScene = null;
            private m_billGroup:BillParticleGroup = null;
            getTexByUrl(pns:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/voxgl/assets/"+pns);
                tex.setWrap(TextureConst.WRAP_REPEAT);
                tex.mipmapEnabled = true;
                return tex;
            }
            private m_dstPlane:Plane3DEntity = null;
            private m_entityRSCIndex:number = 0;
            private m_parIndex:number = 1;
            private m_entityBGIndex:number = 2;
            private m_factorPlaneIndex:number = 4;
            private m_dstPlaneIndex:number = 3;
            
            fogShow2M:FogSphShow2Material;

            private m_motioners:BoxSpaceMotioner[] = [];
            private m_volMotioners:BoxSpaceMotioner[] = [];
            posList:Vector3D[] = [];
            factorColors:Color4[] = [];
            fogColors:Color4[] = [];
            volumeStates:number[] = [];
            volumeRadiuss:number[] = [];
            
            middleFBO:FBOInstance = null;
            parFBO:FBOInstance = null;
            factorFBO:FBOInstance = null;
            
            fboMana:FogFBOMana = null;
            private runmotion():void
            {
                let i:number = 0;
                let len:number = this.m_motioners.length;
                for(; i < len; ++i)
                {
                    this.m_motioners[i].update();
                    //this.m_motioners[i].getPosition(this.posList[i]);
                }
                i = 0;
                len = this.m_volMotioners.length;
                for(; i < len; ++i)
                {
                    this.m_volMotioners[i].update();
                    this.m_volMotioners[i].getPosition(this.posList[i]);
                }
            }
            private m_status:number = 0;
            getStatus():number
            {
                return this.m_status;
            }
            mouseDownListener(evt:any):void
            {
                this.m_status++;
                if(this.m_status > 2)
                {
                    this.m_status = 0;
                }
                this.m_fogSys.setStatus(this.m_status);
            }
            mouseWheeelListener(evt:any):void
            {
                //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
                if(evt.wheelDeltaY < 0)
                {
                    // zoom in
                    this.m_rc.getCamera().forward(-25.0);
                }
                else
                {
                    // zoom out
                    this.m_rc.getCamera().forward(25.0);
                }
            }
            initialize(rc:RendererScene):void
            {
                if(this.m_rc == null)
                {
                    this.m_rc = rc;
                    
                    
                    this.m_rct = this.m_rc.getRendererContext();

                    this.m_rc.getStage3D().addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                    this.m_rc.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);

                    RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                    RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                    RendererState.CreateRenderState("ADD03",CullFaceMode.BACK,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_ALWAYS);
                    ///*
                    this.m_billGroup = new BillParticleGroup();                    
                    let ptex0:TextureProxy = this.getTexByUrl("flare_core_02.jpg");
                    let ptex1:TextureProxy = this.getTexByUrl("a_02_c.jpg");
                    this.m_billGroup.texs = [ptex0,ptex1];
                    this.m_billGroup.renderer = this.m_rc;
                    this.m_billGroup.rendererIndex = this.m_parIndex;
                    //*/
                    this.m_roleSc = new RoleScene();
                    this.m_roleSc.texLoader = this.m_texLoader;
                    this.m_roleSc.initialize(this.m_rc);
                    
                    this.fboMana = new FogFBOMana();
                    this.fboMana.initialize(this.m_rc);
                    
                    this.middleFBO = this.fboMana.createMiddleFBO([this.m_entityRSCIndex,this.m_entityBGIndex]);
                    this.parFBO = this.fboMana.createParFBO([this.m_parIndex]);
                    this.factorFBO = this.fboMana.createFactorFBO([this.m_factorPlaneIndex]);
                    
                    this.fogShow2M = new FogSphShow2Material();
                    this.fogShow2M.setTextureList(
                        [
                            this.middleFBO.getTextureAt(1)
                            ,this.factorFBO.getTextureAt(0)
                            ,this.factorFBO.getTextureAt(1)
                        ]
                    );

                    this.m_dstPlane = new Plane3DEntity();
                    this.m_dstPlane.setMaterial(this.fogShow2M);
                    this.m_dstPlane.initialize(
                        -1.0,-1.0,2.0,2.0
                        ,[
                            this.middleFBO.getTextureAt(0)
                            ,this.factorFBO.getTextureAt(0)
                            ,this.factorFBO.getTextureAt(1)
                        ]
                        );
                    this.m_rc.addEntity(this.m_dstPlane,this.m_dstPlaneIndex);
                    
                    //this.m_fogSys = new FogSystem();
                    this.m_fogSys = new FogSphSystem();
                    this.m_fogSys.texLoader = this.m_texLoader;
                    this.m_fogSys.initialize(this.m_rc, this.middleFBO, this.factorFBO);

                    this.m_profileInstance = new ProfileInstance();
                    this.m_profileInstance.initialize(this.m_rc.getRenderer());
                    
                }
            }
            runBegin():void
            {
                // logic run
                this.runmotion();
                if(this.m_billGroup != null)this.m_billGroup.runAndCreate();
            }
            private m_bgColor:Color4 = new Color4(0.0, 0.0, 0.0,1.0);
            renderRun():void
            {
                this.m_fogSys.runBase();
                this.parFBO.unlockMaterial();
                this.parFBO.unlockRenderState();
                this.parFBO.run();
                this.m_fogSys.runFog();
                if(this.m_fogSys.getFogVolumesTotal() > 0)
                {
                    //this.m_status
                    switch(this.m_status)
                    {
                        case 0:
                            this.fogShow2M.setRGB3f(1.0,1.0,1.0);
                            break;
                        case 1:
                            this.fogShow2M.setRGB3f(1.0,1.0,1.0);
                        break;
                        case 2:
                            this.fogShow2M.setRGB3f(0.05,0.1,0.2);
                        break;
                        default:
                            this.fogShow2M.setRGB3f(1.0,1.0,1.0);
                            break;
                    
                    }
                }

                this.m_rc.setClearColor(this.m_bgColor);
                this.m_rc.setRenderToBackBuffer();
                this.m_rct.unlockMaterial();
                // dst drawing
                this.m_rc.runAt(this.m_dstPlaneIndex);
            }
            runEnd():void
            {
                if(this.m_profileInstance != null)
                {
                    this.m_profileInstance.run();
                }
            }
        }
    }
}
}