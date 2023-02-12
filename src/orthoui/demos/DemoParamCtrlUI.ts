
import RendererDevice from "../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import TextureConst from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../usage/ParamCtrlUI";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";
import IRendererSceneGraphStatus from "../../vox/scene/IRendererSceneGraphStatus";
import IRendererScene from "../../vox/scene/IRendererScene";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Vector3D from "../../vox/math/Vector3D";
import IColorMaterial from "../../vox/material/mcase/IColorMaterial";

export class DemoParamCtrlUI {
    constructor() { }

    private m_rscene: IRendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController = new CameraZoomController();

    private m_graph = new RendererSceneGraph();
    private m_ctrlui = new ParamCtrlUI();

    private m_box0: Box3DEntity = null;
    private m_box1: Box3DEntity = null;
    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    private initSys(): void {

        this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
        this.m_cameraZoomController.initWithRScene(this.m_rscene);
        this.m_stageDragSwinger.initWithRScene(this.m_rscene);
        this.m_statusDisp.initialize();

        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        this.m_rscene.addEventListener(MouseEvent.MOUSE_MIDDLE_DOWN, this, this.mouseMiddleDown);

    }
    initialize(): void {
        console.log("DemoParamCtrlUI::initialize()......");
        if (this.m_rscene == null) {


            document.oncontextmenu = function (e) {
                e.preventDefault();
            }

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam = this.m_graph.createRendererParam();
            rparam.setCamPosition(1200.0, 1200.0, 1200.0);
            rparam.setAttriAntialias(true);
            rparam.setAttriAlpha(true);

            this.m_rscene = this.m_graph.createScene(rparam, 3);
            this.m_rscene.enableMouseEvent(true);

            this.initSys();
            this.update();
            this.initScene();
            this.initUI();

        }
    }
    private initScene(): void {

        this.m_box0 = new Box3DEntity();
        this.m_box0.initializeCube(150, [this.getTexByUrl("static/assets/box.jpg")]);
        this.m_rscene.addEntity(this.m_box0);

        this.m_box1 = new Box3DEntity();
        this.m_box1.initializeCube(100, [this.getTexByUrl("static/assets/metal_02.jpg")]);
        this.m_box1.setXYZ(150, 0, -200);
        this.m_rscene.addEntity(this.m_box1);
    }
    private initUI(): void {

        let ui = this.m_ctrlui;
        ui.initialize(this.m_rscene, true);

        console.log("initUI --------------------------------------");

        ui.addStatusItem("显示-A", "visible-a", "Yes", "No", true, (info: CtrlInfo): void => {
            this.m_box0.setVisible(info.flag);
        });
        ui.addStatusItem("显示-B", "visible-b", "Yes", "No", true, (info: CtrlInfo): void => {
            this.m_box1.setVisible(info.flag);
        });
        ui.addProgressItem("缩放-A", "scale", 1.0, (info: CtrlInfo): void => {
            let s = info.values[0];
            this.m_box0.setScaleXYZ(s, s, s);
            this.m_box0.update();
        });
        ui.addValueItem("X轴移动-B", "move-b", 0, -300, 300, (info: CtrlInfo): void => {
            
            let pv = new Vector3D();
            this.m_box1.getPosition(pv);
            pv.x = info.values[0];
            this.m_box1.setPosition(pv);
            this.m_box1.update();
        });
        ui.addValueItem("颜色-A", "color-a", 0.8, 0.0, 10, (info: CtrlInfo): void => {
            let values = info.values;
            console.log("color-a values: ", values, ", colorPick: ", info.colorPick);
            let material = this.m_box0.getMaterial() as IColorMaterial;
            material.setRGB3f(values[0], values[1], values[2]);
        }, true);
        ui.addValueItem("颜色-B", "color-b", 0.6, 0.0, 2.0, (info: CtrlInfo): void => {
            let values = info.values;
            console.log("color-b, values: ", values, ", colorPick: ", info.colorPick);
            let material = this.m_box1.getMaterial() as IColorMaterial;
            material.setRGB3f(values[0], values[1], values[2]);
        }, true);

        ui.updateLayout(true);

        let node = this.m_graph.addScene(ui.ruisc);
        node.setPhase0Callback(null, (sc: IRendererScene, st: IRendererSceneGraphStatus): void => {
            /**
             * 设置摄像机转动操作的启用状态
             */
            this.m_stageDragSwinger.setEnabled(!st.rayPickFlag);
        })
    }
    private mouseDown(evt: any): void {
    }
    private mouseMiddleDown(evt: any): void {

        console.log("mouse middle down... ...");
        /**
         * 直接同步参数数据到UI和控制对象
         */
        let item = this.m_ctrlui.getItemByUUID("move-b");
        item.param.value = 50;
        item.syncEnabled = true;
        item.updateParamToUI();
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

    }

    run(): void {

        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);

        this.m_graph.run();
    }

}
export default DemoParamCtrlUI;