
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

import * as Box3DEntityT from "../../../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../../../vox/entity/Sphere3DEntity";
import * as Plane3DEntityT from "../../../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../../../vox/entity/Axis3DEntity";
import * as ProfileInstanceT from "../../../voxprofile/entity/ProfileInstance";
import * as FogSphDepthMaterialT from "../../../advancedDemo/depthFog4/material/FogSphDepthMaterial";
import * as FogSphGeomFactorMaterialT from "../../../advancedDemo/depthFog4/material/FogSphGeomFactorMaterial";
import * as FogSphGeomFactor2MaterialT from "../../../advancedDemo/depthFog4/material/FogSphGeomFactor2Material";
import * as FogSphShowMaterialT from "../../../advancedDemo/depthFog4/material/FogSphShowMaterial";
import * as FogSphShow2MaterialT from "../../../advancedDemo/depthFog4/material/FogSphShow2Material";
import * as BoxSpaceMotionerT from "../../../voxmotion/primtive/BoxSpaceMotioner";
import * as FogFBOManaT from "../../../advancedDemo/depthFog4/scene/FogFBOMana";

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

import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import FogSphDepthMaterial = FogSphDepthMaterialT.advancedDemo.depthFog4.material.FogSphDepthMaterial;
import FogSphShowMaterial = FogSphShowMaterialT.advancedDemo.depthFog4.material.FogSphShowMaterial;
import FogSphShow2Material = FogSphShow2MaterialT.advancedDemo.depthFog4.material.FogSphShow2Material;
import FogSphGeomFactorMaterial = FogSphGeomFactorMaterialT.advancedDemo.depthFog4.material.FogSphGeomFactorMaterial;
import FogSphGeomFactor2Material = FogSphGeomFactor2MaterialT.advancedDemo.depthFog4.material.FogSphGeomFactor2Material;
import BoxSpaceMotioner = BoxSpaceMotionerT.voxmotion.primitive.BoxSpaceMotioner;
import FogFBOMana = FogFBOManaT.advancedDemo.depthFog4.scene.FogFBOMana;

export namespace advancedDemo
{
    export namespace depthFog4
    {
        export namespace scene
        {
        export class SceneFogSph
        {
            constructor()
            {
            }

            private m_rc:RendererScene = null;
            private m_rct:RendererInstanceContext = null;
            private m_texLoader:TexResLoader = new TexResLoader();
            private m_profileInstance:ProfileInstance = null;
            getImageTexByUrl(pns:string):TextureProxy
            {
                let tex:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/voxgl/assets/"+pns);
                tex.setWrap(TextureConst.WRAP_REPEAT);
                tex.mipmapEnabled = true;
                return tex;
            }
            private m_dstPlane:Plane3DEntity = null;
            factorPlane:Plane3DEntity = null;
            private m_entityRSCIndex:number = 0;
            private m_fogVolumeIndex:number = 1;
            private m_entityBGIndex:number = 2;
            private m_factorPlaneIndex:number = 4;
            dstPlaneIndex:number = 3;
            
            //fogFactorM:FogSphGeomFactorMaterial;
            fogFactorM:FogSphGeomFactor2Material;
            fogShowM:FogSphShowMaterial;
            fogShow2M:FogSphShow2Material;

            private m_motioners:BoxSpaceMotioner[] = [];
            private m_volMotioners:BoxSpaceMotioner[] = [];
            maxRadius:number = 1.0;
            posList:Vector3D[] = [];
            factorColors:Color4[] = [];
            fogColors:Color4[] = [];
            volumeStates:number[] = [];
            volumeRadiuss:number[] = [];
            //volumeSphs:Sphere3DEntity[] = [];
            
            middleFBO:FBOInstance = null;
            factorFBO:FBOInstance = null;
            
            fogFboMana:FogFBOMana = null;
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
                console.log("SceneFogSph::initialize()......");
                if(this.m_rc == null)
                {
                    this.m_rc = rc;
                    
                    let tex0:TextureProxy = this.getImageTexByUrl("moss_04.jpg");
                    let tex1:TextureProxy = this.getImageTexByUrl("metal_08.jpg");
                    let tex2:TextureProxy = this.getImageTexByUrl("brickwall_big.jpg");
                    //let tex3:TextureProxy = this.getImageTexByUrl("cloud_01.jpg");
                    //let tex3:TextureProxy = this.getImageTexByUrl("caustics_02.jpg");
                    let tex3:TextureProxy = this.getImageTexByUrl("displacement_03.jpg");

                    this.m_rct = this.m_rc.getRendererContext();

                    this.m_rc.getStage3D().addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                    this.m_rc.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);

                    RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                    RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                    RendererState.CreateRenderState("ADD03",CullFaceMode.BACK,RenderBlendMode.TRANSPARENT,DepthTestMode.RENDER_ALWAYS);
                    RendererState.CreateRenderState("EqualFalse",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_FALSE_EQUAL);
                    RendererState.CreateRenderState("EqualFalseFront",CullFaceMode.FRONT,RenderBlendMode.NORMAL,DepthTestMode.RENDER_FALSE_EQUAL);
                    RendererState.CreateRenderState("LessFalse",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_FALSE_LEQUAL);
                    RendererState.CreateRenderState("LessEqualFalse",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_FALSE_LEQUAL);
                    RendererState.CreateRenderState("LessEqualTrue",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_TRUE_LEQUAL);
                    RendererState.CreateRenderState("LessFalseFront",CullFaceMode.FRONT,RenderBlendMode.NORMAL,DepthTestMode.RENDER_FALSE_LEQUAL);
                    
                    //  let axis:Axis3DEntity = new Axis3DEntity();
                    //  axis.initialize(200.0);
                    //  this.m_rc.addEntity(axis, this.m_entityRSCIndex);

                    let i:number = 0;
                    let total:number = 0;
                    let scaleK:number = 1.0;
                    let motioner:BoxSpaceMotioner = null;
                    let srcBox:Box3DEntity = new Box3DEntity();
                    srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex0]);
                    total = 50;
                    let box:Box3DEntity = null;
                    for(i = 0; i < total; ++i)
                    {
                        box = new Box3DEntity();
                        box.setMaterial(new FogSphDepthMaterial());
                        if(srcBox != null)box.setMesh(srcBox.getMesh());
                        box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex2]);
                        if(total > 1)
                        {
                            box.setScaleXYZ((Math.random() * 2.0 + 0.5) * scaleK,(Math.random() * 2.0 + 0.5) * scaleK,(Math.random() * 2.0 + 0.5) * scaleK);
                            box.setRotationXYZ(Math.random() * 500.0,Math.random() * 500.0,Math.random() * 500.0);
                            box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                        }
                        else
                        {
                            box.setXYZ(-150.0,0.0,0.0);
                        }
                        this.m_rc.addEntity(box, this.m_entityRSCIndex);
                        motioner = new BoxSpaceMotioner();
                        motioner.setTarget(box);
                        this.m_motioners.push(motioner);
                    }
                    let sph:Sphere3DEntity = null;
                    let srcSph:Sphere3DEntity = null;
                    total = 50;
                    for(i = 0; i < total; ++i)
                    {
                        sph = new Sphere3DEntity();
                        sph.setMaterial(new FogSphDepthMaterial());
                        if(srcSph != null)
                        {
                            sph.setMesh(srcSph.getMesh());
                            sph.initialize(100,20,20,[tex0]);
                        }
                        else
                        {
                            sph.initialize(100,20,20,[tex0]);
                            srcSph = sph;
                        }
                        if(total > 1)
                        {
                            sph.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                        }
                        else
                        {
                            sph.setXYZ(150.0,0.0,0.0);
                        }
                        this.m_rc.addEntity(sph,this.m_entityRSCIndex);
                        motioner = new BoxSpaceMotioner();
                        motioner.setTarget(sph);
                        this.m_motioners.push(motioner);
                    }

                    let size:number = 2300.0;
                    let bgBox:Box3DEntity = new Box3DEntity();
                    bgBox.setMaterial(new FogSphDepthMaterial());
                    bgBox.showBackFace();
                    bgBox.initialize(new Vector3D(-size,-size,-size),new Vector3D(size,size,size),[tex1]);
                    bgBox.setScaleXYZ(2.0,1.0,2.0);
                    this.m_rc.addEntity(bgBox,this.m_entityBGIndex);

                    sph = null;
                    let scale:number = 1.0;
                    
                    ///*
                    let rState0:number = RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                    let rState1:number = RendererState.BACK_TRANSPARENT_ALWAYS_STATE;
                    let pv:Vector3D;
                    let pcolor:Color4;
                    this.maxRadius = 800.0;//141.25;
                    let baseRadius:number = this.maxRadius;
                    for(i = 0; i < 1; ++i)
                    {
                        if(Math.random() > 0.9) this.volumeStates.push(rState0);
                        else this.volumeStates.push(rState1);
                        //pv = new Vector3D(-1157.75, 159.23,-1468.46);
                        pv = new Vector3D();
                        //pv.setXYZ(i * 800.0,0.0,0.0);
                        pv.setXYZ((i+1) * 800.0,0.0,0.0);
                        motioner = new BoxSpaceMotioner();
                        motioner.setPosition(pv);
                        this.m_volMotioners.push(motioner);
                        motioner.sleep();
                        pcolor = new Color4();
                        pcolor.setRGB3f(1.0,1.0,1.0);
                        this.volumeRadiuss.push(baseRadius);
                        this.factorColors.push(pcolor);
                        pcolor = new Color4();
                        pcolor.setRGB3f(1.0,1.0,1.0);
                        //pcolor.normalizeRandom(1.0);
                        this.fogColors.push(pcolor);
                        this.posList.push(pv);
                    }
                    for(i = 0; i < 60; ++i)
                    {
                        if(Math.random() > 0.9) this.volumeStates.push(rState0);
                        else this.volumeStates.push(rState1);

                        pv = new Vector3D();
                        pv.setXYZ(Math.random() * 1800.0 - 900.0,Math.random() * 1800.0 - 900.0,Math.random() * 1800.0 - 900.0);
                        
                        scale = 0.2 + Math.random();
                        this.volumeRadiuss.push(scale * baseRadius);
                        motioner = new BoxSpaceMotioner();
                        motioner.setPosition(pv);
                        this.m_volMotioners.push(motioner);
                        pcolor = new Color4();
                        pcolor.randomRGB(2.0);
                        this.factorColors.push(pcolor);
                        pcolor = new Color4();
                        pcolor.randomRGB(2.0);;
                        //pcolor.normalizeRandom(1.0);
                        this.fogColors.push(pcolor);
                        this.posList.push(pv);
                    }
                    
                    this.fogFboMana = new FogFBOMana();
                    this.fogFboMana.initialize(this.m_rc);
                    this.middleFBO = this.fogFboMana.createMiddleFBO([this.m_entityRSCIndex,this.m_entityBGIndex]);
                    this.factorFBO = this.fogFboMana.createFactorFBO([this.m_factorPlaneIndex]);

                    //this.fogFactorM = new FogSphGeomFactorMaterial();
                    this.fogFactorM = new FogSphGeomFactor2Material();
                    this.factorPlane = new Plane3DEntity();
                    this.factorPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                    //this.factorPlane.setRenderStateByName("ADD02");
                    this.factorPlane.setMaterial(this.fogFactorM);
                    //this.middleFBO
                    this.factorPlane.initialize(
                        //-1.0,-1.0,2.0,2.0
                        -0.5,-0.5,1.0,1.0
                        ,[
                            this.middleFBO.getTextureAt(0)
                            ,tex3
                        ]
                        );
                    this.m_rc.addEntity(this.factorPlane,this.m_factorPlaneIndex);

                    this.fogShow2M = new FogSphShow2Material();
                    this.fogShow2M.setTextureList(
                        [
                            this.middleFBO.getTextureAt(1)
                            ,this.factorFBO.getTextureAt(0)
                            ,this.factorFBO.getTextureAt(1)
                        ]
                    );
                    this.fogShow2M.initializeByCodeBuf(true);

                    this.fogShowM = new FogSphShowMaterial();
                    this.m_dstPlane = new Plane3DEntity();
                    this.m_dstPlane.setMaterial(this.fogShow2M);
                    this.m_dstPlane.initialize(
                        -1.0,-1.0,2.0,2.0
                        ,[
                            this.middleFBO.getTextureAt(1)
                            ,this.factorFBO.getTextureAt(0)
                            ,this.factorFBO.getTextureAt(1)
                        ]
                        );
                    this.m_rc.addEntity(this.m_dstPlane,this.dstPlaneIndex);
                    
                    this.m_profileInstance = new ProfileInstance();
                    this.m_profileInstance.initialize(this.m_rc.getRenderer());
                    
                }
            }
            run():void
            {
                // logic run
                this.runmotion();
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