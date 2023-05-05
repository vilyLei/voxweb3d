/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import IAttackDst from "../../../app/robot/attack/IAttackDst";

// 一个 robot 由多个 RbtModule 组合而成
export default interface IRbtModule {
    
    setBrightness(brn: number): void;
    getContainer(): DisplayEntityContainer;
    setAttackDst(dst: IAttackDst): void;
    setVisible(boo: boolean): void;
    getVisible(): boolean;
    setRotationY(rotation: number): void;
    getRotationY(): number;
    setDstDirecDegree(degree: number): void;
    direcByPos(pos: Vector3D, finished: boolean): void;
    direcByDegree(degree: number, finished: boolean): void;
    setXYZ(px: number, py: number, pz: number): void;
    setPosition(position: Vector3D): void;
    getPosition(position: Vector3D): void;
    isResetFinish(): boolean;
    isPoseRunning(): boolean;
    resetPose(): void;
    run(moveEnabled: boolean): void;
}