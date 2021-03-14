
import * as Vector3DT from "..//vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RandomRangeT from "../vox/utils/RandomRange";
import * as Color4T from "../vox/material/Color4";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as IRendererSpaceT from "../vox/scene/IRendererSpace";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RaySelectorT from "../vox/scene/RaySelector";
import * as MouseEvt3DControllerT from "../vox/scene/MouseEvt3DController";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as EventBaseT from "../vox/event/EventBase";
import * as Stage3DT from "../vox/display/Stage3D";
import * as H5FontSysT from "../vox/text/H5FontSys";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as BoundsEntityT from "../vox/entity/BoundsEntity";
import * as BillboardFrameT from "../vox/entity/BillboardFrame";
import * as BoxFrame3DT from "../vox/entity/BoxFrame3D";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as MouseEvt3DDispatcherT from "../vox/event/MouseEvt3DDispatcher";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CubeRandomRange = RandomRangeT.vox.utils.CubeRandomRange;
import Color4 = Color4T.vox.material.Color4;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RaySelector = RaySelectorT.vox.scene.RaySelector;
import MouseEvt3DController = MouseEvt3DControllerT.vox.scene.MouseEvt3DController;
import EventBase = EventBaseT.vox.event.EventBase;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import BoundsEntity = BoundsEntityT.vox.entity.BoundsEntity;
import BillboardFrame = BillboardFrameT.vox.entity.BillboardFrame;
import BoxFrame3D = BoxFrame3DT.vox.entity.BoxFrame3D;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;


export namespace demo
{
    export class DispCtrObj
    {
        constructor()
        {
        }
        name:string = "";
        rscene:RendererScene = null;
        private m_frameDisp:BoxFrame3D = null;

        static FrameDispList:BoxFrame3D[] = null;
        private createDisp(evt:any):void
        {
            if(this.rscene != null && this.m_frameDisp == null)
            {
                if(DispCtrObj.FrameDispList == null)DispCtrObj.FrameDispList = [];
                let boxFrame:BoxFrame3D = new BoxFrame3D(true);
                boxFrame.initialize(evt.target.getGlobalBounds().min,evt.target.getGlobalBounds().max);
                boxFrame.setScaleXYZ(1.01,1.01,1.01);
                this.rscene.addEntity(boxFrame);
                DispCtrObj.FrameDispList.push( boxFrame );
                this.m_frameDisp = boxFrame;
            }
        }
        mouseMoveListener(evt:any):void
        {
            this.createDisp(evt);
            if(this.m_frameDisp != null)
            {
                this.m_frameDisp.setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
            }
        }
        mouseOverListener(evt:any):void
        {
            this.createDisp(evt);
            //console.log(this.name+", mouse over. this.m_frameDisp != null: "+(this.m_frameDisp != null));
            if(this.m_frameDisp != null)
            {
                this.m_frameDisp.setVisible(true);
            }
        }
        mouseOutListener(evt:any):void
        {
            //console.log(this.name+", mouse out. this.m_frameDisp != null: "+(this.m_frameDisp != null));
            if(this.m_frameDisp != null)
            {
                this.m_frameDisp.setVisible(false);
            }
        }
        mouseDownListener(evt:any):void
        {
            this.createDisp(evt);
            //console.log("DispCtrObj::mouseDownListener call.");
            let list:BoxFrame3D[] = DispCtrObj.FrameDispList;
            for(let i:number = 0; i < list.length; ++i)
            {
                if(this.m_frameDisp != list[i])
                {
                    list[i].setVisible(false);
                }
                else if(list[i] != null)
                {
                    list[i].setVisible(true);
                    list[i].setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
                }
            }
            
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(70.0);
            axis.setPosition(evt.wpos);
            this.rscene.addEntity(axis);
        }
        mouseUpListener(evt:any):void
        {
        }
        destory():void
        {
            this.rscene = null;
            this.m_frameDisp = null;
            //this.frameDispList = null;
        }
    }
    export class DemoMouseEvent
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_rspace:IRendererSpace = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_dispList:DisplayEntity[] = [];
        //private m_frameList:BoxFrame3D[] = [];
        private m_raySelector:RaySelector = null;
        initialize():void
        {
            console.log("DemoMouseEvent::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/a_02_c.jpg");
                tex0.mipmapEnabled = true;
                tex1.mipmapEnabled = true;
                tex2.mipmapEnabled = true;
                tex3.mipmapEnabled = true;
                tex4.mipmapEnabled = true;
                tex5.mipmapEnabled = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rspace = this.m_rscene.getSpace();
                this.m_raySelector = new RaySelector();
                this.m_rspace.setRaySelector(this.m_raySelector);
                let evtCtr:MouseEvt3DController = new MouseEvt3DController();
                this.m_rscene.setEvt3DController(evtCtr);
                
                let stage3D:Stage3D = this.m_rscene.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                stage3D.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                stage3D.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener);
                stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                stage3D.addEventListener(EventBase.RESIZE,this,this.stageResizeListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                this.m_rscene.updateCamera();

                let pv:Vector3D = new Vector3D();
                
                //  let boundsMin:Vector3D = new Vector3D(-200.0,-200.0,-200.0);
                //  let boundsMax:Vector3D = new Vector3D(200.0,200.0,200.0);
                //  // 作为不会被渲染的逻辑体对象，可以被遮挡剔除和射线拾取的过程处理
                //  let boundsDisp:BoundsEntity = new BoundsEntity();
                //  boundsDisp.initializeBox(boundsMin,boundsMax);
                //  this.m_rspace.addEntity(boundsDisp);
                //  let boxFrame:BoxFrame3D = new BoxFrame3D();
                //  boxFrame.initialize(boundsMin,boundsMax);
                //  this.m_rscene.addEntity(boxFrame);
                //return;
                
                let i:number = 0;
                let scaleK:number = 1.0;
                let ctrObj:DispCtrObj = null;
                for(i = 0; i < 8; ++i)
                {
                    ctrObj = new DispCtrObj();
                    ctrObj.rscene = this.m_rscene;
                    let axis:Axis3DEntity = new Axis3DEntity();
                    axis.initialize(200.0 + Math.random() * 100.0);
                    axis.mouseEnabled = true;
                    axis.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    axis.setScaleXYZ((Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK);
                    axis.setRotationXYZ(Math.random() * 500.0,Math.random() * 500.0,Math.random() * 500.0);
                    this.m_rscene.addEntity(axis);
                    axis.name = "axis_"+i;
                    ctrObj.name = axis.name;
                    let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
                    axis.setEvtDispatcher(dispatcher);
                }

                //return;
                let cubeRange:CubeRandomRange = new CubeRandomRange();
                cubeRange.min.setXYZ(-400.0,-400.0,-400.0);
                cubeRange.max.setXYZ(400.0,400.0,400.0);
                cubeRange.initialize();

                let total:number = 3;
                this.m_profileInstance = new ProfileInstance();
                this.m_profileInstance.initialize(this.m_rscene.getRenderer());

                let plane:Plane3DEntity = null;
                for(i = 0; i < 5; ++i)
                {
                    ctrObj = new DispCtrObj();
                    ctrObj.rscene = this.m_rscene;
                    plane = new Plane3DEntity();
                    plane.name = "plane_"+i;
                    ctrObj.name = plane.name;
                    let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
                    plane.setEvtDispatcher(dispatcher);
                    plane.showDoubleFace();
                    plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                    plane.setXYZ(Math.random() * 3000.0 - 1500.0,Math.random() * 3000.0 - 1500.0,Math.random() * 2000.0 - 1000.0);
                    this.m_rscene.addEntity(plane);
                    plane.mouseEnabled = true;
                }

                for(i = 0; i < 1; ++i)
                {
                    plane = new Plane3DEntity();
                    //  ctrObj = new DispCtrObj();
                    //  ctrObj.rscene = this.m_rscene;
                    //  plane.name = "plane_"+i;
                    //  ctrObj.name = plane.name;
                    //  let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                    //  dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    //  dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
                    //  dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
                    //  dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
                    //  dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
                    //  plane.setEvtDispatcher(dispatcher);
                    plane.showDoubleFace();
                    plane.initializeXOY(-800.0,-800.0,1600.0,1600.0,[tex3]);
                    plane.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                    this.m_rscene.addEntity(plane,1);
                    plane.mouseEnabled = true;
                }

                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                
                let box:Box3DEntity = null;
                for(i = 0; i < 5; ++i)
                {
                    ctrObj = new DispCtrObj();
                    ctrObj.rscene = this.m_rscene;
                    box = new Box3DEntity();
                    box.name = "box_"+i;
                    ctrObj.name = box.name;
                    let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                    //dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.entityMouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
                    box.setEvtDispatcher(dispatcher);
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                    if(total > 1)
                    {
                        box.setScaleXYZ((Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK);
                        //box.setRotationXYZ(Math.random() * 500.0,Math.random() * 500.0,Math.random() * 500.0);
                        //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                        cubeRange.calc();
                        box.setPosition(cubeRange.value);
                    }
                    else
                    {
                        box.setXYZ(150.0,0.0,0.0);
                    }
                    box.mouseEnabled = true;
                    //box.spaceCullMask |= SpaceCullingMasK.POV;
                    this.m_rscene.addEntity(box);
                    box.getPosition(pv);

                }
                let sph:Sphere3DEntity = null;
                for(i = 0; i < 5; ++i)
                {
                    ctrObj = new DispCtrObj();
                    ctrObj.rscene = this.m_rscene;
                    sph = new Sphere3DEntity();
                    sph.name = "sphere_"+i;
                    ctrObj.name = sph.name;
                    let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                    //dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.entityMouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
                    sph.setEvtDispatcher(dispatcher);
                    sph.initialize(100,20,20,[tex1]);
                    if(total > 1)
                    {
                        cubeRange.calc();
                        sph.setPosition(cubeRange.value);
                    }
                    else
                    {
                        sph.setXYZ(150.0,0.0,0.0);
                    }
                    sph.mouseEnabled = true;
                    //box.spaceCullMask |= SpaceCullingMasK.POV;
                    this.m_rscene.addEntity(sph);
                    sph.getPosition(pv);
                }

                let x_pv0:Vector3D = new Vector3D(300,-90,500.0);
                let x_pv1:Vector3D = new Vector3D();
                x_pv1.copyFrom(x_pv0);
                let x_nv:Vector3D = new Vector3D(Math.random(),Math.random(),Math.random());
                x_nv.normalize();
                x_pv1.multBy(x_nv);
                x_pv0.w = x_pv0.dot(x_nv);
                x_pv0.copyFrom(x_nv);
                x_pv0.scaleBy(x_pv0.w);

                console.log(">>>>>>>>>>>> x_pv0: "+x_pv0.toString());
                console.log(">>>>>>>>>>>> x_pv1: "+x_pv1.toString());

            }
        }
        private m_flagBoo:boolean = true;
        stageResizeListener(evt:any):void
        {
            console.log("Demo stageResizeListener call, Stage resize().");
        }
        mouseWheeelListener(evt:any):void
        {
            //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
            if(evt.wheelDeltaY < 0)
            {
                // zoom in
                ///this.m_rscene.getCamera().forward(-125.0);
            }
            else
            {
                // zoom out
                //this.m_rscene.getCamera().forward(125.0);
            }
        }
        private m_bgColor:Color4 = new Color4(0.0, 0.3, 0.1);
        private m_mouseEvt:MouseEvent = new MouseEvent();
        // 鼠标动了, 摄像机动了, 被渲染对象本身动了,都可能形成mouse move事件
        mouseMoveListener(evt:any):void
        {
            this.m_mouseEvt.type = evt.type;
            this.m_mouseEvt.mouseX = evt.mouseX;
            this.m_mouseEvt.mouseY = evt.mouseY;
            //console.log("mouseMove,evt.type: "+evt.type);
        }
        mouseDownListener(evt:any):void
        {
            this.m_mouseEvt.type = evt.type;
            this.m_mouseEvt.mouseX = evt.mouseX;
            this.m_mouseEvt.mouseY = evt.mouseY;
            this.m_bgColor.setRGB3f(0.4 * Math.random(),0.4 * Math.random(),0.4 * Math.random());
        }
        mouseUpListener(evt:any):void
        {
            this.m_mouseEvt.type = evt.type;
            this.m_mouseEvt.mouseX = evt.mouseX;
            this.m_mouseEvt.mouseY = evt.mouseY;
        }
        entityMouseDownListener(evt:any):void
        {
            console.log("entityMouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(70.0);
            axis.setPosition(evt.wpos);
            this.m_rscene.addEntity(axis);
        }
        run():void
        {
            this.m_rscene.setClearRGBColor3f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b);
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.cullingTest();
            this.m_rscene.run();

            //  this.m_rscene.setViewPort(150,200,200,100);
            //  this.m_rscene.update();
            //  this.m_rscene.cullingTest();
            //  this.m_rscene.reseizeViewPort();
            //  this.m_rscene.runAt(0);
            //  this.m_rscene.setViewPort(100,150,400,200);
            //  this.m_rscene.reseizeRCViewPort();
            //  this.m_rscene.runAt(1);

            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
            
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
            this.m_mouseEvt.type = 0;
        }
    }
}