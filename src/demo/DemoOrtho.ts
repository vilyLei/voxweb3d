
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RODrawStateT from "../vox/render/RODrawState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";
import * as IRendererSpaceT from "../vox/scene/IRendererSpace";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RaySelectorT from "../vox/scene/RaySelector";
import * as MouseEvt3DControllerT from "../vox/scene/MouseEvt3DController";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as MouseEvt3DDispatcherT from "../vox/event/MouseEvt3DDispatcher";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;

import Stage3D = Stage3DT.vox.display.Stage3D;
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RaySelector = RaySelectorT.vox.scene.RaySelector;
import MouseEvt3DController = MouseEvt3DControllerT.vox.scene.MouseEvt3DController;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;

export namespace demo
{
    export class DispEvtevtCtrObj
    {
        constructor()
        {
        }
        name:string = "DispEvtevtCtrObj";
        disp:DisplayEntity = null;
        mouseMoveListener(evt:any):void
        {
            
        }
        mouseOverListener(evt:any):void
        {
            
            console.log(this.name+", DispEvtevtCtrObj mouse over. pos: "+evt.mouseX+","+evt.mouseY);
            if(this.disp != null)
            {
                let material:any = this.disp.getMaterial();
                material.setRGB3f(Math.random() * 1.2,1.0,1.0);
            }
        }
        mouseOutListener(evt:any):void
        {
            console.log(this.name+", DispEvtevtCtrObj mouse out. ");
            if(this.disp != null)
            {
                let material:any = this.disp.getMaterial();
                material.setRGB3f(1.0,1.0, Math.random() * 1.2);
            }
        }
        mouseDownListener(evt:any):void
        {
            console.log(this.name+", DispEvtevtCtrObj mouse down. ");
        }
        mouseUpListener(evt:any):void
        {
            console.log(this.name+", DispEvtevtCtrObj mouse up. ");
        }
        destory():void
        {
        }
    }
    export class DemoOrtho
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_rspace:IRendererSpace = null;
        private m_raySelector:RaySelector = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_stage3D:Stage3D = null;
        initialize():void
        {
            console.log("DemoOrtho::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/warter_01.jpg");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                
                this.m_statusDisp.initialize("rstatus");
                
                let rparam:RendererParam = new RendererParam();
                rparam.cameraPerspectiveEnabled = false;
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,10.1,3000.0);
                rparam.setCamPosition(0.0,0.0,1500.0);
                //rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_stage3D = this.m_rscene.getStage3D();
                // align to left bottom
                this.m_rscene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
                this.m_rscene.updateCamera();

                
                this.m_rspace = this.m_rscene.getSpace();
                this.m_raySelector = new RaySelector();
                this.m_rspace.setRaySelector(this.m_raySelector);
                let evtCtr:MouseEvt3DController = new MouseEvt3DController();
                this.m_rscene.setEvt3DController(evtCtr);

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                RenderStateObject.Create("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RenderStateObject.Create("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let evtCtrObj:DispEvtevtCtrObj;
                let dispatcher:MouseEvt3DDispatcher;
                let i:number = 0;
                let plane:Plane3DEntity;

                let dprK:number = this.m_rscene.getDevicePixelRatio();
                for(i = 0; i < 2; ++i)
                {
                    plane = new Plane3DEntity();
                    //plane.showDoubleFace();
                    plane.initialize(0.0,0.0,200.0,150.0,[tex0]);
                    plane.setXYZ(i * 400.0,0.0,0.0);
                    this.m_rscene.addEntity(plane);
                    
                    evtCtrObj = new DispEvtevtCtrObj();
                    evtCtrObj.name = "plane_"+i;
                    evtCtrObj.disp = plane;
                    dispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,evtCtrObj,evtCtrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,evtCtrObj,evtCtrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,evtCtrObj,evtCtrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,evtCtrObj,evtCtrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,evtCtrObj,evtCtrObj.mouseMoveListener);
                    plane.setEvtDispatcher(dispatcher);                    
                    plane.mouseEnabled = true;
                }
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(600.0);
                axis.setXYZ(200,300,0);
                this.m_rscene.addEntity(axis);
                let box:Box3DEntity = null;
                let sphere:Sphere3DEntity = null;

                for(i = 0; i < 2; ++i)
                {
                    box = new Box3DEntity(); 
                    box.initialize(new Vector3D(-50.0,-50.0,-50.0),new Vector3D(50.0,50.0,5.0),[tex1]);
                    box.setXYZ(Math.random() * 1000.0,Math.random() * 1000.0,Math.random() * 1000.0);
                    this.m_rscene.addEntity(box);

                    evtCtrObj = new DispEvtevtCtrObj();
                    evtCtrObj.disp = box;
                    evtCtrObj.name = "box_"+i;
                    dispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,evtCtrObj,evtCtrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,evtCtrObj,evtCtrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,evtCtrObj,evtCtrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,evtCtrObj,evtCtrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,evtCtrObj,evtCtrObj.mouseMoveListener);
                    box.setEvtDispatcher(dispatcher);                    
                    box.mouseEnabled = true;

                }
                for(i = 0; i < 0; ++i)
                {
                    sphere = new Sphere3DEntity();
                    sphere.initialize(50.0,15,15,[tex1]);
                    sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_rscene.addEntity(sphere);

                    evtCtrObj = new DispEvtevtCtrObj();
                    evtCtrObj.disp = sphere;
                    evtCtrObj.name = "sphere_"+i;
                    dispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,evtCtrObj,evtCtrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,evtCtrObj,evtCtrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,evtCtrObj,evtCtrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,evtCtrObj,evtCtrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,evtCtrObj,evtCtrObj.mouseMoveListener);
                    sphere.setEvtDispatcher(dispatcher);                    
                    sphere.mouseEnabled = true;
                }
            }
        }
        run():void
        {
            this.m_statusDisp.update();
            this.m_rscene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
            this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rscene.runBegin();
            this.m_rscene.update();
            this.m_rscene.run();

            this.m_rscene.runEnd();
        }
    }
}