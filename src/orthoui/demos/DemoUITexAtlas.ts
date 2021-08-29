
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

        this.initTest();
    }
    private initTest(): void {
        
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