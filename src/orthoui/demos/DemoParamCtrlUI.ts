
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
import { ItemCallback, CtrlParamItem, ParamCtrlUI } from "../usage/ParamCtrlUI";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";
import IRendererSceneGraphStatus from "../../vox/scene/IRendererSceneGraphStatus";
import IRendererScene from "../../vox/scene/IRendererScene";

export class DemoParamCtrlUI {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_grap = new RendererSceneGraph();
    private m_ui = new ParamCtrlUI();
    private m_axis: Axis3DEntity = null;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
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

            let axis = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            this.m_axis = axis;

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            //this.m_rscene.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMove);
            //this.m_rscene.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);

            this.update();

            this.initUI();

        }
    }

    private m_ruisc: RendererSubScene = null;
    private createSelectBtn(name: string, uuid: string, selectNS: string, deselectNS: string, callback: ItemCallback): void {
        let item: CtrlParamItem = {
            type: "status_select", name: name, uuid: uuid,
            selectNS: selectNS, deselectNS: deselectNS,
            flag: false,
            visibleAlways: true,
            callback: callback
        };

        let ui = this.m_ui;
        ui.addItem(item);
    }
    private createProgressBtn(name: string, uuid: string, progress: number, callback: ItemCallback, colorPick?: boolean): void {
        let item: CtrlParamItem = {
            type: "progress", name: name, uuid: uuid,
            progress: progress,
            visibleAlways: true,
            colorPick: colorPick,
            callback: callback
        };

        let ui = this.m_ui;
        ui.addItem(item);
    }

    private createValueBtn(name: string, uuid: string, value: number, minValue: number, maxValue: number, callback: ItemCallback, colorPick?: boolean): void {
        let item: CtrlParamItem = {
            type: "number_value", name: name, uuid: uuid,
            value: value,
            minValue: minValue,
            maxValue: maxValue,
            visibleAlways: true,
            colorPick: colorPick,
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
        this.createSelectBtn("透明测试", "alphaTest", "ON", "OFF", (type: string, uuid: string, values: number[], flag: boolean, colorPick?: boolean): void => {
            console.log("flag: ", flag);
        });
        this.createProgressBtn("缩放值", "scale", 0.3, (type: string, uuid: string, values: number[], flag: boolean, colorPick?: boolean): void => {
            console.log("progress: ", values[0]);
            let s = values[0];
            this.m_axis.setScaleXYZ(s, s, s);
            this.m_axis.update();
        });
        this.createValueBtn("XXXX体重", "weight", 50, 10, 70, (type: string, uuid: string, values: number[], flag: boolean): void => {
            console.log("value: ", values[0]);
        });
        // this.createValueBtn("长度", "width", 500, 100, 700,(type: string, uuid: string, values: number[], flag: boolean): void => {
        //     console.log("value: ", values[0]);
        // });
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