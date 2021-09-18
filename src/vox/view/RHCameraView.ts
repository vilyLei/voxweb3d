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
import Plane from "../geom/Plane";

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
    private m_tempV0: Vector3D = new Vector3D();
    private m_tempV1: Vector3D = new Vector3D();
    private m_lookAt: Vector3D = new Vector3D();
    private m_axisModeEnabled: boolean = false;
    private m_changed: boolean = true;

    private m_camera: CameraBase = null;

    constructor() {
        this.m_originMatrix.rotationY(-0.5 * Math.PI);
    }

    setCamera(camera: CameraBase): void {

        if(this.m_camera != camera) {
            this.m_changed = true;
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
    enableAxisMode(): void {
        this.m_axisModeEnabled = true;
    }
    disableAxisMode(): void {
        this.m_axisModeEnabled = false;
    }
    /**
     * 通过 look at world space position(x,y,z) 来确定 up 为 y-axis 正向方向的摄像机, 此功能不能用作绕z轴或者x轴连续旋转
     * @param pv look at position
     */
    lookAtXYZUpYAxis(x: number, y: number, z: number): void {

        this.m_lookAt.setXYZ(x, y, z);

        this.m_tempV0.subVecsTo(this.m_lookAt, this.m_pos);
        this.m_rot.y = 180 - MathConst.GetDegreeByXY(-this.m_tempV0.x, -this.m_tempV0.z);
        this.m_rot.x = (Vector3D.AngleBetween(Vector3D.Y_AXIS, this.m_tempV0) - 90);        
        this.m_changed = true;

    }
    /**
     * 通过 lopk at world space position 来确定 up 为 y-axis 正向方向的摄像机, 此功能不能用作绕z轴或者x轴连续旋转
     * @param pv look at position
     */
    lookAtUpYAxis(pv: Vector3D): void {
        
        this.m_lookAt.copyFrom( pv );

        this.m_tempV0.subVecsTo(this.m_lookAt, this.m_pos);
        this.m_rot.y = 180 - MathConst.GetDegreeByXY(-this.m_tempV0.x, -this.m_tempV0.z);
        this.m_rot.x = (Vector3D.AngleBetween(Vector3D.Y_AXIS, this.m_tempV0) - 90);        
        this.m_changed = true;

    }
    
    /**
     * rotate the camera view space
     * @param dx rotate "dx" angle degree about the camera view x-axis from current angle degree
     * @param dy rotate "dy" angle degree about the camera view y-axis
     * @param dz rotate "dz" angle degree about the camera view z-axis, it will be rolling the camera
     */
    rotateXYZ(dx: number, dy: number, dz: number): void {

        this.m_rot.x += dx;
        this.m_rot.y += dy;
        this.m_rot.z += dz;
        
        this.m_changed = true;
    }

    /**
     * rotate the camera view space
     * @param offsetRotV
     *                offsetRotV.x: rotate "dx" angle degree about the camera view x-axis from current angle degree
     *                offsetRotV.y: rotate "dy" angle degree about the camera view space y-axis
     *                offsetRotV.z: rotate "dz" angle degree about the camera view space z-axis, it will be rolling the camera
     */
    rotate(offsetRotV: Vector3D): void {

        this.m_rot.addBy(offsetRotV);
        this.m_changed = true;
    }
    /**
     * set the camera view space rotation angle degree
     * @param degreeX set rotatation angle degree about the camera view space x-axis
     * @param degreeY set rotatation angle degree about the camera view space y-axis
     * @param degreeZ set rotatation angle degree about the camera view space z-axis, it will be rolling the camera
     */
    setRotationXYZ(degreeX: number, degreeY: number, degreeZ: number): void {
        this.m_rot.setXYZ(degreeX, degreeY, degreeZ);
        this.m_changed = true;
    }
    /**
     * set the camera view space rotation angle degree
     * @param rotV rotV.x: set rotatation angle degree about the camera view x-axis
     *             rotV.y: set rotatation angle degree about the camera view y-axis
     *             rotV.z: set rotatation angle degree about the camera view z-axis, it will be rolling the camera
     */
    setRotation(rotV: Vector3D): void {
        this.m_rot.copyFrom(rotV);
        this.m_changed = true;
    }
    /**
     * 
     * @returns get the rotatation of the camera view space
     *               rotV.x: rotatation angle degree about the camera view space x-axis
     *               rotV.y: rotatation angle degree about the camera view space y-axis
     *               rotV.z: rotatation angle degree about the camera view space z-axis, it will be rolling the camera
     */
    getRotation(rotV: Vector3D): void {
        rotV.copyFrom(this.m_rot);
        this.m_changed = true;
    }
    
    /**
     * rotate "degree" angle degree about the camera view x-axis from current angle degree
     * @param degree rotation angle degree
     */
    rotateX(degree: number): void {
        this.m_rot.x += degree;
        this.m_changed = true;
    }
    /**
     * rotate "degree" angle degree about the camera view y-axis from current angle degree
     * @param degree rotation angle degree
     */
    rotateY(degree: number): void {
        this.m_rot.y += degree;
        this.m_changed = true;
    }
    /**
     * rotate "degree" angle degree about the camera view z-axis from current angle degree
     * @param degree rotation angle degree
     */
    rotateZ(degree: number): void {
        this.m_rot.z += degree;
        this.m_changed = true;
    }
    /**
     * set rotatation angle about the camera view space x-axis
     * @param degree rotation angle degree
     */
    setRotationX(degree: number): void {
        this.m_rot.x = degree;
        this.m_changed = true;
    }
    /**
     * set rotatation angle about the camera view space y-axis
     * @param degree rotation angle degree
     */
    setRotationY(degree: number): void {
        this.m_rot.y = degree;
        this.m_changed = true;
    }
    /**
     * set rotatation angle about the camera view space z-axis, roll the camera
     * @param degree rotation angle degree
     */
    setRotationZ(degree: number): void {
        this.m_rot.z = degree;
        this.m_changed = true;
    }
    setXYZ(x: number, y: number, z: number): void {
        this.m_pos.setXYZ(x, y, z);
        this.m_changed = true;
    }
    moveXYZ(dx: number, dy: number, dz: number): void {
        this.m_pos.x += dx;
        this.m_pos.y += dy;
        this.m_pos.z += dz;
        this.m_changed = true;
    }
    move(pv: Vector3D): void {
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
    
    getViewMatrix(): Matrix4 {
        return this.m_viewMat;
    }
    getViewInvMatrix(): Matrix4 {
        return this.m_invViewMat;
    }

    update(): void {

        if (this.m_changed) {

            this.m_changed = false;
            //console.log("update this.m_rot.x: ", this.m_rot.x);
            if(this.m_axisModeEnabled) {

                this.m_tempV0.subVecsTo(this.m_lookAt, this.m_pos);
                this.m_tempV0.y = 0;
                // 计算其在 xoy平面上的投影
                Plane.IntersectionSLV2(Vector3D.Z_AXIS, 0, this.m_tempV0, Vector3D.Z_AXIS, this.m_tempV1);
                this.m_tempV1.y = 0;
                let ang: number = 0;
                if(Vector3D.Distance(this.m_tempV0, this.m_tempV1) > 0.001) {
                    ang = Vector3D.AngleBetween(this.m_tempV1, this.m_tempV1);
                }
                //console.log("ang: ",ang,this.m_tempV1);
                this.m_rotMat.identity();
                this.m_rotMat.rotationY(ang);
                this.m_rotMat.transformOutVector3(Vector3D.Z_AXIS, this.m_tempV1);
                this.m_tempV1.normalize();
                this.m_tempV0.subVecsTo(this.m_lookAt, this.m_pos);
                this.m_tempV1.crossBy(this.m_tempV0);
                //console.log(this.m_tempV1);

                /*
                // (1.0,0.0,0.0)
                //this.m_rot.z = 180 - MathConst.GetDegreeByXY(-this.m_tempV0.x, -this.m_tempV0.z);

                // 这里的实现是错误的, 无法达到全向标准
                this.m_tempV0.subVecsTo(this.m_lookAt, this.m_pos);
                // 直接使用Vector3D.Z_AXIS 当 look at 朝向和这个非常轴接近的时候 是个问题
                this.m_tempV1.copyFrom(Vector3D.Z_AXIS);
                this.m_tempV1.crossBy(this.m_tempV0);
                this.m_tempV1.normalize();
                this.m_viewMat.identity();
                //*/
                this.m_viewMat.lookAtRH(this.m_pos, this.m_lookAt, this.m_tempV1);
                this.m_invViewMat.copyFrom(this.m_viewMat);
                this.m_invViewMat.invert();
            }else{
                this.m_rotMat.identity();
                this.m_rotMat.rotationZ( MathConst.DegreeToRadian( -this.m_rot.x ) );
                this.m_rotMat.appendRotationY( MathConst.DegreeToRadian( this.m_rot.y ) );
                this.m_rotMat.setTranslation( this.m_pos );
    
                this.m_rollMat.identity();
                this.m_rollMat.rotationX(MathConst.DegreeToRadian(this.m_rot.z));
    
                this.m_invViewMat.copyFrom(this.m_originMatrix);
                this.m_invViewMat.append(this.m_rollMat);
    
                this.m_invViewMat.append(this.m_rotMat);
                this.m_viewMat.copyFrom(this.m_invViewMat);
                this.m_viewMat.invert();
            }

            
            if(this.m_camera != null) {
                this.m_camera.setViewMatrix(this.m_viewMat);
                this.m_camera.update();
            }
        }
    }
    toString(): string {
        return "[Object CameraBase()]";
    }
}
export { RHCameraView };