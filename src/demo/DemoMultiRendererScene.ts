
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
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
import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

import MouseDragEntityController from "../orthoui/ctrl/MouseDragEntityController";
import MouseEventEntityController from "../voxeditor/control/MouseEventEntityController";
import Color4 from "../vox/material/Color4";

class DragLineControl extends MouseDragEntityController {
    private m_color:Color4 = new Color4();
    constructor() {
        super();
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_color.setRGB3f(pr, pg, pb);  
        if (this.m_targetEntity != null) {
            let m: any = this.m_targetEntity.getMaterial() as any;
            m.setRGB3f(pr,pg,pb);
        }
    }
    protected mouseOverListener(evt: any): void {
        if (this.m_targetEntity != null) {
            let m: any = this.m_targetEntity.getMaterial() as any;
            m.setRGB3f(1.0,0.0,0.0);
        }
    }
    protected mouseOutListener(evt: any): void {

        if (this.m_targetEntity != null) {
            let m: any = this.m_targetEntity.getMaterial() as any;
            m.setRGB3f(this.m_color.r, this.m_color.g, this.m_color.b);
        }
    }
}

class LeftScene {
    private m_rendererScene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    constructor() {
        
    }
    initialize(rscene: RendererScene, texLoader: ImageTextureLoader): void {

        this.m_rendererScene = rscene;
        this.m_texLoader = texLoader;

        let tex0: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
        let tex1: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(600.0);
        this.m_rendererScene.addEntity( axis );
        let i: number = 0;
        let box: Box3DEntity;
        for (i = 0; i < 1; ++i) {
            box = new Box3DEntity();
            box.name = "box_" + i;
            box.initialize(new Vector3D(-50.0, -50.0, -50.0), new Vector3D(50.0, 50.0, 5.0), [tex1]);
            box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
            this.m_rendererScene.addEntity(box);

            this.useEvt(box);
        }
        let sphere: Sphere3DEntity;
        for (i = 0; i < 1; ++i) {
            sphere = new Sphere3DEntity();
            sphere.name = "sphere_" + i;
            sphere.initialize(110.0, 15, 15, [tex0]);
            sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
            this.m_rendererScene.addEntity(sphere);

            this.useEvt(sphere);
        }
    }
    
    private useEvt(disp: DisplayEntity): void {

        let evtCtrl:MouseEventEntityController = new MouseEventEntityController();
        evtCtrl.bindTarget(disp);
    }
}

class RightScene {
    private m_rendererScene: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader;
    constructor() {
        
    }
    initialize(rscene: RendererSubScene, texLoader: ImageTextureLoader): void {

        this.m_rendererScene = rscene;
        this.m_texLoader = texLoader;

        let tex1: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
        let tex2: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/warter_01.jpg");

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(600.0);
        this.m_rendererScene.addEntity( axis );
        let i: number = 0;
        let box: Box3DEntity;
        for (i = 0; i < 1; ++i) {
            box = new Box3DEntity();
            box.name = "box_" + i;
            box.initialize(new Vector3D(-50.0, -50.0, -50.0), new Vector3D(50.0, 50.0, 5.0), [tex2]);
            box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
            this.m_rendererScene.addEntity(box);

            this.useEvt(box);
        }
        let sphere: Sphere3DEntity;
        for (i = 0; i < 1; ++i) {
            sphere = new Sphere3DEntity();
            sphere.name = "sphere_" + i;
            sphere.initialize(110.0, 15, 15, [tex1]);
            sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
            this.m_rendererScene.addEntity(sphere);

            this.useEvt(sphere);
        }
    }
    
    private useEvt(disp: DisplayEntity): void {

        let evtCtrl:MouseEventEntityController = new MouseEventEntityController();
        evtCtrl.bindTarget(disp);
    }
}
class UIScene {
    private m_rendererScene: RendererSubScene = null;
    private m_mainRScene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_stage3D:Stage3D = null;

    targetAxis: Axis3DEntity = null;
    horizontalDivision: DragLineControl = null;
    constructor() {
    }
    initialize(mainRScene: RendererScene, rscene: RendererSubScene, texLoader: ImageTextureLoader): void {

        this.m_mainRScene = mainRScene;
        this.m_rendererScene = rscene;
        this.m_texLoader = texLoader;

        let tex3: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/caustics_02.jpg");
        let tex4: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/white.jpg");
        
        let stage3D:Stage3D = this.m_rendererScene.getStage3D() as Stage3D;
        this.m_stage3D = stage3D;
        let tar_axis: Axis3DEntity = new Axis3DEntity();
        tar_axis.initializeCross(100.0);
        tar_axis.setXYZ(100, 100, 0.0);
        this.m_rendererScene.addEntity(tar_axis);
        this.targetAxis = tar_axis;
        
        let separator: Plane3DEntity;
        separator = new Plane3DEntity();
        separator.initializeXOY(0.0, 0.0, 4.0, 100.0, [tex4]);
        separator.setScaleXYZ(1.0, stage3D.stageHeight/100.0, 1.0);
        separator.setXYZ(Math.round(stage3D.stageWidth * 0.5), 0.0, 0.0);
        this.m_rendererScene.addEntity(separator);
        this.horizontalDivision = this.useDragXEvt(separator);
        this.horizontalDivision.setRGB3f(0.8,0.8,0.8);
        this.horizontalDivision.dragController.lockX(50, stage3D.stageWidth - 50);

        let plane: Plane3DEntity;
        let i: number = 0;

        for (i = 0; i < 1; ++i) {
            plane = new Plane3DEntity();
            plane.toBrightnessBlend(true,false);
            plane.initializeXOY(0.0, 0.0, 200.0, 150.0, [tex3]);
            plane.setXYZ(100.0, 50.0, 0.0);
            this.m_rendererScene.addEntity(plane);
            this.useDragEvt(plane);
        }
    }
    
    private useDragEvt(disp: DisplayEntity): void {

        let evtCtrObj: DragLineControl = new DragLineControl();
        evtCtrObj.setStage3D(this.m_stage3D);
        evtCtrObj.bindTarget(disp);
        this.m_mainRScene.runnableQueue.addRunner(evtCtrObj);
    }
    private useDragXEvt(disp: DisplayEntity): DragLineControl {

        let evtCtrObj: DragLineControl = new DragLineControl();
        //evtCtrObj.dragController.lockX();
        evtCtrObj.setStage3D(this.m_stage3D);
        evtCtrObj.bindTarget(disp);
        this.m_mainRScene.runnableQueue.addRunner(evtCtrObj);
        return evtCtrObj;
    }
}
export class DemoMultiRendererScene {
    constructor() { }

    private m_rendererLeftScene: RendererScene = null;
    private m_rendererRightScene: RendererSubScene = null;
    private m_rendererUIScene: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_camTrack2: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stage3D: Stage3D = null;
    
    private m_leftScene:LeftScene = new LeftScene();
    private m_rightScene:RightScene = new RightScene();
    private m_uiScene:UIScene = new UIScene();
    initialize(): void {
        console.log("DemoMultiRendererScene::initialize()......");
        if (this.m_rendererLeftScene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            this.m_statusDisp.initialize();

            let rparam: RendererParam;

            rparam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rendererLeftScene = new RendererScene();
            this.m_rendererLeftScene.initialize(rparam);
            this.m_rendererLeftScene.enableMouseEvent(true);
            this.m_stage3D = this.m_rendererLeftScene.getStage3D() as Stage3D;

            this.m_texLoader = new ImageTextureLoader(this.m_rendererLeftScene.textureBlock);

            rparam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1200.0);
            this.m_rendererRightScene = this.m_rendererLeftScene.createSubScene();
            this.m_rendererRightScene.initialize(rparam);
            this.m_rendererRightScene.enableMouseEvent(true);

            rparam = new RendererParam();
            rparam.cameraPerspectiveEnabled = false;
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(0.0, 0.0, 1500.0);
            let subScene: RendererSubScene = null;
            subScene = this.m_rendererLeftScene.createSubScene();
            subScene.initialize(rparam);
            subScene.enableMouseEvent(true);
            this.m_rendererUIScene = subScene;
            this.m_rendererUIScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth, this.m_stage3D.stageHalfHeight, 1500.0);
            this.m_rendererUIScene.getCamera().update();

            this.m_rendererLeftScene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_rendererLeftScene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            this.m_rendererLeftScene.addEventListener(EventBase.RESIZE, this, this.resizeListener);
            this.m_rendererLeftScene.addEventListener(MouseEvent.MOUSE_WHEEL, this, this.mouseWheeelListener);
            this.m_rendererLeftScene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDownListener);
            this.m_rendererLeftScene.addEventListener(KeyboardEvent.KEY_UP, this, this.keyUpListener);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rendererLeftScene.getCamera());

            this.m_camTrack2 = new CameraTrack();
            this.m_camTrack2.bindCamera(this.m_rendererRightScene.getCamera());

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
            
            this.m_leftScene.initialize(this.m_rendererLeftScene,this.m_texLoader);
            this.m_rightScene.initialize(this.m_rendererRightScene,this.m_texLoader);
            this.m_uiScene.initialize(this.m_rendererLeftScene, this.m_rendererUIScene, this.m_texLoader);
        }
    }
    keyDownListener(evt: any): void {
        console.log("keyDownListener call, key: " + evt.key + ",repeat: " + evt.repeat);
    }
    keyUpListener(evt: any): void {
        console.log("keyUpListener call, key: " + evt.key + ",repeat: " + evt.repeat);
        switch (evt.key) {
            case "z":
                console.log("reset cam lookAt.");
                this.m_rendererLeftScene.getCamera().lookAtRH(new Vector3D(1500.0, 1500.0, 1500.0), new Vector3D(), new Vector3D(0.0, 1.0, 0.0));
                break;
        }
    }
    mouseDownListener(evt: any): void {
        //  console.log("mouseDownListener call, this.m_rendererLeftScene: " + this.m_rendererLeftScene.toString());
        this.m_uiScene.targetAxis.setXYZ(evt.mouseX, evt.mouseY, 0.0);
        this.m_uiScene.targetAxis.update();
    }
    mouseUpListener(evt: any): void {
        //console.log("mouseUpListener call, this.m_rendererLeftScene: "+this.m_rendererLeftScene.toString());
    }
    resizeListener(evt: any): void {
        this.m_rendererLeftScene.setViewPort(0, 0, this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
        this.m_rendererUIScene.setViewPort(0, 0, this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
        this.m_rendererUIScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth, this.m_stage3D.stageHalfHeight, 1500.0);
    }
    mouseWheeelListener(evt: any): void {
        //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
        if (evt.wheelDeltaY < 0) {
            // zoom in
            this.m_rendererLeftScene.getCamera().forward(-25.0);
        }
        else {
            // zoom out
            this.m_rendererLeftScene.getCamera().forward(25.0);
        }
    }
    private m_pos: Vector3D = new Vector3D();
    
    run(): void {
        this.m_statusDisp.update();

        this.m_rendererLeftScene.setClearRGBColor3f(0.0, 0.1, 0.0);

        this.m_uiScene.horizontalDivision.getPosition(this.m_pos);
        let maxX:number = this.m_pos.x;
        let minX:number = 0;//maxX - 200.0;
        minX = minX >= 0 ? minX:0;
        let width:number = maxX - minX;

        this.m_rendererLeftScene.setViewPort(minX, 0, width, this.m_stage3D.stageHeight);
        this.m_rendererRightScene.setViewPort(maxX, 0, this.m_stage3D.stageWidth - width, this.m_stage3D.stageHeight);
        
        let pickFlag:boolean = true;
        //this.m_rendererLeftScene.renderContextBegin();

        /////////////////////////////////////////////////////// ---- mouseTest begin.
        this.m_rendererUIScene.runBegin(true,true);
        this.m_rendererUIScene.update(false,true);
        pickFlag = this.m_rendererUIScene.isRayPickSelected();

        this.m_rendererLeftScene.runBegin(false);
        this.m_rendererLeftScene.update(false, !pickFlag);
        pickFlag = pickFlag || this.m_rendererLeftScene.isRayPickSelected();

        this.m_rendererRightScene.runBegin(true);
        this.m_rendererRightScene.update(false, !pickFlag);
        /////////////////////////////////////////////////////// ---- mouseTest end.


        /////////////////////////////////////////////////////// ---- rendering begin.
        this.m_rendererLeftScene.renderBegin();
        this.m_rendererLeftScene.run( false );
        this.m_rendererLeftScene.runEnd();

        this.m_rendererRightScene.renderBegin();
        this.m_rendererRightScene.run( false );
        this.m_rendererRightScene.runEnd();

        this.m_rendererUIScene.renderBegin();
        this.m_rendererUIScene.run( false );
        this.m_rendererUIScene.runEnd();
        /////////////////////////////////////////////////////// ---- rendering end.

        this.m_camTrack.rotationOffsetAngleWorldY( -0.2 );
        this.m_camTrack2.rotationOffsetAngleWorldY( -0.1 );
    }
    ///*
    run2(): void {
        this.m_statusDisp.update();

        this.m_rendererLeftScene.setClearRGBColor3f(0.0, 0.1, 0.0);

        this.m_uiScene.horizontalDivision.getPosition(this.m_pos);
        let maxX:number = this.m_pos.x;
        let minX:number = 0;//maxX - 200.0;
        minX = minX >= 0 ? minX:0;
        let width:number = maxX - minX;

        this.m_rendererLeftScene.setViewPort(minX, 0, width, this.m_stage3D.stageHeight);
        
        this.m_rendererLeftScene.run( true );
        if(this.m_rendererRightScene != null) {
            this.m_rendererRightScene.setViewPort(maxX, 0, this.m_stage3D.stageWidth - width, this.m_stage3D.stageHeight);
            this.m_rendererRightScene.run( true );
            this.m_camTrack2.rotationOffsetAngleWorldY( -0.1 );
        }

        if(this.m_rendererUIScene != null) {
            this.m_rendererUIScene.run( true );
        }

        this.m_camTrack.rotationOffsetAngleWorldY( -0.2 );
    }
    //*/
}