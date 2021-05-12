
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
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
export class DemoMultiRendererScene {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rscene2: RendererSubScene = null;
    private m_uiScene: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_camTrack2: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_entitys: DisplayEntity[] = [];
    private m_stage3D: Stage3D = null;
    private m_dragVerticalLine: Plane3DEntity = null;
    private m_dragVerticalCtrl: DragLineControl = null;
    initialize(): void {
        console.log("DemoMultiRendererScene::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;

            this.m_statusDisp.initialize("rstatus", 180);

            let rparam: RendererParam;

            rparam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.enableMouseEvent(true);
            this.m_stage3D = this.m_rscene.getStage3D() as Stage3D;

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
            let tex2: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/warter_01.jpg");
            let tex3: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/caustics_02.jpg");
            let tex4: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/white.jpg");


            rparam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1200.0);
            this.m_rscene2 = this.m_rscene.createSubScene();
            this.m_rscene2.initialize(rparam);
            this.m_rscene2.enableMouseEvent(true);

            rparam = new RendererParam();
            rparam.cameraPerspectiveEnabled = false;
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(0.0, 0.0, 1500.0);
            let subScene: RendererSubScene = null;
            subScene = this.m_rscene.createSubScene();
            subScene.initialize(rparam);
            subScene.enableMouseEvent(true);
            this.m_uiScene = subScene;
            this.m_uiScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth, this.m_stage3D.stageHalfHeight, 1500.0);
            this.m_uiScene.getCamera().update();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            this.m_rscene.addEventListener(EventBase.RESIZE, this, this.resizeListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_WHEEL, this, this.mouseWheeelListener);
            this.m_rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDownListener);
            this.m_rscene.addEventListener(KeyboardEvent.KEY_UP, this, this.keyUpListener);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            
            this.m_camTrack2 = new CameraTrack();
            this.m_camTrack2.bindCamera(this.m_rscene2.getCamera());

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.RENDER_BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.RENDER_ALWAYS);

            let scrPlane:ScreenFixedAlignPlaneEntity = new ScreenFixedAlignPlaneEntity();
            scrPlane.showDoubleFace(true, true);
            scrPlane.initialize(-1.0, -1.0, 2.0, 2.0);
            (scrPlane.getMaterial() as any).setRGB3f(0.1,0.0,0.0);
            this.m_rscene.addEntity(scrPlane);
            
            let tar_axis: Axis3DEntity = new Axis3DEntity();
            tar_axis.initializeCross(100.0);
            tar_axis.setXYZ(100, 100, 0.0);
            this.m_uiScene.addEntity(tar_axis);
            this.m_entitys.push(tar_axis);

            let separator: Plane3DEntity;
            separator = new Plane3DEntity();
            separator.initializeXOY(0.0, 0.0, 4.0, 100.0, [tex4]);
            separator.setScaleXYZ(1.0, this.m_stage3D.stageHeight/100.0, 1.0);
            separator.setXYZ(Math.round(this.m_stage3D.stageWidth * 0.5), 0.0, 0.0);
            this.m_uiScene.addEntity(separator);
            this.m_dragVerticalCtrl = this.useDragXEvt(separator);
            this.m_dragVerticalCtrl.setRGB3f(0.8,0.8,0.8);
            this.m_dragVerticalCtrl.dragController.lockX(50,this.m_stage3D.stageWidth - 50);
            this.m_dragVerticalLine = separator;

            let plane: Plane3DEntity;
            let i: number = 0;

            for (i = 0; i < 1; ++i) {
                plane = new Plane3DEntity();
                plane.toBrightnessBlend(true,false)
                plane.initializeXOY(0.0, 0.0, 200.0, 150.0, [tex3]);
                plane.setXYZ(100.0, 50.0, 0.0);
                this.m_uiScene.addEntity(plane);
                this.useDragEvt(plane);
            }

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(600.0);
            this.m_rscene.addEntity( axis );

            axis = new Axis3DEntity();
            axis.initialize(600.0);
            this.m_rscene2.addEntity( axis );

            let box: Box3DEntity = null;
            let sphere: Sphere3DEntity = null;

            for (i = 0; i < 1; ++i) {
                box = new Box3DEntity();
                box.name = "box_" + i;
                box.initialize(new Vector3D(-50.0, -50.0, -50.0), new Vector3D(50.0, 50.0, 5.0), [tex1]);
                box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_rscene.addEntity(box);

                this.useEvt(box);

            }
            for (i = 0; i < 1; ++i) {
                box = new Box3DEntity();
                box.name = "box_subscene_" + i;
                box.initialize(new Vector3D(-50.0, -50.0, -50.0), new Vector3D(50.0, 50.0, 5.0), [tex2]);
                box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_rscene2.addEntity(box);
                this.useEvt(box);
            }
            for (i = 0; i < 1; ++i) {
                sphere = new Sphere3DEntity();
                sphere.name = "sphere_" + i;
                sphere.initialize(110.0, 15, 15, [tex1]);
                //sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                this.m_rscene.addEntity(sphere);

                this.useEvt(sphere);
            }
        }
    }
    private useDragEvt(disp: DisplayEntity): void {

        let evtCtrObj: DragLineControl = new DragLineControl();
        evtCtrObj.setStage3D(this.m_stage3D);
        evtCtrObj.bindTarget(disp);
        this.m_rscene.runnableQueue.addRunner(evtCtrObj);
    }
    private useDragXEvt(disp: DisplayEntity): DragLineControl {

        let evtCtrObj: DragLineControl = new DragLineControl();
        //evtCtrObj.dragController.lockX();
        evtCtrObj.setStage3D(this.m_stage3D);
        evtCtrObj.bindTarget(disp);
        this.m_rscene.runnableQueue.addRunner(evtCtrObj);
        return evtCtrObj;
    }
    private useEvt(disp: DisplayEntity): void {

        let evtCtrl:MouseEventEntityController = new MouseEventEntityController();
        evtCtrl.bindTarget(disp);
    }
    keyDownListener(evt: any): void {
        console.log("keyDownListener call, key: " + evt.key + ",repeat: " + evt.repeat);
    }
    keyUpListener(evt: any): void {
        console.log("keyUpListener call, key: " + evt.key + ",repeat: " + evt.repeat);
        switch (evt.key) {
            case "z":
                console.log("reset cam lookAt.");
                this.m_rscene.getCamera().lookAtRH(new Vector3D(1500.0, 1500.0, 1500.0), new Vector3D(), new Vector3D(0.0, 1.0, 0.0));
                break;
        }
    }
    mouseDownListener(evt: any): void {
        //  console.log("mouseDownListener call, this.m_rscene: " + this.m_rscene.toString());
        this.m_entitys[0].setXYZ(evt.mouseX, evt.mouseY, 0.0);
        this.m_entitys[0].update();
    }
    mouseUpListener(evt: any): void {
        //console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
    }
    resizeListener(evt: any): void {
        this.m_rscene.setViewPort(0, 0, this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
        this.m_uiScene.setViewPort(0, 0, this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
        this.m_uiScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth, this.m_stage3D.stageHalfHeight, 1500.0);
    }
    mouseWheeelListener(evt: any): void {
        //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
        if (evt.wheelDeltaY < 0) {
            // zoom in
            this.m_rscene.getCamera().forward(-25.0);
        }
        else {
            // zoom out
            this.m_rscene.getCamera().forward(25.0);
        }
    }
    private m_pos: Vector3D = new Vector3D();
    run(): void {
        this.m_statusDisp.update();

        this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.0);
        //if(this.m_dragVerticalCtrl != null) {

        this.m_dragVerticalCtrl.getPosition(this.m_pos);
        let maxX:number = this.m_pos.x;
        let minX:number = 0;//maxX - 200.0;
        minX = minX >= 0 ? minX:0;
        let width:number = maxX - minX;

        this.m_rscene.setViewPort(minX, 0, width, this.m_stage3D.stageHeight);
        //}
        this.m_rscene.run( true );
        if(this.m_rscene2 != null) {
            this.m_rscene2.setViewPort(maxX, 0, this.m_stage3D.stageWidth - width, this.m_stage3D.stageHeight);
            this.m_rscene2.run( true );
            this.m_camTrack2.rotationOffsetAngleWorldY( -0.1 );
        }

        if(this.m_uiScene != null) {
            this.m_uiScene.run( true );
        }

        this.m_camTrack.rotationOffsetAngleWorldY( -0.2 );
    }
}