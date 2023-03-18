/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";

import Plane from "../../vox/geom/Plane";
import AABB from "../../vox/geom/AABB";
import {IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";
import {IRenderCamera} from "../../vox/render/IRenderCamera";

const pmin = MathConst.MATH_MIN_POSITIVE;
class CameraBase implements IRenderCamera {

    constructor() {
    }
    version: number = 0;
    matUProbe: IShaderUniformProbe = null;
    ufrustumProbe: IShaderUniformProbe = null;
    ucameraPosProbe: IShaderUniformProbe;
    uniformEnabled: boolean = false;
    name = "Camera";

    private m_tempV: Vector3D = new Vector3D()
    private m_tempV1: Vector3D = new Vector3D();
    private m_initRV: Vector3D = new Vector3D();
    private m_initUP: Vector3D = new Vector3D();
    private m_lookRHEnabled: boolean = true;

    private m_matrix: Matrix4 = new Matrix4();
    private m_viewMat: Matrix4 = new Matrix4();
    private m_viewInvertMat: Matrix4 = new Matrix4();
    private m_vpMat: Matrix4 = new Matrix4();
    private m_tempMat: Matrix4 = new Matrix4();
    private m_projMat: Matrix4 = new Matrix4();
    private m_camPos: Vector3D = new Vector3D();
    private m_lookAtPos: Vector3D = new Vector3D();
    private m_up: Vector3D = new Vector3D();
    private m_lookDirectNV: Vector3D = new Vector3D();
    private m_lookAtDirec: Vector3D = new Vector3D();

    private m_nearPlaneWidth: number = 1.0;
    private m_nearPlaneHeight: number = 1.0;

    private m_viewX: number = 0.0;
    private m_viewY: number = 0.0;
    private m_viewW: number = 800.0
    private m_viewH: number = 600.0;
    private m_viewHalfW: number = 400.0
    private m_viewHalfH: number = 300.0;
    private m_fovRadian: number = 0.0;
    private m_aspect: number = 1.0;
    private m_zNear: number = 0.1;
    private m_zFar: number = 1000.0;
    private m_b: number = 0.0;
    private m_t: number = 0.0;
    private m_l: number = 0.0;
    private m_r: number = 0.0;
    private m_perspectiveEnabled: boolean = false;
    private m_project2Enabled: boolean = false;
    private m_rightHandEnabled: boolean = true;
    private m_rotV: Vector3D = new Vector3D(0.0,0.0,0.0);

    private m_viewFieldZoom: number = 1.0;
    private m_changed: boolean = true;
    private m_unlock: boolean = true;
    // 不允许外界修改camera数据
    lock(): void {
        this.m_unlock = false;
    }
    // 允许外界修改camera数据
    unlock(): void {
        this.m_unlock = true;
    }
    lookAtLH(camPos: Vector3D, lookAtPos: Vector3D, up: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.copyFrom(camPos);
            this.m_lookAtPos.copyFrom(lookAtPos);
            this.m_up.copyFrom(up);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookRHEnabled = false;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            this.m_initUP.copyFrom(up);
            this.m_initUP.normalize();
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    lookAtRH(camPos: Vector3D, lookAtPos: Vector3D, up: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.copyFrom(camPos);
            this.m_lookAtPos.copyFrom(lookAtPos);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            Vector3D.Cross(this.m_lookAtDirec, up, this.m_initRV);
            Vector3D.Cross(this.m_initRV, this.m_lookAtDirec, this.m_initUP);
            this.m_initUP.normalize();
            this.m_initRV.normalize();
            this.m_up.copyFrom(this.m_initUP);
            this.m_changed = true;
        }
    }

    getLookAtLHToCamera(camera: CameraBase): void {
        camera.lookAtLH(this.m_camPos, this.m_lookAtPos, this.m_up);
    }
    getLookAtRHToCamera(camera: CameraBase): void {
        camera.lookAtRH(this.m_camPos, this.m_lookAtPos, this.m_up);
    }
    /**
     * left-hand axis perspective projection
     * @param fovRadian radian value
     * @param aspect the value is the view port width / height
     * @param zNear the camera near plane distance
     * @param zFar the camera far plane distance
     */
    perspectiveLH(fovRadian: number, aspect: number, zNear: number, zFar: number): void {
        if (this.m_unlock) {
            this.m_project2Enabled = false;
            this.m_aspect = aspect;
            this.m_fovRadian = fovRadian;
            this.m_zNear = zNear;
            this.m_zFar = zFar;
            this.m_projMat.perspectiveLH(fovRadian, aspect, zNear, zFar);
            this.m_viewFieldZoom = Math.tan(fovRadian * 0.5);
            this.m_perspectiveEnabled = true;
            this.m_rightHandEnabled = false;
            this.m_changed = true;
        }
    }
    /**
     * right-hand axis perspective projection
     * @param fovRadian radian value
     * @param aspect the value is the view port width / height
     * @param zNear the camera near plane distance
     * @param zFar the camera far plane distance
     */
    perspectiveRH(fovRadian: number, aspect: number, zNear: number, zFar: number): void {
        if (this.m_unlock) {
            this.m_aspect = aspect;
            this.m_fovRadian = fovRadian;
            this.m_zNear = zNear;
            this.m_zFar = zFar;
            this.m_projMat.perspectiveRH(fovRadian, aspect, zNear, zFar);
            this.m_viewFieldZoom = Math.tan(fovRadian * 0.5);
            this.m_project2Enabled = false;
            this.m_perspectiveEnabled = true;
            this.m_rightHandEnabled = true;
            this.m_changed = true;
        }
    }
    perspectiveRH2(fovRadian: number, pw: number, ph: number, zNear: number, zFar: number): void {
        if (this.m_unlock) {
            this.m_aspect = pw / ph;
            this.m_fovRadian = fovRadian;
            this.m_zNear = zNear;
            this.m_zFar = zFar;
            this.m_projMat.perspectiveRH2(fovRadian, pw, ph, zNear, zFar);
            this.m_viewFieldZoom = Math.tan(fovRadian * 0.5);
            this.m_perspectiveEnabled = true;
            this.m_project2Enabled = true;
            this.m_rightHandEnabled = true;
            this.m_changed = true;
        }
    }
    getAspect(): number { return this.m_aspect; }
    getViewFieldZoom(): number { return this.m_viewFieldZoom; }
    orthoRH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void {
        if (this.m_unlock) {
            this.m_zNear = zNear;
            this.m_zFar = zFar;
            this.m_b = b; this.m_t = t; this.m_l = l; this.m_r = r;
            this.m_projMat.orthoRH(b, t, l, r, zNear, zFar);
            this.m_perspectiveEnabled = false;
            this.m_rightHandEnabled = true;
            this.m_changed = true;
        }
    }
    orthoLH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void {
        if (this.m_unlock) {
            this.m_zNear = zNear;
            this.m_zFar = zFar;
            this.m_b = b; this.m_t = t; this.m_l = l; this.m_r = r;
            this.m_projMat.orthoLH(b, t, l, r, zNear, zFar);
            this.m_perspectiveEnabled = false;
            this.m_rightHandEnabled = false;
            this.m_changed = true;
        }
    }
    isPerspectiveEnabled(): boolean {
        return this.m_perspectiveEnabled;
    }
    isRightHandEnabled(): boolean {
        return this.m_rightHandEnabled;
    }
    setViewXY(px: number, py: number): void {
        if (this.m_unlock) {
            this.m_viewX = px;
            this.m_viewY = py;
        }
    }
    setViewSize(pw: number, ph: number): void {
        if (this.m_unlock) {
            if (pw != this.m_viewW || ph != this.m_viewH) {
                this.m_viewW = pw;
                this.m_viewH = ph;
                this.m_viewHalfW = pw * 0.5;
                this.m_viewHalfH = ph * 0.5;

                //console.log("setViewSize, pw:"+pw+",ph:"+ph);
                if (this.m_perspectiveEnabled) {
                    if (this.m_project2Enabled) {
                        if (this.m_rightHandEnabled) this.perspectiveRH2(this.m_fovRadian, pw, ph, this.m_zNear, this.m_zFar);
                    }
                    else {
                        if (this.m_rightHandEnabled) this.perspectiveRH(this.m_fovRadian, pw / ph, this.m_zNear, this.m_zFar);
                        else this.perspectiveLH(this.m_fovRadian, pw / ph, this.m_zNear, this.m_zFar);
                    }
                }
                else {
                    this.orthoRH(this.m_zNear, this.m_zFar, -0.5 * ph, 0.5 * ph, -0.5 * pw, 0.5 * pw);
                }
            }
        }
    }
    getViewX(): number {
        return this.m_viewX;
    }
    getViewY(): number {
        return this.m_viewY;
    }
    getViewWidth(): number {
        return this.m_viewW;
    }
    getViewHeight(): number {
        return this.m_viewH;
    }
    translation(v3: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.copyFrom(v3);
            // this.m_lookAtPos.x = v3.x + this.m_lookAtDirec.x;
            // this.m_lookAtPos.y = v3.y + this.m_lookAtDirec.y;
            // this.m_lookAtPos.z = v3.z + this.m_lookAtDirec.z;
			this.m_lookAtPos.addVecsTo(v3, this.m_lookAtDirec);
            this.m_changed = true;
        }
    }
    translationXYZ(px: number, py: number, pz: number): void {
        this.m_tempV.setXYZ(px,py,pz);
        if (this.m_unlock && Vector3D.DistanceSquared(this.m_camPos, this.m_tempV) > 0.00001) {

            this.m_camPos.setTo(px, py, pz);
            this.m_lookAtPos.x = px + this.m_lookAtDirec.x;
            this.m_lookAtPos.y = py + this.m_lookAtDirec.y;
            this.m_lookAtPos.z = pz + this.m_lookAtDirec.z;
            this.m_changed = true;
        }
    }
    forward(dis: number): void {
        if (this.m_unlock) {
            this.m_camPos.x += this.m_lookDirectNV.x * dis;
            this.m_camPos.y += this.m_lookDirectNV.y * dis;
            this.m_camPos.z += this.m_lookDirectNV.z * dis;
            // this.m_lookAtPos.x = this.m_camPos.x + this.m_lookAtDirec.x;
            // this.m_lookAtPos.y = this.m_camPos.y + this.m_lookAtDirec.y;
            // this.m_lookAtPos.z = this.m_camPos.z + this.m_lookAtDirec.z;
			this.m_lookAtPos.addVecsTo(this.m_camPos, this.m_lookAtDirec);
            this.m_changed = true;
        }
    }
    /**
     * 在平行于远平面的平面上滑动， 垂直于此平面的方向上不变
     * @param dx 摄像机 view 空间内 x方向偏移量
     * @param dy 摄像机 view 空间内 y方向偏移量
     */
    slideViewOffsetXY(dx: number, dy: number): void {

        if (this.m_unlock) {
            this.m_tempV.setXYZ(dx,dy,0);

            this.m_invViewMat.transformVectorSelf(this.m_tempV);

            dx = this.m_tempV.x - this.m_camPos.x;
            dy = this.m_tempV.y - this.m_camPos.y;
            let dz = this.m_tempV.z - this.m_camPos.z;
            this.m_camPos.x += dx;
            this.m_camPos.y += dy;
            this.m_camPos.z += dz;

            this.m_lookAtPos.x += dx;
            this.m_lookAtPos.y += dy;
            this.m_lookAtPos.z += dz;

            this.m_changed = true;
        }
    }

    forwardFixPos(dis: number, pos: Vector3D): void {
        if (this.m_unlock) {
			this.m_camPos.copyFrom(this.m_lookDirectNV).scaleBy(dis).addBy(pos);
            // this.m_camPos.x = pos.x + this.m_lookDirectNV.x * dis;
            // this.m_camPos.y = pos.y + this.m_lookDirectNV.y * dis;
            // this.m_camPos.z = pos.z + this.m_lookDirectNV.z * dis;
            // this.m_lookAtPos.x = this.m_camPos.x + this.m_lookAtDirec.x;
            // this.m_lookAtPos.y = this.m_camPos.y + this.m_lookAtDirec.y;
            // this.m_lookAtPos.z = this.m_camPos.z + this.m_lookAtDirec.z;
			this.m_lookAtPos.addVecsTo(this.m_camPos, this.m_lookAtDirec);
            this.m_changed = true;
        }
    }

    swingHorizontalWithAxis(rad: number, axis: Vector3D): void {
        if (this.m_unlock) {
            this.m_tempMat.identity();
            if (axis != null) {
                this.m_tempMat.appendRotation(rad * MathConst.MATH_PI_OVER_180, axis);
            }
            else {
                this.m_tempMat.appendRotation(rad * MathConst.MATH_PI_OVER_180, Vector3D.Y_AXIS);
            }
            // this.m_lookAtDirec.x = this.m_camPos.x - this.m_lookAtPos.x;
            // this.m_lookAtDirec.y = this.m_camPos.y - this.m_lookAtPos.y;
            // this.m_lookAtDirec.z = this.m_camPos.z - this.m_lookAtPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_camPos, this.m_lookAtPos);

            this.m_tempMat.transformVectorSelf(this.m_lookAtDirec);
            // this.m_camPos.x = this.m_lookAtDirec.x + this.m_lookAtPos.x;
            // this.m_camPos.y = this.m_lookAtDirec.y + this.m_lookAtPos.y;
            // this.m_camPos.z = this.m_lookAtDirec.z + this.m_lookAtPos.z;
			this.m_camPos.addVecsTo(this.m_lookAtDirec, this.m_lookAtPos);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            //
            this.m_tempMat.transformVectorSelf(this.m_initRV);
            this.m_initRV.normalize();
            //Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            Vector3D.Cross(this.m_initRV, this.m_lookAtDirec, this.m_up);
            this.m_up.normalize();
            this.m_changed = true;
        }
    }
    swingHorizontal(degree: number): void {
        if (this.m_unlock) {
            this.m_tempMat.identity();
            this.m_tempMat.appendRotation(degree * MathConst.MATH_PI_OVER_180, this.m_up);
            // this.m_lookAtDirec.x = this.m_camPos.x - this.m_lookAtPos.x;
            // this.m_lookAtDirec.y = this.m_camPos.y - this.m_lookAtPos.y;
            // this.m_lookAtDirec.z = this.m_camPos.z - this.m_lookAtPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_camPos, this.m_lookAtPos);

            this.m_tempMat.transformVectorSelf(this.m_lookAtDirec);
            // this.m_camPos.x = this.m_lookAtDirec.x + this.m_lookAtPos.x;
            // this.m_camPos.y = this.m_lookAtDirec.y + this.m_lookAtPos.y;
            // this.m_camPos.z = this.m_lookAtDirec.z + this.m_lookAtPos.z;
			this.m_camPos.addVecsTo(this.m_lookAtDirec, this.m_lookAtPos);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();

            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    swingVertical(degree: number): void {
        if (this.m_unlock) {
            this.m_tempMat.identity();
            this.m_tempMat.appendRotation(degree * MathConst.MATH_PI_OVER_180, this.m_initRV);
            // this.m_lookAtDirec.x = this.m_camPos.x - this.m_lookAtPos.x;
            // this.m_lookAtDirec.y = this.m_camPos.y - this.m_lookAtPos.y;
            // this.m_lookAtDirec.z = this.m_camPos.z - this.m_lookAtPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_camPos, this.m_lookAtPos);

            this.m_tempMat.transformVectorSelf(this.m_lookAtDirec);
            // this.m_camPos.x = this.m_lookAtDirec.x + this.m_lookAtPos.x;
            // this.m_camPos.y = this.m_lookAtDirec.y + this.m_lookAtPos.y;
            // this.m_camPos.z = this.m_lookAtDirec.z + this.m_lookAtPos.z;
			this.m_camPos.addVecsTo(this.m_lookAtDirec, this.m_lookAtPos);

            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);

            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();

            Vector3D.Cross(this.m_initRV, this.m_lookAtDirec, this.m_up);
            this.m_up.normalize();
            this.m_initUP.copyFrom(this.m_up);
            this.m_changed = true;
        }
    }
    setPosition(v3: Vector3D): void {
        if (this.m_unlock) {
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_tempV);
            let dot = this.m_tempV.dot(this.m_initUP);
            this.m_tempV1.copyFrom(this.m_initUP);
            this.m_tempV1.scaleBy(dot);
            this.m_tempV.subtractBy(this.m_tempV1);

            this.m_camPos.copyFrom(v3);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();

            Vector3D.Cross(this.m_tempV, this.m_lookAtDirec, this.m_up);
            this.m_up.normalize();
            this.m_changed = true;
        }
    }
    setPositionXYZ(px: number, py: number, pz: number): void {
        if (this.m_unlock) {
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_tempV);
            var dot = this.m_tempV.dot(this.m_initUP);
            this.m_tempV1.copyFrom(this.m_initUP);
            this.m_tempV1.scaleBy(dot);
            this.m_tempV.subtractBy(this.m_tempV1);
            this.m_camPos.setTo(px, py, pz);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();

            Vector3D.Cross(this.m_tempV, this.m_lookAtDirec, this.m_up);
            this.m_up.normalize();
            this.m_changed = true;
        }
    }
    setLookPosXYZFixUp(px: number, py: number, pz: number): void {
        if (this.m_unlock) {
            this.m_lookAtPos.setTo(px, py, pz);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();

            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    setPositionXYZFixUp(px: number, py: number, pz: number): void {
        if (this.m_unlock) {
            this.m_camPos.setTo(px, py, pz);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();

            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    setPositionFixUp(v3: Vector3D): void {
        if (this.m_unlock) {
            this.m_camPos.copyFrom(v3);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookRHEnabled = true;
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
            this.m_initRV.normalize();
            this.m_changed = true;
        }
    }
    copyFrom(tarCam: CameraBase): void {
        let pv = tarCam.getPosition();
        this.m_camPos.copyFrom(pv);
        pv = tarCam.getLookAtPosition();
        this.m_lookAtPos.copyFrom(pv);
        this.setZNear(tarCam.getZNear());
        this.setZFar(tarCam.getZFar());
        this.setNearPlaneWidth(tarCam.getNearPlaneWidth());
        this.setNearPlaneHeight(tarCam.getNearPlaneHeight());
        this.setPerspectiveEnabled(tarCam.getPerspectiveEnabled());
        this.m_viewInvertMat.copyFrom(tarCam.getViewInvMatrix());
    }
    private m_tempNV = new Vector3D();
    private m_tempUPV = new Vector3D();
    private m_tempRV = new Vector3D();
    private m_tempCamPos = new Vector3D();
    private m_tempLookAtPos = new Vector3D();
    // view space axis z
    getNV(): Vector3D { this.m_tempNV.copyFrom(this.m_lookDirectNV); return this.m_tempNV;}
    // view space axis y
    getUV(): Vector3D { this.m_tempUPV.copyFrom(this.m_up); return this.m_tempUPV; }
    // view space axis x
    getRV(): Vector3D { this.m_tempRV.copyFrom(this.m_initRV); return this.m_tempRV; }
    getPosition():Vector3D { this.m_tempCamPos.copyFrom(this.m_camPos); return this.m_tempCamPos; }
    getLookAtPosition(): Vector3D { this.m_tempLookAtPos.copyFrom(this.m_lookAtPos); return this.m_tempLookAtPos; }
    setLookAtPosition(pv: Vector3D): void {
        if (this.m_unlock) {
            this.m_lookAtPos.copyFrom(pv);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            this.m_changed = true;
        }
    }
    setLookAtXYZ(px: number, py: number, pz: number): void {
        if (this.m_unlock) {
            this.m_lookAtPos.setTo(px, py, pz);
            // this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
            // this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
            // this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
			this.m_lookAtDirec.subVecsTo(this.m_lookAtPos, this.m_camPos);
            this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
            this.m_lookDirectNV.normalize();
            this.m_changed = true;
        }
    }
    getPerspectiveEnabled(): boolean { return this.m_perspectiveEnabled; }
    setPerspectiveEnabled(boo: boolean): void { this.m_perspectiveEnabled = boo; }

    private m_rotDegree: number = 0.0;
    private m_rotAxis: Vector3D = new Vector3D();
    private m_rotPivotPoint: Vector3D = null;
    private m_axisRotEnabled: boolean = false;
    appendRotationByAxis(degree: number, axis: Vector3D, pivotPoint: Vector3D = null): void {
        if (this.m_unlock) {
            this.m_rotDegree = degree;
            this.m_changed = true;
            this.m_rotAxis.copyFrom(axis);
            this.m_rotPivotPoint = pivotPoint;
            this.m_axisRotEnabled = true;
        }
    }
    setRotationX(degree: number): void { this.m_rotV.x = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getRotationX(): number { return this.m_rotV.x; }
    setRotationY(degree: number): void { this.m_rotV.y = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getRotationY(): number { return this.m_rotV.y; }
    setRotationZ(degree: number): void { this.m_rotV.z = degree; this.m_changed = true; this.m_axisRotEnabled = false; }
    getRotationZ() { return this.m_rotV.z; }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        if (this.m_unlock) {
            this.m_rotV.setXYZ(rx,ry,rz);
            this.m_changed = true;
            this.m_axisRotEnabled = false;
        }
    }
    screenXYToViewXYZ(px: number, py: number, outV: Vector3D): void {
        px -= this.m_viewX;
        py -= this.m_viewY;
        if (this.m_perspectiveEnabled) {
            px = this.m_nearPlaneWidth * (px - this.m_viewHalfW) / this.m_viewHalfW;
            py = this.m_nearPlaneHeight * (this.m_viewHalfH - py) / this.m_viewHalfH;
        }
        outV.setTo(px, py, -this.m_zNear);
        //
    }
    screenXYToWorldXYZ(px: number, py: number, outV: Vector3D): void {
        px -= this.m_viewX;
        py -= this.m_viewY;
        if (this.m_perspectiveEnabled) {
            px = 0.5 * this.m_nearPlaneWidth * (px - this.m_viewHalfW) / this.m_viewHalfW;
            py = 0.5 * this.m_nearPlaneHeight * (this.m_viewHalfH - py) / this.m_viewHalfH;
        }
        outV.setTo(px, py, -this.m_zNear);
        outV.w = 1.0;
        this.m_viewInvertMat.transformVectorSelf(outV);
    }
    getWorldPickingRayByScreenXY(screenX: number, screenY: number, ray_pos: Vector3D, ray_tv: Vector3D): void {
        //console.log("screenX,screenY: ",screenX,screenY,this.m_viewHalfW,this.m_viewHalfH);
        screenX -= this.m_viewX;
        screenY -= this.m_viewY;
        if (this.m_perspectiveEnabled) {
            screenX = 0.5 * this.m_nearPlaneWidth * (screenX - this.m_viewHalfW) / this.m_viewHalfW;
            screenY = 0.5 * this.m_nearPlaneHeight * (screenY - this.m_viewHalfH) / this.m_viewHalfH;
            ray_pos.setTo(screenX, screenY, -this.m_zNear);
            ray_pos.w = 1.0;
            this.m_viewInvertMat.transformVectorSelf(ray_pos);
            ray_tv.copyFrom(ray_pos);
            ray_tv.subtractBy(this.m_camPos);
            ray_tv.normalize();
        }
        else {
            screenX -= this.m_viewHalfW;
            screenY -= this.m_viewHalfH;
            ray_pos.setTo(screenX, screenY, -this.m_zNear);
            ray_pos.w = 1.0;
            this.m_viewInvertMat.transformVectorSelf(ray_pos);
            ray_tv.copyFrom(this.m_lookDirectNV);
        }
    }
    calcScreenNormalizeXYByWorldPos(pv3: Vector3D, scPV3: Vector3D): void {
        scPV3.copyFrom(pv3);
        this.m_vpMat.transformVectorSelf(scPV3);
        scPV3.x /= scPV3.w;
        scPV3.y /= scPV3.w;
    }
    worldPosToScreen(pv: Vector3D): void {
        this.m_viewMat.transformVector3Self(pv);
        this.m_projMat.transformVectorSelf(pv);
        pv.x /= pv.w;
        pv.y /= pv.w;
        pv.x *= this.m_viewHalfW;
        pv.y *= this.m_viewHalfH;
        pv.x += this.m_viewX;
        pv.y += this.m_viewY;
    }
    // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值为像素数
    calcViewRectByWorldSphere(pv: Vector3D, radius: number, outV: Vector3D): void {
        this.m_viewMat.transformVector3Self(pv);
        radius *= 1.15;
        outV.x = pv.x - radius;
        outV.y = pv.y - radius;
        outV.z = pv.z;
        pv.x += radius;
        pv.y += radius;
        this.m_projMat.transformPerspV4Self(outV);
        this.m_projMat.transformPerspV4Self(pv);
        pv.z = 1.0 / pv.w;
        outV.z = pv.x * pv.z;
        outV.w = pv.y * pv.z;
        outV.z *= this.m_viewHalfW;
        outV.w *= this.m_viewHalfH;
        outV.x *= pv.z;
        outV.y *= pv.z;
        outV.x *= this.m_viewHalfW;
        outV.y *= this.m_viewHalfH;
        outV.z = outV.z - outV.x;
        outV.w = outV.w - outV.y;
        outV.x += this.m_viewX;
        outV.y += this.m_viewY;
    }

    // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值0.0 - 1.0之间
    calcScreenRectByWorldSphere(pv: Vector3D, radius: number, outV: Vector3D): void {
        this.m_viewMat.transformVector3Self(pv);
        radius *= 1.15;
        outV.x = pv.x - radius;
        outV.y = pv.y - radius;
        pv.x += radius;
        pv.y += radius;
        this.m_projMat.transformPerspV4Self(outV);
        this.m_projMat.transformPerspV4Self(pv);
        pv.z = 1.0 / pv.w;
        outV.z = pv.x * pv.z;
        outV.w = pv.y * pv.z;
        outV.x *= pv.z;
        outV.y *= pv.z;
        outV.z = outV.z - outV.x;
        outV.w = outV.w - outV.y;
    }
    private m_frustumWAABB = new AABB();
    private m_invViewMat: Matrix4 = null;
    private m_nearPlaneHalfW = 0.5;
    private m_nearPlaneHalfH = 0.5;
    private m_nearWCV = new Vector3D();
    private m_farWCV = new Vector3D();
    private m_wNV = new Vector3D();
    // 4 far point, 4 near point
    private m_wFrustumVS: Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), null, null, null];
    // world space front,back ->(view space -z,z), world space left,right ->(view space -x,x),world space top,bottm ->(view space y,-y)
    private m_wFruPlanes: Plane[] = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];
    private m_fpNVArr: Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D()];
    private m_fpDisArr: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    getFrustumWorldPlantAt(i: number): Plane {
        return this.m_wFruPlanes[i];
    }
    getInvertViewMatrix(): Matrix4 { return this.m_invViewMat; };
    getZNear(): number { return this.m_zNear; }
    setZNear(value: number): void { this.m_zNear = value; }
    getZFar(): number { return this.m_zFar; }
    setZFar(value: number): void { this.m_zFar = value; }
    getNearPlaneWidth(): number { return this.m_nearPlaneWidth; }
    setNearPlaneWidth(value: number): void { this.m_nearPlaneWidth = value; }
    getNearPlaneHeight(): number { return this.m_nearPlaneHeight; }
    setNearPlaneHeight(value: number): void { this.m_nearPlaneHeight = value; }
    getFov(): number {
        return this.m_fovRadian;
    }
    private __calcTestParam(): void {
        if (this.m_invViewMat == null) this.m_invViewMat = new Matrix4();
        this.m_invViewMat.copyFrom(this.m_viewMat);
        this.m_invViewMat.invert();
        
        let plane: Plane = null;
        let halfMinH = this.m_viewHalfH;
        let halfMinW = this.m_viewHalfW;
        let halfMaxH = this.m_viewHalfH;
        let halfMaxW = this.m_viewHalfW;
        if(this.m_perspectiveEnabled) {
            const tanv =  Math.tan(this.m_fovRadian * 0.5);
            halfMinH = this.m_zNear * tanv;
            halfMinW = halfMinH * this.m_aspect;
            halfMaxH = this.m_zFar * tanv;
            halfMaxW = halfMaxH * this.m_aspect;
        }

		const wfva = this.m_wFrustumVS;
		const wfpa = this.m_wFruPlanes;
        //console.log("CameraBase::__calcTestParam(), (halfMinW, halfMinH): "+halfMinW+", "+halfMinH);
        this.m_nearPlaneHalfW = halfMinW;
        this.m_nearPlaneHalfH = halfMinH;
        // inner view space
        this.m_nearWCV.setXYZ(0, 0, -this.m_zNear);
        this.m_farWCV.setXYZ(0, 0, -this.m_zFar);
        this.m_invViewMat.transformVectorSelf(this.m_nearWCV);
        this.m_invViewMat.transformVectorSelf(this.m_farWCV);
		this.m_wNV.subVecsTo(this.m_farWCV, this.m_nearWCV);
        this.m_wNV.normalize();

        // front face, far plane
        plane = wfpa[0];
        plane.nv.copyFrom(this.m_wNV);
        plane.distance = plane.nv.dot(this.m_farWCV);
        plane.position.copyFrom(this.m_farWCV);
        // back face, near face
        plane = wfpa[1];
        plane.nv.copyFrom(wfpa[0].nv);
        plane.distance = plane.nv.dot(this.m_nearWCV);
        plane.position.copyFrom(this.m_nearWCV);

        wfva[8] = this.m_nearWCV;
        wfva[9] = this.m_farWCV;
        wfva[11] = this.m_wNV;
        // far face
        wfva[0].setXYZ(-halfMaxW, -halfMaxH, -this.m_zFar);
        wfva[1].setXYZ(halfMaxW, -halfMaxH, -this.m_zFar);
        wfva[2].setXYZ(halfMaxW, halfMaxH, -this.m_zFar);
        wfva[3].setXYZ(-halfMaxW, halfMaxH, -this.m_zFar);
        // near face
        wfva[4].setXYZ(-halfMinW, -halfMinH, -this.m_zNear);
        wfva[5].setXYZ(halfMinW, -halfMinH, -this.m_zNear);
        wfva[6].setXYZ(halfMinW, halfMinH, -this.m_zNear);
        wfva[7].setXYZ(-halfMinW, halfMinH, -this.m_zNear);

        const invM = this.m_invViewMat;
        invM.transformVectorSelf(wfva[0]);
        invM.transformVectorSelf(wfva[1]);
        invM.transformVectorSelf(wfva[2]);
        invM.transformVectorSelf(wfva[3]);
        invM.transformVectorSelf(wfva[4]);
        invM.transformVectorSelf(wfva[5]);
        invM.transformVectorSelf(wfva[6]);
        invM.transformVectorSelf(wfva[7]);

        this.m_frustumWAABB.reset();
        for (let i = 0; i < 8; ++i) {
            this.m_frustumWAABB.addPosition(wfva[i]);
        }
        this.m_frustumWAABB.updateFast();

        // bottom
		this.m_tempV.subVecsTo(wfva[0], wfva[4]);
        let v0 = wfva[1];
		this.m_tempV1.subVecsTo(wfva[1], wfva[5]);
        plane = wfpa[3];
        Vector3D.Cross(this.m_tempV1, this.m_tempV, plane.nv);
        plane.nv.normalize();
        plane.distance = plane.nv.dot(v0);
        plane.position.copyFrom(v0);
        // top
		this.m_tempV.subVecsTo(wfva[3], wfva[7]);
        v0 = wfva[2];
		this.m_tempV1.subVecsTo(wfva[2], wfva[6]);
        plane = wfpa[2];
        Vector3D.Cross(this.m_tempV1, this.m_tempV, plane.nv);
        plane.nv.normalize();
        plane.distance = plane.nv.dot(v0);
        plane.position.copyFrom(v0);
        // left
		this.m_tempV.subVecsTo(wfva[0], wfva[4]);
        v0 = wfva[3];
		this.m_tempV1.subVecsTo(wfva[3], wfva[7]);
        plane = wfpa[4];
        Vector3D.Cross(this.m_tempV, this.m_tempV1, plane.nv);
        plane.nv.normalize();
        plane.distance = plane.nv.dot(v0);
        plane.position.copyFrom(v0);
        // right
		this.m_tempV.subVecsTo(wfva[1], wfva[5]);
        v0 = wfva[2];
		this.m_tempV1.subVecsTo(wfva[2], wfva[6]);
        plane = wfpa[5];
        Vector3D.Cross(this.m_tempV, this.m_tempV1, plane.nv);
        plane.nv.normalize();
        plane.distance = plane.nv.dot(v0);
        plane.position.copyFrom(v0);
		const fpna = this.m_fpNVArr;
        fpna[0].copyFrom(wfpa[0].nv);
        fpna[1].copyFrom(wfpa[1].nv);
        fpna[1].scaleBy(-1.0);
        fpna[2].copyFrom(wfpa[2].nv);
        fpna[3].copyFrom(wfpa[3].nv);
        fpna[3].scaleBy(-1.0);
        fpna[4].copyFrom(wfpa[4].nv);
        fpna[4].scaleBy(-1.0);
        fpna[5].copyFrom(wfpa[5].nv);

		const fpda = this.m_fpDisArr;
        fpda[0] = wfpa[0].distance;
        fpda[1] = -wfpa[1].distance;
        fpda[2] = wfpa[2].distance;
        fpda[3] = -wfpa[3].distance;
        fpda[4] = -wfpa[4].distance;
        fpda[5] = wfpa[5].distance;
    }
    getWordFrustumWAABB(): AABB { return this.m_frustumWAABB; }
    getWordFrustumWAABBCenter(): Vector3D { return this.m_frustumWAABB.center; }
    getWordFrustumVtxArr(): Vector3D[] { return this.m_wFrustumVS; }
    getWordFrustumPlaneArr(): Plane[] { return this.m_wFruPlanes; }

    visiTestNearPlaneWithSphere(w_cv: Vector3D, radius: number): number {
        const v = this.m_fpNVArr[1].dot(w_cv) - this.m_fpDisArr[1];// - radius;
        if((v - radius) > pmin) {
            // 表示完全在近平面之外，也就是前面
            return -1;
        }else if((v + radius) < MathConst.MATH_MIN_NEGATIVE){
            // 表示完全在近平面内, 也就是后面
            return 1;
        }
        // 表示和近平面相交
        return 0;
    }
    visiTestSphere2(w_cv: Vector3D, radius: number): boolean {

        let boo = (this.m_fpNVArr[0].dot(w_cv) - this.m_fpDisArr[0] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[1].dot(w_cv) - this.m_fpDisArr[1] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[2].dot(w_cv) - this.m_fpDisArr[2] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[3].dot(w_cv) - this.m_fpDisArr[3] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[4].dot(w_cv) - this.m_fpDisArr[4] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[5].dot(w_cv) - this.m_fpDisArr[5] - radius) > pmin;
        if (boo) return false;
        return true;
    }

    visiTestSphere3(w_cv: Vector3D, radius: number, farROffset: number): boolean {

        let boo = (this.m_fpNVArr[0].dot(w_cv) - this.m_fpDisArr[0] + farROffset - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[1].dot(w_cv) - this.m_fpDisArr[1] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[2].dot(w_cv) - this.m_fpDisArr[2] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[3].dot(w_cv) - this.m_fpDisArr[3] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[4].dot(w_cv) - this.m_fpDisArr[4] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[5].dot(w_cv) - this.m_fpDisArr[5] - radius) > pmin;
        if (boo) return false;
        return true;
    }
    visiTestPosition(pv: Vector3D): boolean {
        let boo = (this.m_fpNVArr[0].dot(pv) - this.m_fpDisArr[0]) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[1].dot(pv) - this.m_fpDisArr[1]) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[2].dot(pv) - this.m_fpDisArr[2]) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[3].dot(pv) - this.m_fpDisArr[3]) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[4].dot(pv) - this.m_fpDisArr[4]) > pmin;
        if (boo) return false;
        boo = (this.m_fpNVArr[5].dot(pv) - this.m_fpDisArr[5]) > pmin;
        if (boo) return false;
        return true;
    }
    visiTestPlane(nv: Vector3D, distance: number): boolean {
		const ls = this.m_wFruPlanes;
        let f0 = (nv.dot(ls[0].position) - distance);
        let f1 = f0 * (nv.dot(ls[1].position) - distance);
        if (f1 < pmin) return true;
        f1 = f0 * (nv.dot(ls[2].position) - distance);
        if (f1 < pmin) return true;
        f1 = f0 * (nv.dot(ls[3].position) - distance);
        if (f1 < pmin) return true;
        f1 = f0 * (nv.dot(ls[4].position) - distance);
        if (f1 < pmin) return true;
        f1 = f0 * (nv.dot(ls[5].position) - distance);
        if (f1 < pmin) return true;
        return false;
    }
    //this.m_wFruPlanes
    // frustum intersect sphere in wrod space
    visiTestSphere(w_cv: Vector3D, radius: number): boolean {
		const ls = this.m_wFruPlanes;
        let boo = this.m_frustumWAABB.sphereIntersect(w_cv, radius);
        if (boo) {
            let pf0 = ls[0].intersectSphere(w_cv, radius);
            let pf1 = ls[1].intersectSphere(w_cv, radius);
            if (pf0 * pf1 >= 0) {
                if (ls[0].intersectBoo || ls[1].intersectBoo) {
                } else {
                    return false;
                }
            }
            pf0 = ls[2].intersectSphere(w_cv, radius);
            pf1 = ls[3].intersectSphere(w_cv, radius);
            if (pf0 * pf1 >= 0) {
                if (ls[2].intersectBoo || ls[3].intersectBoo) {
                }
                else {
                    return false;
                }
            }
            pf0 = ls[4].intersectSphere(w_cv, radius);
            pf1 = ls[5].intersectSphere(w_cv, radius);
            if (pf0 * pf1 >= 0) {
                if (ls[4].intersectBoo || ls[5].intersectBoo) {
                }
                else {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    // visibility test
    // 可见性检测这边可以做的更精细，例如上一帧检测过的对象如果摄像机没有移动而且它自身也没有位置等变化，就可以不用检测
    // 例如精细检测可以分类: 圆球，圆柱体，长方体 等不同的检测模型计算方式会有区别
    visiTestAABB(ab: AABB): boolean {
        //trace("ro.bounds.getCenter(): "+ro.bounds.getCenter()+","+ro.bounds.getRadius());
        //return m_frustumWAABB.sphereIntersectFast(ro.bounds.getCenter(),ro.bounds.getRadius());
        let w_cv = ab.center;
        let radius = ab.radius;
        let boo = this.m_frustumWAABB.sphereIntersect(w_cv, radius);
		const ls = this.m_wFruPlanes;

        if (boo) {
            let pf0 = ls[0].intersectSphere(w_cv, radius);
            let pf1 = ls[1].intersectSphere(w_cv, radius);
            if (pf0 * pf1 >= 0) {
                if (ls[0].intersectBoo || ls[1].intersectBoo) {
                }
                else {
                    return false;
                }
            }
            pf0 = ls[2].intersectSphere(w_cv, radius);
            pf1 = ls[3].intersectSphere(w_cv, radius);
            if (pf0 * pf1 >= 0) {
                if (ls[2].intersectBoo || ls[3].intersectBoo) {
                } else {
                    return false;
                }
            }
            pf0 = ls[4].intersectSphere(w_cv, radius);
            pf1 = ls[5].intersectSphere(w_cv, radius);
            if (pf0 * pf1 >= 0) {
                if (ls[4].intersectBoo || ls[5].intersectBoo) {
                } else {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    private m_viewMatrix: Matrix4 = null;
    setViewMatrix(viewMatrix: Matrix4): void {
        this.m_viewMatrix = viewMatrix;
        this.m_changed = true;
    }
    update(): void {
        if (this.m_changed) {
            this.version++;
            this.m_changed = false;
            if(this.m_viewMatrix == null) {

                if (this.m_axisRotEnabled) {
                    this.m_matrix.appendRotationPivot(this.m_rotDegree * MathConst.MATH_PI_OVER_180, this.m_rotAxis, this.m_rotPivotPoint);
                }
                else {
                    this.m_matrix.identity();
                    this.m_matrix.appendRotationEulerAngle(this.m_rotV.x * MathConst.MATH_PI_OVER_180, this.m_rotV.y * MathConst.MATH_PI_OVER_180, this.m_rotV.z * MathConst.MATH_PI_OVER_180);
                }
                if (this.m_lookRHEnabled) {
                    this.m_viewMat.lookAtRH(this.m_camPos, this.m_lookAtPos, this.m_up);
                }
                else {
                    this.m_viewMat.lookAtLH(this.m_camPos, this.m_lookAtPos, this.m_up);
                }
                this.m_viewMat.append(this.m_matrix);
            }
            else {
                this.m_viewMat.copyFrom(this.m_viewMatrix);
            }
            if (this.m_project2Enabled) {
                this.m_nearPlaneWidth = this.m_zNear * Math.tan(this.m_fovRadian * 0.5) * 2.0;
                this.m_nearPlaneHeight = this.m_nearPlaneWidth / this.m_aspect;
            }
            else {
                this.m_nearPlaneHeight = this.m_zNear * Math.tan(this.m_fovRadian * 0.5) * 2.0;
                this.m_nearPlaneWidth = this.m_aspect * this.m_nearPlaneHeight;
            }
            this.m_viewInvertMat.copyFrom(this.m_viewMat);
            this.m_viewInvertMat.invert();
            //
            this.m_vpMat.identity();
            this.m_vpMat.copyFrom(this.m_viewMat);
            this.m_vpMat.append(this.m_projMat);

            this.__calcTestParam();
            // very very important !!!
            this.updateUniformData();
        }
    }
    updateCamMatToUProbe(uniformProbe: IShaderUniformProbe): void {
        if (uniformProbe.isEnabled()) {
            uniformProbe.update();
            uniformProbe.getFS32At(0).set(this.m_viewMat.getLocalFS32(), 0);
            uniformProbe.getFS32At(1).set(this.m_projMat.getLocalFS32(), 0);
        }
    }
    private updateUniformData(): void {

        if (this.uniformEnabled) {
            this.updateCamMatToUProbe(this.matUProbe);
            this.ufrustumProbe.setVec4DataAt(0, this.m_zNear, this.m_zFar, this.m_nearPlaneHalfW, this.m_nearPlaneHalfH);
            this.ufrustumProbe.update();
            this.ucameraPosProbe.setVec4DataAt(0, this.m_camPos.x,this.m_camPos.y,this.m_camPos.z,1.0);
            this.ucameraPosProbe.update();
        }
    }
    destroy(): void {
    }
    lookRHEnabled(): boolean {
        return this.m_lookRHEnabled;
    }
    lookLHEnabled(): boolean {
        return !this.m_lookRHEnabled;
    }
    getVPMatrix(): Matrix4 {
        return this.m_vpMat;
    }
    getViewMatrix(): Matrix4 {
        return this.m_viewMat;
    }
    getViewInvMatrix(): Matrix4 {
        return this.m_viewInvertMat;
    }
    getProjectMatrix(): Matrix4 {
        return this.m_projMat;
    }
}
export default CameraBase;
