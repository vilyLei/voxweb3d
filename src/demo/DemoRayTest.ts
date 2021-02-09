
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RandomRangeT from "../vox/utils/RandomRange";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as IRendererSpaceT from "../vox/scene/IRendererSpace";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RaySelectorT from "../vox/scene/RaySelector";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";
import * as H5FontSysT from "../vox/text/H5FontSys";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as BoundsEntityT from "../vox/entity/BoundsEntity";
import * as BillboardFrameT from "../vox/entity/BillboardFrame";
import * as BoxFrame3DT from "../vox/entity/BoxFrame3D";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RaySelectedNodeT from '../vox/scene/RaySelectedNode';
import * as IEvt3DDispatcherT from "../vox/event/IEvtDispatcher";
import * as MouseEvt3DDispatcherT from "../vox/event/MouseEvt3DDispatcher";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CubeRandomRange = RandomRangeT.vox.utils.CubeRandomRange;
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
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import H5FontSystem = H5FontSysT.vox.text.H5FontSystem;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import BoundsEntity = BoundsEntityT.vox.entity.BoundsEntity;
import BillboardFrame = BillboardFrameT.vox.entity.BillboardFrame;
import BoxFrame3D = BoxFrame3DT.vox.entity.BoxFrame3D;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RaySelectedNode = RaySelectedNodeT.vox.scene.RaySelectedNode;
import IEvtDispatcher = IEvt3DDispatcherT.vox.event.IEvtDispatcher;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;


export namespace demo
{
    class BoundsDispCtrObj
    {
        constructor()
        {
        }
        frameDisp:BoxFrame3D = null;
        mouseDownListener(evt:any):void
        {
            console.log("BoundsDispCtrObj::mouseDownListener call. this.frameDisp != null: "+(this.frameDisp != null));
            if(this.frameDisp != null)
            {
                this.frameDisp.setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
            }
        }
        initialize():void
        {
        }
    }
    class DispCtrObj
    {
        constructor()
        {
        }
        frameDisp:BoxFrame3D = null;
        frameDispList:BoxFrame3D[] = null;
        mouseDownListener(evt:any):void
        {
            //console.log("DispCtrObj::mouseDownListener call.");
            for(let i:number = 0; i < this.frameDispList.length; ++i)
            {
                if(this.frameDisp != this.frameDispList[i])
                {
                    this.frameDispList[i].setVisible(false);
                }
                else
                {
                    this.frameDispList[i].setVisible(true);
                    this.frameDispList[i].setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
                }
            }
        }
        initialize():void
        {
        }
    }
    export class DemoRayTest
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
        private m_frameList:BoxFrame3D[] = [];
        private m_raySelector:RaySelector = null;
        initialize():void
        {
            console.log("DemoRayTest::initialize()......");
            if(this.m_rscene == null)
            {
                H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/flare_core_02.jpg");
                let tex5:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/a_02_c.jpg");
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
                
                let stage3D:Stage3D = this.m_rscene.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                this.m_rscene.updateCamera();

                let dispatcher:MouseEvt3DDispatcher;
                let boundsCtr:BoundsDispCtrObj;
                let pv:Vector3D = new Vector3D();
                
                let boundsMin:Vector3D = new Vector3D(-200.0,-200.0,-200.0);
                let boundsMax:Vector3D = new Vector3D(200.0,200.0,200.0);
                
                let boxFrame:BoxFrame3D = new BoxFrame3D(true);
                boxFrame.initialize(boundsMin,boundsMax);
                this.m_rscene.addEntity(boxFrame);

                // 作为不会被渲染的逻辑体对象，可以被遮挡剔除和射线拾取
                let boundsDisp:BoundsEntity = new BoundsEntity();
                boundsDisp.initialize(boundsMin,boundsMax);
                this.m_rspace.addEntity(boundsDisp);
                boundsCtr = new BoundsDispCtrObj();
                boundsCtr.frameDisp = boxFrame;
                dispatcher = new MouseEvt3DDispatcher();
                dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,boundsCtr,boundsCtr.mouseDownListener);
                boundsDisp.setEvtDispatcher(dispatcher);

                //return;
                let cubeRange:CubeRandomRange = new CubeRandomRange();
                cubeRange.min.setXYZ(-400.0,-400.0,-400.0);
                cubeRange.max.setXYZ(400.0,400.0,400.0);
                cubeRange.initialize();

                let i:number = 0;
                let total:number = 3;
                this.m_profileInstance = new ProfileInstance();
                this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                let ctrObj:DispCtrObj = null;
                for(i = 0; i < 3; ++i)
                {
                    ctrObj = new DispCtrObj();
                    let plane:Plane3DEntity = new Plane3DEntity();
                    dispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    plane.setEvtDispatcher(dispatcher);
                    plane.name = "plane";
                    plane.showDoubleFace();
                    plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                    plane.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                    this.m_rscene.addEntity(plane);
                    plane.mouseEnabled = true;

                    let boxFrame:BoxFrame3D = new BoxFrame3D(true);
                    boxFrame.initialize(plane.getGlobalBounds().min,plane.getGlobalBounds().max);
                    boxFrame.setScaleXYZ(1.01,1.01,1.01);
                    this.m_rscene.addEntity(boxFrame);
                    this.m_frameList.push( boxFrame );
                    ctrObj.frameDisp = boxFrame;
                    ctrObj.frameDispList = this.m_frameList;
                }

                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                
                let box:Box3DEntity = null;
                for(i = 0; i < total; ++i)
                {
                    ctrObj = new DispCtrObj();
                    box = new Box3DEntity();
                    let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                    //dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.entityMouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    box.setEvtDispatcher(dispatcher);
                    if(srcBox != null)box.setMesh(srcBox.getMesh());
                    box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                    if(total > 1)
                    {
                        //box.setScaleXYZ((Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK,(Math.random() + 0.8) * scaleK);
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

                    let boxFrame:BoxFrame3D = new BoxFrame3D(true);
                    boxFrame.initialize(box.getGlobalBounds().min,box.getGlobalBounds().max);
                    boxFrame.setScaleXYZ(1.01,1.01,1.01);
                    this.m_rscene.addEntity(boxFrame);
                    this.m_frameList.push( boxFrame );
                    ctrObj.frameDisp = boxFrame;
                    ctrObj.frameDispList = this.m_frameList;
                }

            }
        }
        private m_flagBoo:boolean = true;
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
        private m_mouseEvt:MouseEvent = new MouseEvent();
        mouseUpListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_rscene.mouseRayTest();
            let dispatcher:IEvtDispatcher = null;
            console.log("this.m_raySelector.getSelectedNodesTotal(): "+this.m_raySelector.getSelectedNodesTotal());
            if(this.m_raySelector.getSelectedNodesTotal() > 0)
            {
                let nodes:RaySelectedNode[] = this.m_raySelector.getSelectedNodes();
                let entity:DisplayEntity = nodes[0].entity as DisplayEntity;
                dispatcher = entity.getEvtDispatcher(MouseEvent.EventClassType);
                let pv:Vector3D = nodes[0].wpv;
                //  let axis:Axis3DEntity = new Axis3DEntity();
                //  axis.initialize(70.0);
                //  axis.setPosition(pv);
                //  this.m_rscene.addEntity(axis);
                if(dispatcher != null)
                {
                    this.m_mouseEvt.target = entity;
                    this.m_mouseEvt.type = MouseEvent.MOUSE_DOWN;
                    this.m_mouseEvt.wpos.copyFrom(pv);
                    dispatcher.dispatchEvt(this.m_mouseEvt);
                }
            }
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
            //console.log("##-- begin");
            
            this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);
            this.m_rscene.runBegin();

            this.m_rscene.update();
            this.m_rscene.cullingTest();

            this.m_rscene.run();
            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rscene.updateCamera();
            
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
        }
    }
}