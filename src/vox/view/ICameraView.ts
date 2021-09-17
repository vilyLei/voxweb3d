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

    lookAtXYZ(x: number, y: number, z: number): void;
    lookAt(pv: Vector3D): void;
    
    setRotationXYZ(degreeX: number, degreeY: number, degreeZ: number): void;
    setPosition(pv: Vector3D): void;
    setXYZ(x: number, y: number, z: number): void;
    update(): void;
    getViewMatrix(): Matrix4;
    getViewInvMatrix(): Matrix4;
}
export {ICameraView};