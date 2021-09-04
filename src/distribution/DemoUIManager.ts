
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";


import DebugFlag from "../vox/debug/DebugFlag";
import {UILayoutBase} from "./uiManage/UILayoutBase";
import {VoxCoreExport} from "./voxCoreExports";
import RendererSubScene from "../vox/scene/RendererSubScene";
import CanvasTextureTool from "../orthoui/assets/CanvasTextureTool";
import Color4 from "../vox/material/Color4";

import SelectionEvent from "../vox/event/SelectionEvent";
import SelectionBar from "../orthoui/button/SelectionBar";

export class DemoUIManager {

    constructor() { }
    
    private m_rscene: RendererScene = null;
    private m_ruisc: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    private initLoadJS(module_ns:string): void {

        let pwindwo: any = window;

        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", "static/code/test/"+module_ns+".js", true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            console.log("progress, e: ", e);
            //document.body.innerText = Math.round(100.0 * e.loaded / e.total) + "%";
        };

        codeLoader.onload = function () {

            console.log("js code file load success.....");
            let scriptEle: HTMLScriptElement = document.createElement("script");

            scriptEle.onerror = (e) => {
                console.log("script onerror, e: ", e);
            }

            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);

            if (pwindwo[module_ns] != null) {
                let noduleIns = new pwindwo[module_ns]();
                noduleIns.initialize();
            }
        }
        codeLoader.send(null);
    }
    initialize(): void {

        console.log("DemoUIManager::initialize()......");
        if (this.m_rscene == null) {

            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setAttriStencil(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 200);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            
            // add common 3d display entity
            // let plane:Plane3DEntity = new Plane3DEntity();
            // plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            // this.m_rscene.addEntity(plane);
            

            let voxCoreExport = new VoxCoreExport();

            this.initUIScene();
            UILayoutBase.GetInstance().initialize(this.m_rscene, this.m_ruisc, this.m_texLoader);

            this.update();
        }
    }
    private initUIScene(): void {

        let rparam: RendererParam = new RendererParam();
        rparam.cameraPerspectiveEnabled = false;
        rparam.setCamProject(45.0, 0.1, 3000.0);
        rparam.setCamPosition(0.0, 0.0, 1500.0);

        let subScene: RendererSubScene = null;
        subScene = this.m_rscene.createSubScene();
        subScene.initialize(rparam);
        subScene.enableMouseEvent(true);
        this.m_ruisc = subScene;
        let stage = this.m_rscene.getStage3D();
        this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        this.m_ruisc.getCamera().update();
        CanvasTextureTool.GetInstance().initialize(this.m_rscene);
        CanvasTextureTool.GetInstance().initializeAtlas(1024,1024, new Color4(1.0,1.0,1.0,0.0), true);

        
        if (RendererDeviece.IsMobileWeb()) {
            this.m_btnSize *= 2;
            this.m_btnPX *= 2;
            this.m_btnPY *= 2;
        }
        this.createSelectBtn("加载分布式代码", "loadDistributedRuntimeCode", "已加载", "加载", false);
        
    }
    
    private m_btnSize: number = 24;
    private m_bgLength: number = 200.0;
    private m_btnPX: number = 162.0;
    private m_btnPY: number = 20.0;
    private m_btns: any[] = [];
    private m_menuBtn: SelectionBar = null;
    
    private createSelectBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false): SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
        selectBar.uuid = uuid;
        ///selectBar.testTex = this.getImageTexByUrl("static/assets/testEFT4.jpg");
        selectBar.initialize(this.m_ruisc, ns, selectNS, deselectNS, this.m_btnSize);
        selectBar.addEventListener(SelectionEvent.SELECT, this, this.selectChange);
        if (flag) {
            selectBar.select(false);
        }
        else {
            selectBar.deselect(false);
        }
        selectBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if (!visibleAlways) this.m_btns.push(selectBar);
        return selectBar;
    }

    private selectChange(evt: any): void {
        let selectEvt: SelectionEvent = evt as SelectionEvent;
        if(evt.uuid == "loadDistributedRuntimeCode") {
            selectEvt.target.disable();
            selectEvt.target.select(false);
            this.initLoadJS("UIManagementModule");
        }
    }
    private m_flag: boolean = true;
    private mouseDown(evt: any): void {

        this.m_flag = true;
        DebugFlag.Flag_0 = 1;
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps

        this.m_statusDisp.render();

    }
    run(): void {
        
        //  if(this.m_flag) {
        //      this.m_flag = false;
        //  }
        //  else {
        //      return;
        //  }
        //console.log("run begin...");
        
        UILayoutBase.GetInstance().run();

        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        //this.m_rscene.run(true);

        let pickFlag: boolean = true;

        this.m_ruisc.runBegin(true, true);
        this.m_ruisc.update(false, true);
        pickFlag = this.m_ruisc.isRayPickSelected();

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
    }
}
export default DemoUIManager;