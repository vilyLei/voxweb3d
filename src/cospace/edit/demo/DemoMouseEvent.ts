import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../../vox/event/MouseEvt3DDispatcher";
import RendererDevice from "../../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";

import RendererParam from "../../../vox/scene/RendererParam";
import RendererScene from "../../../vox/scene/RendererScene";
import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";

import DebugFlag from "../../../vox/debug/DebugFlag";

import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import Line3DEntity from "../../../vox/entity/Line3DEntity";

import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import { RenderableMaterialBlock } from "../../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../../vox/scene/block/RenderableEntityBlock";

import DivLog from "../../../vox/utils/DivLog";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import BoundsEntity from "../../../vox/entity/BoundsEntity";

export class DemoMouseEvent {

    constructor() { }
    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materialCtx: MaterialContext = new MaterialContext();

    initialize(): void {

        console.log("DemoMouseEvent::initialize()......");

        if (this.m_rscene == null) {

            // window.oncontextmenu = function (e) {
            //     e.preventDefault();
            // }

            document.oncontextmenu = function (e) {
                e.preventDefault();
            }

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            RendererDevice.SetWebBodyColor("#333333");
            DivLog.SetDebugEnabled(true);

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 50.0, 10000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(2000.0, 2000.0, 2000.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
            this.m_rscene.updateCamera();

            let rscene = this.m_rscene;
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            rscene.materialBlock = materialBlock;
            let entityBlock = new RenderableEntityBlock();
            entityBlock.initialize();
            rscene.entityBlock = entityBlock;
            ///*
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_RIGHT_DOWN, this, this.mouseRightDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_RIGHT_UP, this, this.mouseRightUp);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBGDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_UP, this, this.mouseBGUp);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_MIDDLE_DOWN, this, this.mouseMiddleDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_MIDDLE_UP, this, this.mouseMiddleUp);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_MIDDLE_DOWN, this, this.mouseMiddleBGDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_MIDDLE_UP, this, this.mouseMiddleBGUp);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_RIGHT_DOWN, this, this.mouseRightBGDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_RIGHT_UP, this, this.mouseRightBGUp);
            //*/
            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());

            // this.m_stageDragSwinger.buttonType = 1;
            this.m_stageDragSwinger.buttonType = 2;
            this.m_stageDragSwinger.bgEventEnabled = true;

            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_materialCtx.initialize(this.m_rscene);

            this.m_statusDisp.initialize();
            this.m_rscene.setClearRGBColor3f(0.23, 0.23, 0.23);

            // DivLog.ShowLog("renderer inited.");
            // DivLog.ShowLog(RendererDevice.GPU_RENDERER);
            this.initScene();
        }
    }

    private initScene(): void {

        let axis = new Axis3DEntity();
        axis.initialize(300);
        this.m_rscene.addEntity(axis);

        let bounds = new BoundsEntity();
        let radius: number = 100.0;
        let minV = new Vector3D(radius, radius, radius).scaleBy(-1.0);
        let maxV = new Vector3D(radius, radius, radius);
        bounds.setBounds(minV, maxV);

        this.initializeEvent(bounds);

        this.m_rscene.addEntity(bounds);

        let sph = new Sphere3DEntity();
        sph.normalEnabled = true;
        sph.initialize(radius, 20, 20);
        this.m_rscene.addEntity(sph);
    }

    private initializeEvent(entity: DisplayEntity): void {
        const me = MouseEvent;
        let dispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(me.MOUSE_OVER, this, this.mOverListener);
        dispatcher.addEventListener(me.MOUSE_OUT, this, this.mOutListener);
        dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mDownListener);
        entity.setEvtDispatcher(dispatcher);
        entity.mouseEnabled = true;
    }

    private mOverListener(evt: any): void {
        console.log("DemoMouseEvent::mOverListener() ...");
    }
    private mOutListener(evt: any): void {
        console.log("DemoMouseEvent::mOutListener() ...");
    }
    private mDownListener(evt: any): void {
        console.log("DemoMouseEvent::mDownListener() ...");
    }

    // protected mouseOverListener(evt: any): void {
    //     console.log("DemoMouseEvent::mouseOverListener() ...");
    //     // this.showOverColor();
    // }
    // protected mouseOutListener(evt: any): void {
    //     console.log("DemoMouseEvent::mouseOutListener() ...");
    //     // this.showOutColor();
    // }
    private mouseDown(evt: any): void {
        console.log("DemoMouseEvent::mouseDown() ...");
    }
    private mouseUp(evt: any): void {
        console.log("DemoMouseEvent::mouseUp() ...");
    }
    private mouseRightDown(evt: any): void {
        console.log("DemoMouseEvent::mouseRightDown() ...");
    }
    private mouseRightUp(evt: any): void {
        console.log("DemoMouseEvent::mouseRightUp() ...");
    }
    private mouseBGDown(evt: any): void {
        console.log("DemoMouseEvent::mouseBGDown() ...");
    }
    private mouseBGUp(evt: any): void {
        console.log("DemoMouseEvent::mouseBGUp() ...");
    }
    private mouseMiddleDown(evt: any): void {
        console.log("DemoMouseEvent::mouseMiddleDown() ...");
    }
    private mouseMiddleUp(evt: any): void {
        console.log("DemoMouseEvent::mouseMiddleUp() ...");
    }
    private mouseMiddleBGDown(evt: any): void {
        console.log("DemoMouseEvent::mouseMiddleBGDown() ...");
    }
    private mouseMiddleBGUp(evt: any): void {
        console.log("DemoMouseEvent::mouseMiddleBGUp() ...");
    }
    private mouseRightBGDown(evt: any): void {
        console.log("DemoMouseEvent::mouseRightBGDown() ...");
    }
    private mouseRightBGUp(evt: any): void {
        console.log("DemoMouseEvent::mouseRightBGUp() ...");
    }
    private update(): void {

        this.m_statusDisp.update(true);
    }
    run(): void {

        this.update();

        if (this.m_rscene != null) {

            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(null, 30.0);

            this.m_rscene.run(true);
        }


        DebugFlag.Flag_0 = 0;
    }
}

export default DemoMouseEvent;
