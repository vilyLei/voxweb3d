
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
import Line3DEntity from "../../vox/entity/Line3DEntity";
import AABB2D from "../../vox/geom/AABB2D";
import TextureAtlas from "../../vox/texture/TextureAtlas";
import { TexArea } from "../../vox/texture/TexAreaNode";

class AltasSample {

    constructor() {
    }

    initialize(px: number, py: number): void {

        this.initTestAtlas(px, py);
    }
    private createImage(width: number, height: number,fillStyle: string = "#770000"): HTMLCanvasElement {

        //  let width: number = 78;
        //  let height: number = 50;
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'bolck';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.position = 'absolute';
        //canvas.style.visibility = "hidden";
        let ctx2D = canvas.getContext("2d");
        ctx2D.fillStyle = fillStyle;//"#770000";
        ctx2D.fillRect(0,0, width,height);

        return canvas;
    }
    
    canvas0: HTMLCanvasElement = null;
    canvas1: HTMLCanvasElement = null;

    private m_canvas2d0: any = null;
    private m_canvas2d1: any = null;
    altas0: TextureAtlas = null;
    altas1: TextureAtlas = null;
    private m_total_0: number = 0;
    private m_total_1: number = 0;
    private m_total_all: number = 200;
    private initTestAtlas(px: number, py: number): void {

        let color:Color4 = new Color4();
        let canvasWidth: number = 1024;
        let canvasHeight: number = 1024;

        let canvas0 = this.createImage(canvasWidth,canvasHeight, "#000000");        
        canvas0.style.width = '300px';
        canvas0.style.height = '300px';
        canvas0.style.left = px + 'px';
        canvas0.style.top = py + 'px';
        this.canvas0 = canvas0;
        //canvas.style.visibility = "hidden";
        let canvas2d0 = canvas0.getContext("2d");
        document.body.appendChild( canvas0 );

        let canvas1 = this.createImage(canvasWidth,canvasHeight, "#000000");        
        canvas1.style.width = '300px';
        canvas1.style.height = '300px';
        canvas1.style.left = px + 'px';
        canvas1.style.top = py + 310 + 'px';
        this.canvas1 = canvas1;
        //canvas.style.visibility = "hidden";
        let canvas2d1 = canvas1.getContext("2d");
        document.body.appendChild( canvas1 );

        let fontColor: Color4 = new Color4();
        
        let altas0: TextureAtlas = new TextureAtlas(canvasWidth,canvasHeight);
        let altas1: TextureAtlas = new TextureAtlas(canvasWidth,canvasHeight);
        altas0.setMinSize(16);
        altas1.setMinSize(16);

        this.altas0 = altas0;
        this.altas1 = altas1;
        this.m_canvas2d0 = canvas2d0;
        this.m_canvas2d1 = canvas2d1;
        
        for(let i: number = 0; i < this.m_total_all; i++) {
            color.randomRGB();
            fontColor.copyFrom(color);
            fontColor.inverseRGB();
            let image: any;
            let factor: number = Math.random();
            if(factor > 0.8) {
                image = this.createImage(30 + Math.round(20 * Math.random()),30 + Math.round(20 * Math.random()), color.getCSSHeXRGBColor());
            }
            else if(factor > 0.5) {
                if(Math.random() > 0.5) {
                    image = this.createImage(10 + Math.round(100 * Math.random()),10 + Math.round(100 * Math.random()), color.getCSSHeXRGBColor());
                }
                else {
                    image = this.createImage(10 + Math.round(30 * Math.random()),60 + Math.round(60 * Math.random()), color.getCSSHeXRGBColor());
                }
            }
            else {
                let colorNS: string = color.getCSSHeXRGBColor();
                let total: number = Math.round( Math.random() * 6);
                for(let j: number = 0; j < total; j++) {
                    colorNS = j + "" + colorNS;
                }
                image = altas0.createCharsTexture(colorNS,40,fontColor.getCSSDecRGBAColor(), color.getCSSDecRGBAColor());
            }
            //let image = this.createImage(30 + Math.round(80 * Math.random()),30 + Math.round(80 * Math.random()), color.getCSSHeXRGBColor());
            //let image = this.createImage(10 + Math.round(100 * Math.random()),10 + Math.round(100 * Math.random()), color.getCSSHeXRGBColor());
            //let image = altas.createCharsTexture(colorNS,40,fontColor.getCSSDecRGBAColor(), color.getCSSDecRGBAColor());

            let area: TexArea = altas0.addImageDebug("img"+i, image, canvas2d0);
            if(area == null) {
                area = altas1.addImageDebug("img"+i, image, canvas2d1);
                if(area != null) {
                    this.m_total_1++;
                }
            }
            else {
                this.m_total_0++;
            }
        }

        console.log("total_0: ",this.m_total_0);
        console.log("total_1: ",this.m_total_1);
        console.log(this.m_total_all+",left total: ",(this.m_total_all - (this.m_total_0 + this.m_total_1)));
    }
    private m_speI: number = 0;
    addImageBySize(pw: number, ph: number): void {

        let color:Color4 = new Color4();
        color.randomRGB();
        //  color.r = 1;
        //  color.g = 0;
        //  color.b = 0;
        this.m_total_all ++;
        let image = this.createImage(pw, ph, color.getCSSHeXRGBColor());
        let area: TexArea = this.altas0.addImageDebug("imgSpe"+this.m_speI, image, this.m_canvas2d0);
        if(area == null) {
            area = this.altas1.addImageDebug("imgSpe"+this.m_speI, image, this.m_canvas2d1);
            if(area != null) {
                console.log("B addImageBySize success.");
                this.m_total_1++;
                this.m_speI++;
            }
        }
        else {
            console.log("A addImageBySize success.");
            this.m_total_0++;
            this.m_speI++;
        }

        
        console.log("addImageBySize total_0: ",this.m_total_0);
        console.log("addImageBySize total_1: ",this.m_total_1);
        console.log(this.m_total_all+",left total: ",(this.m_total_all - (this.m_total_0 + this.m_total_1)));
    }
}
export class DemoUITexAtlas {
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
        console.log("DemoUITexAtlas::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
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

            let uMin: number = 0.0;
            let vMin: number = 0.0;
            let uMax: number = 0.5;
            let vMax: number = 0.5;
            let plane: Plane3DEntity;
            /*
            plane = new Plane3DEntity();
            plane.uvs = new Float32Array([
                
                uMin, vMin,
                uMax, vMin,
                uMax, vMax,
                uMin, vMax
            ]);
            plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/testEFT4.jpg")]);
            this.m_rscene.addEntity(plane);
            //*/
            //this.m_plane = plane;

            //  plane = new Plane3DEntity();
            //  plane.initializeXOZ(-200.0, -200.0, 400.0, 400.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
            //  plane.setXYZ(0.0, 50.0, 0.0);
            //  this.m_rscene.addEntity(plane);
            //  this.m_plane2 = plane;

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus", 200);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);
            //this.m_rscene.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMove);
            //this.m_rscene.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);

            this.update();

            this.initUIScene();
        }
    }

    private m_ruisc: RendererSubScene = null;
    private m_atlasSample0:AltasSample = null;
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
        //CanvasTextureTool.GetInstance().initialize(this.m_rscene);

        //this.initTestGeom();
        //this.initTestAtlas();

        this.m_atlasSample0 = new AltasSample();
        this.m_atlasSample0.initialize(10,10);
        let tex:ImageTextureProxy = this.m_rscene.textureBlock.createImageTex2D(1,1);
        
        //img0
        let plane: Plane3DEntity;

        let uMin: number = 0.0;
        let vMin: number = 0.0;
        let uMax: number = 0.5;
        let vMax: number = 0.5;
        plane = new Plane3DEntity();
        plane.uvs = new Float32Array([
            
            uMin, vMin,
            uMax, vMin,
            uMax, vMax,
            uMin, vMax
        ]);
        let texNS: string = "img"+(10 + Math.round(Math.random() * 100));
        let texArea: TexArea = this.m_atlasSample0.altas0.getAreaByName( texNS );
        if(texArea == null) {
            texArea = this.m_atlasSample0.altas1.getAreaByName( texNS );
            tex.setDataFromImage(this.m_atlasSample0.canvas1);
        }
        else {
            tex.setDataFromImage(this.m_atlasSample0.canvas0);
        }
        plane.uvs = texArea.uvs;
        console.log("plane.uvs: ",plane.uvs);
        //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/testEFT4.jpg")]);
        plane.initializeXOZ(-400.0, -200.0, 800.0, 400.0, [tex]);
        this.m_rscene.addEntity(plane);
    }
    private initTestGeom(): void {
        
        let rect0: AABB2D = new AABB2D();
        rect0.x = 10;
        rect0.y = 10;
        rect0.width = 100;
        rect0.height = 70;
        rect0.update();

        
        let rect1: AABB2D = new AABB2D();
        rect1.x = 30;
        rect1.y = 80.01;
        rect1.width = 100;
        rect1.height = 70;
        rect1.update();

        let selectFrame0: Line3DEntity = new Line3DEntity();
        selectFrame0.dynColorEnabled = true;
        selectFrame0.initializeRectXOY(0,0, rect0.width, rect0.height);
        selectFrame0.setXYZ(rect0.x,rect0.y, 0.1);
        this.m_ruisc.addEntity( selectFrame0 );
        
        let selectFrame1: Line3DEntity = new Line3DEntity();
        selectFrame1.dynColorEnabled = true;
        selectFrame1.initializeRectXOY(0,0, rect1.width, rect1.height);
        selectFrame1.setXYZ(rect1.x,rect1.y, 0.1);
        this.m_ruisc.addEntity( selectFrame1 );

        let intersectFlag: boolean = rect0.intersect(rect1);
        console.log("intersectFlag: ",intersectFlag);
    }
    private mouseBgDown(evt: any): void {
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...");
        DebugFlag.Flag_0 = 1;
        //this.m_atlasSample0.addImageBySize(33,35);
        this.m_atlasSample0.addImageBySize(10 + Math.round(100 * Math.random()), 10 + Math.round(100 * Math.random()));
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
export default DemoUITexAtlas;