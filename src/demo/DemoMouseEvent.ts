
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import { CubeRandomRange } from "../vox/utils/RandomRange";
import Color4 from "../vox/material/Color4";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import IRendererSpace from "../vox/scene/IRendererSpace";
import RendererScene from "../vox/scene/RendererScene";
import MouseEvent from "../vox/event/MouseEvent";
import EventBase from "../vox/event/EventBase";
import Stage3D from "../vox/display/Stage3D";
//import H5FontSystem from "../vox/text/H5FontSys";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import BoundsEntity from "../vox/entity/BoundsEntity";
import BillboardFrame from "../vox/entity/BillboardFrame";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";


export class DispCtrObj {
    constructor() {
    }
    name: string = "";
    rscene: RendererScene = null;
    private m_frameDisp: BoxFrame3D = null;

    static FrameDispList: BoxFrame3D[] = null;
    private createDisp(evt: any): void {
        if (this.rscene != null && this.m_frameDisp == null) {
            if (DispCtrObj.FrameDispList == null) DispCtrObj.FrameDispList = [];
            let boxFrame: BoxFrame3D = new BoxFrame3D(true);
            boxFrame.initialize(evt.target.getGlobalBounds().min, evt.target.getGlobalBounds().max);
            boxFrame.setScaleXYZ(1.01, 1.01, 1.01);
            this.rscene.addEntity(boxFrame);
            DispCtrObj.FrameDispList.push(boxFrame);
            this.m_frameDisp = boxFrame;
        }
    }
    mouseMoveListener(evt: any): void {
        this.createDisp(evt);
        if (this.m_frameDisp != null) {
            this.m_frameDisp.setRGB3f(Math.random() * 1.1, Math.random() * 1.1, Math.random() * 1.1);
        }
    }
    mouseOverListener(evt: any): void {
        this.createDisp(evt);
        //console.log(this.name+", mouse over. this.m_frameDisp != null: "+(this.m_frameDisp != null));
        if (this.m_frameDisp != null) {
            this.m_frameDisp.setVisible(true);
        }
    }
    mouseOutListener(evt: any): void {
        //console.log(this.name+", mouse out. this.m_frameDisp != null: "+(this.m_frameDisp != null));
        if (this.m_frameDisp != null) {
            this.m_frameDisp.setVisible(false);
        }
    }
    mouseDownListener(evt: any): void {
        this.createDisp(evt);
        //console.log("DispCtrObj::mouseDownListener call.");
        let list: BoxFrame3D[] = DispCtrObj.FrameDispList;
        for (let i: number = 0; i < list.length; ++i) {
            if (this.m_frameDisp != list[i]) {
                list[i].setVisible(false);
            }
            else if (list[i] != null) {
                list[i].setVisible(true);
                list[i].setRGB3f(Math.random() * 1.1, Math.random() * 1.1, Math.random() * 1.1);
            }
        }

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(70.0);
        axis.setPosition(evt.wpos);
        this.rscene.addEntity(axis);
    }
    mouseUpListener(evt: any): void {
    }
    destory(): void {
        this.rscene = null;
        this.m_frameDisp = null;
        //this.frameDispList = null;
    }
}
export class DemoMouseEvent {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_rspace: IRendererSpace = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;

    private m_profileInstance: ProfileInstance = new ProfileInstance();
    initialize(): void {
        console.log("DemoMouseEvent::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setRendererProcessParam(1, true, true);

            this.m_rscene.enableMouseEvent(true);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            let tex0: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
            let tex2: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/guangyun_H_0007.png");
            let tex3: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/flare_core_01.jpg");
            let tex4: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/flare_core_02.jpg");
            let tex5: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/a_02_c.jpg");

            let stage3D: Stage3D = this.m_rscene.getStage3D() as Stage3D;
            stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            stage3D.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            stage3D.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMoveListener);
            stage3D.addEventListener(MouseEvent.MOUSE_WHEEL, this, this.mouseWheeelListener);
            stage3D.addEventListener(EventBase.RESIZE, this, this.stageResizeListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
            this.m_rscene.updateCamera();

            let pv: Vector3D = new Vector3D();

            let i: number = 0;
            let scaleK: number = 1.0;
            let ctrObj: DispCtrObj = null;
            for (i = 0; i < 8; ++i) {
                let axis: Axis3DEntity = new Axis3DEntity();
                axis.name = "axis_" + i;
                axis.initialize(200.0 + Math.random() * 100.0);
                this.useEvt(axis);
                axis.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                axis.setScaleXYZ((Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK);
                axis.setRotationXYZ(Math.random() * 500.0, Math.random() * 500.0, Math.random() * 500.0);
                this.m_rscene.addEntity(axis);
            }

            //return;
            let cubeRange: CubeRandomRange = new CubeRandomRange();
            cubeRange.min.setXYZ(-400.0, -400.0, -400.0);
            cubeRange.max.setXYZ(400.0, 400.0, 400.0);
            cubeRange.initialize();

            let total: number = 3;
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            let plane: Plane3DEntity = null;
            for (i = 0; i < 5; ++i) {
                plane = new Plane3DEntity();
                plane.name = "plane_" + i;

                this.useEvt(plane);

                plane.showDoubleFace();
                plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
                plane.setXYZ(Math.random() * 3000.0 - 1500.0, Math.random() * 3000.0 - 1500.0, Math.random() * 2000.0 - 1000.0);
                this.m_rscene.addEntity(plane);
            }

            for (i = 0; i < 0; ++i) {
                plane = new Plane3DEntity();
                plane.showDoubleFace();
                plane.initializeXOY(-800.0, -800.0, 1600.0, 1600.0, [tex3]);
                plane.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
                this.m_rscene.addEntity(plane, 1);
                plane.mouseEnabled = true;
            }

            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);

            let box: Box3DEntity = null;
            for (i = 0; i < 5; ++i) {
                box = new Box3DEntity();
                box.name = "box_" + i;
                this.useEvt(box);

                if (srcBox != null) box.setMesh(srcBox.getMesh());
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                if (total > 1) {
                    box.setScaleXYZ((Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK);
                    cubeRange.calc();
                    box.setPosition(cubeRange.value);
                }
                else {
                    box.setXYZ(150.0, 0.0, 0.0);
                }
                this.m_rscene.addEntity(box);
                box.getPosition(pv);

            }
            let sph: Sphere3DEntity = null;
            for (i = 0; i < 5; ++i) {
                sph = new Sphere3DEntity();
                sph.name = "sphere_" + i;
                this.useEvt(sph);
                sph.initialize(100, 20, 20, [tex1]);
                if (total > 1) {
                    cubeRange.calc();
                    sph.setPosition(cubeRange.value);
                }
                else {
                    sph.setXYZ(150.0, 0.0, 0.0);
                }
                this.m_rscene.addEntity(sph);
                sph.getPosition(pv);
            }
        }
    }
    private useEvt(disp: DisplayEntity): void {

        let ctrObj: DispCtrObj = new DispCtrObj();
        ctrObj.rscene = this.m_rscene;
        ctrObj.name = disp.name;
        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        //dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.entityMouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, ctrObj, ctrObj.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_UP, ctrObj, ctrObj.mouseUpListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, ctrObj, ctrObj.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, ctrObj, ctrObj.mouseOutListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_MOVE, ctrObj, ctrObj.mouseMoveListener);
        disp.setEvtDispatcher(dispatcher);
        disp.mouseEnabled = true;
    }
    private stageResizeListener(evt: any): void {
        console.log("Demo stageResizeListener call, Stage resize().");
    }
    mouseWheeelListener(evt: any): void {
        //console.log("mouseWheeelListener call, evt.wheelDeltaY: "+evt.wheelDeltaY);
        if (evt.wheelDeltaY < 0) {
            // zoom in
            ///this.m_rscene.getCamera().forward(-125.0);
        }
        else {
            // zoom out
            //this.m_rscene.getCamera().forward(125.0);
        }
    }
    private m_bgColor: Color4 = new Color4(0.0, 0.3, 0.1);

    // 鼠标动了, 摄像机动了, 被渲染对象本身动了,都可能形成mouse move事件
    mouseMoveListener(evt: any): void {

    }
    mouseDownListener(evt: any): void {

        this.m_bgColor.setRGB3f(0.4 * Math.random(), 0.4 * Math.random(), 0.4 * Math.random());
    }
    mouseUpListener(evt: any): void {

    }
    entityMouseDownListener(evt: any): void {
        console.log("entityMouseDownListener call, this.m_rscene: " + this.m_rscene.toString());
        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(70.0);
        axis.setPosition(evt.wpos);
        this.m_rscene.addEntity(axis);
    }
    private m_rayPickSelected: boolean = false;
    run(): void {
        this.m_rscene.setClearColor(this.m_bgColor);

        this.m_rscene.runBegin();
        this.m_rscene.update(false);

        if (this.m_rayPickSelected != this.m_rscene.isRayPickSelected()) {
            this.m_rayPickSelected = this.m_rscene.isRayPickSelected()
            console.log("this.m_rscene.isRayPickSelected(): ", this.m_rscene.isRayPickSelected());
        }
        this.m_rscene.renderBegin();
        this.m_rscene.run(false);
        this.m_rscene.runEnd();

        //  this.m_rscene.runBegin();
        //  this.m_rscene.update();
        //  this.m_rscene.cullingTest();
        //  this.m_rscene.run();
        //  this.m_rscene.runEnd();

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_rscene.updateCamera();

        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
        //this.m_mouseEvt.type = 0;
    }
}
export default DemoMouseEvent;