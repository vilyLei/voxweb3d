
import * as Vector3DT from "..//vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";
import * as IRendererSpaceT from "../vox/scene/IRendererSpace";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RendererSubSceneT from '../vox/scene/RendererSubScene';
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

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RendererSubScene = RendererSubSceneT.vox.scene.RendererSubScene;
import RaySelector = RaySelectorT.vox.scene.RaySelector;
import MouseEvt3DController = MouseEvt3DControllerT.vox.scene.MouseEvt3DController;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
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
            //console.log(this.name+", mouseMoveListener mouse over. this.disp != null: "+(this.disp != null));
            if(this.disp != null)
            {
                this.disp.setRotationXYZ(0.0,0.0,this.disp.getTransform().getRotationZ() + 2.0);
                this.disp.update();
            }
        }
        mouseOverListener(evt:any):void
        {            
            console.log(this.name+", DispEvtevtCtrObj mouse over. ");            
        }
        mouseOutListener(evt:any):void
        {
            console.log(this.name+", DispEvtevtCtrObj mouse out. ");
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
    export class DemoOrthoSubScene
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_subScene:RendererSubScene = null;
        private m_rspace:IRendererSpace = null;
        private m_raySelector:RaySelector = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_delayAddEntitys:DisplayEntity[] = [];
        private m_stage3D:Stage3D = null;
        initialize():void
        {
            console.log("DemoOrthoSubScene::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/warter_01.jpg");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam;
                rparam = new RendererParam();
                //rparam.cameraPerspectiveEnabled = false;
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                //rparam.setCamPosition(0.0,0.0,1500.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_stage3D = this.m_rscene.getStage3D() as Stage3D;
                // align to left bottom
                //  this.m_rscene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
                //  this.m_rscene.updateCamera();

                let evtCtr:MouseEvt3DController = null;

                this.m_rspace = this.m_rscene.getSpace();
                this.m_raySelector = new RaySelector();
                this.m_rspace.setRaySelector(this.m_raySelector);
                evtCtr = new MouseEvt3DController();
                this.m_rscene.setEvt3DController(evtCtr);
                
                rparam = new RendererParam();
                rparam.cameraPerspectiveEnabled = false;
                //rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(0.0,0.0,1500.0);
                let subScene:RendererSubScene = null;
                subScene = this.m_rscene.createSubScene();
                subScene.initialize(rparam);
                let rspace:IRendererSpace = subScene.getSpace();
                let raySelector:RaySelector = new RaySelector();
                rspace.setRaySelector(raySelector);
                evtCtr = new MouseEvt3DController();
                subScene.setEvt3DController(evtCtr);
                this.m_subScene = subScene;
                this.m_subScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
                this.m_subScene.getCamera().update();

                //  this.m_stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                //  this.m_stage3D.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                //  this.m_stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                //  this.m_stage3D.addEventListener(KeyboardEvent.KEY_DOWN,this,this.keyDownListener);
                //  this.m_stage3D.addEventListener(KeyboardEvent.KEY_UP,this,this.keyUpListener);

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let evtCtrObj:DispEvtevtCtrObj;
                let dispatcher:MouseEvt3DDispatcher;
                let i:number = 0;
                let plane:Plane3DEntity;
                
                for(i = 0; i < 1; ++i)
                {
                    plane = new Plane3DEntity();
                    //plane.showDoubleFace();
                    plane.initializeXOY(0.0,0.0,200.0,150.0,[tex0]);
                    //this.m_rscene.addEntity(plane);
                    plane.setXYZ(100.0,50.0,0.0);
                    this.m_subScene.addEntity(plane);
                    plane.getDisplay().name = "plane_"+i;
                    
                    evtCtrObj = new DispEvtevtCtrObj();
                    evtCtrObj.disp = plane;
                    evtCtrObj.name = "plane_"+i;
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
                this.m_rscene.addEntity(axis);
                let box:Box3DEntity = null;
                let sphere:Sphere3DEntity = null;

                for(i = 0; i < 1; ++i)
                {
                    box = new Box3DEntity(); 
                    box.initialize(new Vector3D(-50.0,-50.0,-50.0),new Vector3D(50.0,50.0,5.0),[tex1]);
                    box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
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
                for(i = 0; i < 1; ++i)
                {
                    sphere = new Sphere3DEntity();
                    sphere.initialize(110.0,15,15,[tex1]);
                    //sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_rscene.addEntity(sphere);
                    sphere.getDisplay().name = "sphere";

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
        private m_mouseX:number = 0.0;
        private m_mouseY:number = 0.0;
        private m_mouseDownBoo:boolean = false;
        private m_dragDirec:number = 0;
        keyDownListener(evt:any):void
        {
            console.log("keyDownListener call, key: "+evt.key+",repeat: "+evt.repeat);
        }
        keyUpListener(evt:any):void
        {
            console.log("keyUpListener call, key: "+evt.key+",repeat: "+evt.repeat);
            switch(evt.key)
            {
                case "z":
                    console.log("reset cam lookAt.");
                    this.m_rscene.getCamera().lookAtRH(new Vector3D(1500.0,1500.0,1500.0),new Vector3D(),new Vector3D(0.0,1.0,0.0));
                break;
            }
        }
        mouseDownListener(evt:any):void
        {
            //console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
            this.m_mouseDownBoo = true;
        }
        mouseUpListener(evt:any):void
        {
            //console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_mouseDownBoo = false;
        }
        mouseWheeelListener(evt:any):void
        {
            //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
            if(evt.wheelDeltaY < 0)
            {
                // zoom in
                this.m_rscene.getCamera().forward(-25.0);
            }
            else
            {
                // zoom out
                this.m_rscene.getCamera().forward(25.0);
            }
        }
        private updateMouseDrag():void
        {
            let dx:number = this.m_mouseX - this.m_stage3D.mouseX;
            let dy:number = this.m_mouseY - this.m_stage3D.mouseY;
            let abs_dx:number = Math.abs(dx);
            let abs_dy:number = Math.abs(dy);
            if(abs_dx > abs_dy)
            {
                if(abs_dx > 0.5)this.m_rscene.getCamera().swingHorizontal(dx * 0.002);
            }
            else
            {
                if(abs_dy > 0.5)this.m_rscene.getCamera().swingVertical(dy * 0.002);
            }
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
        }
        private updateLoad():void
        {
            if(this.m_delayAddEntitys.length > 0)
            {
                let len:number = this.m_delayAddEntitys.length;
                for(let i:number = 0; i < len; ++i)
                {
                    if(this.m_delayAddEntitys[i].getMesh() != null)
                    {
                        this.m_rscene.addEntity(this.m_delayAddEntitys[i]);
                        this.m_delayAddEntitys.splice(i,1);
                        --i;
                        --len;
                    }
                }
            }
        }
        run():void
        {
            this.m_statusDisp.update();
            //  this.updateLoad();
            //  if(this.m_mouseDownBoo)
            //  {
            //      this.updateMouseDrag();
            //  }
            this.m_rscene.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
            this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
            //this.m_rscene.reseizeViewPort();
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.cullingTest();
            this.m_rscene.run();

            //this.m_subScene.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
            this.m_subScene.runBegin();
            this.m_subScene.update();
            this.m_subScene.cullingTest();
            this.m_subScene.run();
            this.m_subScene.runEnd();

            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
        }
    }
}