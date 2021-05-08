
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import MaterialBase from "../vox/material/MaterialBase";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import DepthTextureProxy from "../vox/texture/DepthTextureProxy";
import WrapperTextureProxy from "../vox/texture/WrapperTextureProxy";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import * as DeepColorMaterialT from "../demo/deepTransparent/DeepColorMaterial";
import * as PeelColorMaterialT from "../demo/deepTransparent/PeelColorMaterial";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RendererState = RendererStateT.vox.render.RendererState;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
//import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
//import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import DepthTextureProxy = DepthTextureProxyT.vox.texture.DepthTextureProxy;
//import WrapperTextureProxy = WrapperTextureProxyT.vox.texture.WrapperTextureProxy;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
//import MouseEvent = MouseEventT.vox.event.MouseEvent;
////import DemoInstance = DemoInstanceT.demo.DemoInstance;
//import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import DeepColorMaterial = DeepColorMaterialT.demo.deepTransparent.DeepColorMaterial;
import PeelColorMaterial = PeelColorMaterialT.demo.deepTransparent.PeelColorMaterial;


export namespace demo
{
    export class DemoDeepTransparent2 extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_depTex0:DepthTextureProxy = null;
        private m_depTex1:DepthTextureProxy = null;
        private m_wrapperTex:WrapperTextureProxy = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = null;
        private m_profileInstance:ProfileInstance = null;
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
        protected initializeSceneObj():void
        {
            console.log("DemoDeepTransparent2::initialize()......,maxTexSize: ",RendererDeviece.MAX_TEXTURE_SIZE);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
            
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            if(this.m_statusDisp != null)this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);
            //let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/bg002.jpg");
            //this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight
            this.m_depTex0 = this.m_rscene.textureBlock.createDepthTextureAt(0, this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);
            this.m_depTex1 = this.m_rscene.textureBlock.createDepthTextureAt(1, this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);

            this.m_wrapperTex = this.m_rscene.textureBlock.createWrapperTex(64,64);
            this.m_wrapperTex.attachTex(this.m_depTex1);
            //this.m_wrapperTex.attachTex(tex0);
            console.log("tex uids: ",tex0.getUid(), this.m_depTex0.getUid(), this.m_depTex1.getUid()
            ,this.m_rscene.textureBlock.getRTTTextureAt(0).getUid()
            ,this.m_rscene.textureBlock.getRTTTextureAt(1).getUid()
            );
            this.m_handleMaterial.setTextureList([this.m_depTex0,this.m_depTex1,this.m_wrapperTex]);
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
            box.initialize(new Vector3D(-size,-size,-size),new Vector3D(size,size,size),[tex0,this.m_wrapperTex]);
            box.setXYZ(0.0,200.0,0.0);
            //box.setXYZ(1200 * Math.random() - 600.0,1200 * Math.random() - 600.0,600 * Math.random() - 600.0);
            //box.setScaleXYZ(scale,scale,scale);
            this.m_rscene.addEntity(box);

            //*/
            let srcSph:Sphere3DEntity = null;
            let sph:Sphere3DEntity = new Sphere3DEntity();
            sph.setMaterial(peelM);
            //NONE_CULLFACE_NORMAL_STATE
            //sph.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
            sph.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            sph.initialize(400.0,20,20,[tex0, this.m_wrapperTex]);
            //sph.initialize(400.0,20,20,[this.m_wrapperTex,this.m_depTex1]);
            console.log("sph.getMaterial().getTextureList(): ",sph.getMaterial().getTextureList());
            this.m_rscene.addEntity(sph);
            //sph.setVisible(false);
            srcSph = sph;
            ///*
            sph = new Sphere3DEntity();
            sph.setMaterial(peelM);
            sph.copyMeshFrom(srcSph);
            //NONE_CULLFACE_NORMAL_STATE
            //sph.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
            sph.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            sph.initialize(400.0,20,20,[tex0,this.m_wrapperTex]);
            sph.setScaleXYZ(scale,scale,scale);
            //console.log("sph.getMaterial().getTextureList(): ",sph.getMaterial().getTextureList());
            this.m_rscene.addEntity(sph);
            //*/
            let scrPlane:Plane3DEntity = new Plane3DEntity();
            //scrPlane.setScreenAlignEnable(true);
            let material:DeepColorMaterial = new DeepColorMaterial();
            material.setStageSize(this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);
            scrPlane.setMaterial(material);
            //scrPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            //scrPlane.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
            //scrPlane.initialize(-1.0,-1.0,2.0,2.0,[this.m_rscene.textureBlock.getRTTTextureAt(0)]);
            scrPlane.initializeXOY(-1.0,-1.0,2.0,2.0,[this.m_rscene.textureBlock.getRTTTextureAt(1), this.m_depTex1]);
            //scrPlane.initialize(-1.0,-1.0,2.0,2.0,[this.m_rscene.textureBlock.getRTTTextureAt(0), this.m_depTex0]);
            this.m_rscene.addEntity(scrPlane, 1);

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
                        
            // --------------------------------------------- rtt begin
            let depIndex0:number = 1;
            let depIndex1:number = 0;
            let colorIndex:number = 1;
            this.m_peelM0.setPeelEanbled(false);
            this.m_wrapperTex.attachTex(this.m_rscene.textureBlock.getDepthTextureAt(depIndex0));
            
            this.m_rcontext.setClearRGBAColor4f(0.0, 0.0, 0.0,1.0);
            this.m_rcontext.synFBOSizeWithViewport();
            this.m_rcontext.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(colorIndex), true, false, 0);
            this.m_rcontext.setRenderToTexture(this.m_rscene.textureBlock.getDepthTextureAt(depIndex1), true, false, 1024);
            this.m_rcontext.useFBO(true, true, false);
            // to be rendering in framebuffer
            this.m_rscene.runAt(0);
            
            for(let i:number = 0; i < 3; ++i)
            {
                ++depIndex0;
                ++depIndex1;
                ++colorIndex;
                if(depIndex0 > 1) depIndex0 = 0;
                if(depIndex1 > 1) depIndex1 = 0;
                if(colorIndex > 1) colorIndex = 0;
                this.m_peelM0.setPeelEanbled(true);
                this.m_wrapperTex.attachTex(this.m_rscene.textureBlock.getDepthTextureAt(depIndex0));
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
            
            this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0,1.0);
            this.m_rscene.setRenderToBackBuffer();
            // to be rendering in backbuffer
            this.m_rscene.runAt(1);
            
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