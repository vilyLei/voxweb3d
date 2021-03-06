
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import RendererScene from "../vox/scene/RendererScene";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";

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
            this.disp.getTransform().setRotationZ(this.disp.getTransform().getRotationZ() + 2.0);
            this.disp.update();
            console.log(this.name+", DispEvtevtCtrObj mouse down. ",evt.target);
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
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_stage3D:Stage3D = null;
        initialize():void
        {
            console.log("DemoOrtho::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                                
                this.m_statusDisp.initialize("rstatus");
                
                let rparam:RendererParam = new RendererParam();
                rparam.cameraPerspectiveEnabled = false;
                rparam.setAttriAntialias(true);
                rparam.setCamProject(45.0,10.1,3000.0);
                rparam.setCamPosition(0.0,0.0,1500.0);
                //rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam);
                this.m_stage3D = this.m_rscene.getStage3D() as Stage3D;
                
                this.m_rscene.enableMouseEvent(true);
                // align to left bottom
                this.m_rscene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
                
                this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
                let tex0:TextureProxy = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexByUrl("static/assets/warter_01.jpg");
                let tex3:TextureProxy = this.m_texLoader.getTexByUrl("static/assets/flare_core_02.jpg");                

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());
                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
                
                let i:number = 0;
                let plane:Plane3DEntity;

                for(i = 0; i < 1; ++i)
                {
                    plane = new Plane3DEntity();
                    //plane.showDoubleFace();
                    plane.initializeXOY(0.0,0.0,200.0,150.0,[tex0]);
                    //plane.setXYZ(i * 400.0,0.0,0.0);
                    this.m_rscene.addEntity(plane);
                    
                    this.useTex(plane);
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

                    this.useTex(box);

                }
                for(i = 0; i < 2; ++i)
                {
                    sphere = new Sphere3DEntity();
                    sphere.initialize(50.0,15,15,[tex1]);
                    sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_rscene.addEntity(sphere);

                    this.useTex(sphere);
                }
            }
        }
        private useTex(disp:DisplayEntity):void
        {
            let evtCtrObj:DispEvtevtCtrObj = new DispEvtevtCtrObj();
            evtCtrObj.disp = disp;
            let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
            dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,evtCtrObj,evtCtrObj.mouseDownListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_UP,evtCtrObj,evtCtrObj.mouseUpListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OVER,evtCtrObj,evtCtrObj.mouseOverListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OUT,evtCtrObj,evtCtrObj.mouseOutListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,evtCtrObj,evtCtrObj.mouseMoveListener);
            disp.setEvtDispatcher(dispatcher);
            disp.mouseEnabled = true;
        }
        mouseDownListener(evt:any):void
        {
            console.log("stage mouseDownListener.");
        }
        run():void
        {
            this.m_statusDisp.update();
            
            this.m_rscene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
            this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);

            this.m_rscene.run(true);

        }
    }
}