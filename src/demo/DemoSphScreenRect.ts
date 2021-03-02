
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as Cylinder3DEntityT from "../vox/entity/Cylinder3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";
import * as ScreenRectMaterialT from "./material/ScreenRectMaterial";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Cylinder3DEntity = Cylinder3DEntityT.vox.entity.Cylinder3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;
import ScreenRectMaterial = ScreenRectMaterialT.demo.material.ScreenRectMaterial;

export namespace demo
{
    export class DemoSphScreenRect
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        private m_rectPlane:Plane3DEntity = null;
        private m_sph:Sphere3DEntity = null;
        private m_radius:number = 250.0;
        initialize():void
        {
            console.log("DemoSphScreenRect::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D:Stage3D = this.m_rcontext.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let i:number = 0;
                ///*
                //  let plane:Plane3DEntity = new Plane3DEntity();
                //  plane.name = "plane";
                //  //plane.showDoubleFace();
                //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //  //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,null);
                //  this.m_renderer.addEntity(plane);
                let rectMaterial:ScreenRectMaterial = new ScreenRectMaterial();
                rectMaterial.setRGBA4f(1.0,0.0,1.0,1.0);
                let rectPlane:Plane3DEntity = new Plane3DEntity();
                rectPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                rectPlane.setMaterial(rectMaterial);
                rectPlane.initializeXOY(-1.0,-1.0,2.0,2.0);
                this.m_renderer.addEntity(rectPlane,0);

                let wk:number = 5.0 / this.m_rcontext.getStage3D().stageHalfWidth;
                let hk:number = 5.0 / this.m_rcontext.getStage3D().stageHalfHeight;
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                this.m_renderer.addEntity(axis);
                let pv:Vector3D = new Vector3D();
                let outV:Vector3D = new Vector3D();
                let radius:number = this.m_radius;
                for(i = 0; i < 1; ++i)
                {
                    let sphere:Sphere3DEntity = new Sphere3DEntity();
                    sphere.initialize(250.0,15,15,[tex1]);
                    //pv.setXYZ(Math.random() * 600.0 - 300.0,Math.random() * 600.0 - 300.0,Math.random() * 600.0 - 300.0);
                    pv.setXYZ(Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0);
                    //pv.scaleBy(1.5);
                    sphere.setPosition(pv);
                    this.m_renderer.addEntity(sphere,1);
                    this.m_sph = sphere;
                }
                rectMaterial = new ScreenRectMaterial();
                rectMaterial.setRGBA4f(1.0,1.0,1.0,0.5);
                rectPlane = new Plane3DEntity();
                rectPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                rectPlane.setMaterial(rectMaterial);
                rectPlane.initializeXOY(-0.5,-0.5,1.0,1.0);
                this.m_renderer.addEntity(rectPlane,2);
                //rectPlane.setXYZ(0.3,0.2,0.0);
                let k:number = this.m_rcontext.getStage3D().stageHalfWidth/this.m_rcontext.getStage3D().stageHalfHeight;
                this.m_rcontext.getCamera().calcScreenRectByWorldSphere(pv,radius + 30.0,outV);
                //outV.z *= ;
                //outV.w *= this.m_rcontext.getCamera().getZFar;
                rectPlane.setXYZ(outV.x + outV.z * 0.5,outV.y + outV.w * 0.5,0.0);
                rectPlane.setScaleXYZ(outV.z * k, outV.w,1.0);

                this.m_rectPlane = rectPlane;
                //  rectPlane.setXYZ(outV.x + outV.z * 0.5,outV.y + outV.w * 0.5,0.0);
                //  rectPlane.setScaleXYZ(outV.z * (1.0 + 0.2 * Math.abs(outV.x)) + wk,outV.w * (1.0 + 0.2 * Math.abs(outV.w)) + hk,1.0);


            }
        }
        mouseDownListener(evt:any):void
        {
            let outV:Vector3D = new Vector3D();
            let scale:number = Math.random() * 0.8 + 0.8;
            console.log("mouseUpListener call, this.m_renderer: "+this.m_renderer.toString());
            let pv:Vector3D = new Vector3D();
            //pv.setXYZ(Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0);
            pv.setXYZ(Math.random() * 2200.0 - 1100.0,Math.random() * 2200.0 - 1100.0,Math.random() * 2200.0 - 1100.0);
            this.m_sph.setScaleXYZ(scale,scale,scale);
            this.m_sph.setPosition(pv);
            this.m_sph.update();

            let persK:number = this.m_rcontext.getCamera().getViewFieldZoom() * this.m_rcontext.getCamera().getAspect();
            console.log("getViewFieldZoom: "+this.m_rcontext.getCamera().getViewFieldZoom()+", getAspect: "+this.m_rcontext.getCamera().getAspect());
            console.log("persK: "+persK+", 1.0/persK: "+(1.0/persK));
            let radius:number = this.m_radius * scale;
            let k:number = 0.5 * this.m_rcontext.getCamera().getViewFieldZoom() * (this.m_rcontext.getStage3D().stageHalfWidth - this.m_rcontext.getStage3D().stageHalfHeight);
            k = (this.m_rcontext.getStage3D().stageHalfWidth - k)/this.m_rcontext.getStage3D().stageHalfHeight;
            if(k < 1.0)
            {
                k = 1.0;
            }
            k = 1.0;
            this.m_rcontext.getCamera().calcScreenRectByWorldSphere(pv,radius,outV);
            //this.m_rcontext.getCamera().calcScreenRectByWorldSphere(pv,radius,outV);
            //outV.z *= 1.05;
            //outV.w *= 1.05;
            this.m_rectPlane.setXYZ(outV.x + outV.z * 0.5,outV.y + outV.w * 0.5,0.0);
            //this.m_rectPlane.setScaleXYZ(outV.z * k, outV.w,1.0);
            this.m_rectPlane.setScaleXYZ(outV.z, outV.w,1.0);
            this.m_rectPlane.update();
        }
        run():void
        {
            //--this.m_runFlag;

            this.m_equeue.run();
            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            // 使用1/4窗口尺寸
            //this.m_rcontext.setViewPort(0,0,Math.round(this.m_rcontext.getStage3D().stageHalfWidth),Math.round(this.m_rcontext.getStage3D().stageHalfHeight));
            //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            this.m_rcontext.updateCamera();
            
            //  //console.log("#---  end");
        }
    }
}