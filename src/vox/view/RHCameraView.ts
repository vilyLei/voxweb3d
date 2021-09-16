/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import MathConst from "../math/MathConst";
import { ICameraView } from "./ICameraView";

/**
 * free move and rotate the camera view
 */
class RHCameraView {

    private m_originMatrix: Matrix4 = new Matrix4();
    private m_rotYMat: Matrix4 = new Matrix4();
    private m_rotZMat: Matrix4 = new Matrix4();
    private m_invViewMat: Matrix4 = new Matrix4();
    private m_viewMat: Matrix4 = new Matrix4();
    private m_rot: Vector3D = new Vector3D();
    private m_pos: Vector3D = new Vector3D();
    private m_changed: boolean = true;

    constructor() {
        this.m_originMatrix.setRotationEulerAngle(0, -0.5 * Math.PI, 0);
    }

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
    setPosition(pv: Vector3D): void {
        this.m_pos.copyFrom(pv);
        this.m_changed = true;
    }
    getPosition(pv: Vector3D): void {
        pv.copyFrom(this.m_pos);
    }
    update(): void {

        if (this.m_changed) {
            this.m_changed = false;

            this.m_rotZMat.identity();
            this.m_rotYMat.identity();
            this.m_rotZMat.setRotationEulerAngle(
                0,
                0,
                MathConst.DegreeToRadian(this.m_rot.z)
            );
            this.m_rotYMat.setRotationEulerAngle(
                0,
                MathConst.DegreeToRadian(this.m_rot.y),
                0         
            );
            this.m_rotZMat.append( this.m_rotYMat );
            this.m_rotZMat.setTranslation(this.m_pos);

            this.m_invViewMat.copyFrom(this.m_originMatrix);
            this.m_invViewMat.append(this.m_rotZMat);
            this.m_viewMat.copyFrom(this.m_invViewMat);
            this.m_viewMat.invert();
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