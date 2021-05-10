
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import { CubeRandomRange } from "../vox/utils/RandomRange";
import Color4 from "../vox/material/Color4";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import IRendererSpace from "../vox/scene/IRendererSpace";
import RendererScene from "../vox/scene/RendererScene";
import RayGpuSelector from "../vox/scene/RayGpuSelector";
import MouseEvt3DController from "../vox/scene/MouseEvt3DController";
import MouseEvent from "../vox/event/MouseEvent";
import EventBase from "../vox/event/EventBase";
import Stage3D from "../vox/display/Stage3D";
import H5FontSystem from "../vox/text/H5FontSys";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import AxisDragController from "../voxeditor/control/AxisDragController";
import DragAxis from "../voxeditor/entity/DragAxis";
import DragAxisQuad3D from "../voxeditor/entity/DragAxisQuad3D";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";

//import AxisDragController = AxisDragControllerT.voxeditor.control.AxisDragController;


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
                DispCtrObj.MeshDragAxis.bindTarget(this.dispEntity);
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
        constructor(){}
        
        private m_rscene:RendererScene = null;
        private m_rspace:IRendererSpace = null;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        
        private m_profileInstance:ProfileInstance;// = new ProfileInstance();
        private m_evtCtr:MouseEvt3DController = null;
        initialize():void
        {
            console.log("DemoMouseDrag::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setAttriAntialias(true);
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
                stage3D.addEventListener(MouseEvent.MOUSE_BG_DOWN,this,this.mouseBgDownListener);
                stage3D.addEventListener(MouseEvent.MOUSE_BG_UP,this,this.mouseBgUpListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

                
                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/a_02_c.jpg");
                let tex6:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/metal_08.jpg");
                tex0.mipmapEnabled = true;
                tex1.mipmapEnabled = true;
                tex2.mipmapEnabled = true;
                tex3.mipmapEnabled = true;
                tex4.mipmapEnabled = true;
                tex5.mipmapEnabled = true;
                tex6.mipmapEnabled = true;
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                this.m_rscene.updateCamera();

                let testAxis:Axis3DEntity = new Axis3DEntity();
                testAxis.initialize(300);
                //testAxis.setXYZ(-50.0,0.0,0.0);
                this.m_rscene.addEntity(testAxis);

                let pv:Vector3D = new Vector3D();
                

                let axis:Axis3DEntity = null;
                DispCtrObj.MeshDragAxis = new DragAxisQuad3D();

                let i:number = 0;
                let scaleK:number = 1.0;
                let ctrObj:DispCtrObj = null;
                let axisCtrObj:AxisCtrlObj = null;
                for(i = 0; i < 8; ++i)
                {
                    if(i > 0)
                    {
                        axis = new Axis3DEntity();
                        axis.initialize(200.0 + Math.random() * 100.0);
                        axis.mouseEnabled = true;
                        axis.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                        axis.setScaleXYZ((Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK);
                        axis.setRotationXYZ(Math.random() * 500.0,Math.random() * 500.0,Math.random() * 500.0);
                        this.m_rscene.addEntity(axis);
                        axis.name = "axis_"+i;

                        this.useEvt(axis);
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
                    plane = new Plane3DEntity();
                    plane.showDoubleFace();
                    plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                    plane.setXYZ(Math.random() * 3000.0 - 1500.0,Math.random() * 3000.0 - 1500.0,Math.random() * 2000.0 - 1000.0);
                    this.m_rscene.addEntity(plane);

                    this.useEvt(plane);
                }

                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                total = 5;
                let box:Box3DEntity = null;
                for(i = 0; i < total; ++i)
                {                    
                    box = new Box3DEntity();
                    this.useEvt(box);

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
                    this.m_rscene.addEntity(box);

                }
                let sph:Sphere3DEntity = null;
                for(i = 0; i < 5; ++i)
                {
                    sph = new Sphere3DEntity();
                    this.useEvt(sph);

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
                    this.m_rscene.addEntity(sph);
                }

                
                let objUrl:string = "static/assets/obj/box01.obj";
                objUrl = "static/assets/obj/building_001.obj";
                let objDisp:ObjData3DEntity = new ObjData3DEntity();
                this.useEvt(objDisp);
                objDisp.moduleScale = 3.0;
                objDisp.initializeByObjDataUrl(objUrl,[tex6]);
                objDisp.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                this.m_rscene.addEntity(objDisp);
            }
        }
        private useEvt(objDisp:DisplayEntity):void
        {
            objDisp.mouseEnabled = true;
            let ctrObj:DispCtrObj = new DispCtrObj();
            ctrObj.rscene = this.m_rscene;
            ctrObj.dispEntity = objDisp;
            let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
            dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
            //dispatcher.addEventListener(MouseEvent.MOUSE_BG_DOWN,ctrObj,ctrObj.mouseBgDownListener);
            objDisp.setEvtDispatcher(dispatcher);
        }
        stageResizeListener(evt:any):void
        {
            console.log("Demo stageResizeListener call, Stage resize().");
        }
        private mouseBgDownListener(evt:any):void
        {
            if(!this.m_evtCtr.isSelected())
            {
                console.log("mouseBgDownListener.");
                DispCtrObj.MeshDragAxis.setVisible(false);
                DispCtrObj.Draging = false;
            }
        }
        private mouseBgUpListener(evt:any):void
        {
            //  DispCtrObj.MeshDragAxis.deselect();
            //  DispCtrObj.Draging = false;
            //  AxisCtrlObj.AxisSelectedObj = null;
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
        private m_mouseUpBoo:boolean = false;
        // 鼠标动了, 摄像机动了, 被渲染对象本身动了,都可能形成mouse move事件
        mouseMoveListener(evt:any):void
        {
        }
        mouseDownListener(evt:any):void
        {
            if(evt.phase == 1)
            {
                this.m_bgColor.setRGB3f(0.4 * Math.random(),0.4 * Math.random(),0.4 * Math.random());
                console.log("stage mouse down.");
            }
        }
        mouseUpListener(evt:any):void
        {
            if(evt.phase == 1)
            {
                console.log("stage mouse up.");
                this.m_mouseUpBoo = true;

                //  //this.m_mouseUpBoo = false;
                //  AxisCtrlObj.AxisSelectedObj = null;
                //  DispCtrObj.MeshDragAxis.deselect();
                //  DispCtrObj.Draging = false;
            }
        }
        private m_rpv:Vector3D = new Vector3D();
        private m_rtv:Vector3D = new Vector3D();
        run():void
        {
            this.m_rscene.setClearColor(this.m_bgColor);
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.run();
            this.m_rscene.runEnd();
            this.mouseCtrUpdate();

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
                AxisCtrlObj.AxisSelectedObj = null;
                DispCtrObj.MeshDragAxis.deselect();
                DispCtrObj.Draging = false;
            }
        }
    }
}