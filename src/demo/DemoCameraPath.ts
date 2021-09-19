
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
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import BaseColorMaterial from "../vox/material/mcase/BaseColorMaterial";

import CameraDragController from "../voxeditor/control/CameraDragController";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Vector3D from "../vox/math/Vector3D";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import CameraBase from "../vox/view/CameraBase";
import { RHCameraView } from "../vox/view/RHCameraView";
import MathConst from "../vox/math/MathConst";
import DivLog from "../vox/utils/DivLog";
import Line3DEntity from "../vox/entity/Line3DEntity";
import { PathMotionAction } from "./scene/PathMotionAction";
import Matrix4 from "../vox/math/Matrix4";
import CameraViewRay from "../vox/view/CameraViewRay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import { SpaceCullingMask } from "../vox/space/SpaceCullingMask";
import { OrthoUIScene } from "../vox/ui/OrthoUIScene";
import SelectionEvent from "../vox/event/SelectionEvent";
import SelectionBar from "../orthoui/button/SelectionBar";

export class DemoCameraPath {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_texLoader: ImageTextureLoader = null;
    private m_runType: number = 0;
    private m_stageDragCtrl: CameraDragController = new CameraDragController();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_viewRay: CameraViewRay = new CameraViewRay();
    private m_uiScene: OrthoUIScene = new OrthoUIScene();
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

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
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

            this.initTest();
        }
    }

    private m_ls: Line3DEntity = new Line3DEntity();
    private m_lsList: Line3DEntity[] = [];
    private m_lsEndPosList: Vector3D[] = [];
    private m_slideFlag: boolean = false;
    
    private m_lookPos: Vector3D = new Vector3D(800.0, 0.0, 0.0);
    private m_lookMat: Matrix4 = new Matrix4();

    private m_camView: RHCameraView = null;
    private m_camFrame: FrustrumFrame3DEntity = null;
    private m_camera: CameraBase = null;
    private m_moveAction: PathMotionAction = new PathMotionAction();

    private initTest(): void {

        this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

        for (let i: number = 0; i < 10; ++i) {

            let pv: Vector3D = new Vector3D(Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150);
            pv.normalize();
            pv.scaleBy(350 + Math.random() * 200);
            this.m_lsEndPosList.push(pv);

            let ls = new Line3DEntity();
            ls.initialize(new Vector3D(), pv);
            this.m_rscene.addEntity(ls);
        }
        this.m_ls = new Line3DEntity();
        this.m_ls.initialize(new Vector3D(), new Vector3D(100.0, 0.0, 0.0));
        this.m_rscene.addEntity(this.m_ls);

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        let camera: CameraBase = new CameraBase();
        camera.lookAtRH(new Vector3D(), new Vector3D(50, 0, 0.0), Vector3D.Y_AXIS);
        camera.perspectiveRH(MathConst.DegreeToRadian(45), 800 / 600, 80, 500);
        camera.update();
        this.m_camera = camera;

        let camView: RHCameraView = new RHCameraView();
        camView.setCamera(camera);
        camView.lookAtUpYAxis(new Vector3D(50, 0, 0.0));
        //camView.rotateZ(30);
        //camView.rotateX(60);
        //camView.rotateY(30);
        //camView.enableAxisMode();
        camView.update();
        this.m_camView = camView;

        let camFrame: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        camFrame.initiazlize(camera);
        this.m_rscene.addEntity(camFrame);
        this.m_camFrame = camFrame;
    }

    private m_rotV: Vector3D = new Vector3D();
    private m_posV: Vector3D = new Vector3D();
    private m_mat: Matrix4 = new Matrix4();

    private lookAtTest(): void {

        this.m_posV.setXYZ(500.0,0.0,0.0);
        this.m_rotV.z += 0.002;
        this.m_rotV.y += -0.003;
        this.m_mat.identity();
        this.m_mat.setRotationEulerAngle(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
        this.m_mat.transformVector3Self(this.m_posV);

        if(this.m_ls != null) {
            this.m_ls.setPosAt(1,this.m_posV);
            this.m_ls.updateMeshToGpu();
        }
        if (this.m_camView != null) {
            this.m_camView.lookAtUpYAxis(this.m_posV);
            this.m_camView.update();
        }
    }
    private mouseDown(evt: any): void {

        this.m_viewRay.intersectPiane();
        let pv: Vector3D = this.m_viewRay.position;

    }
    private keyDown(evt: any): void {
        //return;
        switch (evt.key) {
            default:
                if (this.m_camView != null) {
                    //this.m_camView.rotateX(-3.0);
                    this.m_camView.lookAtUpYAxis(this.m_lsEndPosList[Math.round(Math.random() * (this.m_lsEndPosList.length - 1))]);
                    this.m_camView.update();
                }
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

        //  this.rotateZ(1);

        this.m_statusDisp.render();
    }

    private m_rot: Vector3D = new Vector3D();

    run(): void {
        if (this.m_slideFlag) {
            //this.m_rscene.getCamera().slideViewOffsetXY(0.0,1.0);
        }
        this.m_statusDisp.update(false);

        this.m_stageDragCtrl.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);

        this.lookAtTest();

        if (this.m_camView != null) {
            //this.m_moveAction.run();
            if (this.m_camFrame != null) {
                this.m_camFrame.updateFrame(this.m_camView.getCamera() != null ? this.m_camView.getCamera() : this.m_camera);
                //this.m_camFrame.updateFrame(this.m_camera);
                this.m_camFrame.updateMeshToGpu();
            }
        }


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

        //this.m_rscene.run();
        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
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
        console.log("selectEvt: ",selectEvt);
        switch( selectEvt.uuid ) {
            case "bindCamera":
                    this.switchCamera( selectEvt.flag );
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
    private switchCamera(flag: boolean): void {

        if (flag) {
            this.m_camView.setCamera(this.m_rscene.getCamera());
        }
        else {
            this.m_camView.setCamera(this.m_camera);
        }
        this.m_camView.update();
        this.m_camera.update();
    }
    private rotateZ(d: number): void {
        if (this.m_camView != null) {
            this.m_camView.rotateZ(d);
            this.m_camView.update();
            if (this.m_camFrame != null) {
                this.m_camFrame.updateFrame(this.m_camView.getCamera());
                this.m_camFrame.updateMeshToGpu();
            }
        }
    }
}

export default DemoCameraPath;