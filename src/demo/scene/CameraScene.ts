import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import RendererScene from "../../vox/scene/RendererScene";
import Vector3D from "../../vox/math/Vector3D";
import FrustrumFrame3DEntity from "../../vox/entity/FrustrumFrame3DEntity";
import CameraBase from "../../vox/view/CameraBase";
import { RHCameraView } from "../../vox/view/RHCameraView";
import MathConst from "../../vox/math/MathConst";
import DivLog from "../../vox/utils/DivLog";
import Line3DEntity from "../../vox/entity/Line3DEntity";
import Matrix4 from "../../vox/math/Matrix4";
import CameraViewRay from "../../vox/view/CameraViewRay";

class CameraScene {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_viewRay: CameraViewRay = new CameraViewRay();

    initialize(rscene: RendererScene): void {

        console.log("CameraScene::initialize()......");

        if (this.m_rscene == null) {
            this.m_rscene = rscene;
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
    run(): void {

        this.lookAtTest();

        if (this.m_camView != null) {
            if (this.m_camFrame != null) {
                this.m_camFrame.updateFrame(this.m_camView.getCamera() != null ? this.m_camView.getCamera() : this.m_camera);
                this.m_camFrame.updateMeshToGpu();
            }
        }
    }

    switchCamera(flag: boolean): void {

        if (flag) {
            this.m_camView.setCamera(this.m_rscene.getCamera());
        }
        else {
            this.m_camView.setCamera(this.m_camera);
        }
        this.m_camView.update();
        this.m_camera.update();
    }
    rotateZ(d: number): void {
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

export {CameraScene};