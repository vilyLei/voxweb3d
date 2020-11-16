
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as Stage3DT from "../vox/display/Stage3D";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTexResLoaderT from "../vox/texture/ImageTexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as DivLogT from "../vox/utils/DivLog";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as MouseEvt3DDispatcherT from "../vox/event/MouseEvt3DDispatcher";
import * as BoxFrame3DT from "../vox/entity/BoxFrame3D";
import * as CameraZoomControllerT from "../voxeditor/control/CameraZoomController";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import Stage3D = Stage3DT.vox.display.Stage3D;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTexResLoader = ImageTexResLoaderT.vox.texture.ImageTexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import DivLog = DivLogT.vox.utils.DivLog;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;
import BoxFrame3D = BoxFrame3DT.vox.entity.BoxFrame3D;
import CameraZoomController = CameraZoomControllerT.voxeditor.control.CameraZoomController;

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
                boxFrame.setScaleXYZ(1.02,1.02,1.02);
                this.rscene.addEntity(boxFrame);
                DispCtrObj.FrameDispList.push( boxFrame );
                this.m_frameDisp = boxFrame;
            }
        }
        mouseMoveListener(evt:any):void
        {
            //this.createDisp(evt);
            if(this.m_frameDisp != null)
            {
                //this.m_frameDisp.setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
            }
        }
        mouseOverListener(evt:any):void
        {
            //  this.createDisp(evt);
            //  //console.log(this.name+", mouse over. this.m_frameDisp != null: "+(this.m_frameDisp != null));
            //  if(this.m_frameDisp != null)
            //  {
            //      //this.m_frameDisp.setVisible(true);
            //  }
        }
        mouseOutListener(evt:any):void
        {
            //  //console.log(this.name+", mouse out. this.m_frameDisp != null: "+(this.m_frameDisp != null));
            //  if(this.m_frameDisp != null)
            //  {
            //      this.m_frameDisp.setVisible(false);
            //  }
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
            //this.m_frameDisp.setRGB3f(Math.random() * 1.1,Math.random() * 1.1,Math.random() * 1.1);
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
    export class DemoMobileEvt
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTexResLoader = new ImageTexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_CameraZoomController:CameraZoomController = new CameraZoomController();
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        private initMobileEvt():void
        {
            let stage3D:Stage3D = this.m_rscene.getStage3D();
            stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheelListener);
            stage3D.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
            stage3D.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener);
        }
        mouseDownListener(evt:any):void
        {
            //this.m_rscene.getStage3D().mouseMultiUp([{x:0,y:0},{x:1,y:1}]);
            //console.log("mouseDown...");
            //this.m_rscene.setClearRGBColor3f(Math.random(), 0, 0);
        }
        mouseUpListener(evt:any):void
        {
            //console.log("mouseDown...");
            //this.m_rscene.setClearRGBColor3f(0, Math.random(), 0);
        }
        mouseMoveListener(evt:any):void
        {
            //console.log("mouseDown...");
            //this.m_rscene.setClearRGBColor3f(Math.random(), 0, Math.random());
        }
        mouseWheelListener(evt:any):void
        {
            //this.m_CameraZoomController.setMoevDistance(evt.wheelDeltaY * 0.5);
        }
        initialize():void
        {
            console.log("DemoMobileEvt::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                DivLog.SetDebugEnabled(false);
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                
                let rparam:RendererParam = new RendererParam("glcanvas");
                rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_rscene.enableMouseEvent(false);
                this.m_CameraZoomController.bindCamera(this.m_rscene.getCamera());
                this.m_CameraZoomController.initialize(this.m_rscene.getStage3D());

                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 10);

                //  //  // add common 3d display entity
                //  var plane:Plane3DEntity = new Plane3DEntity();
                //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //  this.m_rscene.addEntity(plane);
                //  return;
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                let i:number = 0;
                let ctrObj:DispCtrObj;
                let dispatcher:MouseEvt3DDispatcher;
                for(i = 0; i < 5; ++i)
                {
                    let box:Box3DEntity = new Box3DEntity();
                    box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                    //box.setXYZ(100,100,0);
                    box.setXYZ(800 * Math.random() - 400.0,800 * Math.random() - 400.0,800 * Math.random() - 400.0);
                    ctrObj = new DispCtrObj();
                    ctrObj.rscene = this.m_rscene;
                    box.name = "box_"+i;
                    ctrObj.name = box.name;
                    dispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
                    box.setEvtDispatcher(dispatcher);
                    box.mouseEnabled = true;
                    this.m_rscene.addEntity(box);
                }

                for(i = 0; i < 5; ++i)
                {
                    let sph:Sphere3DEntity = new Sphere3DEntity();
                    sph.initialize(150,20,20,[tex1]);
                    //sph.setXYZ(-100,-100,0);
                    sph.setXYZ(800 * Math.random() - 400.0,800 * Math.random() - 400.0,800 * Math.random() - 400.0);
                    ctrObj = new DispCtrObj();
                    ctrObj.rscene = this.m_rscene;
                    sph.name = "sph_"+i;
                    ctrObj.name = sph.name;
                    dispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,ctrObj,ctrObj.mouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,ctrObj,ctrObj.mouseUpListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OVER,ctrObj,ctrObj.mouseOverListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_OUT,ctrObj,ctrObj.mouseOutListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,ctrObj,ctrObj.mouseMoveListener);
                    sph.setEvtDispatcher(dispatcher);
                    sph.mouseEnabled = true;
                    this.m_rscene.addEntity(sph);
                }

                this.initMobileEvt();

            }
        }
        private m_lookAtPos:Vector3D = new Vector3D();
        run():void
        {
            // show fps status
            this.m_statusDisp.update();
            // 分帧加载
            this.m_texLoader.run();
            //this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
            // render begin
            this.m_rscene.runBegin();
            // run logic program
            this.m_rscene.update();
            this.m_rscene.run();
            // render end
            this.m_rscene.runEnd();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_CameraZoomController.run(this.m_lookAtPos, 50.0);
        }
    }
}