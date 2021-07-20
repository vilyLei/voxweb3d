
import RendererDeviece from "../../vox/render/RendererDeviece";
import RendererParam from "../../vox/scene/RendererParam";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import RendererState from "../../vox/render/RendererState";
import { GLBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import RendererSubScene from "../../vox/scene/RendererSubScene";
import ColorRectImgButton from "../../orthoui/button/ColorRectImgButton";
import DebugFlag from "../../vox/debug/DebugFlag";
import ImageTextureProxy from "../../vox/texture/ImageTextureProxy";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import CanvasTextureTool from "./base/CanvasTextureTool";
import ProgressBar from "./base/ProgressBar";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import EventBase from "../../vox/event/EventBase";
import SelectionBar from "./base/SelectionBar";
import SelectionEvent from "../../vox/event/SelectionEvent";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import RGBColorPanel, { RGBColoSelectEvent } from "../panel/RGBColorPanel";
import Color4 from "../../vox/material/Color4";
import Vector3D from "../../vox/math/Vector3D";

export class DemoOrthoBtn {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_plane: Plane3DEntity = null;
    private m_plane2: Plane3DEntity = null;
    private m_axis: Axis3DEntity = null;

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoOrthoBtn::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
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

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(500.0);
            this.m_rscene.addEntity(axis);
            this.m_axis = axis;

            let plane: Plane3DEntity;

            //  plane = new Plane3DEntity();
            //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //  this.m_rscene.addEntity(plane);
            //this.m_plane = plane;

            //  plane = new Plane3DEntity();
            //  plane.initializeXOZ(-200.0, -200.0, 400.0, 400.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
            //  plane.setXYZ(0.0, 50.0, 0.0);
            //  this.m_rscene.addEntity(plane);
            //  this.m_plane2 = plane;

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus", 300);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);
            //this.m_rscene.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMove);
            //this.m_rscene.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);

            this.update();

            this.initUIScene();

        }
    }

    private m_ruisc: RendererSubScene = null;
    private m_rgbPanel: RGBColorPanel;
    private m_colorIntensity: number = 1.0;
    private m_color: Color4 = new Color4();
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

        this.initUI();
    }
    
    private m_btnSize: number = 24;
    private m_bgLength: number = 200.0;
    private m_btnPX: number = 102.0;
    private m_btnPY: number = 10.0;

    private m_btns: any[] = [];
    private m_menuBtn: SelectionBar = null;
    private createSelectBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false): SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
        selectBar.uuid = uuid;
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
    private createProgressBtn(ns: string, uuid: string, progress: number, visibleAlways: boolean = false): ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(this.m_ruisc, ns, this.m_btnSize, this.m_bgLength);
        proBar.setProgress(progress, false);
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if (!visibleAlways) this.m_btns.push(proBar);
        return proBar;
    }

    private createValueBtn(ns: string, uuid: string, value: number, minValue: number, maxValue: number, visibleAlways: boolean = false): ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = uuid;
        proBar.initialize(this.m_ruisc, ns, this.m_btnSize, this.m_bgLength);
        proBar.minValue = minValue;
        proBar.maxValue = maxValue;
        proBar.setValue(value, false);

        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        if (!visibleAlways) this.m_btns.push(proBar);
        return proBar;
    }
    private initCtrlBars(): void {

        if (RendererDeviece.IsMobileWeb()) {
            this.m_btnSize = 64;
            this.m_btnPX = 280;
            this.m_btnPY = 30;            
        }
        if(RendererDeviece.IsWebGL1()) {
            this.m_btnPX += 32;
        }

        
        this.m_menuBtn = this.createSelectBtn("", "menuCtrl", "Menu Open", "Menu Close", false, true);
        ///*
        this.metalBtn = this.createProgressBtn("metal", "metal", 0.5);
        this.roughBtn = this.createProgressBtn("rough", "rough", 0.5);
        this.noiseBtn = this.createProgressBtn("noise", "noise", 0.07);
        this.reflectionBtn = this.createProgressBtn("reflection", "reflection", 0.5);

        this.sideBtn = this.createValueBtn("side", "side", 1.0, 0.1, 30.0);
        ///*
        this.surfaceBtn = this.createValueBtn("surface", "surface", 1.0, 0.1, 30.0);
        this.scatterBtn = this.createValueBtn("scatter", "scatter", 1.0, 0.1, 128.0);
        this.toneBtn = this.createValueBtn("tone", "tone", 2.0, 0.1, 128.0);
        ///*
        this.createSelectBtn("absorb", "absorb", "ON", "OFF", false);
        this.createSelectBtn("vtxNoise", "vtxNoise", "ON", "OFF", false);

        this.f0ColorBtn = this.createValueBtn("F0Color", "F0Color", 1.0, 0.01, 32.0);
        this.albedoBtn = this.createValueBtn("albedo", "albedo", 0.2, 0.01, 5.0);
        this.ambientBtn = this.createValueBtn("ambient", "ambient", 0.1, 0.01, 1.0);
        this.specularBtn = this.createValueBtn("specular", "specular", 1.0, 0.01, 1.0);
        //*/
    }
    
    metalBtn: ProgressBar;
    roughBtn: ProgressBar;
    noiseBtn: ProgressBar;
    reflectionBtn: ProgressBar;
    sideBtn: ProgressBar;
    surfaceBtn: ProgressBar;
    scatterBtn: ProgressBar;
    toneBtn: ProgressBar;
    f0ColorBtn: ProgressBar;
    albedoBtn: ProgressBar;
    ambientBtn: ProgressBar;
    specularBtn: ProgressBar;
    private initUI(): void {

        this.initCtrlBars();
        return;
        /*
        let size: number = 32;
        let tex:TextureProxy = CanvasTextureTool.GetInstance().createCharTexture("AAXX", size, "rgba(180,180,180,1.0)");
        let nameBtn: ColorRectImgButton = new ColorRectImgButton();
        nameBtn.premultiplyAlpha = true;
        nameBtn.flipVerticalUV = true;
        nameBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
        nameBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
        nameBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
        nameBtn.initialize(0.0, 0.0, tex.getWidth(), size, [tex]);
        nameBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        nameBtn.setXYZ(100,200.0,0.0);
        this.m_ruisc.addEntity(nameBtn);
        //*/
        /*
        let size: number = 64;
        let px: number = 200;
        let py: number = 10;
        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = "prog";
        proBar.initialize(this.m_ruisc, "prog");
        proBar.setProgress(1.0);
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(px, py);
        py += 64 + 1;
        //*/
        /*
        let selectBar: SelectionBar = new SelectionBar();
        selectBar.initialize(this.m_ruisc, "select");
        selectBar.addEventListener(SelectionEvent.SELECT, this, this.selectChange);
        selectBar.setXY(px, py);
        selectBar.deselect(false);
        py += 64 + 1;

        let colorBar: ProgressBar = new ProgressBar();
        colorBar.uuid = "color";
        colorBar.initialize(this.m_ruisc, "color");
        colorBar.setProgress(1.0);
        colorBar.minValue = 0.0;
        colorBar.maxValue = 2.0;
        colorBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        colorBar.setXY(px, py);
        py += 64 + 1;

        
        this.m_rgbPanel = new RGBColorPanel();
        this.m_rgbPanel.initialize(32,4);
        this.m_rgbPanel.addEventListener(RGBColoSelectEvent.COLOR_SELECT, this, this.selectColor);
        this.m_rgbPanel.setXY(px,py);
        this.m_ruisc.addContainer(this.m_rgbPanel);
        this.m_rgbPanel.close();
        //*/
    }
    private selectColor(evt: any): void {
        let currEvt: RGBColoSelectEvent = evt as RGBColoSelectEvent;
        this.m_color.copyFrom(currEvt.color);
        //this.m_color.scaleBy();
        (this.m_plane.getMaterial() as any).setRGB3f(
            this.m_color.r * this.m_colorIntensity,
            this.m_color.g * this.m_colorIntensity,
            this.m_color.b * this.m_colorIntensity);
    }
    private progressChange(evt: any): void {
        let progEvt: ProgressDataEvent = evt as ProgressDataEvent;
        console.log("progressChange, progress: ", progEvt.progress);
        switch(evt.uuid)
        {
            case "prog":
                this.m_colorIntensity = progEvt.progress;
                (this.m_plane.getMaterial() as any).setRGB3f(progEvt.progress, 1.0,1.0);
                break;
            case "color":
                if(progEvt.status != 0) {
                    this.m_colorIntensity = progEvt.value;
                    (this.m_plane.getMaterial() as any).setRGB3f(
                        this.m_color.r * this.m_colorIntensity,
                        this.m_color.g * this.m_colorIntensity,
                        this.m_color.b * this.m_colorIntensity);
                }
                else {
                    if(this.m_rgbPanel.isClosed())this.m_rgbPanel.open();
                    else this.m_rgbPanel.close();
                }
                return;
                break;
            default:
                break;
        }
        //(this.m_plane.getMaterial() as any).setRGB3f(1.0, progEvt.progress, 1.0);
        if(this.m_rgbPanel != null)this.m_rgbPanel.close();
    }
    private selectChange(evt: any): void {
        let progEvt: SelectionEvent = evt as SelectionEvent;
        console.log("selectChange, flag: ", progEvt.flag, this.m_plane2);
        //this.m_axis.setVisible( progEvt.flag );
        ///*
        ///*
        this.m_rscene.removeEntity(this.m_plane2);
        let material: Default3DMaterial = new Default3DMaterial();
        if(progEvt.flag) {
            material.setTextureList([this.getImageTexByUrl("static/assets/default.jpg")]);
            material.initializeByCodeBuf(true);
        }
        else {
            material.setTextureList([this.getImageTexByUrl("static/assets/box_wood01.jpg")]);
            material.initializeByCodeBuf(true);
        }
        this.m_plane2.setMaterial(material);
        
        this.m_rscene.addEntity(this.m_plane2);
        //*/
        //this.m_plane2.updateMaterialToGpu( this.m_rscene.getRenderProxy() );
        //*/
        if(this.m_rgbPanel != null)this.m_rgbPanel.close();
    }
    private mouseBgDown(evt: any): void {
        if(this.m_rgbPanel != null)this.m_rgbPanel.close();
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...");
        DebugFlag.Flag_0 = 1;
    }
    private mouseMove(evt: any): void {
        console.log("mouse move... ...");
    }
    private enterFrame(evt: any): void {
        console.log("enter frame... ...");
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        //this.m_statusDisp.render();
    }

    run(): void {

        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        this.m_rscene.setClearRGBColor3f(0.0, 0.2, 0.0);
        let renderingType: number = 1;
        if(renderingType < 1) {
            // current rendering strategy
            this.m_rscene.run( true );
            if(this.m_ruisc != null) this.m_ruisc.run( true );
        }
        else {
            /////////////////////////////////////////////////////// ---- mouseTest begin.
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

            /////////////////////////////////////////////////////// ---- rendering end.

        }

        //this.m_profileInstance.run();

        DebugFlag.Reset();
    }

}
export default DemoOrthoBtn;