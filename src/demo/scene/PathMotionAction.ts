
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import PathTrack from "../../voxnav/path/PathTrack";
import MathConst from "../../vox/math/MathConst";
import {AngleDegreeTween} from "../../voxmotion/tween/AngleDegreeTween";
import {CameraViewFollower} from "../../voxmotion/camera/CameraViewFollower";


class PathMotionAction {

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

                this.m_temV.copyFrom(this.m_outV);
                this.m_preV.y = this.m_temV.y;
                this.m_temV.subtractBy(this.m_preV);
                let currDegree: number = this.m_degTween.calcDegree( 360 - MathConst.GetDegreeByXY(this.m_temV.x,this.m_temV.z) );
                
                this.m_temV.copyFrom( this.m_outV );
                this.m_temV.y += this.cameraOffset.y;

                this.cameraFollower.moveToOnXOZ(this.m_temV, 200, currDegree);

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

        this.cameraFollower.setViewParams(this.m_temV, this.m_degTween.getDegree(), -30.0);

        this.m_pathTrack.clear();
        let pv: Vector3D = null;
        for (; i < len; ++i) {
            pv = posList[i];
            this.m_pathTrack.addXYZ(pv.x, pv.y, pv.z);
        }
        if(circle) {
            if(Vector3D.DistanceSquared(posList[0], posList[posList.length - 1])) {
                pv = posList[0];
                this.m_pathTrack.addXYZ(pv.x, pv.y, pv.z);
            }
        }
    }
}

export {PathMotionAction};