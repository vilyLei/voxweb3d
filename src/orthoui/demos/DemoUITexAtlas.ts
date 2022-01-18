
import RendererDevice from "../../vox/render/RendererDevice";
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
import Line3DEntity from "../../vox/entity/Line3DEntity";
import AABB2D from "../../vox/geom/AABB2D";
import TextureAtlas from "../../vox/texture/TextureAtlas";
import ImageTextureAtlas from "../../vox/texture/ImageTextureAtlas";
import { TexArea } from "../../vox/texture/TexAreaNode";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

class AltasSample {

    private m_rscene: RendererScene = null;
    constructor() {
    }

    initialize(rscene: RendererScene, px: number, py: number, debug: boolean): void {
        this.m_rscene = rscene;
        this.initTestAtlas(px, py, debug);
    }
    private createImage(width: number, height: number, fillStyle: string = "#770000"): HTMLCanvasElement {

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
        ctx2D.fillRect(0, 0, width, height);

        return canvas;
    }

    altas0: ImageTextureAtlas = null;
    altas1: ImageTextureAtlas = null;
    private m_total_0: number = 0;
    private m_total_1: number = 0;
    private m_total_all: number = 200;
    canvasWidth: number = 1024;
    canvasHeight: number = 1024;
    canvasStyleWidth: number = 256;
    canvasStyleHeight: number = 256;
    canvas0x: number = 10;
    canvas0y: number = 10;
    canvas1x: number = 10;
    canvas1y: number = 10;
    rect0: AABB2D = null;
    rect1: AABB2D = null;
    story: string =
`
Learning a language is hard. With Easy Stories in English, you can learn English the natural way, without studying lists of vocabulary or complicated grammar rules. Every week, Ariel Goodbody, author and language teacher, will present a story adapted to your level of English.
The stories will be hilarious, dramatic, and entertaining, but never too difficult. If you’re learning English and are tired of boring textbooks, then this is the podcast for you Before long, Agnes came to a yard with many hens and many geese. What a noise they made!  Ca-ca, quawk, quawk!  In the middle of all these birds there was a young woman.  She was feeding them corn, and she waved to Agnes.  Agnes waved back.  Soon the two women were talking away
The man and woman cut one flower here, and another there.  Soon the had more lovely flowers than their  arms could hold.  Oh, never was there a sweeter bunch of flowers!  And they handed it all to Agnes
Soon Agnes came upon a young lord, dressed in very fine clothes and with a gold chain around his neck.  But such a frown on his face!  He looked as if he had no friend left in the whole wide world
The man and woman cut one flower here, and another there.  Soon the had more lovely flowers than their  arms could hold.  Oh, never was there a sweeter bunch of flowers!  And they handed it all to Agnes
`;
    story0: string =
`
Learning a language is hard
`;
    private initTestAtlas(px: number, py: number, debug: boolean): void {

        let color: Color4 = new Color4();


        let fontColor: Color4 = new Color4();

        let altas0: ImageTextureAtlas = new ImageTextureAtlas(this.m_rscene, this.canvasWidth, this.canvasHeight, new Color4(0.0, 0.0, 0.0, 1.0), false, debug);
        let altas1: ImageTextureAtlas = new ImageTextureAtlas(this.m_rscene, this.canvasWidth, this.canvasHeight, new Color4(0.0, 0.0, 0.0, 1.0), false, debug);
        altas0.setMinSize(16);
        altas1.setMinSize(16);

        this.altas0 = altas0;
        this.altas1 = altas1;

        let canvas0 = altas0.getCanvas();
        canvas0.style.width = this.canvasStyleWidth + 'px';
        canvas0.style.height = this.canvasStyleHeight + 'px';
        canvas0.style.left = px + 'px';
        canvas0.style.top = py + 'px';
        this.canvas0x = px;
        this.canvas0y = py;
        this.rect0 = new AABB2D(px,py, this.canvasStyleWidth, this.canvasStyleHeight);
        py += 310;
        let canvas1 = altas1.getCanvas();
        canvas1.style.width = this.canvasStyleWidth + 'px';
        canvas1.style.height = this.canvasStyleHeight + 'px';
        canvas1.style.left = px + 'px';
        canvas1.style.top = py + 'px';
        this.canvas1x = px;
        this.canvas1y = py;
        this.rect1 = new AABB2D(px,py, this.canvasStyleWidth, this.canvasStyleHeight);

        let debugEnabled: boolean = true;
        if (debugEnabled) {
            document.body.appendChild(canvas0);
            document.body.appendChild(canvas1);
        }
        
        let temp_words: string[] = this.story.split(" ");
        let words: string[] = [];
        //for(let i: number = 0; i < temp_words.length; i++) {
        for(; temp_words.length > 0; ) {
            let k: number = Math.round(Math.random() * (temp_words.length - 1));
            if(temp_words[k] != "") {
                // 去除字母以外的符号
                words.push(temp_words[k].replace(/\W+/gi,''));
            }
            temp_words.splice(k,1);
        }
        this.m_total_all = words.length;
        for (let i: number = 0; i < this.m_total_all; i++) {
            color.randomRGB();
            fontColor.copyFrom(color);
            fontColor.inverseRGB();
            let image: any;
            /*
            let factor: number = Math.random();
            if (factor > 0.8) {
                image = this.createImage(30 + Math.round(20 * Math.random()), 30 + Math.round(20 * Math.random()), color.getCSSHeXRGBColor());
            }
            else if (factor > 0.5) {
                if (Math.random() > 0.5) {
                    image = this.createImage(10 + Math.round(100 * Math.random()), 10 + Math.round(100 * Math.random()), color.getCSSHeXRGBColor());
                }
                else {
                    image = this.createImage(10 + Math.round(30 * Math.random()), 60 + Math.round(60 * Math.random()), color.getCSSHeXRGBColor());
                }
            }
            else {
                let colorNS: string = color.getCSSHeXRGBColor();
                let total: number = Math.round(Math.random() * 6);
                for (let j: number = 0; j < total; j++) {
                    colorNS = j + "" + colorNS;
                }
                image = ImageTextureAtlas.CreateCharsTexture(colorNS, 40, fontColor.getCSSDecRGBAColor(), color.getCSSDecRGBAColor());
            }
            //*/
            let colorNS: string = words[i];
            image = ImageTextureAtlas.CreateCharsTexture(colorNS, 20 + Math.round(Math.random() * 60), fontColor.getCSSDecRGBAColor(), color.getCSSDecRGBAColor());
            let area: TexArea = altas0.addSubImage("img" + i, image);
            if (area == null) {
                area = altas1.addSubImage("img" + i, image);
                if (area != null) {
                    this.m_total_1++;
                }
            }
            else {
                this.m_total_0++;
            }
        }

        console.log("total_0: ", this.m_total_0);
        console.log("total_1: ", this.m_total_1);
        console.log(this.m_total_all + ",left total: ", (this.m_total_all - (this.m_total_0 + this.m_total_1)));
    }
    addText(atlasIndex: number, text: string, fontSize: number, fontColor: Color4, bgColor: Color4): TexArea {
        let area: TexArea = null;
        let image = ImageTextureAtlas.CreateCharsTexture(text, fontSize, fontColor.getCSSDecRGBAColor(), bgColor.getCSSDecRGBAColor());
        if(atlasIndex == 0) {
            area = this.altas0.addSubImage(text, image);
        }
        else {
            area = this.altas1.addSubImage(text, image);
        }
        return area;
    }
    getTexAreaByXY(px: number, py: number): TexArea {
        
        py = this.m_rscene.getStage3D().stageHeight - py;
        let pixelRatio: number = this.m_rscene.getRendererContext().getDevicePixelRatio();
        let sx: number = (this.canvasWidth / this.canvasStyleWidth);
        let sy: number = (this.canvasHeight / this.canvasStyleHeight);
        sx /= pixelRatio;
        sy /= pixelRatio;
        let vx: number = (px - this.canvas0x);
        let vy: number = (py - this.canvas0y);
        vx *= sx;
        vy *= sy;
        let texArea: TexArea = this.altas0.getTexAreaByXY(vx, vy);
        if (texArea == null) {
            console.log("altas1 find...");
            vx = (px - this.canvas1x);
            vy = (py - this.canvas1y);
            vx *= sx;
            vy *= sy;
            texArea = this.altas1.getTexAreaByXY(vx, vy);
        }
        else {            
            console.log("altas0 find...");
        }
        return texArea;
    }
    getTexAreaByNS(texNS: string): TexArea {
        let texArea: TexArea = this.altas0.getAreaByName(texNS);
        if (texArea == null) {
            texArea = this.altas1.getAreaByName(texNS);
        }
        return texArea;
    }
    private m_speI: number = 0;
    addImageBySize(pw: number, ph: number): void {

        let color: Color4 = new Color4();
        color.randomRGB();
        this.m_total_all++;
        let image = this.createImage(pw, ph, color.getCSSHeXRGBColor());
        let area: TexArea = this.altas0.addSubImage("imgSpe" + this.m_speI, image);
        if (area == null) {
            area = this.altas1.addSubImage("imgSpe" + this.m_speI, image);
            if (area != null) {
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


        console.log("addImageBySize total_0: ", this.m_total_0);
        console.log("addImageBySize total_1: ", this.m_total_1);
        console.log(this.m_total_all + ",left total: ", (this.m_total_all - (this.m_total_0 + this.m_total_1)));
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
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            rparam.setAttriAntialias(true);
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


            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);
            //this.m_rscene.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMove);
            //this.m_rscene.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);

            this.update();

            this.initUIScene();
        }
    }

    private m_ruisc: RendererSubScene = null;
    private m_atlasSample0: AltasSample = null;
    private m_posX: number = 0;
    private m_posY: number = 0;
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

        this.m_atlasSample0 = new AltasSample();
        this.m_atlasSample0.initialize(this.m_rscene, 10, 10, true);

        let texArea: TexArea;
        this.m_posX = 400;
        this.m_posY = 300;
        for (let i: number = 0; i < 0; ++i) {
            texArea = this.getTexAreaByNS("img" + (10 + Math.round(Math.random() * 100)));
            let rect: AABB2D = this.createRectAreaPlane(texArea, this.m_posX, this.m_posY);
            rect.update();
            this.m_posY += rect.height + 5;
        }
        //  texArea = this.getTexAreaByXY( 10,10 );
        //  let rect: AABB2D = this.createRectAreaPlane(texArea, this.m_posX,this.m_posY);
    }
    private updateBoxUV(box: Box3DEntity, uvs: Float32Array): void {
        let uvs0: Float32Array = new Float32Array([
            uvs[0], uvs[1], uvs[0], uvs[1],
            uvs[0], uvs[1], uvs[0], uvs[1]
        ]);
        box.setFaceUVSAt(0, uvs0);
        box.setFaceUVSAt(1, uvs, 1);
        box.setFaceUVSAt(2, uvs0);
        box.setFaceUVSAt(3, uvs0);
        box.setFaceUVSAt(4, uvs0);
        box.setFaceUVSAt(5, uvs0);

        box.reinitializeMesh();
    }
    private getTexAreaByXY(px: number, py: number): TexArea {
        let texArea: TexArea = this.m_atlasSample0.altas0.getTexAreaByXY(px, py);
        if (texArea == null) {
            texArea = this.m_atlasSample0.altas1.getTexAreaByXY(px, py);
        }
        return texArea;
    }
    private getTexAreaByNS(texNS: string): TexArea {
        let texArea: TexArea = this.m_atlasSample0.altas0.getAreaByName(texNS);
        if (texArea == null) {
            texArea = this.m_atlasSample0.altas1.getAreaByName(texNS);
        }
        return texArea;
    }
    private createRectAreaPlane(texArea: TexArea, px: number, py: number): AABB2D {

        let plane: Plane3DEntity;
        let tex: IRenderTexture;
        //  let texArea: TexArea = this.m_atlasSample0.altas0.getAreaByName( texNS );
        //  if(texArea == null) {
        //      texArea = this.m_atlasSample0.altas1.getAreaByName( texNS );
        //  }
        if (texArea.atlasUid == 1) {
            //texArea = this.m_atlasSample0.altas1.getAreaByName( texNS );
            tex = this.m_atlasSample0.altas1.getTexture();
        }
        else {
            tex = this.m_atlasSample0.altas0.getTexture();
        }
        //*/
        let rect: AABB2D = new AABB2D(px, py, texArea.texRect.width, texArea.texRect.height);

        ///*
        plane = new Plane3DEntity();
        plane.uvs = texArea.uvs;
        plane.initializeXOY(0.0, 0.0, rect.width, rect.height, [tex]);
        plane.setXYZ(rect.x, rect.y, 0);
        plane.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        this.m_ruisc.addEntity(plane);
        //*/

        plane = new Plane3DEntity();
        plane.showDoubleFace();
        plane.uvs = texArea.uvs;
        plane.initializeXOY(0.0, 0.0, rect.width, rect.height, [tex]);
        //plane.setXYZ(rect.x - 250, rect.y - 150, 0);
        plane.setXYZ(texArea.rect.x, 100 + texArea.rect.y,0.0);
        this.m_rscene.addEntity(plane);

        let box: Box3DEntity = new Box3DEntity();
        box.initialize(new Vector3D(0.0, 0.0, 0.0), new Vector3D(rect.width, 100.0, rect.height), [tex]);
        //box.initialize(new Vector3D(0.0, 0.0, 0.0), new Vector3D(rect.width, rect.width, rect.height), [tex]);
        //box.setXYZ(rect.x - 250, 0.0, rect.y - 200);
        box.setXYZ(texArea.rect.x, 0.0, 100 + texArea.rect.y);
        //box.setScaleXYZ(2.0,2.0,2.0);
        this.updateBoxUV(box, texArea.uvs);
        this.m_rscene.addEntity(box);
        //*/
        return rect;

    }
    private mouseBgDown(evt: any): void {
    }
    private m_textIndex: number = 0;
    private mouseDown(evt: any): void {
        console.log("mouse down... ...",evt);
        DebugFlag.Flag_0 = 1;
        /*
        let texArea: TexArea = this.m_atlasSample0.addText(0,"vily"+this.m_textIndex, 40, new Color4(1.0,0.0,0.0), new Color4(0.0,1.0,0.0));
        this.m_textIndex++;
        //let texArea: TexArea = this.getTexAreaByNS("img0");
        if(texArea != null) {
            let rect: AABB2D = this.createRectAreaPlane(texArea, this.m_posX, this.m_posY);
            this.m_posY += rect.height + 5;
        }
        //*/
        ///*
        let texArea: TexArea = this.m_atlasSample0.getTexAreaByXY(evt.mouseX, evt.mouseY);
        console.log("texArea: ",texArea);
        if(texArea != null) {
            let rect: AABB2D = this.createRectAreaPlane(texArea, this.m_posX, this.m_posY);
            this.m_posY += rect.height + 5;
        }
        //*/
    }
    private mouseMove(evt: any): void {
        console.log("mouse move... ...");
    }
    private enterFrame(evt: any): void {
        console.log("enter frame... ...");
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
        selectFrame0.initializeRectXOY(0, 0, rect0.width, rect0.height);
        selectFrame0.setXYZ(rect0.x, rect0.y, 0.1);
        this.m_ruisc.addEntity(selectFrame0);

        let selectFrame1: Line3DEntity = new Line3DEntity();
        selectFrame1.dynColorEnabled = true;
        selectFrame1.initializeRectXOY(0, 0, rect1.width, rect1.height);
        selectFrame1.setXYZ(rect1.x, rect1.y, 0.1);
        this.m_ruisc.addEntity(selectFrame1);

        let intersectFlag: boolean = rect0.intersect(rect1);
        console.log("intersectFlag: ", intersectFlag);
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

        //this.m_profileInstance.run();

        DebugFlag.Reset();
    }

}
export default DemoUITexAtlas;