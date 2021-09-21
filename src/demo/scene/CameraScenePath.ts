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
import DisplayEntity from "../../vox/entity/DisplayEntity";
import PathTrack from "../../voxnav/path/PathTrack";
import MathConst from "../../vox/math/MathConst";
import {AngleDegreeTween} from "../../voxmotion/tween/AngleDegreeTween";
import {CameraViewFollower} from "../../voxmotion/camera/CameraViewFollower";


class PathMoveAction {

    constructor() { }

    private m_target: DisplayEntity = null;
    cameraFollower:CameraViewFollower = new CameraViewFollower();
    motionSpeed: number = 1;

    cameraOffset: Vector3D = new Vector3D(0,130,-200);

    private m_degTween: AngleDegreeTween = new AngleDegreeTween();

    bindTarget(tar: DisplayEntity): void {
        this.m_target = tar;
    }
    destroy(): void {
        this.m_target = null;
    }
    getTarget(): DisplayEntity {
        return this.m_target;
    }
    private m_dis: number = 0.0;
    private m_temV: Vector3D = new Vector3D();
    private m_outV: Vector3D = new Vector3D();
    private m_preV: Vector3D = new Vector3D();
    private m_flag: number = PathTrack.TRACK_END;
    private m_circle: boolean = false;
    private m_pathTrack: PathTrack = new PathTrack();
    run(): void {
        if (this.m_flag != PathTrack.TRACK_END) {
            if(this.m_target != null) {

                let dis: number = this.m_dis + this.motionSpeed;
                this.m_flag = this.m_pathTrack.calcPosByDis(this.m_outV, this.m_dis, true);
                //console.log("index: ", this.m_pathTrack.getCurrPosIndex());
                this.m_temV.copyFrom(this.m_outV);
                this.m_preV.y = this.m_temV.y;
                this.m_temV.subtractBy(this.m_preV);
                let currDegree: number = this.m_degTween.calcDegree( 360 - MathConst.GetDegreeByXY(this.m_temV.x,this.m_temV.z) );
                
                this.m_temV.copyFrom( this.m_outV );
                this.m_temV.y += this.cameraOffset.y;

                if(this.cameraFollower != null) {
                    this.cameraFollower.moveToOnXOZ(this.m_temV, 200, currDegree);
                }

                this.m_target.setPosition(this.m_outV);
                this.m_target.setRotationXYZ(0.0, currDegree ,0.0);
                this.m_target.update();
                this.m_target.getPosition( this.m_preV );
                this.m_dis = dis;
            }
        } else {
            if (this.moveToEnd != null) this.moveToEnd();
            if(this.m_circle) {
                this.m_dis = 0;
                this.m_flag = PathTrack.TRACK_INIT;
                this.m_pathTrack.toBegin();
            }
        }
    }

    getTrackFlag(): number {
        return this.m_flag;
    }
    moveToEnd: ()=>void = null;
    setPathPosList(posList: Vector3D[], circle: boolean = false): void {

        this.m_dis = 0;
        this.m_flag = PathTrack.TRACK_INIT;
        this.m_circle = circle;

        let i: number = 0;
        let len: number = posList.length;
        if(this.m_target != null) {
            this.m_target.setPosition(posList[0]);
            this.m_target.update();
        }
        this.m_preV.copyFrom(posList[0]);
        this.m_temV.copyFrom(posList[1]);
        this.m_preV.y = this.m_temV.y;
        this.m_temV.subtractBy(this.m_preV);

        this.m_degTween.setDegree( 360 - MathConst.GetDegreeByXY(this.m_temV.x,this.m_temV.z) );
        this.m_temV.normalize();
        this.m_temV.scaleBy(-210);
        this.m_temV.addBy( this.m_preV );
        this.m_temV.y += this.cameraOffset.y;

        if(this.cameraFollower != null) {
            this.cameraFollower.setViewParams(this.m_temV, this.m_degTween.getDegree(), 30.0);
        }

        this.m_pathTrack.clear();
        let pv: Vector3D = null;
        for (; i < len; ++i) {
            pv = posList[i];
            this.m_pathTrack.addXYZ(pv.x, pv.y, pv.z);
        }
        if(circle) {
            if(Vector3D.DistanceSquared(posList[0], posList[posList.length - 1]) > 0.01) {
                pv = posList[0];
                this.m_pathTrack.addXYZ(pv.x, pv.y, pv.z);
            }
        }
    }
}


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

        
        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);
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

        //rightV.copyFrom( this.m_lsUpList[0] );
        rightV.scaleBy(1.0);
        let posV: Vector3D = this.m_lsPosList[0];
        let lookAtV: Vector3D = posV.clone();
        lookAtV.addBy(rightV);

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