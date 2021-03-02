
import * as Vector3DT from "../vox/geom/Vector3";
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
import * as RayGpuSelectorT from "../vox/scene/RayGpuSelector";
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
import * as BoxFrame3DT from "../vox/entity/BoxFrame3D";
import * as AxisDragControllerT from "../voxeditor/control/AxisDragController";
import * as DragAxisT from "../voxeditor/entity/DragAxis";
import * as DragAxisQuad3DT from "../voxeditor/entity/DragAxisQuad3D";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as MouseEvt3DDispatcherT from "../vox/event/MouseEvt3DDispatcher";
import * as ObjData3DEntityT from "../vox/entity/ObjData3DEntity";

import Vector3D = Vector3DT.vox.geom.Vector3D;
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
import RayGpuSelector = RayGpuSelectorT.vox.scene.RayGpuSelector;
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
import BoxFrame3D = BoxFrame3DT.vox.entity.BoxFrame3D;
import AxisDragController = AxisDragControllerT.voxeditor.control.AxisDragController;
import DragAxis = DragAxisT.voxeditor.entity.DragAxis;
import DragAxisQuad3D = DragAxisQuad3DT.voxeditor.entity.DragAxisQuad3D;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;
import ObjData3DEntity = ObjData3DEntityT.vox.entity.ObjData3DEntity;


export namespace demo
{
    export class DispCtrObj
    {
        constructor()
        {
        }
        name:string = "";
        dispEntity:DisplayEntity = null;
        rscene:RendererScene = null;

        protected m_frameDisp:BoxFrame3D = null;
        //static MeshDragAxis:DragAxis = null;
        static MeshDragAxis:DragAxisQuad3D = null;
        static Draging:boolean = false;
        static SelectedCtrlObj:DispCtrObj = null;
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
            if(!DispCtrObj.Draging)
            {
                this.createDisp(evt);
                if(this.m_frameDisp != null)
                {
                    this.m_frameDisp.setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
                }
            }
        }
        mouseOverListener(evt:any):void
        {
            //console.log(this.name+", mouse over. this.m_frameDisp != null: "+(this.m_frameDisp != null));
            if(!DispCtrObj.Draging)
            {
                this.createDisp(evt);
                if(this.m_frameDisp != null)
                {
                    this.m_frameDisp.setVisible(true);
                }
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
        private m_downBoo:boolean = false;
        mouseDownListener(evt:any):void
        {
            this.createDisp(evt);
            console.log("DispCtrObj::mouseDownListener call.");
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
            DispCtrObj.SelectedCtrlObj = this;
            DispCtrObj.Draging = true;
        }
        mouseUpListener(evt:any):void
        {
            DispCtrObj.Draging = false;
            if(DispCtrObj.SelectedCtrlObj == this)
            {
                DispCtrObj.MeshDragAxis.setVisible(true);
                DispCtrObj.MeshDragAxis.targetEntity = this.dispEntity;
                if(this.dispEntity != null)
                {
                    DispCtrObj.MeshDragAxis.copyPositionFrom(this.dispEntity);
                    DispCtrObj.MeshDragAxis.update();
                }
            }
            console.log("DispCtrObj::mouseUpListener(), this.dispEntity != null."+(this.dispEntity != null));
        }
        destroy():void
        {
            this.rscene = null;
            this.m_frameDisp = null;
        }
        
        public updateDrag(rpv:Vector3D, rtv:Vector3D):void
        {
        }
        updateFrameBox():void
        {
            if(this.m_frameDisp != null && this.dispEntity != null)
            {
                this.m_frameDisp.updateFrameByAABB(this.dispEntity.getGlobalBounds());
            }
        }
    }
    export class AxisCtrlObj extends DispCtrObj
    {
        private m_controller:AxisDragController = new AxisDragController();
        static AxisSelectedObj:DispCtrObj = null;
        constructor()
        {
            super();
        }
        public updateDrag(rpv:Vector3D, rtv:Vector3D):void
        {
            if(DispCtrObj.Draging && this.dispEntity != null)
            {
                this.m_controller.updateDrag(rpv, rtv);
                this.updateFrameBox();
            }
        }
        mouseUpListener(evt:any):void
        {
            AxisCtrlObj.AxisSelectedObj = null;
        }
        mouseDownListener(evt:any):void
        {
            super.mouseDownListener(evt);
            DispCtrObj.MeshDragAxis.deselect();
            DispCtrObj.MeshDragAxis.setVisible(false);
            AxisCtrlObj.AxisSelectedObj = this;
            DispCtrObj.Draging = true;

            this.m_controller.targetEntity = this.dispEntity;
            this.m_controller.dragBegin(evt.lpos, evt.raypv,evt.raytv);            
            
        }
    }
    export class DemoMouseDrag
    {
        constructor()
        {
        }
        
        private m_rscene:RendererScene = null;
        private m_rspace:IRendererSpace = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        
        private m_profileInstance:ProfileInstance = null;//new ProfileInstance();
        private m_evtCtr:MouseEvt3DController = null;
        initialize():void
        {
            console.log("DemoMouseDrag::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/a_02_c.jpg");
                let tex6:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/metal_08.jpg");
                tex0.mipmapEnabled = true;
                tex1.mipmapEnabled = true;
                tex2.mipmapEnabled = true;
                tex3.mipmapEnabled = true;
                tex4.mipmapEnabled = true;
                tex5.mipmapEnabled = true;
                tex6.mipmapEnabled = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_rspace = this.m_rscene.getSpace();
                //this.m_rspace.setRaySelector( new RaySelector() );
                this.m_rspace.setRaySelector( new RayGpuSelector() );
                this.m_evtCtr = new MouseEvt3DController();
                this.m_rscene.setEvt3DController(this.m_evtCtr);
                //for test
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
                
                let axis:Axis3DEntity = null;
                //DispCtrObj.MeshDragAxis = new DragAxis();
                DispCtrObj.MeshDragAxis = new DragAxisQuad3D();

                let i:number = 0;
                let scaleK:number = 1.0;
                let ctrObj:DispCtrObj = null;
                let axisCtrObj:AxisCtrlObj = null;
                for(i = 0; i < 8; ++i)
                {
                    if(i > 0)
                    {
                        axisCtrObj = new AxisCtrlObj();
                        axisCtrObj.rscene = this.m_rscene;
                        axis = new Axis3DEntity();
                        axis.initialize(200.0 + Math.random() * 100.0);
                        axis.mouseEnabled = true;
                        axis.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                        axis.setScaleXYZ((Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK);
                        axis.setRotationXYZ(Math.random() * 500.0,Math.random() * 500.0,Math.random() * 500.0);
                        this.m_rscene.addEntity(axis);
                        axisCtrObj.dispEntity = axis;
                        axis.name = "axis_"+i;
                        axisCtrObj.name = axis.name;
                        let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,axisCtrObj,axisCtrObj.mouseDownListener);
                        dispatcher.addEventListener(MouseEvent.MOUSE_UP,axisCtrObj,axisCtrObj.mouseUpListener);
                        dispatcher.addEventListener(MouseEvent.MOUSE_OVER,axisCtrObj,axisCtrObj.mouseOverListener);
                        dispatcher.addEventListener(MouseEvent.MOUSE_OUT,axisCtrObj,axisCtrObj.mouseOutListener);
                        dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,axisCtrObj,axisCtrObj.mouseMoveListener);
                        axis.setEvtDispatcher(dispatcher);
                    }
                    else
                    {
                        //let saxis:Axis3DEntity = DispCtrObj.MeshDragAxis;
                        let saxis:DragAxisQuad3D = DispCtrObj.MeshDragAxis;
                        saxis.initialize(500.0,6.0);
                        this.m_rscene.addEntity(saxis); 
                    }
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
                    ctrObj.dispEntity = plane;
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

                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                total = 5;
                let box:Box3DEntity = null;
                for(i = 0; i < total; ++i)
                {
                    ctrObj = new DispCtrObj();
                    ctrObj.rscene = this.m_rscene;
                    box = new Box3DEntity();
                    ctrObj.dispEntity = box;
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
                        box.setRotationXYZ(Math.random() * 500.0,Math.random() * 500.0,Math.random() * 500.0);
                        //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                        cubeRange.calc();
                        box.setPosition(cubeRange.value);
                    }
                    else
                    {
                        box.setXYZ(150.0,0.0,0.0);
                    }
                    box.mouseEnabled = true;
                    this.m_rscene.addEntity(box);

                }
                let sph:Sphere3DEntity = null;
                for(i = 0; i < 5; ++i)
                {
                    ctrObj = new DispCtrObj();
                    ctrObj.rscene = this.m_rscene;
                    sph = new Sphere3DEntity();
                    ctrObj.dispEntity = sph;
                    sph.name = "sphere_"+i;
                    ctrObj.name = sph.name;
                    let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
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
                    this.m_rscene.addEntity(sph);
                }

                
                let objUrl:string = "assets/obj/box01.obj";
                objUrl = "assets/obj/building_001.obj";
                let objDisp:ObjData3DEntity = new ObjData3DEntity();
                objDisp.mouseEnabled = true;
                ctrObj = new DispCtrObj();
                ctrObj.rscene = this.m_rscene;
                ctrObj.dispEntity = objDisp;
                let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
                objDisp.setEvtDispatcher(dispatcher);

                objDisp.moduleScale = 3.0;
                objDisp.initializeByObjDataUrl(objUrl,[tex6]);
                objDisp.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                this.m_rscene.addEntity(objDisp);
            }
        }
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
                this.m_rscene.getCamera().forward(-25.0);
            }
            else
            {
                // zoom out
                this.m_rscene.getCamera().forward(25.0);
            }
        }
        private m_bgColor:Color4 = new Color4(0.0, 0.3, 0.1);
        private m_mouseDownBoo:boolean = false;
        private m_mouseUpBoo:boolean = false;
        // 鼠标动了, 摄像机动了, 被渲染对象本身动了,都可能形成mouse move事件
        mouseMoveListener(evt:any):void
        {
        }
        mouseDownListener(evt:any):void
        {
            this.m_bgColor.setRGB3f(0.4 * Math.random(),0.4 * Math.random(),0.4 * Math.random());
            this.m_mouseDownBoo = true;
            console.log("stage mouse down.");
        }
        mouseUpListener(evt:any):void
        {
            this.m_mouseUpBoo = true;
        }
        entityMouseDownListener(evt:any):void
        {
            //this.m_mouseDownBoo = true;
        }
        private m_rpv:Vector3D = new Vector3D();
        private m_rtv:Vector3D = new Vector3D();
        run():void
        {
            this.m_rscene.setClearRGBColor3f(this.m_bgColor.r,this.m_bgColor.g,this.m_bgColor.b);
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.run();
            this.mouseCtrUpdate();

            this.m_rscene.runEnd();
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
            
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
        }
        private mouseCtrUpdate():void
        {

            if(AxisCtrlObj.AxisSelectedObj != null)
            {
                this.m_rscene.getMouseXYWorldRay(this.m_rpv, this.m_rtv);
                AxisCtrlObj.AxisSelectedObj.updateDrag(this.m_rpv, this.m_rtv);
                DispCtrObj.Draging = true;
            }
            else if(DispCtrObj.MeshDragAxis.isSelected())
            {
                this.m_rscene.getMouseXYWorldRay(this.m_rpv, this.m_rtv);
                DispCtrObj.MeshDragAxis.updateDrag(this.m_rpv, this.m_rtv);
                DispCtrObj.Draging = true;
                if(DispCtrObj.SelectedCtrlObj != null)
                {
                    DispCtrObj.SelectedCtrlObj.updateFrameBox();
                }
            }
            if(this.m_mouseUpBoo)
            {
                this.m_mouseUpBoo = false;
                if(AxisCtrlObj.AxisSelectedObj != null)
                {
                    AxisCtrlObj.AxisSelectedObj = null;
                }
                DispCtrObj.MeshDragAxis.deselect();
                DispCtrObj.Draging = false;
            }
            if(this.m_mouseDownBoo)
            {
                this.m_mouseDownBoo = false;
                if(!this.m_evtCtr.isSelected())
                {
                    console.log("mouse down ready deselect.");
                    DispCtrObj.MeshDragAxis.setVisible(false);
                    //  DispCtrObj.SelectedCtrlObj = null;
                    DispCtrObj.Draging = false;
                }
            }
        }
    }
}