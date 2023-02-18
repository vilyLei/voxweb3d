
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { CubeRandomRange } from "../vox/utils/RandomRange";
import Color4 from "../vox/material/Color4";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import IEvt3DController from "../vox/scene/IEvt3DController";
import MouseEvent from "../vox/event/MouseEvent";
import EventBase from "../vox/event/EventBase";
import H5FontSystem from "../vox/text/H5FontSys";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import DragAxisQuad3D from "../voxeditor/entity/DragAxisQuad3D";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvt3DDispatcher from "../vox/event/MouseEvt3DDispatcher";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import Sphere3DMesh from "../vox/mesh/Sphere3DMesh"
import Matrix4 from "../vox/math/Matrix4";

class DispCtrObj {
    constructor() {
    }
    name: string = "";
    dispEntity: DisplayEntity = null;
    rscene: RendererScene = null;

    protected m_frameDisp: BoxFrame3D = null;
    static MeshDragAxis: DragAxisQuad3D = null;
    static Draging: boolean = false;
    static SelectedCtrlObj: DispCtrObj = null;
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
        if (!DispCtrObj.Draging) {
            this.createDisp(evt);
            if (this.m_frameDisp != null) {
                this.m_frameDisp.setRGB3f(Math.random() * 1.1, Math.random() * 1.1, Math.random() * 1.1);
            }
        }
    }
    mouseOverListener(evt: any): void {
        //console.log(this.uuid+", mouse over. this.m_frameDisp != null: "+(this.m_frameDisp != null));
        if (!DispCtrObj.Draging) {
            this.createDisp(evt);
            if (this.m_frameDisp != null) {
                this.m_frameDisp.setVisible(true);
            }
        }
    }
    mouseOutListener(evt: any): void {
        //console.log(this.uuid+", mouse out. this.m_frameDisp != null: "+(this.m_frameDisp != null));
        if (this.m_frameDisp != null) {
            this.m_frameDisp.setVisible(false);
        }
    }
    mouseDownListener(evt: any): void {
        this.createDisp(evt);
        console.log("DispCtrObj::mouseDownListener call.");
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
        DispCtrObj.SelectedCtrlObj = this;
        DispCtrObj.Draging = true;
    }
    mouseUpListener(evt: any): void {
        DispCtrObj.Draging = false;
        if (DispCtrObj.SelectedCtrlObj == this) {
            DispCtrObj.MeshDragAxis.setVisible(true);
            DispCtrObj.MeshDragAxis.setTarget(this.dispEntity);
            if (this.dispEntity != null) {
                DispCtrObj.MeshDragAxis.copyPositionFrom(this.dispEntity);
                DispCtrObj.MeshDragAxis.update();
            }
        }
        console.log("DispCtrObj::mouseUpListener(), this.dispEntity != null." + (this.dispEntity != null));
    }
    destroy(): void {
        this.rscene = null;
        this.m_frameDisp = null;
    }

    public updateDrag(rpv: Vector3D, rtv: Vector3D): void {
    }
    updateFrameBox(): void {
        if (this.rscene != null && this.m_frameDisp != null && this.dispEntity != null) {
            this.m_frameDisp.updateFrameByAABB(this.dispEntity.getGlobalBounds());
            this.m_frameDisp.updateMeshToGpu(this.rscene.getRenderProxy());
        }
    }
}

export class DemoMouseDrag {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();

    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_evtCtr: IEvt3DController = null;
    initialize(): void {
        console.log("DemoMouseDrag::initialize()......");
        if (this.m_rscene == null) {
            H5FontSystem.GetInstance().initialize("fontTex", 18, 512, 512, false, false);
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(true);
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setRendererProcessParam(1, true, true);

            this.m_rscene.enableMouseEvent(false);
            this.m_evtCtr = this.m_rscene.getEvt3DController();

            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, false, true);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMoveListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_WHEEL, this, this.mouseWheeelListener);
            this.m_rscene.addEventListener(EventBase.RESIZE, this, this.stageResizeListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_UP, this, this.mouseBgUpListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0 = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
            let tex1 = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
            let tex2 = this.m_texLoader.getTexByUrl("static/assets/guangyun_H_0007.png");
            let tex3 = this.m_texLoader.getTexByUrl("static/assets/flare_core_01.jpg");
            let tex4 = this.m_texLoader.getTexByUrl("static/assets/flare_core_02.jpg");
            let tex5 = this.m_texLoader.getTexByUrl("static/assets/a_02_c.jpg");
            let tex6 = this.m_texLoader.getTexByUrl("static/assets/metal_08.jpg");

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);
            this.m_rscene.updateCamera();

            let t_axis = new Axis3DEntity();
            t_axis.initialize(500.0);
            this.m_rscene.addEntity(t_axis);

            let saxis: DragAxisQuad3D = new DragAxisQuad3D();
            saxis.initialize(500.0, 10.0);
            saxis.initializeEvent();
            this.m_rscene.addEntity(saxis);
            DispCtrObj.MeshDragAxis = saxis;

            let axis: Axis3DEntity = null;

            let i: number = 0;
            let scaleK: number = 1.0;
            for (i = 0; i < 8; ++i) {
                axis = new Axis3DEntity();
                axis.initialize(200.0 + Math.random() * 100.0);
                axis.mouseEnabled = true;
                axis.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                axis.setScaleXYZ((Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK);
                axis.setRotationXYZ(Math.random() * 500.0, Math.random() * 500.0, Math.random() * 500.0);
                // axis.initialize(400.0);
                // axis.setXYZ(200,50,100);
                this.m_rscene.addEntity(axis);
                axis.uuid = "axis_" + i;
                this.useEvt(axis);

            }

            //return;
            let cubeRange: CubeRandomRange = new CubeRandomRange();
            cubeRange.min.setXYZ(-400.0, -400.0, -400.0);
            cubeRange.max.setXYZ(400.0, 400.0, 400.0);
            cubeRange.initialize();

            let total: number = 3;
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            let dis: number = 50;
            let axisPlaneSize: number = 130;
            let plane: Plane3DEntity = null;
            for (i = 0; i < 5; ++i) {
                plane = new Plane3DEntity();
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
                plane.setPolyhedral(false);
                // plane.initializeXOY(dis, dis, axisPlaneSize, axisPlaneSize, [tex0]);
                // plane.initializeXOYSquare(300,[tex0]);
                // plane.setXYZ(200,50,100);
                // let scale: number = 1.3;
                // plane.setScaleXYZ(scale,scale,scale);
                plane.setXYZ(Math.random() * 3000.0 - 1500.0, Math.random() * 3000.0 - 1500.0, Math.random() * 2000.0 - 1000.0);
                this.m_rscene.addEntity(plane);

                this.useEvt(plane);
            }

            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            total = 5;
            let box: Box3DEntity = null;
            for (i = 0; i < total; ++i) {
                box = new Box3DEntity();
                this.useEvt(box);

                if (srcBox != null) box.setMesh(srcBox.getMesh());
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                box.setScaleXYZ((Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK);
                box.setRotationXYZ(Math.random() * 500.0, Math.random() * 500.0, Math.random() * 500.0);
                //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                cubeRange.calc();
                box.setPosition(cubeRange.value);
                this.m_rscene.addEntity(box);

            }
            let sph: Sphere3DEntity = null;
            for (i = 0; i < 5; ++i) {
                sph = new Sphere3DEntity();
                this.useEvt(sph);

                sph.initialize(100, 20, 20, [tex1]);
                cubeRange.calc();
                //cubeRange.value.setXYZ(200,50,100);
                sph.setPosition(cubeRange.value);
                this.m_rscene.addEntity(sph);
                //this.m_sph = sph;
            }
            ///*
            let objUrl: string = "static/assets/obj/box01.obj";
            objUrl = "static/assets/obj/building_001.obj";
            let objDisp: ObjData3DEntity = new ObjData3DEntity();
            this.useEvt(objDisp);
            objDisp.moduleScale = 3.0;
            objDisp.initializeByObjDataUrl(objUrl, [tex6]);
            objDisp.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
            this.m_rscene.addEntity(objDisp);
            //*/
        }
    }
    private m_sph: Sphere3DEntity = null;
    private useEvt(objDisp: DisplayEntity): void {
        objDisp.mouseEnabled = true;
        let ctrObj: DispCtrObj = new DispCtrObj();
        ctrObj.rscene = this.m_rscene;
        ctrObj.dispEntity = objDisp;
        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, ctrObj, ctrObj.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_UP, ctrObj, ctrObj.mouseUpListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, ctrObj, ctrObj.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, ctrObj, ctrObj.mouseOutListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_MOVE, ctrObj, ctrObj.mouseMoveListener);
        //dispatcher.addEventListener(MouseEvent.MOUSE_BG_DOWN,ctrObj,ctrObj.mouseBgDownListener);
        objDisp.setEvtDispatcher(dispatcher);
    }
    stageResizeListener(evt: any): void {
        console.log("Demo stageResizeListener call, Stage resize().");
    }
    private mouseBgDownListener(evt: any): void {
        if (!this.m_evtCtr.isSelected()) {
            console.log("mouseBgDownListener.");
            DispCtrObj.MeshDragAxis.setVisible(false);
            DispCtrObj.Draging = false;
        }
    }
    private mouseBgUpListener(evt: any): void {
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
    private m_bgColor: Color4 = new Color4(0.0, 0.3, 0.1);
    // 鼠标动了, 摄像机动了, 被渲染对象本身动了,都可能形成mouse move事件
    mouseMoveListener(evt: any): void {
    }
    mouseDownListener(evt: any): void {
        console.log("stage mouse down, evt.phase: ", evt.phase);
        this.m_bgColor.setRGB3f(0.4 * Math.random(), 0.4 * Math.random(), 0.4 * Math.random());
    }
    mouseUpListener(evt: any): void {
        console.log("stage mouse up, evt.phase: ", evt.phase);
        DispCtrObj.MeshDragAxis.deselect();
        DispCtrObj.Draging = false;
    }
    private m_rpv: Vector3D = new Vector3D();
    private m_rtv: Vector3D = new Vector3D();
    run(): void {

        this.m_rscene.setClearColor(this.m_bgColor);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_rscene.run(true);
        this.mouseCtrUpdate();

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
    }
    private mouseCtrUpdate(): void {
        
        if (DispCtrObj.MeshDragAxis.isSelected()) {
            this.m_rscene.getMouseXYWorldRay(this.m_rpv, this.m_rtv);
            DispCtrObj.MeshDragAxis.moveByRay(this.m_rpv, this.m_rtv);
            DispCtrObj.Draging = true;
            if (DispCtrObj.SelectedCtrlObj != null) {
                DispCtrObj.SelectedCtrlObj.updateFrameBox();
            }
        }
    }
}
export default DemoMouseDrag;