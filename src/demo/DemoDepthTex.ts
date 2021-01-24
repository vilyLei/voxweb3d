
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererStateT from "../vox/render/RendererState";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as PureEntityT from "../vox/entity/PureEntity";
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
import * as DepZColorMaterialT from "../demo/material/DepZColorMaterial";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import PureEntity = PureEntityT.vox.entity.PureEntity;
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
import DepZColorMaterial = DepZColorMaterialT.demo.material.DepZColorMaterial;


export namespace demo
{
    export class DemoDepthTex extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_depTex:DepthTextureProxy = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = null;
        //private m_profileInstance:ProfileInstance = null;//new ProfileInstance();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 4;
            param.maxWebGLVersion = 1;
            param.setMatrix4AllocateSize(4096 * 2);
            param.setCamPosition(500.0,500.0,500.0);
        }
        
        protected initializeSceneObj():void
        {
            console.log("DemoDepthTex::initialize()......");
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            this.m_rscene.getStage3D().addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            if(this.m_statusDisp != null)this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            
            this.m_depTex = TextureStore.GetDepthTextureAt(0);

            //  // add common 3d display entity
            //  var plane:Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            //  this.m_rscene.addEntity(plane,0);

            //  let sph:Sphere3DEntity = new Sphere3DEntity();
            //  sph.initialize(200.0,20,20,[tex0]);
            //  this.m_rscene.addEntity(sph);
            let scale:number = 1.0;
            for(let i:number = 0; i < 50; ++i)
            {
                scale = 0.3 + 0.2 * Math.random();
                let box:Box3DEntity = new Box3DEntity();
                box.initialize(new Vector3D(-200,-200,-200),new Vector3D(200,200,200),[tex0]);
                box.setXYZ(1200 * Math.random() - 600.0,1200 * Math.random() - 600.0,600 * Math.random() - 600.0);
                box.setScaleXYZ(scale,scale,scale);
                this.m_rscene.addEntity(box);
            }

            let scrPlane:Plane3DEntity = new Plane3DEntity();
            //scrPlane.setScreenAlignEnable(true);
            let material:DepZColorMaterial = new DepZColorMaterial();
            material.setStageSize(this.m_rscene.getStage3D().stageWidth, this.m_rscene.getStage3D().stageHeight);
            scrPlane.setMaterial(material);
            //scrPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            //scrPlane.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);
            //scrPlane.initialize(-1.0,-1.0,2.0,2.0,[TextureStore.GetRTTTextureAt(0)]);
            scrPlane.initialize(-1.0,-1.0,2.0,2.0,[TextureStore.GetRTTTextureAt(0), this.m_depTex]);
            this.m_rscene.addEntity(scrPlane, 1);

            console.log("------------------------------------------------------------------");
            console.log("------------------------------------------------------------------");
        }
        private mouseDown(evt:any):void
        {
        }
        runBegin():void
        {
            if(this.m_statusDisp != null)this.m_statusDisp.update();
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            //this.m_rscene.setClearUint24Color(0x003300,1.0);
            super.runBegin();
        }
        run():void
        {
            //this.m_rscene.run();
            //  if(this.m_profileInstance != null)
            //  {
            //      this.m_profileInstance.run();
            //  }
            ///*
            // --------------------------------------------- rtt begin
            this.m_rcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
            this.m_rcontext.synFBOSizeWithViewport();
            this.m_rcontext.setRenderToTexture(TextureStore.GetRTTTextureAt(0), true, false, 0);
            this.m_rcontext.setRenderToTexture(this.m_depTex, true, false, 1024);
            this.m_rcontext.useFBO(true, true, false);
            // to be rendering in framebuffer
            this.m_rscene.runAt(0);
            // --------------------------------------------- rtt end
            this.m_rscene.setClearRGBColor3f(0.0, 3.0, 2.0);
            this.m_rscene.setRenderToBackBuffer();
            // to be rendering in backbuffer
            this.m_rscene.runAt(1);
            //*/
        }
        runEnd():void
        {
            super.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}