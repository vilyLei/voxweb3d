
import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import { ICameraView } from "../../vox/view/ICameraView";
import { AngleDegreeTween } from "../../voxmotion/tween/AngleDegreeTween";

class CameraViewFollower {

    private m_camView: ICameraView = null;
    private m_degreeY: number = 0.0;
    private m_degreeX: number = -30.0;
    private m_position: Vector3D = new Vector3D();
    private m_lookAtPos: Vector3D = new Vector3D();

    private m_tempva: Vector3D = new Vector3D();

    readonly angleTweenY: AngleDegreeTween = new AngleDegreeTween();
    readonly angleTweenZ: AngleDegreeTween = new AngleDegreeTween();


    positionMovefactor: number = 0.3;
    speed: number = 0.01;

    constructor() {
        this.angleTweenY.factor = 0.02;
        //this.angleTweenY.factor = 0.01;
    }
    private updateView(): void {
        if (this.m_camView != null) {
            this.m_camView.setPosition(this.m_position);
            this.m_camView.setRotationXYZ(this.m_degreeX, this.m_degreeY, 0.0);
            this.m_camView.update();
        }
    }

    setCameraView(cameraView: ICameraView): void {
        this.m_camView = cameraView;
    }

    setViewPositionAndLookAt(pos: Vector3D, lookAtPos: Vector3D): void {

        this.m_position.copyFrom(pos);
        this.m_lookAtPos.copyFrom(lookAtPos);
    }
    setViewParams(pos: Vector3D, degreeY: number, degreeZ: number): void {

        this.m_position.copyFrom(pos);
        this.m_degreeY = degreeY;
        this.m_degreeX = degreeZ;
        this.angleTweenY.setDegree(degreeY);
        this.updateView();
    }

    moveToOnXOZ(pos: Vector3D, minDis: number, degreeY: number): void {
        
        this.m_tempva.subVecsTo(pos, this.m_position);
        if (this.m_tempva.getLengthSquared() > (minDis * minDis)) {
            minDis = this.m_tempva.getLength() - minDis;
            this.m_tempva.normalize();
            this.m_tempva.scaleBy(minDis * this.positionMovefactor);
            this.m_position.addBy(this.m_tempva);
        }
        this.m_tempva.subVecsTo(pos, this.m_position);
        this.m_tempva.y = 0;
        degreeY = this.angleTweenY.calcDegree( 360 - MathConst.GetDegreeByXY(this.m_tempva.x,this.m_tempva.z) );
        this.m_degreeY = degreeY;
        
        this.updateView();
    }
}

export { CameraViewFollower };