import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import KeyboardEvent from "../../../vox/event/KeyboardEvent";
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
import { KeyboardInteraction } from "./edit/KeyboardInteraction";
import Keyboard from "../../../vox/ui/Keyboard";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import { TransformRecorder } from "./edit/TransformRecorder";

// class TestA {
//     constructor(){}

//     test(value: number): void {
//         let value_a = value * 4;
//         let value_b = value_a - 2;
//         if(value_b > 10) {
//             console.log("正常输出: ", value_b);
//         }else {
//             console.log("不能输出, 因为这个结果是: ", value_b, ", 它不是大于10。");
//             this.test(value_b);
//         }
//     }
// }

export class DemoTransRecoder {

    constructor() { }
    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materialCtx: MaterialContext = new MaterialContext();
    private m_keyInterac = new KeyboardInteraction();

    initialize(): void {

        console.log("DemoTransRecoder::initialize()......");
        // let p = new TestA();
        // p.test(1);
        // return;
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
            this.m_rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);
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

            this.m_keyInterac.initialize( this.m_rscene );
            // DivLog.ShowLog("renderer inited.");
            // DivLog.ShowLog(RendererDevice.GPU_RENDERER);

            let Key = Keyboard;
            let type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Y]);
            this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlYDown);
            type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Z]);
            this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlZDown);

            this.initScene();
        }
    }
    private m_sph: IRenderEntity = null;
    private m_recoder = new TransformRecorder();

    private mouseDown(evt: any): void {
        // console.log("DemoTransRecoder::mouseDown() ...");

        let sph = this.m_sph;
        let pv = new Vector3D();
        sph.getPosition(pv);
        pv.x += 60.0;
        sph.setPosition(pv);
        sph.update();
        this.m_recoder.save( [ sph ] );

        // this.m_rscene.getCanvas().tabIndex = 1;
        // window.focus();
        // document.body.focus();
    }
    private mouseUp(evt: any): void {
        // console.log("DemoTransRecoder::mouseUp() ...");
    }
    private keyCtrlZDown(evt: any): void {
        // console.log("DemoTransRecoder::keyCtrlZDown() ..., evt.keyCode: ", evt.keyCode);
        this.m_recoder.undo();
    }
    private keyCtrlYDown(evt: any): void {
        // console.log("DemoTransRecoder::keyCtrlYDown() ..., evt.keyCode: ", evt.keyCode);        
        this.m_recoder.redo();
    }
    private keyDown(evt: any): void {
        // console.log("DemoTransRecoder::keyDown() ..., evt.keyCode: ", evt.keyCode);

    }
    private initScene(): void {

        let axis = new Axis3DEntity();
        axis.initialize(300);
        this.m_rscene.addEntity(axis);

        let radius: number = 16.0;

        let sph = new Sphere3DEntity();
        sph.normalEnabled = true;
        sph.initialize(radius, 20, 20);
        this.m_rscene.addEntity(sph);
        this.m_sph = sph;
        this.m_recoder.save( [ sph ] );
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

export default DemoTransRecoder;
