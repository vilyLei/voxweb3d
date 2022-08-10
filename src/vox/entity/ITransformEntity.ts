/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IDisplayEntity from "../../vox/entity/IDisplayEntity";

interface ITransformEntity extends IDisplayEntity{
    setXYZ(px: number, py: number, pz: number): void;
    setPosition(pv: IVector3D): void;
    getPosition(pv: IVector3D): void;
    setRotationXYZ(rx: number, ry: number, rz: number): void;
    setScaleXYZ(sx: number, sy: number, sz: number): void;
    getRotationXYZ(pv: IVector3D): void;
    getScaleXYZ(pv: IVector3D): void;
    localToGlobal(pv: IVector3D): void;
    globalToLocal(pv: IVector3D): void;
    update(): void;
}

export default ITransformEntity;