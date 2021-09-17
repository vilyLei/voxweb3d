/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import MathConst from "../math/MathConst";
import {ICameraView} from "../../vox/view/ICameraView";
import CameraBase from "../../vox/view/CameraBase";

/**
 * free move and rotate the camera view
 */
class RHCameraView implements ICameraView{

    private m_originMatrix: Matrix4 = new Matrix4();
    private m_rotMat: Matrix4 = new Matrix4();
    private m_rollMat: Matrix4 = new Matrix4();
    private m_invViewMat: Matrix4 = new Matrix4();
    private m_viewMat: Matrix4 = new Matrix4();
    private m_rot: Vector3D = new Vector3D();
    private m_pos: Vector3D = new Vector3D();
    private m_rollDegree: number = 0.0;
    private m_rollFlag: boolean = true;
    private m_lookAt: Vector3D = new Vector3D();
    private m_changed: boolean = true;

    private m_camera: CameraBase = null;

    constructor() {
        this.m_originMatrix.rotationY(-0.5 * Math.PI);
    }

    setCamera(camera: CameraBase): void {

        if(this.m_camera != camera) {
            if(this.m_camera != null) {
                this.m_camera.setViewMatrix( null );
                this.m_camera.update();
            }
            this.m_camera = camera;
        }
    }
    getCamera(): CameraBase {
        return this.m_camera;
    }
    
    lookAtXYZ(x: number, y: number, z: number): void {

        this.m_lookAt.setXYZ(x, y, z);
        // to do

    }
    lookAt(pv: Vector3D): void {
        
        this.m_lookAt.copyFrom( pv );
        // to do

    }
    setRotationOffsetXYZ(degreeX: number, degreeY: number, degreeZ: number): void {

        this.m_rot.x += degreeX;
        this.m_rot.y += degreeY;
        this.m_rot.z += degreeZ;
        
        this.m_changed = true;
    }
    setRotationOffset(offsetRotV: Vector3D): void {

        this.m_rot.addBy(offsetRotV);
        this.m_changed = true;
    }

    /**
     * 摄像机整体旋转
     * @param degreeX roll rotation angle degree, rotate by camera x-axis
     * @param degreeY rotate by camera y-axis: the up direction of the camera
     * @param degreeZ roll rotation angle degree, rotate by camera z-axis
     */
    setRotationXYZ(degreeX: number, degreeY: number, degreeZ: number): void {
        this.m_rot.setXYZ(degreeX, degreeY, degreeZ);
        this.m_changed = true;
    }
    setRotation(rotV: Vector3D): void {
        this.m_rot.copyFrom(rotV);
        this.m_changed = true;
    }
    getRotation(rotV: Vector3D): void {
        rotV.copyFrom(this.m_rot);
    }
    setXYZ(x: number, y: number, z: number): void {
        this.m_pos.setXYZ(x, y, z);
        this.m_changed = true;
    }
    setPositionOffsetXYZ(dx: number, dy: number, dz: number): void {
        this.m_pos.x += dx;
        this.m_pos.y += dy;
        this.m_pos.z += dz;
        this.m_changed = true;
    }
    setPositionOffset(pv: Vector3D): void {
        this.m_pos.addBy( pv );
        this.m_changed = true;
    }
    setPosition(pv: Vector3D): void {
        this.m_pos.copyFrom(pv);
        this.m_changed = true;
    }
    getPosition(pv: Vector3D): void {
        pv.copyFrom(this.m_pos);
    }
    /**
     *  绕摄像机Z轴旋转
     * @param degree 绕摄像机Z轴旋转的角度
     */
    setRollRotation(degree: number): void {
        this.m_rot.z = degree;
    }
    update(): void {

        if (this.m_changed) {
            this.m_changed = false;

            this.m_rotMat.identity();
            this.m_rotMat.rotationZ( MathConst.DegreeToRadian(this.m_rot.x) );
            this.m_rotMat.appendRotationY( MathConst.DegreeToRadian(this.m_rot.y) );
            this.m_rotMat.setTranslation( this.m_pos );

            this.m_rollMat.identity();
            this.m_rollMat.rotationX(MathConst.DegreeToRadian(this.m_rot.z));

            this.m_invViewMat.copyFrom(this.m_originMatrix);
            this.m_invViewMat.append(this.m_rollMat);

            this.m_invViewMat.append(this.m_rotMat);
            this.m_viewMat.copyFrom(this.m_invViewMat);
            this.m_viewMat.invert();
            
            if(this.m_camera != null) {
                this.m_camera.setViewMatrix(this.m_viewMat);
                this.m_camera.update();
            }
        }
    }
    getViewMatrix(): Matrix4 {
        return this.m_viewMat;
    }
    getViewInvMatrix(): Matrix4 {
        return this.m_invViewMat;
    }
    toString(): string {
        return "[Object CameraBase()]";
    }
}
export { RHCameraView };