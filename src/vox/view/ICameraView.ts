/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import CameraBase from "../../vox/view/CameraBase";

/**
 * free move and rotate the camera view
 */
interface ICameraView {
    setCamera(camera: CameraBase): void;
    getCamera(): CameraBase;
    
    lookAtXYZUpYAxis(x: number, y: number, z: number): void;
    lookAtUpYAxis(pv: Vector3D): void;
    
    /**
     * rotate the camera view space
     * @param dx rotate "dx" angle degree about the camera view x-axis from current angle degree
     * @param dy rotate "dy" angle degree about the camera view y-axis
     * @param dz rotate "dz" angle degree about the camera view z-axis, it will be rolling the camera
     */
    rotateXYZ(dx: number, dy: number, dz: number): void;

    /**
     * rotate the camera view space
     * @param offsetRotV
     *                offsetRotV.x: rotate "dx" angle degree about the camera view x-axis from current angle degree
     *                offsetRotV.y: rotate "dy" angle degree about the camera view space y-axis
     *                offsetRotV.z: rotate "dz" angle degree about the camera view space z-axis, it will be rolling the camera
     */
    rotate(offsetRotV: Vector3D): void;
    /**
     * set the camera view space rotation angle degree
     * @param degreeX set rotatation angle degree about the camera view space x-axis
     * @param degreeY set rotatation angle degree about the camera view space y-axis
     * @param degreeZ set rotatation angle degree about the camera view space z-axis, it will be rolling the camera
     */
    setRotationXYZ(degreeX: number, degreeY: number, degreeZ: number): void;
    /**
     * set the camera view space rotation angle degree
     * @param rotV rotV.x: set rotatation angle degree about the camera view x-axis
     *             rotV.y: set rotatation angle degree about the camera view y-axis
     *             rotV.z: set rotatation angle degree about the camera view z-axis, it will be rolling the camera
     */
    setRotation(rotV: Vector3D): void;
    /**
     * 
     * @returns get the rotatation of the camera view space
     *               rotV.x: rotatation angle degree about the camera view space x-axis
     *               rotV.y: rotatation angle degree about the camera view space y-axis
     *               rotV.z: rotatation angle degree about the camera view space z-axis, it will be rolling the camera
     */
    getRotation(rotV: Vector3D): void;
    
    /**
     * rotate "degree" angle degree about the camera view x-axis from current angle degree
     * @param degree rotation angle degree
     */
    rotateX(degree: number): void;
    /**
     * rotate "degree" angle degree about the camera view y-axis from current angle degree
     * @param degree rotation angle degree
     */
    rotateY(degree: number): void;
    /**
     * rotate "degree" angle degree about the camera view z-axis from current angle degree
     * @param degree rotation angle degree
     */
    rotateZ(degree: number): void;
    /**
     * set rotatation angle about the camera view space x-axis
     * @param degree rotation angle degree
     */
    setRotationX(degree: number): void;
    /**
     * set rotatation angle about the camera view space y-axis
     * @param degree rotation angle degree
     */
    setRotationY(degree: number): void;
    /**
     * set rotatation angle about the camera view space z-axis, roll the camera
     * @param degree rotation angle degree
     */
    setRotationZ(degree: number): void;

    setXYZ(x: number, y: number, z: number): void;
    moveXYZ(dx: number, dy: number, dz: number): void;
    move(pv: Vector3D): void;
    setPosition(pv: Vector3D): void;
    getPosition(pv: Vector3D): void;

    getViewMatrix(): Matrix4;
    getViewInvMatrix(): Matrix4;

    update(): void;
    
}
export {ICameraView};