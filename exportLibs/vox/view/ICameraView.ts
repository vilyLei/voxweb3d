/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import {IRenderCamera} from "../../vox/render/IRenderCamera";

/**
 * free move and rotate the camera view
 */
interface ICameraView {
    setCamera(camera: IRenderCamera): void;
    getCamera(): IRenderCamera;
    
    lookAtXYZUpYAxis(x: number, y: number, z: number): void;
    lookAtUpYAxis(pv: IVector3D): void;
    
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
    rotate(offsetRotV: IVector3D): void;
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
    setRotation(rotV: IVector3D): void;
    /**
     * 
     * @returns get the rotatation of the camera view space
     *               rotV.x: rotatation angle degree about the camera view space x-axis
     *               rotV.y: rotatation angle degree about the camera view space y-axis
     *               rotV.z: rotatation angle degree about the camera view space z-axis, it will be rolling the camera
     */
    getRotation(rotV: IVector3D): void;
    
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
    move(pv: IVector3D): void;
    setPosition(pv: IVector3D): void;
    getPosition(pv: IVector3D): void;

    getViewMatrix(): IMatrix4;
    getViewInvMatrix(): IMatrix4;

    update(): void;
    
}
export {ICameraView};