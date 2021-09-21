import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import RendererScene from "../../vox/scene/RendererScene";

import FrustrumFrame3DEntity from "../../vox/entity/FrustrumFrame3DEntity";
import CameraBase from "../../vox/view/CameraBase";
import { RHCameraView } from "../../vox/view/RHCameraView";
import DivLog from "../../vox/utils/DivLog";
import Line3DEntity from "../../vox/entity/Line3DEntity";
import Matrix4 from "../../vox/math/Matrix4";
import CameraViewRay from "../../vox/view/CameraViewRay";
import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import {PathMoveAction} from "./PathMoveAction";


class CameraScenePath {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_viewRay: CameraViewRay = new CameraViewRay();
    moveAction: PathMoveAction = new PathMoveAction();

    initialize(rscene: RendererScene): void {

        console.log("CameraScenePath::initialize()......");

        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.initTest();
        }
    }

    private m_ls: Line3DEntity = new Line3DEntity();
    private m_lsList: Line3DEntity[] = [];
    private m_lsUpList: Vector3D[] = [];
    private m_lsPosList: Vector3D[] = [];
    private m_lsBeginPosList: Vector3D[] = [];
    private m_lsEndPosList: Vector3D[] = [];
    private m_slideFlag: boolean = false;
    
    private m_lookPos: Vector3D = new Vector3D(800.0, 0.0, 0.0);
    private m_lookMat: Matrix4 = new Matrix4();

    private m_camView: RHCameraView = null;
    private m_camFrame: FrustrumFrame3DEntity = null;
    private m_camera: CameraBase = null;

    private initTest(): void {

        this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

        let pos: Vector3D = new Vector3D();

        let distance: number = 300.0;
        let yDis: number = 150.0;
        let radius: number = 500.0;
        let rad: number = 0.0;
        let totalRad: number = Math.PI * 2.0;
        let total: number = 10;

        for (let i: number = 0; i < total; ++i) {

            rad = totalRad * i/total;
            pos.x = Math.cos(rad) * radius;
            pos.z = Math.sin(rad) * radius;
            //pos.y = 0;

            let pv0: Vector3D = pos.clone();
            let pv1: Vector3D = pos.clone();
            
            pv1.normalize();
            pv1.scaleBy( distance );
            pv1.y = yDis * Math.sin(rad);
            pv1.normalize();
            pv1.scaleBy( distance );
            //pv1.subtract( pv0 );
            pv1.addBy(pv0);

            pos.addVecsTo(pv0, pv1);
            pos.scaleBy(0.5);
            this.m_lsPosList.push( pos.clone() );
            
            this.m_lsBeginPosList.push(pv0);
            this.m_lsEndPosList.push(pv1);

            let ls = new Line3DEntity();
            ls.initialize(pv0, pv1);
            this.m_rscene.addEntity(ls);
        }
        
        this.m_lsPosList.push(this.m_lsPosList[0]);
        this.m_lsEndPosList.push(this.m_lsEndPosList[0]);
        this.m_lsBeginPosList.push(this.m_lsBeginPosList[0]);

        let dircV0: Vector3D = new Vector3D();
        let dircV1: Vector3D = new Vector3D();

        for (let i: number = 0; i < total; ++i) {

            let pv0: Vector3D = this.m_lsBeginPosList[i];
            let pv1: Vector3D = this.m_lsEndPosList[i];
            let pv2: Vector3D = this.m_lsEndPosList[i+1];
            let pv3: Vector3D = this.m_lsBeginPosList[i+1];

            dircV0.subVecsTo(pv0, pv1);
            dircV1.subVecsTo(pv1, pv2);
            dircV1.crossBy(dircV0);
            dircV1.normalize();

            this.m_lsUpList.push( dircV1.clone() );

            dircV1.scaleBy(150);
            dircV1.addBy( this.m_lsPosList[i] );
            
            //  let up_direc_ls = new Line3DEntity();
            //  up_direc_ls.color.setRGB3f(0,1,0);
            //  up_direc_ls.initialize(this.m_lsPosList[i], dircV1);
            //  this.m_rscene.addEntity(up_direc_ls);

            let ls = new Line3DEntity();
            ls.initializePolygon([pv0, pv1, pv2, pv3, pv0]);
            this.m_rscene.addEntity(ls);

        }
        this.m_lsUpList.push(this.m_lsUpList[0]);
        this.m_lsUpList.push(this.m_lsUpList[1]);
        //this.m_lsUpList.push(this.m_lsUpList[1]);

        this.m_lsPosList.push(this.m_lsPosList[1]);
       // this.m_lsPosList.push(this.m_lsPosList[1]);

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);
        
        axis = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        this.moveAction.upList = this.m_lsUpList;
        this.moveAction.posList = this.m_lsPosList;
        this.moveAction.bindTarget( axis );
        this.moveAction.setPathPosList(this.m_lsPosList);

        this.m_ls = new Line3DEntity();
        this.m_ls.initialize(new Vector3D(), new Vector3D(100.0, 0.0, 0.0));
        this.m_rscene.addEntity(this.m_ls);


        let upV: Vector3D = this.m_lsUpList[0];
        let rightV: Vector3D = new Vector3D();
        rightV.subVecsTo(this.m_lsEndPosList[0], this.m_lsBeginPosList[0]);
        rightV.normalize();
        rightV.crossBy(upV);

        let zAxis: Vector3D = new Vector3D();
        zAxis.subVecsTo(this.m_lsBeginPosList[0], this.m_lsEndPosList[0]);
        let yAxis: Vector3D = upV.clone();
        let xAxis: Vector3D = new Vector3D();
        Vector3D.Cross(upV, zAxis, xAxis);
        xAxis.normalize();
        yAxis.normalize();
        zAxis.normalize();

        let posV: Vector3D = this.m_lsPosList[0];
        let lookAtV: Vector3D = posV.clone();
        lookAtV.addBy(rightV);

        let pv = posV.clone();
        pv.y += 10.0;
        let transMat: Matrix4 = new Matrix4();
        transMat.identity();
        transMat.setThreeAxes(xAxis, yAxis, zAxis);
        transMat.setTranslation( pv );
        let paxis: Axis3DEntity = new Axis3DEntity();
        paxis.initialize(100.0);
        paxis.getTransform().setParentMatrix( transMat );
        this.m_rscene.addEntity(paxis);

        let direc_ls = new Line3DEntity();
        direc_ls.color.setRGB3f(1,0,1);
        direc_ls.initialize(this.m_lsPosList[0], lookAtV);
        this.m_rscene.addEntity(direc_ls);
        //return;
        let camera: CameraBase = new CameraBase();
        camera.lookAtRH(posV, lookAtV, upV);
        camera.perspectiveRH(MathConst.DegreeToRadian(45), 800 / 600, 80, 500);
        camera.update();
        this.m_camera = camera;

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

        this.moveAction.run();

        /*
        this.lookAtTest();

        if (this.m_camView != null) {
            if (this.m_camFrame != null) {
                this.m_camFrame.updateFrame(this.m_camView.getCamera() != null ? this.m_camView.getCamera() : this.m_camera);
                this.m_camFrame.updateMeshToGpu();
            }
        }
        */
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

export {CameraScenePath};