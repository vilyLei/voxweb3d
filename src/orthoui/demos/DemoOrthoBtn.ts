
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import TextureConst from "../../vox/texture/TextureConst";
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
import RectSelectionButton from "../../orthoui/button/RectSelectionButton";
import DebugFlag from "../../vox/debug/DebugFlag";
import ImageTextureProxy from "../../vox/texture/ImageTextureProxy";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import CanvasTextureTool from "../assets/CanvasTextureTool";
import ProgressBar from "../button/ProgressBar";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import EventBase from "../../vox/event/EventBase";
import SelectionBar from "../button/SelectionBar";
import SelectionEvent from "../../vox/event/SelectionEvent";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import RGBColorPanel, { RGBColoSelectEvent } from "../panel/RGBColorPanel";
import Color4 from "../../vox/material/Color4";
import Vector3D from "../../vox/math/Vector3D";
import SelectionAtlasBar from "../button/SelectionAtlasBar";
import Line3DEntity from "../../vox/entity/Line3DEntity";
import { Bezier2Curve } from "../../vox/geom/curve/BezierCurve";

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
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
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

            //  let axis: Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(500.0);
            //  this.m_rscene.addEntity(axis);
            //  this.m_axis = axis;

            let plane: Plane3DEntity;

            //  plane = new Plane3DEntity();
            //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //  this.m_rscene.addEntity(plane);
            //this.m_plane = plane;
            /*
            let uvs: Float32Array = new Float32Array([
                0.0, 1.0,
                1.0, 1.0,
                1.0, 0.0,
                0.0, 0.0
            ]);
            plane = new Plane3DEntity();
            plane.initializeXOZ(-200.0, -200.0, 400.0, 400.0, [this.getImageTexByUrl("static/assets/testFT4.jpg")]);
            plane.setXYZ(0.0, 50.0, 0.0);
            this.m_rscene.addEntity(plane);
            this.m_plane2 = plane;
            //*/

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);
            //this.m_rscene.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMove);
            //this.m_rscene.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);

            this.update();

            this.initUIScene();
            this.updateCurve(0.5, -1.0);

        }
    }
    updateCurve(factor: number, radiusFactor: number): void {
        let posList: Vector3D[] = this.getCurvePosList(factor, radiusFactor);
        this.drawCurve(posList, factor, radiusFactor);
    }
    
    private m_bezier2: Bezier2Curve = new Bezier2Curve();
    private m_flag0: boolean = true;
    private m_offsetFactor: number = 0.5;
    private m_radiusFactor: number = 1.0;
    getCurvePosList(factor: number, radiusFactor: number): Vector3D[] {

        let total: number = 20;
        let y0: number = 300;
        let y1: number = 70;
        let dy: number = Math.abs(y1 - y0);
        this.m_bezier2.begin.setXYZ(0, y0, 0);
        this.m_bezier2.end.setXYZ(dy + 1.0, y1, 0);
        this.m_bezier2.setSegTot(total);

        let dis: number = Vector3D.Distance(this.m_bezier2.begin, this.m_bezier2.end);

        let direcTV: Vector3D = new Vector3D();
        direcTV.subVecsTo(this.m_bezier2.end, this.m_bezier2.begin);
        let direcNV: Vector3D = new Vector3D(-direcTV.y, direcTV.x);
        direcNV.normalize();
        direcNV.scaleBy(radiusFactor * dy);

        direcTV.normalize();
        direcTV.scaleBy(dis * factor);
        this.m_bezier2.ctrPos.addVecsTo(direcTV, this.m_bezier2.begin);
        this.m_bezier2.ctrPos.addBy(direcNV);

        this.m_bezier2.updateCalc();
        return this.m_bezier2.getPosList();

    }

    private m_curveLS: Line3DEntity = null;
    private drawCurve(posList: Vector3D[], factor: number, radiusFactor: number): void {
        if (this.m_curveLS != null) {
            
            radiusFactor = radiusFactor * 0.5 + 0.5;
            let f = factor * radiusFactor;
            this.m_curveLS.setRGB3f(factor, radiusFactor, f);
            this.m_curveLS.initializeByPosList(posList);
            this.m_curveLS.reinitializeMesh();
            this.m_curveLS.updateMeshToGpu();
            return;
        }
        let ls: Line3DEntity = new Line3DEntity();
        this.m_curveLS = ls;
        ls.dynColorEnabled = true;
        ls.initializeByPosList(posList);
        radiusFactor = radiusFactor * 0.5 + 0.5;
        let f = factor * radiusFactor;
        ls.setRGB3f(factor, radiusFactor, f);
        ls.setXYZ(50, 100, 1);
        this.m_ruisc.addEntity(ls);
        if (this.m_flag0) {
            this.m_flag0 = false;
            ls = new Line3DEntity();
            ls.dynColorEnabled = true;
            //ls.setRGB3f(0.0,1.0,0.0);
            ls.initializeByPosList([this.m_bezier2.begin, this.m_bezier2.end]);
            ls.setXYZ(50, 100, 1);
            this.m_ruisc.addEntity(ls);
        }
    }
    private m_ruisc: RendererSubScene = null;
    private m_rgbPanel: RGBColorPanel;
    private m_colorIntensity: number = 1.0;
    private m_color: Color4 = new Color4();
    private initUIScene(): void {

        let rparam: RendererParam = new RendererParam();
        rparam.cameraPerspectiveEnabled = false;
        rparam.setAttriAlpha(false);
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
        CanvasTextureTool.GetInstance().initializeAtlas(1024, 1024, new Color4(1.0, 1.0, 1.0, 0.0), true);
        //return;
        // let tex: TextureProxy = this.getImageTexByUrl("static/assets/texFour01.png");
        // tex.flipY = true;
        // let rectTexBtn: RectSelectionButton = new RectSelectionButton();
        // rectTexBtn.bgSelectOverColor.setRGB3f(0.7, 0.7, 0.7);
        // rectTexBtn.bgSelectOutColor.setRGB3f(0.5, 0.5, 0.5);
        // rectTexBtn.uuid = "sbt_01";
        // rectTexBtn.bgUVClampRect.setTo(0.0, 0.5, 0.5, 0.5);
        // //rectTexBtn.bgUVClampRect.setTo(0.5, 0.5, 0.5, 0.5);
        // rectTexBtn.deselectUVClampRect.setTo(0.5, 0.0, 0.5, 0.5);
        // rectTexBtn.selectUVClampRect.setTo(0.5, 0.5, 0.5, 0.5);
        // rectTexBtn.initialize(0, 0, 100, 80, [tex]);
        // rectTexBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        // rectTexBtn.setXYZ(100, 200.0, 0);
        // this.m_ruisc.addEntity(rectTexBtn);
        // rectTexBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown2);
        // rectTexBtn.addEventListener(SelectionEvent.SELECT, this, this.selectChange2);
        /*
        let plane: Plane3DEntity = new Plane3DEntity();
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [CanvasTextureTool.GetInstance().getAtlasAt(0).getTexture()]);
        this.m_rscene.addEntity(plane);
        //*/
        this.initUI();

        // let pimg: HTMLCanvasElement = this.createCharsTexture2("锦",64);
        // pimg.style.left = '50px';
        // pimg.style.top = '128px';
        // document.body.appendChild( pimg );
    }
    private mouseDown2(evt: any): void {
        console.log("mouseDown2(), ", evt);
    }
    private selectChange2(evt: any): void {
        let progEvt: SelectionEvent = evt as SelectionEvent;
        console.log(progEvt, ", selectChange2(), progEvt.flag: ", progEvt.flag);
    }
    private m_btnSize: number = 24;
    private m_bgLength: number = 200.0;
    private m_btnPX: number = 102.0;
    private m_btnPY: number = 10.0;
    private m_ySpace: number = 4.0;

    private m_btns: any[] = [];
    private m_menuBtn: SelectionBar = null;
    createCharsTexture2(chars: string, size: number, font: string = "宋体"): HTMLCanvasElement {

        let width: number = size;
        let height: number = size + Math.round(size * 0.5);
        if (chars.length > 1) {
            width = size * chars.length;
        }

        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'bolck';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.position = 'absolute';
        canvas.style.backgroundColor = 'transparent';
        //canvas.style.pointerEvents = 'none';

        let ctx2D = canvas.getContext("2d");
        ctx2D.font = (size - 4) + "px " + font;
        //ctx2D.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
        ctx2D.textBaseline = "top";
        var metrics: any = ctx2D.measureText(chars);
        let texWidth: number = metrics.width;
        ctx2D.textAlign = "left";
        ctx2D.fillStyle = "#ffffff";
        ctx2D.fillText(chars, (width - texWidth) * 0.5, 0);
        let imgData: ImageData = ctx2D.getImageData(0, 0, width, height);
        let pixels = imgData.data;

        let minY: number = 0;
        let maxY: number = 0;
        // let minX: number = 0;
        // let maxX: number = 0;
        let k: number = 0;

        // calc minY
        for (let i: number = 0; i < height; ++i) {
            for (let j: number = 0; j < width; ++j) {
                k = ((i * width + j) << 2) + 3;
                if (pixels[k] > 0) {
                    minY = i;
                    i = height;
                    break;
                }
            }
        }
        // calc maxY
        for (let i: number = height - 1; i >= 0; --i) {
            for (let j: number = 0; j < width; ++j) {
                k = ((i * width + j) << 2) + 3;
                if (pixels[k] > 0) {
                    maxY = i;
                    i = -1;
                    break;
                }
            }
        }
        // // calc minX
        // for(let j: number = 0; j < width; ++j) {
        //     for(let i: number = 0; i < height; ++i) {
        //         k = ((i * width + j) << 2) + 3;
        //         if(pixels[k] > 0) {
        //             minX = j;
        //             j = width;
        //             break;
        //         }
        //     }
        // }
        // // calc minX
        // for(let j: number = width - 1; j >= 0; --j) {
        //     for(let i: number = 0; i < height; ++i) {
        //         k = ((i * width + j) << 2) + 3;
        //         if(pixels[k] > 0) {
        //             maxX = j;
        //             j = -1;
        //             break;
        //         }
        //     }
        // }
        // console.log("minX, maxX: ", minX, maxX);
        console.log("minY, maxY: ", minY, maxY);
        return canvas;
    }
    private createSelectAtlasBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false): SelectionAtlasBar {

        let selectBar: SelectionAtlasBar = new SelectionAtlasBar();
        selectBar.uuid = uuid;
        selectBar.initialize(this.m_ruisc, ns, selectNS, deselectNS, this.m_btnSize);
        //selectBar.addEventListener(SelectionEvent.SELECT, this, this.selectChange);
        if (flag) {
            selectBar.select(false);
        }
        else {
            selectBar.deselect(false);
        }
        selectBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + this.m_ySpace;
        if (!visibleAlways) this.m_btns.push(selectBar);
        return selectBar;
    }
    private createSelectBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false): SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
        selectBar.uuid = uuid;
        selectBar.fontBgColor.setRGBA4f(1.0, 0.0, 1.0, 0.0);
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
        this.m_btnPY += this.m_btnSize + this.m_ySpace;
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
        this.m_btnPY += this.m_btnSize + this.m_ySpace;
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
        this.m_btnPY += this.m_btnSize + this.m_ySpace;
        if (!visibleAlways) this.m_btns.push(proBar);
        return proBar;
    }
    private initCtrlBars(): void {

        if (RendererDevice.IsMobileWeb()) {
            this.m_btnSize = 64;
            this.m_btnPX = 280;
            this.m_btnPY = 30;
        }
        if (RendererDevice.IsWebGL1()) {
            this.m_btnPX += 32;
        }

        this.createSelectBtn("absorb", "absorb", "ON", "OFF", false);
        this.createSelectBtn("vtxNoise", "vtxNoise", "ON", "OFF", false);
        this.metalBtn = this.createProgressBtn("metal", "metal", 0.5);
        this.roughBtn = this.createProgressBtn("rough", "rough", 0.5);
        return;
        this.m_menuBtn = this.createSelectBtn("", "menuCtrl", "Menu Open", "Menu Close", false, true);

        //  this.createSelectAtlasBtn("Atlas", "menuCtrl", "Menu Open", "Menu Close", false, true);
        //  //this.createSelectBtn("XurrdB", "menuCtrl", "Menu Open", "Menu Close", false, true);
        //  this.metalBtn = this.createProgressBtn("metal", "metal", 0.5);
        //  this.sideBtn = this.createValueBtn("side", "side", 1.0, 0.1, 30.0);
        //  /*
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
        let tex:TextureProxy = CanvasTextureTool.GetInstance().createCharsTexture("AAXX", size, "rgba(180,180,180,1.0)");
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

        if (this.m_plane != null) {
            (this.m_plane.getMaterial() as any).setRGB3f(
                this.m_color.r * this.m_colorIntensity,
                this.m_color.g * this.m_colorIntensity,
                this.m_color.b * this.m_colorIntensity);
        }
    }
    private progressChange(evt: any): void {
        let progEvt: ProgressDataEvent = evt as ProgressDataEvent;
        console.log("progressChange, progress: ", progEvt.progress);
        switch (evt.uuid) {
            case "rough":
                this.m_radiusFactor = 2.0 * (progEvt.progress - 0.5);
                this.updateCurve(this.m_offsetFactor, this.m_radiusFactor);
                break;
            case "metal":
                this.m_offsetFactor = progEvt.progress;
                this.updateCurve(this.m_offsetFactor, this.m_radiusFactor);
                break;
            case "prog":
                this.m_colorIntensity = progEvt.progress;
                (this.m_plane.getMaterial() as any).setRGB3f(progEvt.progress, 1.0, 1.0);
                break;
            case "color":
                if (progEvt.status != 0) {
                    this.m_colorIntensity = progEvt.value;
                    (this.m_plane.getMaterial() as any).setRGB3f(
                        this.m_color.r * this.m_colorIntensity,
                        this.m_color.g * this.m_colorIntensity,
                        this.m_color.b * this.m_colorIntensity);
                }
                else {
                    if (this.m_rgbPanel.isClosed()) this.m_rgbPanel.open();
                    else this.m_rgbPanel.close();
                }
                return;
                break;
            default:
                break;
        }
        //(this.m_plane.getMaterial() as any).setRGB3f(1.0, progEvt.progress, 1.0);
        //if (this.m_rgbPanel != null) this.m_rgbPanel.close();
    }
    private selectChange(evt: any): void {
        let progEvt: SelectionEvent = evt as SelectionEvent;
        console.log("selectChange, flag: ", progEvt.flag, this.m_plane2);
        if (this.m_plane2 == null) {
            return;
        }
        //*
        let uvs: Float32Array = new Float32Array([
            0.0, 0.5,
            0.5, 0.5,
            0.5, 0.0,
            0.0, 0.0
        ]);
        this.m_plane2.setUVS(uvs);
        this.m_plane2.reinitializeMesh();
        //this.m_plane2.updateMeshToGpu(this.m_rscene.getRenderProxy());
        this.m_plane2.updateMeshToGpu();
        return;
        //*/
        //this.m_axis.setVisible( progEvt.flag );
        ///*
        ///*
        this.m_rscene.removeEntity(this.m_plane2);
        let material: Default3DMaterial = new Default3DMaterial();
        if (progEvt.flag) {
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
        if (this.m_rgbPanel != null) this.m_rgbPanel.close();
    }
    private mouseBgDown(evt: any): void {
        if (this.m_rgbPanel != null) this.m_rgbPanel.close();
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
        if (renderingType < 1) {
            // current rendering strategy
            this.m_rscene.run(true);
            if (this.m_ruisc != null) this.m_ruisc.run(true);
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

        //console.log("RendererState.DrawCallTimes: ",RendererState.DrawCallTimes);
        //this.m_profileInstance.run();

        DebugFlag.Reset();
    }

}
export default DemoOrthoBtn;