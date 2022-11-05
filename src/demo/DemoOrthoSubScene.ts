
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import EventBase from "../vox/event/EventBase";
import KeyboardEvent from "../vox/event/KeyboardEvent";
import Stage3D from "../vox/display/Stage3D";
import RendererScene from "../vox/scene/RendererScene";
import RendererSubScene from '../vox/scene/RendererSubScene';

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";


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
            let mat:any = this.disp.getMaterial() as any;
            mat.setRGB3f(Math.random() * 1.2,Math.random() * 1.2,Math.random() * 1.2);
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
        this.disp.setRotationXYZ(0.0,0.0,this.disp.getTransform().getRotationZ() + 2.0);
        this.disp.update();
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
    constructor(){}
    
    private m_rscene:RendererScene = null;
    private m_subScene:RendererSubScene = null;
    private m_texLoader:ImageTextureLoader;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_entitys:DisplayEntity[] = [];
    private m_stage3D:Stage3D = null;
    initialize():void
    {
        console.log("DemoOrthoSubScene::initialize()......");
        if(this.m_rscene == null)
        {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            
            this.m_statusDisp.initialize();
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
            
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            
            let tex0 = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
            let tex1 = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
            let tex2 = this.m_texLoader.getTexByUrl("static/assets/warter_01.jpg");
            let tex3 = this.m_texLoader.getTexByUrl("static/assets/flare_core_02.jpg");

            this.m_rscene.enableMouseEvent(true);
            
            rparam = new RendererParam();
            rparam.cameraPerspectiveEnabled = false;
            //rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0,0.1,3000.0);
            rparam.setCamPosition(0.0,0.0,1500.0);
            let subScene:RendererSubScene = null;
            subScene = this.m_rscene.createSubScene() as RendererSubScene;
            subScene.initialize(rparam);
            subScene.enableMouseEvent(true);
            this.m_subScene = subScene;
            this.m_subScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
            this.m_subScene.getCamera().update();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
            this.m_rscene.addEventListener(EventBase.RESIZE,this,this.resizeListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);
            this.m_rscene.addEventListener(KeyboardEvent.KEY_DOWN,this,this.keyDownListener);
            this.m_rscene.addEventListener(KeyboardEvent.KEY_UP,this,this.keyUpListener);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
            
            let tar_axis:Axis3DEntity = new Axis3DEntity();
            tar_axis.initialize(100.0);
            tar_axis.setXYZ(100,100,0.0);
            this.m_subScene.addEntity(tar_axis);
            this.m_entitys.push(tar_axis);

            let i:number = 0;
            let plane:Plane3DEntity;
            
            for(i = 0; i < 1; ++i)
            {
                plane = new Plane3DEntity();
                plane.name = "plane_"+i;
                //plane.showDoubleFace();
                plane.initializeXOY(0.0,0.0,200.0,150.0,[tex0]);
                //this.m_rscene.addEntity(plane);
                plane.setXYZ(100.0,50.0,0.0);
                this.m_subScene.addEntity(plane);
                
                this.useEvt(plane);
            }
            
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(600.0);
            this.m_rscene.addEntity(axis);
            let box:Box3DEntity = null;
            let sphere:Sphere3DEntity = null;

            for(i = 0; i < 1; ++i)
            {
                box = new Box3DEntity(); 
                box.name = "box_"+i;
                box.initialize(new Vector3D(-50.0,-50.0,-50.0),new Vector3D(50.0,50.0,5.0),[tex1]);
                box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                this.m_rscene.addEntity(box);

                this.useEvt(box);

            }
            for(i = 0; i < 1; ++i)
            {
                sphere = new Sphere3DEntity();
                sphere.name = "sphere_"+i;
                sphere.initialize(110.0,15,15,[tex1]);
                //sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                this.m_rscene.addEntity(sphere);

                this.useEvt(sphere);
            }

        }
    }
    private useEvt(disp:DisplayEntity):void
    {

        let evtCtrObj:DispEvtevtCtrObj = new DispEvtevtCtrObj();
        evtCtrObj.disp = disp;
        evtCtrObj.name = disp.name;
        let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,evtCtrObj,evtCtrObj.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_UP,evtCtrObj,evtCtrObj.mouseUpListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER,evtCtrObj,evtCtrObj.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT,evtCtrObj,evtCtrObj.mouseOutListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,evtCtrObj,evtCtrObj.mouseMoveListener);
        disp.setEvtDispatcher(dispatcher);                    
        disp.mouseEnabled = true;
    }
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
        console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
        this.m_entitys[0].setXYZ(evt.mouseX,evt.mouseY,0.0);
        this.m_entitys[0].update();
    }
    mouseUpListener(evt:any):void
    {
        //console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
    }
    resizeListener(evt:any):void
    {
        this.m_rscene.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
        this.m_subScene.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
        this.m_subScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
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
    run():void
    {
        this.m_statusDisp.update();
        
        this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
        //this.m_rscene.reseizeViewPort();

        this.m_rscene.run(true);

        this.m_subScene.run(true);

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoOrthoSubScene;