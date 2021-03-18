
import * as Vector3DT from "../vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererStateT from "../vox/render/RendererState";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as MaterialBaseT from "../vox/material/MaterialBase";
import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as DepthTextureProxyT from "../vox/texture/DepthTextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as DemoInstanceT from "./DemoInstance";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";
import * as DeepColorMaterialT from "../demo/deepTransparent/DeepColorMaterial";
import * as PeelColorMaterialT from "../demo/deepTransparent/PeelColorMaterial";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import DepthTextureProxy = DepthTextureProxyT.vox.texture.DepthTextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import DemoInstance = DemoInstanceT.demo.DemoInstance;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import DeepColorMaterial = DeepColorMaterialT.demo.deepTransparent.DeepColorMaterial;
import PeelColorMaterial = PeelColorMaterialT.demo.deepTransparent.PeelColorMaterial;


export namespace demo
{
    export class DemoDeepTransparent extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_depTex0:DepthTextureProxy = null;
        private m_depTex1:DepthTextureProxy = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = null;
        private m_profileInstance:ProfileInstance = null;//new ProfileInstance();
        //private m_profileInstance:ProfileInstance = new ProfileInstance();
        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 4;
            param.maxWebGLVersion = 1;
            param.setCamProject(45,200,2000.0);
            param.setMatrix4AllocateSize(4096 * 2);
            param.setCamPosition(800.0,800.0,800.0);
        }
        private m_handleMaterial:MaterialBase = new MaterialBase();
        private m_peelM0:PeelColorMaterial = null;
        private m_peelEntity0:DisplayEntity = null;
        private m_peelEntity1:DisplayEntity = null;
        private m_peelEntity2:DisplayEntity = null;
        protected initializeSceneObj():void
        {
            console.log("DemoDeepTransparent::initialize()......");
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            if(this.m_statusDisp != null)this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);
            //this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
            //let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/bg002.jpg");
            //this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight
            this.m_depTex0 = this.m_rscene.textureBlock.createDepthTextureAt(0, this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);
            this.m_depTex1 = this.m_rscene.textureBlock.createDepthTextureAt(1, this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);

            console.log("tex uids: ",tex0.getUid(), this.m_depTex0.getUid(), this.m_depTex1.getUid()
            ,this.m_rscene.textureBlock.getRTTTextureAt(0).getUid()
            ,this.m_rscene.textureBlock.getRTTTextureAt(1).getUid()
            );
            this.m_handleMaterial.setTextureList([this.m_depTex0,this.m_depTex1]);
            //  // add common 3d display entity
            //  var plane:Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            //  this.m_rscene.addEntity(plane,0);
            let scale:number = 0.5;
            let peelM:PeelColorMaterial = null;//new PeelColorMaterial();
           
            peelM = new PeelColorMaterial();
            peelM.setStageSize(this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);
            this.m_peelM0 = peelM;
            
            ///*
            let size:number = 150.0;
            let box:Box3DEntity = new Box3DEntity();
            box.setMaterial(peelM);
            box.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            box.initialize(new Vector3D(-size,-size,-size),new Vector3D(size,size,size),[tex0,this.m_depTex1]);
            box.setXYZ(0.0,200.0,0.0);
            //box.setXYZ(1200 * Math.random() - 600.0,1200 * Math.random() - 600.0,600 * Math.random() - 600.0);
            //box.setScaleXYZ(scale,scale,scale);
            this.m_rscene.addEntity(box);
            this.m_peelEntity1 = box;

            //*/
            let srcSph:Sphere3DEntity = null;
            let sph:Sphere3DEntity = new Sphere3DEntity();
            sph.setMaterial(peelM);
            //NONE_CULLFACE_NORMAL_STATE
            //sph.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
            sph.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            sph.initialize(400.0,20,20,[tex0,this.m_depTex1]);
            console.log("sph.getMaterial().getTextureList(): ",sph.getMaterial().getTextureList());
            this.m_rscene.addEntity(sph);
            //sph.setVisible(false);
            this.m_peelEntity0 = sph;
            srcSph = sph;
            ///*
            sph = new Sphere3DEntity();
            sph.setMaterial(peelM);
            sph.copyMeshFrom(srcSph);
            //NONE_CULLFACE_NORMAL_STATE
            //sph.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
            sph.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            sph.initialize(400.0,20,20,[tex0,this.m_depTex1]);
            sph.setScaleXYZ(scale,scale,scale);
            //console.log("sph.getMaterial().getTextureList(): ",sph.getMaterial().getTextureList());
            this.m_rscene.addEntity(sph);
            this.m_peelEntity2 = sph;
            //*/
            let scrPlane:Plane3DEntity = new Plane3DEntity();
            //scrPlane.setScreenAlignEnable(true);
            let material:DeepColorMaterial = new DeepColorMaterial();
            material.setStageSize(this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);
            scrPlane.setMaterial(material);
            //scrPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            //scrPlane.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
            //scrPlane.initialize(-1.0,-1.0,2.0,2.0,[TextureStore.GetRTTTextureAt(0)]);
            scrPlane.initializeXOY(-1.0,-1.0,2.0,2.0,[this.m_rscene.textureBlock.getRTTTextureAt(1), this.m_depTex1]);
            //scrPlane.initialize(-1.0,-1.0,2.0,2.0,[TextureStore.GetRTTTextureAt(0), this.m_depTex0]);
            this.m_rscene.addEntity(scrPlane, 1);

            console.log("------------------------------------------------------------------");
            console.log("------------------------------------------------------------------");
        }
        private m_flag:number = 16;
        private mouseDown(evt:any):void
        {
            this.m_flag = 0;
        }
        runBegin():void
        {
            this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);
            this.m_flag = 1;
            if(this.m_flag < 0)
            {
                return;
            }
            // 分帧加载
            this.m_texLoader.run();
            // render begin
            this.m_rscene.runBegin();
            // run logic program
            this.m_rscene.update();

        }
        run():void
        {
            if(this.m_flag < 0)
            {
                return;
            }
            this.m_flag -= 1;
            //this.m_rscene.run();
            //  if(this.m_profileInstance != null)
            //  {
            //      this.m_profileInstance.run();
            //  }
            ///*
            
            //console.log(">>>>> run begin");
            // --------------------------------------------- rtt begin
            let depIndex0:number = 1;
            let depIndex1:number = 0;
            let colorIndex:number = 1;
            this.m_peelM0.setPeelEanbled(false);
            this.m_peelM0.setTextureAt(1,TextureStore.GetDepthTextureAt(depIndex0));

            if(this.m_peelEntity1 != null)this.m_peelEntity1.updateMaterialToGpu(this.m_rscene.getRenderProxy());
            if(this.m_peelEntity2 != null)this.m_peelEntity2.updateMaterialToGpu(this.m_rscene.getRenderProxy());
            this.m_peelEntity0.updateMaterialToGpu(this.m_rscene.getRenderProxy());
            //this.m_peelEntity0.setTextureAt(1,this.m_depTex1,this.m_rscene.getRenderProxy());
            this.m_rcontext.setClearRGBAColor4f(0.0, 0.0, 0.0,1.0);
            this.m_rcontext.synFBOSizeWithViewport();
            this.m_rcontext.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(colorIndex), true, false, 0);
            this.m_rcontext.setRenderToTexture(this.m_rscene.textureBlock.getDepthTextureAt(depIndex1), true, false, 1024);
            this.m_rcontext.useFBO(true, true, false);
            // to be rendering in framebuffer
            this.m_rscene.runAt(0);
            //console.log(">>>>> a02, RendererState.DrawCallTimes: "+RendererState.DrawCallTimes);
            for(let i:number = 0; i < 5; ++i)
            {
                ++depIndex0;
                ++depIndex1;
                ++colorIndex;
                if(depIndex0 > 1) depIndex0 = 0;
                if(depIndex1 > 1) depIndex1 = 0;
                if(colorIndex > 1) colorIndex = 0;
                this.m_peelM0.setPeelEanbled(true);
                this.m_peelM0.setTextureAt(1,this.m_rscene.textureBlock.getDepthTextureAt(depIndex0));

                if(this.m_peelEntity1 != null)this.m_peelEntity1.updateMaterialToGpu(this.m_rscene.getRenderProxy());
                if(this.m_peelEntity2 != null)this.m_peelEntity2.updateMaterialToGpu(this.m_rscene.getRenderProxy());
                this.m_peelEntity0.updateMaterialToGpu(this.m_rscene.getRenderProxy());
                //console.log("depIndex1: ",depIndex1,"colorIndex: ",colorIndex);
                //this.m_peelEntity0.setTextureAt(1,this.m_depTex0,this.m_rscene.getRenderProxy());
                this.m_rcontext.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(colorIndex), true, false, 0);
                this.m_rcontext.setRenderToTexture(this.m_rscene.textureBlock.getDepthTextureAt(depIndex1), true, false, 1024);
                this.m_rscene.renderBegin();
                this.m_rcontext.useFBO(true, true, false);
                this.m_rscene.runAt(0);
            }
            //
            //  RendererState.DrawCallTimes = 0;
            //  RendererState.DrawTrisNumber = 0;
            // --------------------------------------------- rtt end
            //console.log(">>>>> a03");
            this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0,1.0);
            this.m_rscene.setRenderToBackBuffer();
            // to be rendering in backbuffer
            this.m_rscene.runAt(1);
            //console.log(">>>>> a04");
            //*/
            /*
            this.m_rscene.runAt(0);
            //*/
        }
        runEnd():void
        {
            super.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}