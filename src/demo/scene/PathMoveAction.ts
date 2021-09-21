
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import PathTrack from "../../voxnav/path/PathTrack";
import MathConst from "../../vox/math/MathConst";
import {AngleDegreeTween} from "../../voxmotion/tween/AngleDegreeTween";
import {CameraViewFollower} from "../../voxmotion/camera/CameraViewFollower";
import Matrix4 from "../../vox/math/Matrix4";


class PathMoveAction {

    constructor() { }

    private m_target: DisplayEntity = null;
    cameraFollower:CameraViewFollower = new CameraViewFollower();
    motionSpeed: number = 1;

    cameraOffset: Vector3D = new Vector3D(0,130,-200);

    upList: Vector3D[] = null;
    posList: Vector3D[] = null;

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
    private m_transMat: Matrix4 = new Matrix4();

    calcMatrix(upV: Vector3D, moveDV: Vector3D): Matrix4 {

        let xAxis: Vector3D = new Vector3D();
        xAxis.copyFrom(moveDV);
        let yAxis: Vector3D = upV.clone();
        let zAxis: Vector3D = new Vector3D();
        Vector3D.Cross(xAxis, yAxis, zAxis);
        xAxis.normalize();
        yAxis.normalize();
        zAxis.normalize();

        this.m_transMat.identity();
        this.m_transMat.setThreeAxes(xAxis, yAxis, zAxis);
        this.m_transMat.setTranslation(this.m_outV);

        return this.m_transMat;
    }
    private m_upV: Vector3D = new Vector3D();
    private m_moveDV: Vector3D = new Vector3D();
    private m_moveDV0: Vector3D = new Vector3D();
    private m_moveDV1: Vector3D = new Vector3D();
    private m_up0: Vector3D = new Vector3D();
    private m_up1: Vector3D = new Vector3D();
    run(): void {

        if (this.m_flag != PathTrack.TRACK_END) {
            if(this.m_target != null) {

                let dis: number = this.m_dis + this.motionSpeed;
                this.m_flag = this.m_pathTrack.calcPosByDis(this.m_outV, this.m_dis, true);
                
                let index: number = this.m_pathTrack.getCurrPosIndex();

                let posList: Vector3D[] = this.posList;


                let k: number = this.m_pathTrack.getDisProgrssInSeg( dis );

                let moveDV0: Vector3D = this.m_moveDV0;
                moveDV0.subVecsTo(posList[index+1], posList[index]);
                moveDV0.normalize();
                let moveDV1: Vector3D = this.m_moveDV1;
                moveDV1.subVecsTo(posList[index+2], posList[index+1]);
                moveDV1.normalize();

                moveDV0.scaleBy(1.0 - k);
                moveDV1.scaleBy(k);
                let moveDV: Vector3D = this.m_moveDV;
                moveDV.addVecsTo(moveDV0, moveDV1);
                moveDV.normalize();

                this.m_up0.copyFrom(this.upList[index]);
                this.m_up1.copyFrom(this.upList[index+1]);
                
                this.m_up0.scaleBy(1.0 - k);
                this.m_up1.scaleBy(k);

                let upV: Vector3D = this.m_upV;
                upV.addVecsTo(this.m_up0, this.m_up1);
                //console.log("index: ", this.m_pathTrack.getCurrPosIndex());
                //this.m_temV.copyFrom(this.m_outV);
                //this.m_preV.y = this.m_temV.y;
                //this.m_temV.subtractBy(this.m_preV);
                //let currDegree: number = this.m_degTween.calcDegree( 360 - MathConst.GetDegreeByXY(this.m_temV.x,this.m_temV.z) );

                
                let transMat: Matrix4 = this.calcMatrix(upV, moveDV);

                //this.m_temV.copyFrom( this.m_outV );
                //this.m_temV.y += this.cameraOffset.y;

                //if(this.cameraFollower != null) {
                //    this.cameraFollower.moveToOnXOZ(this.m_temV, 200, currDegree);
                //}

                //  this.m_target.setPosition(this.m_outV);
                //  this.m_target.setRotationXYZ(0.0, currDegree ,0.0);
                this.m_target.getTransform().setParentMatrix(transMat);
                this.m_target.update();
                //this.m_target.getPosition( this.m_preV );
                //this.m_target.getPosition( this.m_preV );
                this.m_preV.copyFrom(this.m_outV);
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
            //this.m_target.setPosition(posList[0]);
            //this.m_target.update();
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


export {PathMoveAction};