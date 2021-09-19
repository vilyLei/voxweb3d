
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import MouseEvent from "../vox/event/MouseEvent";
import KeyboardEvent from "../vox/event/KeyboardEvent";
import RendererScene from "../vox/scene/RendererScene";

import CameraDragController from "../voxeditor/control/CameraDragController";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Vector3D from "../vox/math/Vector3D";
import CameraViewRay from "../vox/view/CameraViewRay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import { SpaceCullingMask } from "../vox/space/SpaceCullingMask";
import { OrthoUIScene } from "../vox/ui/OrthoUIScene";
import SelectionEvent from "../vox/event/SelectionEvent";
import SelectionBar from "../orthoui/button/SelectionBar";
import {CameraScene} from "./scene/CameraScene";

export class DemoCameraPath {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_texLoader: ImageTextureLoader = null;
    private m_runType: number = 0;
    private m_stageDragCtrl: CameraDragController = new CameraDragController();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_viewRay: CameraViewRay = new CameraViewRay();
    private m_uiScene: OrthoUIScene = new OrthoUIScene();
    private m_camScene: CameraScene = new CameraScene();

    initialize(): void {

        console.log("DemoCameraPath::initialize()......");
        if (this.m_rscene == null) {

            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            rparam.setCamProject(45, 20.0, 7000.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_statusDisp.initialize();
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);

            this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(), this.m_rscene.getStage3D());
            this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

            this.m_uiScene.initialize( this.m_rscene );
            this.initBtns();
            //this.m_rscene.getRenderProxy().setFrontFaceFlipped(true);
            ///*
            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            let plane: Plane3DEntity = new Plane3DEntity();
            plane.showDoubleFace();
            plane.uScale = 5.0;
            plane.vScale = 5.0;
            plane.initializeXOZSquare(1900.0, [this.m_texLoader.getTexByUrl("static/assets/wood_02.jpg")]);
            plane.setXYZ(0.0, -300.0, 0.0);
            //this.m_rscene.addEntity(plane);

            let size: number = 2500.0;
            let disY: number = 0.5 * size;
            let box: Box3DEntity = new Box3DEntity();
            box.spaceCullMask = SpaceCullingMask.NONE;
            box.uScale = 4.0;
            box.vScale = 4.0;
            //metal_08
            box.showFrontFace();
            box.initialize(new Vector3D(-size, -size * 0.5, -size), new Vector3D(size, size * 0.7, size), [this.m_texLoader.getTexByUrl("static/assets/brickwall_big.jpg")]);
            box.setXYZ(0.0, 0.0, 0.0);
            this.m_rscene.addEntity(box);
            //*/

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragCtrl.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_cameraZoomController.setLookAtCtrlEnabled(false);

            this.update();

            this.m_camScene = new CameraScene();
            this.m_camScene.initialize( this.m_rscene );
        }
    }

    private mouseDown(evt: any): void {

        this.m_viewRay.intersectPiane();
        let pv: Vector3D = this.m_viewRay.position;

    }
    private keyDown(evt: any): void {
        
        switch (evt.key) {
            default:
                break;
        }
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 25);// 20 fps
        this.m_statusDisp.render();
    }

    private m_rot: Vector3D = new Vector3D();

    run(): void {
        
        this.m_statusDisp.update(false);

        this.m_stageDragCtrl.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);

        this.m_camScene.run();
        
        let pickFlag: boolean = true;

        this.m_uiScene.runBegin(true, true);
        this.m_uiScene.update(false, true);
        pickFlag = this.m_uiScene.isRayPickSelected();

        this.m_rscene.runBegin(false);
        this.m_rscene.update(false, !pickFlag);
        pickFlag = pickFlag || this.m_rscene.isRayPickSelected();

        /////////////////////////////////////////////////////// ---- mouseTest end.


        /////////////////////////////////////////////////////// ---- rendering begin.
        this.m_rscene.renderBegin();
        this.m_rscene.run(false);
        this.m_rscene.runEnd();

        this.m_uiScene.renderBegin();
        this.m_uiScene.run(false);
        this.m_uiScene.runEnd();
        
    }

    private initBtns(): void {

        let camBtn = this.createSelectBtn("bindCamera", "bindCamera", "ON", "OFF", false);
        camBtn = this.createSelectBtn("slideCamera", "slideCamera", "ON", "OFF", false);
    }

    private m_btnSize: number = 24;
    private m_btnPX: number = 162.0;
    private m_btnPY: number = 20.0;
    private m_btns: any[] = [];
    
    private createSelectBtn(ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false): SelectionBar {

        let selectBar: SelectionBar = new SelectionBar();
        selectBar.uuid = uuid;
        selectBar.initialize(this.m_uiScene, ns, selectNS, deselectNS, this.m_btnSize);
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
        switch( selectEvt.uuid ) {
            case "bindCamera":
                    this.m_camScene.switchCamera( selectEvt.flag );
                break;
            case "slideCamera":
                    this.switchSlide( selectEvt.flag );
                break;
            default:
                break;
        }
    }
    private switchSlide(flag: boolean): void {
        
        if (flag) {
            this.m_stageDragCtrl.enableSlide();
        }
        else {
            this.m_stageDragCtrl.enableSwing();
        }
    }
}

export default DemoCameraPath;