/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IROTransform from "../../vox/display/IROTransform";
import IDisplayEntity from "../../vox/entity/IDisplayEntity";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";

interface ITransformEntity extends IDisplayEntity{
    __$setParent(parent: IDisplayEntityContainer): void;
    setXYZ(px: number, py: number, pz: number): void;
    setPosition(pv: IVector3D): void;
    getPosition(pv: IVector3D): void;
    setRotation3(r: IVector3D): void;
    setRotationXYZ(rx: number, ry: number, rz: number): void;
    setScaleXYZ(sx: number, sy: number, sz: number): void;
    getRotationXYZ(pv: IVector3D): void;
    getScaleXYZ(pv: IVector3D): void;
    localToGlobal(pv: IVector3D): void;
    globalToLocal(pv: IVector3D): void;
    getTransform(): IROTransform;
    getGlobalBoundsVer(): number;
    update(): void;
}

export default ITransformEntity;