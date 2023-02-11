
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import TextureConst from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import RendererSubScene from "../../vox/scene/RendererSubScene";
import { ItemCallback, CtrlItemParam, ParamCtrlUI } from "../usage/ParamCtrlUI";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";
import IRendererSceneGraphStatus from "../../vox/scene/IRendererSceneGraphStatus";
import IRendererScene from "../../vox/scene/IRendererScene";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Vector3D from "../../vox/math/Vector3D";
import IColorMaterial from "../../vox/material/mcase/IColorMaterial";

export class DemoParamCtrlUI {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_grap = new RendererSceneGraph();
    private m_ui = new ParamCtrlUI();
    // private m_axis: Axis3DEntity = null;
    private m_box0: Box3DEntity = null;
    private m_box1: Box3DEntity = null;
    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoParamCtrlUI::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(1200.0, 1200.0, 1200.0);
            rparam.setAttriAntialias(true);
            //rparam.setAttriStencil(true);
            rparam.setAttriAlpha(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());


            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.update();

            this.initScene();
            this.initUI();

        }
    }
    private initScene(): void {

        // let axis = new Axis3DEntity();
        // axis.initialize(300.0);
        // this.m_rscene.addEntity(axis);
        // this.m_axis = axis;

        this.m_box0 = new Box3DEntity();
        this.m_box0.initializeCube(150, [this.getTexByUrl("static/assets/box.jpg")]);
        this.m_rscene.addEntity(this.m_box0);

        this.m_box1 = new Box3DEntity();
        this.m_box1.initializeCube(100, [this.getTexByUrl("static/assets/metal_02.jpg")]);
        this.m_box1.setXYZ(150, 0, -200);
        this.m_rscene.addEntity(this.m_box1);
        //metal_02
    }
    private m_ruisc: RendererSubScene = null;
    private createSelectBtn(name: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, callback: ItemCallback): void {
        let item: CtrlItemParam = {
            type: "status_select", name: name, uuid: uuid,
            selectNS: selectNS, deselectNS: deselectNS,
            flag: flag,
            visibleAlways: true,
            callback: callback
        };

        let ui = this.m_ui;
        ui.addItem(item);
    }
    private createProgressBtn(name: string, uuid: string, progress: number, callback: ItemCallback, colorPick?: boolean): void {
        let item: CtrlItemParam = {
            type: "progress", name: name, uuid: uuid,
            progress: progress,
            visibleAlways: true,
            colorPick: colorPick,
            callback: callback
        };

        let ui = this.m_ui;
        ui.addItem(item);
    }

    private createValueBtn(name: string, uuid: string, value: number, minValue: number, maxValue: number, callback: ItemCallback, colorPick?: boolean, values?: number[]): void {
        let item: CtrlItemParam = {
            type: "number_value", name: name, uuid: uuid,
            value: value,
            minValue: minValue,
            maxValue: maxValue,
            visibleAlways: true,
            colorPick: colorPick,
            values: values,
            callback: callback
        };

        let ui = this.m_ui;
        ui.addItem(item);
    }
    private initUI(): void {
        let ui = this.m_ui;
        ui.initialize(this.m_rscene, true);
        this.m_ruisc = ui.ruisc;
        console.log("initUI --------------------------------------");
        this.createSelectBtn("显示-A", "visible-a", "Yes", "No", true, (type: string, uuid: string, values: number[], flag: boolean, colorPick?: boolean): void => {
            // console.log("flag: ", flag);
            this.m_box0.setVisible(flag);
        });
        this.createSelectBtn("显示-B", "visible-b", "Yes", "No", true, (type: string, uuid: string, values: number[], flag: boolean, colorPick?: boolean): void => {
            // console.log("flag: ", flag);
            this.m_box1.setVisible(flag);
        });
        this.createProgressBtn("缩放-A", "scale", 1.0, (type: string, uuid: string, values: number[], flag: boolean, colorPick?: boolean): void => {
            // console.log("progress: ", values[0]);
            let s = values[0];
            this.m_box0.setScaleXYZ(s,s,s);
            this.m_box0.update();
        });
        this.createValueBtn("X轴移动-B", "move-b", 0, -300, 300, (type: string, uuid: string, values: number[], flag: boolean): void => {
            console.log("value: ", values[0]);
            let pv = new Vector3D();
            this.m_box1.getPosition(pv);
            pv.x = values[0];
            this.m_box1.setPosition(pv);
            this.m_box1.update();
        });
        this.createValueBtn("颜色-A", "color-a", 0.8, 0.0, 10, (type: string, uuid: string, values: number[], flag: boolean, colorPick: boolean): void => {
            console.log("color-a values: ", values, ", colorPick: ", colorPick);
            let material = this.m_box0.getMaterial() as IColorMaterial;
            material.setRGB3f(values[0], values[1], values[2]);
        }, true);
        this.createValueBtn("颜色-B", "color-b", 0.6, 0.0, 2.0, (type: string, uuid: string, values: number[], flag: boolean, colorPick: boolean): void => {
            console.log("color-b, values: ", values, ", colorPick: ", colorPick);
            let material = this.m_box1.getMaterial() as IColorMaterial;
            material.setRGB3f(values[0], values[1], values[2]);
        }, true);

        ui.alignBtns(true);

        this.m_grap.addScene(this.m_rscene);
        let node = this.m_grap.addScene(this.m_ruisc);
        node.setPhase0Callback(null, (sc: IRendererScene, st: IRendererSceneGraphStatus): void => {
            // console.log("ooooo");
            this.m_stageDragSwinger.setEnabled(!st.rayPickFlag);
        })
    }
    private mouseDown(evt: any): void {
        // console.log("mouse down... ...");
        // DebugFlag.Flag_0 = 1;
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

    }

    run(): void {

        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);

        let renderingType = 1;
        if (renderingType < 1 || this.m_ruisc == null) {
            // current rendering strategy
            this.m_rscene.run(true);
            if (this.m_ruisc != null) this.m_ruisc.run(true);
        }
        else {
            this.m_grap.run();
            /*
            /////////////////////////////////////////////////////// ---- mouseTest begin.
            let pickFlag = false;

            this.m_ruisc.runBegin(true, true);
            this.m_ruisc.update(false, true);
            pickFlag = this.m_ruisc.isRayPickSelected();
            this.m_stageDragSwinger.setEnabled(!pickFlag);

            this.m_rscene.runBegin(false);
            this.m_rscene.update(false, !pickFlag);
            pickFlag = pickFlag || this.m_rscene.isRayPickSelected();

            /////////////////////////////////////////////////////// ---- mouseTest end.


            /////////////////////////////////////////////////////// ---- rendering begin.
            this.m_rscene.renderBegin();
            this.m_rscene.run(false);
            this.m_rscene.runEnd();

            this.m_ruisc.renderBegin();
            this.m_ruisc.run(false);
            this.m_ruisc.runEnd();
            /////////////////////////////////////////////////////// ---- rendering end.
            //*/

        }
        // DebugFlag.Reset();
    }

}
export default DemoParamCtrlUI;