
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import IRendererSpace from "../vox/scene/IRendererSpace";
import RendererScene from "../vox/scene/RendererScene";
import RendererSubScene from '../vox/scene/RendererSubScene';
import RaySelector from "../vox/scene/RaySelector";
import MouseEvt3DController from "../vox/scene/MouseEvt3DController";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import BoundsEntity from "../vox/entity/BoundsEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import BrokenLine3DEntity from "../vox/entity/BrokenLine3DEntity";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";
import ColorRectImgButton from "../orthoui/button/ColorRectImgButton";
import BoundsButton from "../orthoui/button/BoundsButton";


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
        
    }
    mouseOverListener(evt:any):void
    {
        console.log(this.name+", DispEvtevtCtrObj mouse over. ");
        if(this.disp != null)
        {
            let material:any = this.disp.getMaterial();
            material.setRGB3f(1.0,0.1,0.1);
        }
    }
    mouseOutListener(evt:any):void
    {
        console.log(this.name+", DispEvtevtCtrObj mouse out. ");
        if(this.disp != null)
        {
            let material:any = this.disp.getMaterial();
            material.setRGB3f(1.0,1.0,1.0);
        }
    }
    mouseDownListener(evt:any):void
    {
        console.log(this.name+", DispEvtevtCtrObj mouse down. ");
        if(this.disp != null)
        {
            let material:any = this.disp.getMaterial();
            material.setRGB3f(1.0,0.5,0.5);
        }
    }
    mouseUpListener(evt:any):void
    {
        console.log(this.name+", DispEvtevtCtrObj mouse up. ");
        if(this.disp != null)
        {
            let material:any = this.disp.getMaterial();
            material.setRGB3f(1.0,0.1,0.1);
        }
    }
    destory():void
    {
    }
}
export class DemoOrthoBtn
{
    constructor()
    {
    }
    
    private m_rscene:RendererScene = null;
    private m_subScene:RendererSubScene = null;
    private m_boundsLine:BrokenLine3DEntity = null;
    private m_texLoader:ImageTextureLoader;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_stage3D:Stage3D = null;
    initialize():void
    {
        console.log("DemoOrthoBtn::initialize()......");
        if(this.m_rscene == null)
        {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            
            this.m_statusDisp.initialize("rstatus");
            let rparam:RendererParam;
            rparam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0,50.0,6000.0);
            rparam.setCamPosition(1500.0,1500.0,1500.0);
            
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_stage3D = this.m_rscene.getStage3D() as Stage3D;

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            let tex0:TextureProxy = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
            let tex1:TextureProxy = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
            let tex2:TextureProxy = this.m_texLoader.getTexByUrl("static/assets/warter_01.jpg");
            let tex3:TextureProxy = this.m_texLoader.getTexByUrl("static/assets/fruit_01.jpg");

            let evtCtr:MouseEvt3DController = null;
            this.m_rscene.enableMouseEvent( true );
            //  this.m_rspace = this.m_rscene.getSpace();
            //  this.m_rspace.setRaySelector(new RayGpuSelector());
            //  //this.m_rspace.setRaySelector(new RaySelector());
            //  evtCtr = new MouseEvt3DController();
            //  this.m_rscene.setEvt3DController(evtCtr);
            
            rparam = new RendererParam();
            rparam.cameraPerspectiveEnabled = false;
            rparam.setCamProject(45.0,0.1,3000.0);
            rparam.setCamPosition(0.0,0.0,1500.0);
            let subScene:RendererSubScene = null;
            subScene = this.m_rscene.createSubScene();
            subScene.initialize(rparam);
            
            subScene.enableMouseEvent(false);
            this.m_subScene = subScene;
            // align to left bottom
            this.m_subScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth,this.m_stage3D.stageHalfHeight,1500.0);
            this.m_subScene.getCamera().update();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_CLICK,this,this.mouseClickListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOUBLE_CLICK,this,this.mouseDoubleClickListener);

            
            //  this.m_subScene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            //  this.m_subScene.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
            ///*
            let boundsBtn:BoundsButton = new BoundsButton();
            boundsBtn.initializeBtn2D(50.0,50.0);
            this.m_subScene.addEntity(boundsBtn);
            boundsBtn.addEventListener(MouseEvent.MOUSE_OVER,this,this.boundsBtnOverListener);
            boundsBtn.addEventListener(MouseEvent.MOUSE_OUT,this,this.boundsBtnOutListener);
            
            this.m_boundsLine = new BrokenLine3DEntity(true);
            this.m_boundsLine.initializeQuad(new Vector3D(),new Vector3D(50.0),new Vector3D(50.0,50.0),new Vector3D(0.0,50.0));
            this.m_subScene.addEntity(this.m_boundsLine);
            //return;
            //*/
            let imgBtn:ColorRectImgButton = new ColorRectImgButton();
            imgBtn.initialize(0.0,0.0,50.0,50.0,[tex3]);
            this.m_subScene.addEntity(imgBtn);
            imgBtn.setXY(80.0,60.0);

            //return;
            let i:number = 0;
            let j:number = 0;
            let plane:Plane3DEntity;
            
            for(i = 0; i < 2; ++i)
            {
                for(j = 0; j < 2; ++j)
                {
                    let pw:number = 100.0;
                    let ph:number = 80.0;
                    let px:number = 330.0 + (pw + 20.0) * j;
                    let py:number = 30.0 + (ph + 20.0) * i;
                    plane = new Plane3DEntity();
                    plane.name = "plane_"+i;
                    //plane.showDoubleFace();
                    plane.flipVerticalUV = true;
                    plane.initializeXOY(0.0,0.0,pw,ph,[tex0]);
                    plane.setXYZ(px,py,0.0);
                    this.m_subScene.addEntity(plane);
                    
                    let boundsMin:Vector3D = new Vector3D(0.0,0.0,0.0);
                    let boundsMax:Vector3D = new Vector3D(pw,ph,0.0);
                    // 作为不会被渲染的逻辑体对象，可以被遮挡剔除和射线拾取的过程处理
                    let boundsDisp:BoundsEntity = new BoundsEntity();
                    boundsDisp.name = "bounds_plane_"+i;
                    boundsDisp.initialize(boundsMin,boundsMax);
                    boundsDisp.setXYZ(px,py,0.0);
                    this.m_subScene.addEntity(boundsDisp);

                    this.useEvt(plane,boundsDisp);
                }
            }
            
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(600.0);
            this.m_rscene.addEntity(axis);
            let box:Box3DEntity = null;
            let sphere:Sphere3DEntity = null;

            for(i = 0; i < 3; ++i)
            {
                box = new Box3DEntity();
                box.name = "box_"+i;
                box.initialize(new Vector3D(-50.0,-50.0,-50.0),new Vector3D(50.0,50.0,5.0),[tex1]);
                box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                this.m_rscene.addEntity(box);

                this.useEvt(box);

            }
            for(i = 0; i < 3; ++i)
            {
                sphere = new Sphere3DEntity();
                sphere.name = "sphere_"+i;
                sphere.initialize(110.0,15,15,[tex1]);
                sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                this.m_rscene.addEntity(sphere);

                this.useEvt(sphere);
            }
        }
    }
    private useEvt(disp:DisplayEntity, evtTarget:any = null):void
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
        if(evtTarget != null)
        {
            evtTarget.setEvtDispatcher(dispatcher); 
        }else{
            
            disp.setEvtDispatcher(dispatcher); 
        }           
        disp.mouseEnabled = true;
    }
    boundsBtnOverListener(evt:any):void
    {
        console.log("boundsBtnOverListener call.");
        this.m_boundsLine.setRGB3f(1.0,0.5,0.5);
    }
    boundsBtnOutListener(evt:any):void
    {
        console.log("boundsBtnOutListener call.");
        this.m_boundsLine.setRGB3f(1.0,1.0,1.0);
    }
    mouseDoubleClickListener(evt:any):void
    {
        console.log("mouseDoubleClickListener call, this.m_rscene: "+this.m_rscene.toString());
    }
    mouseClickListener(evt:any):void
    {
        console.log("mouseClickListener call, this.m_rscene: "+this.m_rscene.toString());
    }
    mouseDownListener(evt:any):void
    {
        console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
    }
    mouseUpListener(evt:any):void
    {
        console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
    }
    run():void
    {
        this.m_statusDisp.update();
        //this.m_rscene.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
        this.m_rscene.setClearRGBColor3f(0.0, 0.5, 0.0);
        
        this.m_rscene.run(true);

        //this.m_subScene.setViewPort(0,0,this.m_stage3D.stageWidth,this.m_stage3D.stageHeight);
        this.m_subScene.run(true);

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoOrthoBtn;