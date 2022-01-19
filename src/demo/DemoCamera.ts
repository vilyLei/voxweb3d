
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

import CameraDragController from "../voxeditor/control/CameraDragController";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Vector3D from "../vox/math/Vector3D";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import CameraBase from "../vox/view/CameraBase";
import { RHCameraView } from "../vox/view/RHCameraView";
import MathConst from "../vox/math/MathConst";
import DivLog from "../vox/utils/DivLog";
import Line3DEntity from "../vox/entity/Line3DEntity";
import Matrix4 from "../vox/math/Matrix4";

export class DemoCamera {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_texLoader: ImageTextureLoader = null;
    private m_runType: number = 0;
    private m_stageDragCtrl: CameraDragController = new CameraDragController();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    initialize(): void {
        console.log("DemoCamera::initialize()......");
        if (this.m_rscene == null) {
            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
            this.m_statusDisp.initialize();
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);

            //this.m_rscene.getRenderProxy().setFrontFaceFlipped(true);
            ///*
            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZSquare(900.0, [this.m_texLoader.getTexByUrl("static/assets/wood_02.jpg")]);
            plane.setXYZ(0.0, -300.0, 0.0);
            this.m_rscene.addEntity(plane);
            //*/
            /*
            let box:Box3DEntity = new Box3DEntity();
            box.initializeCube(200.0,[this.m_texLoader.getTexByUrl("static/assets/default.jpg")]);
            this.m_rscene.addEntity(box,1);
            //*/

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragCtrl.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_cameraZoomController.setLookAtCtrlEnabled(false);

            this.update();

            this.initTest01();
        }
    }
    private showAxisLine(posList: Vector3D[]): void {

        let ls: Line3DEntity = new Line3DEntity();
        ls.color.setRGB3f(1.0, 0.0, 0.0);
        ls.initialize(posList[0], posList[1])
        this.m_rscene.addEntity(ls);

        ///*
        ls = new Line3DEntity();
        ls.color.setRGB3f(0.0, 1.0, 0.0);
        ls.initialize(posList[2], posList[3])
        this.m_rscene.addEntity(ls);

        ls = new Line3DEntity();
        ls.color.setRGB3f(0.0, 0.0, 1.0);
        ls.initialize(posList[4], posList[5])
        this.m_rscene.addEntity(ls);
        //*/
    }
    private initTest01(): void {

        let pos: Vector3D = new Vector3D(-500, 300, 0);
        let look: Vector3D = new Vector3D(0.0, 300.0, 0.0);
        let up: Vector3D = new Vector3D(0.0, 1.0, 0.0);
        let camera: CameraBase = this.createCamera(pos, look, up, false);

        let basePos: Vector3D = new Vector3D(0.0, 0.0, -300.0);
        let pos_x: Vector3D = new Vector3D(basePos.x + 100.0, basePos.y, basePos.z);
        let pos_y: Vector3D = new Vector3D(basePos.x, basePos.y + 100.0, basePos.z);
        let pos_z: Vector3D = new Vector3D(basePos.x, basePos.y, basePos.z + 100.0);



        //let basePos2: Vector3D = new Vector3D(0.0, 0.0, -300.0);
        let basePos2: Vector3D = new Vector3D(0.0, 50.0, 0.0);
        basePos2.copyFrom(basePos);
        basePos2.y += 30;
        let pos_x2: Vector3D = new Vector3D(basePos2.x + 150.0, basePos2.y, basePos2.z);
        let pos_y2: Vector3D = new Vector3D(basePos2.x, basePos2.y + 150.0, basePos2.z);
        let pos_z2: Vector3D = new Vector3D(basePos2.x, basePos2.y, basePos2.z + 150.0);

        let mat: Matrix4 = camera.getViewInvMatrix();
        mat.transformVectorSelf(basePos);
        mat.transformVectorSelf(pos_x);
        mat.transformVectorSelf(pos_y);
        mat.transformVectorSelf(pos_z);

        let posList: Vector3D[] = [
            basePos, pos_x,
            basePos, pos_y,
            basePos, pos_z
        ];
        this.showAxisLine(posList);

        let camInvMat2: Matrix4 = new Matrix4();
        //camInvMat2.setScaleXYZ(1.0,1.0,1.0);
        camInvMat2.setRotationEulerAngle(0.0, MathConst.DegreeToRadian(-90), 0.0);
        camInvMat2.setTranslationXYZ(pos.x, pos.y, pos.z);

        let camView: RHCameraView = new RHCameraView();
        camView.setPosition(pos);
        camView.update();
        this.m_camView = camView;

        //let mat2: Matrix4 = camInvMat2;
        let mat2: Matrix4 = camView.getViewInvMatrix();
        mat2.transformVectorSelf(basePos2);
        mat2.transformVectorSelf(pos_x2);
        mat2.transformVectorSelf(pos_y2);
        mat2.transformVectorSelf(pos_z2);

        let posList2: Vector3D[] = [
            basePos2, pos_x2,
            basePos2, pos_y2,
            basePos2, pos_z2
        ];
        this.showAxisLine(posList2);

        let viewMatrix2: Matrix4 = new Matrix4();
        viewMatrix2.copyFrom(camInvMat2);
        viewMatrix2.invert();

        let camera2: CameraBase = new CameraBase();
        //camera2.setViewMatrix(viewMatrix2);
        camera2.setViewMatrix(camView.getViewMatrix());
        camera2.perspectiveRH(MathConst.DegreeToRadian(45), 800 / 600, 80, 500);
        camera2.update();

        let frustumFrame2: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustumFrame2.initiazlize(camera2);
        this.m_rscene.addEntity(frustumFrame2);

        this.m_cameraTarget = camera2;
        this.m_frustumFrame2 = frustumFrame2;
        this.m_camView.setCamera(this.m_cameraTarget);
    }
    private createCamera(pos: Vector3D, look: Vector3D, up: Vector3D, buildFrame: boolean = true): CameraBase {
        //let pos: Vector3D = new Vector3D(-500,0,0);
        //let look: Vector3D = new Vector3D();
        //let up: Vector3D = new Vector3D(0.0,1.0,0.0);
        let camera: CameraBase = new CameraBase();
        camera.lookAtRH(pos, look, up);
        camera.perspectiveRH(MathConst.DegreeToRadian(45), 800 / 600, 80, 500);
        camera.update();

        if (buildFrame) {
            let frustumFrame: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
            frustumFrame.initiazlize(camera);
            this.m_rscene.addEntity(frustumFrame);
        }
        return camera;
    }

    private m_slideFlag: boolean = false;

    private m_camView: RHCameraView = null;
    private m_cameraTarget: CameraBase = null;
    private m_frustumFrame2: FrustrumFrame3DEntity = null;

    private m_offsetPos: Vector3D = new Vector3D(0.0, 0.0, 10.0);
    private m_offsetRot: Vector3D = new Vector3D(0.0, 1.0, -1.0);
    private mouseDown(evt: any): void {
        this.m_camView.move(this.m_offsetPos);
        this.m_camView.rotate(this.m_offsetRot);
        this.m_camView.update();
        this.m_frustumFrame2.updateFrame(this.m_cameraTarget);
        this.m_frustumFrame2.updateMeshToGpu();
    }
    private keyDown(evt: any): void {
        this.m_slideFlag = !this.m_slideFlag;

        //console.log("key down....");
        if (this.m_slideFlag) {
            this.m_stageDragCtrl.enableSlide();
        }
        else {
            this.m_stageDragCtrl.enableSwing();
        }
    }
    //keyDown
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_statusDisp.render();
    }
    private m_pv: Vector3D = new Vector3D();

    run(): void {
        if (this.m_slideFlag) {
            //this.m_rscene.getCamera().slideViewOffsetXY(0.0,1.0);
        }
        this.m_statusDisp.update(false);

        this.m_stageDragCtrl.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);

        //this.m_rscene.useCamera(this.m_cameraTarget);

        this.m_rscene.run();
        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}

export default DemoCamera;