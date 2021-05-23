
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
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

class DragLineControl extends MouseDragEntityController {
    private m_color: Color4 = new Color4();
    constructor() {
        super();
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_color.setRGB3f(pr, pg, pb);
        if (this.m_targetEntity != null) {
            let m: any = this.m_targetEntity.getMaterial() as any;
            m.setRGB3f(pr, pg, pb);
        }
    }
    protected mouseOverListener(evt: any): void {
        if (this.m_targetEntity != null) {
            let m: any = this.m_targetEntity.getMaterial() as any;
            m.setRGB3f(1.0, 0.0, 0.0);
        }
    }
    protected mouseOutListener(evt: any): void {

        if (this.m_targetEntity != null) {
            let m: any = this.m_targetEntity.getMaterial() as any;
            m.setRGB3f(this.m_color.r, this.m_color.g, this.m_color.b);
        }
    }
}

class LeftTopScene {
    private m_rendererScene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    constructor() {

    }
    initialize(rscene: RendererScene, texLoader: ImageTextureLoader): void {

        this.m_rendererScene = rscene;
        this.m_texLoader = texLoader;

        let tex0: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
        let tex1: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");

        let scrPlane: ScreenFixedAlignPlaneEntity = new ScreenFixedAlignPlaneEntity();
        scrPlane.showDoubleFace(true, false);
        scrPlane.initialize(-1.0, -1.0, 2.0, 2.0);
        (scrPlane.getMaterial() as any).setRGB3f(Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3);
        rscene.addEntity(scrPlane);

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.name = "axis";
        axis.initialize(600.0);
        rscene.addEntity(axis, 1);

        let i: number = 0;
        let box: Box3DEntity;
        for (i = 0; i < 1; ++i) {
            box = new Box3DEntity();
            box.name = "box_" + i;
            box.initialize(new Vector3D(-150.0, -150.0, -150.0), new Vector3D(150.0, 150.0, 15.0), [tex1]);
            box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
            rscene.addEntity(box, 1);

            this.useEvt(box);
        }
        let sphere: Sphere3DEntity;
        for (i = 0; i < 1; ++i) {
            sphere = new Sphere3DEntity();
            sphere.name = "sphere_" + i;
            sphere.initialize(110.0, 15, 15, [tex0]);
            sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
            rscene.addEntity(sphere, 1);

            this.useEvt(sphere);
        }

    }

    private useEvt(disp: DisplayEntity): void {

        let evtCtrl: MouseEventEntityController = new MouseEventEntityController();
        evtCtrl.bindTarget(disp);
    }
}

class LeftBottomScene {
    private m_rendererScene: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader;
    constructor() {

    }
    initialize(rscene: RendererSubScene, texLoader: ImageTextureLoader): void {

        this.m_rendererScene = rscene;
        this.m_texLoader = texLoader;

        let tex1: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
        let tex2: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/warter_01.jpg");

        let scrPlane: ScreenFixedAlignPlaneEntity = new ScreenFixedAlignPlaneEntity();
        scrPlane.showDoubleFace(true, false);
        scrPlane.initialize(-1.0, -1.0, 2.0, 2.0);
        (scrPlane.getMaterial() as any).setRGB3f(Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3);
        rscene.addEntity(scrPlane);

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(600.0);
        this.m_rendererScene.addEntity(axis, 1);
        let i: number = 0;
        let box: Box3DEntity;
        let total: number = Math.round(Math.random() * 4) + 1;
        for (i = 0; i < total; ++i) {
            box = new Box3DEntity();
            box.name = "box_" + i;
            box.initialize(new Vector3D(-50.0, -50.0, -50.0), new Vector3D(50.0, 50.0, 5.0), [tex2]);
            box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
            this.m_rendererScene.addEntity(box, 1);

            this.useEvt(box);
        }
        let sphere: Sphere3DEntity;
        total = Math.round(Math.random() * 4) + 1;
        for (i = 0; i < total; ++i) {
            sphere = new Sphere3DEntity();
            sphere.name = "sphere_" + i;
            sphere.initialize(110.0, 15, 15, [tex1]);
            sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
            this.m_rendererScene.addEntity(sphere, 1);

            this.useEvt(sphere);
        }
    }

    private useEvt(disp: DisplayEntity): void {

        let evtCtrl: MouseEventEntityController = new MouseEventEntityController();
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
        this.m_rendererScene.addEntity(axis);
        let i: number = 0;
        let box: Box3DEntity;
        let total: number = Math.round(Math.random() * 4) + 1;
        for (i = 0; i < total; ++i) {
            box = new Box3DEntity();
            box.name = "box_" + i;
            box.initialize(new Vector3D(-50.0, -50.0, -50.0), new Vector3D(50.0, 50.0, 5.0), [tex2]);
            box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
            this.m_rendererScene.addEntity(box);

            this.useEvt(box);
        }
        let sphere: Sphere3DEntity;
        for (i = 0; i < total; ++i) {
            sphere = new Sphere3DEntity();
            sphere.name = "sphere_" + i;
            sphere.initialize(110.0, 15, 15, [tex1]);
            sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
            this.m_rendererScene.addEntity(sphere);

            this.useEvt(sphere);
        }
    }

    private useEvt(disp: DisplayEntity): void {

        let evtCtrl: MouseEventEntityController = new MouseEventEntityController();
        evtCtrl.bindTarget(disp);
    }
}
class UIScene {
    private m_rendererScene: RendererSubScene = null;
    private m_mainRScene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_stage3D: Stage3D = null;

    targetAxis: Axis3DEntity = null;
    horizontalDivision: DragLineControl = null;
    //horizontal, horizontalDivision, verticalCtrl
    leftVerticalDivision: DragLineControl = null;
    constructor() {
    }
    initialize(mainRScene: RendererScene, rscene: RendererSubScene, texLoader: ImageTextureLoader): void {

        this.m_mainRScene = mainRScene;
        this.m_rendererScene = rscene;
        this.m_texLoader = texLoader;

        let tex3: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/caustics_02.jpg");
        let tex4: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/white.jpg");

        let stage3D: Stage3D = this.m_rendererScene.getStage3D() as Stage3D;
        this.m_stage3D = stage3D;

        let px: number = Math.round(stage3D.stageWidth * (0.2 + Math.random() * 0.6));
        let py: number = Math.round(stage3D.stageHeight * (0.2 + Math.random() * 0.6));

        let separator: Plane3DEntity;
        separator = new Plane3DEntity();
        separator.initializeXOY(0.0, 0.0, 4.0, 100.0, [tex4]);
        separator.setScaleXYZ(1.0, stage3D.stageHeight / 100.0, 1.0);
        separator.setXYZ(px, 0.0, 0.0);
        this.m_rendererScene.addEntity(separator);
        this.horizontalDivision = this.useDragXEvt(separator);
        this.horizontalDivision.setRGB3f(0.8, 0.8, 0.8);
        this.horizontalDivision.dragController.lockX(50, stage3D.stageWidth - 50);

        separator = new Plane3DEntity();
        separator.initializeXOY(0.0, 0.0, 100.0, 4.0, [tex4]);
        separator.setScaleXYZ(px / 100.0, 1.0, 1.0);
        separator.setXYZ(0.0, py, 0.0);
        this.m_rendererScene.addEntity(separator);
        this.leftVerticalDivision = this.useDragXEvt(separator);
        this.leftVerticalDivision.setRGB3f(0.5, 0.5, 0.8);
        this.leftVerticalDivision.dragController.lockY(50, stage3D.stageHeight - 50);

        let tar_axis: Axis3DEntity = new Axis3DEntity();
        tar_axis.initializeCross(100.0);
        tar_axis.setXYZ(100, 100, 0.0);
        this.m_rendererScene.addEntity(tar_axis);
        this.targetAxis = tar_axis;

        let dragPlane: Plane3DEntity;
        let i: number = 0;
        px -= 100.0;
        for (i = 0; i < 1; ++i) {
            dragPlane = new Plane3DEntity();
            dragPlane.toBrightnessBlend(true, false);
            dragPlane.initializeXOY(0.0, 0.0, 200.0, 150.0, [tex3]);
            dragPlane.setXYZ(px + i * 300, 150.0, 0.0);
            this.m_rendererScene.addEntity(dragPlane);
            this.useDragEvt(dragPlane);
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
        evtCtrObj.setStage3D(this.m_stage3D);
        evtCtrObj.bindTarget(disp);
        this.m_mainRScene.runnableQueue.addRunner(evtCtrObj);
        return evtCtrObj;
    }
}
export class DemoMultiRendererScene2 {
    constructor() { }
    private static s_uid: number = 0;
    private m_uid: number = DemoMultiRendererScene2.s_uid++;
    private m_rendererScene: RendererScene = null;
    private m_rendererLeftTopScene: RendererScene = null;
    private m_rendererLeftBottomScene: RendererSubScene = null;
    private m_rendererRightScene: RendererSubScene = null;
    private m_rendererUIScene: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_letfTopCamTrack: CameraTrack = null;
    private m_leftBottomCamTrack: CameraTrack = null;
    private m_rightCamTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stage3D: Stage3D = null;
    private m_profileInstance: ProfileInstance;

    private m_leftScene: LeftTopScene = new LeftTopScene();
    private m_leftBottomScene: LeftBottomScene = new LeftBottomScene();
    private m_rightScene: RightScene = new RightScene();
    private m_uiScene: UIScene = new UIScene();
    private m_div: HTMLDivElement = null;
    initialize(div: HTMLDivElement = null): void {

        console.log("DemoMultiRendererScene2::initialize()......, div: ", div);

        if (this.m_rendererScene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;

            this.m_div = div;

            let rparam: RendererParam;

            rparam = new RendererParam(div);
            rparam.autoSyncRenderBufferAndWindowSize = div == null;
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rendererScene = new RendererScene();
            this.m_rendererScene.initialize(rparam);
            this.m_rendererScene.enableMouseEvent(true);
            this.m_stage3D = this.m_rendererScene.getStage3D() as Stage3D;
            this.m_profileInstance = new ProfileInstance();
            if (this.m_profileInstance != null) this.m_profileInstance.initialize(this.m_rendererScene.getRenderer());
            this.m_texLoader = new ImageTextureLoader(this.m_rendererScene.textureBlock);

            this.m_rendererScene.setClearRGBColor3f(Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3);

            this.m_statusDisp.initialize("rstatus", this.m_stage3D.viewWidth - 180);

            this.m_rendererLeftTopScene = this.m_rendererScene;

            rparam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1200.0);
            this.m_rendererRightScene = this.m_rendererScene.createSubScene();
            this.m_rendererRightScene.initialize(rparam);
            this.m_rendererRightScene.enableMouseEvent(true);

            rparam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1200.0);
            this.m_rendererLeftBottomScene = this.m_rendererScene.createSubScene();
            this.m_rendererLeftBottomScene.initialize(rparam,);
            this.m_rendererLeftBottomScene.enableMouseEvent(true);

            rparam = new RendererParam();
            rparam.cameraPerspectiveEnabled = false;
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(0.0, 0.0, 1500.0);
            this.m_rendererUIScene = this.m_rendererScene.createSubScene();
            this.m_rendererUIScene.initialize(rparam);
            this.m_rendererUIScene.enableMouseEvent(true);
            this.m_rendererUIScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth, this.m_stage3D.stageHalfHeight, 1500.0);
            this.m_rendererUIScene.getCamera().update();

            this.m_rendererScene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_rendererScene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            this.m_rendererScene.addEventListener(EventBase.RESIZE, this, this.resizeListener);
            this.m_rendererScene.addEventListener(MouseEvent.MOUSE_WHEEL, this, this.mouseWheeelListener);
            this.m_rendererScene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDownListener);
            this.m_rendererScene.addEventListener(KeyboardEvent.KEY_UP, this, this.keyUpListener);

            this.m_letfTopCamTrack = new CameraTrack();
            this.m_letfTopCamTrack.bindCamera(this.m_rendererLeftTopScene.getCamera());

            this.m_leftBottomCamTrack = new CameraTrack();
            this.m_leftBottomCamTrack.bindCamera(this.m_rendererLeftBottomScene.getCamera());

            this.m_rightCamTrack = new CameraTrack();
            this.m_rightCamTrack.bindCamera(this.m_rendererRightScene.getCamera());

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            this.m_leftScene.initialize(this.m_rendererLeftTopScene, this.m_texLoader);
            this.m_leftBottomScene.initialize(this.m_rendererLeftBottomScene, this.m_texLoader);
            this.m_rightScene.initialize(this.m_rendererRightScene, this.m_texLoader);
            this.m_uiScene.initialize(this.m_rendererScene, this.m_rendererUIScene, this.m_texLoader);
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
                this.m_rendererLeftTopScene.getCamera().lookAtRH(new Vector3D(1500.0, 1500.0, 1500.0), new Vector3D(), new Vector3D(0.0, 1.0, 0.0));
                break;
        }
    }
    mouseDownListener(evt: any): void {
        //  console.log("mouseDownListener call, this.m_rendererLeftTopScene: " + this.m_rendererLeftTopScene.toString());
        this.m_uiScene.targetAxis.setXYZ(evt.mouseX, evt.mouseY, 0.0);
        this.m_uiScene.targetAxis.update();
    }
    mouseUpListener(evt: any): void {
        //console.log("mouseUpListener call, this.m_rendererLeftTopScene: "+this.m_rendererLeftTopScene.toString());
    }
    resizeListener(evt: any): void {
        this.m_rendererLeftTopScene.setViewPort(0, 0, this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
        this.m_rendererUIScene.setViewPort(0, 0, this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
        this.m_rendererUIScene.getCamera().translationXYZ(this.m_stage3D.stageHalfWidth, this.m_stage3D.stageHalfHeight, 1500.0);
    }
    mouseWheeelListener(evt: any): void {
        //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
        if (evt.wheelDeltaY < 0) {
            // zoom in
            this.m_rendererLeftTopScene.getCamera().forward(-25.0);
        }
        else {
            // zoom out
            this.m_rendererLeftTopScene.getCamera().forward(25.0);
        }
    }
    private m_pos: Vector3D = new Vector3D();

    run(): void {

        if (this.m_div == null) this.m_statusDisp.update();

        this.m_uiScene.horizontalDivision.getPosition(this.m_pos);
        this.m_uiScene.leftVerticalDivision.setScaleXYZ(this.m_pos.x / 100.0, 1.0, 1.0);
        this.m_uiScene.leftVerticalDivision.updateTargetEntity();
        let maxX: number = this.m_pos.x;
        let minX: number = 0;
        minX = minX >= 0 ? minX : 0;

        this.m_uiScene.leftVerticalDivision.getPosition(this.m_pos);
        let maxY: number = this.m_pos.y;
        let minY: number = 0;
        minY = minY >= 0 ? minY : 0;

        let width: number = maxX - minX;
        let height: number = maxY - minY;

        this.m_rendererLeftTopScene.setViewPort(minX, height, width, this.m_stage3D.stageHeight - height);
        this.m_rendererLeftBottomScene.setViewPort(minX, minY, width, height);
        this.m_rendererRightScene.setViewPort(maxX, 0, this.m_stage3D.stageWidth - width, this.m_stage3D.stageHeight);

        let pickFlag: boolean = true;

        /////////////////////////////////////////////////////// ---- mouseTest begin.
        this.m_rendererUIScene.runBegin(true, true);
        this.m_rendererUIScene.update(false, true);
        pickFlag = this.m_rendererUIScene.isRayPickSelected();

        this.m_rendererLeftTopScene.runBegin(false);
        this.m_rendererLeftTopScene.update(false, !pickFlag);
        pickFlag = pickFlag || this.m_rendererLeftTopScene.isRayPickSelected();

        this.m_rendererLeftBottomScene.runBegin(false);
        this.m_rendererLeftBottomScene.update(false, !pickFlag);
        pickFlag = pickFlag || this.m_rendererLeftBottomScene.isRayPickSelected();

        this.m_rendererRightScene.runBegin(true);
        this.m_rendererRightScene.update(false, !pickFlag);
        /////////////////////////////////////////////////////// ---- mouseTest end.


        /////////////////////////////////////////////////////// ---- rendering begin.
        this.m_rendererLeftTopScene.renderBegin();
        this.m_rendererLeftTopScene.run(false);
        this.m_rendererLeftTopScene.runEnd();

        this.m_rendererLeftBottomScene.renderBegin();
        this.m_rendererLeftBottomScene.run(false);
        this.m_rendererLeftBottomScene.runEnd();

        this.m_rendererRightScene.renderBegin();
        this.m_rendererRightScene.run(false);
        this.m_rendererRightScene.runEnd();

        this.m_rendererUIScene.renderBegin();
        this.m_rendererUIScene.run(false);
        this.m_rendererUIScene.runEnd();
        /////////////////////////////////////////////////////// ---- rendering end.

        this.m_letfTopCamTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_leftBottomCamTrack.rotationOffsetAngleWorldY(0.1);
        this.m_rightCamTrack.rotationOffsetAngleWorldY(-0.1);

        if (this.m_profileInstance != null) this.m_profileInstance.run(true);
    }
}