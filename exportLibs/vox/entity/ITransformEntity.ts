/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IAABB from "../../vox/geom/IAABB";
import IROTransform from "../../vox/display/IROTransform";
import IDisplayEntity from "../../vox/entity/IDisplayEntity";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";

interface ITransformEntity extends IDisplayEntity{
    __$setParent(parent: IDisplayEntityContainer): void;
    // localToGlobal(pv: IVector3D): void;
    // globalToLocal(pv: IVector3D): void;
    getTransform(): IROTransform;
    getGlobalBoundsVer(): number;

    setXYZ(px: number, py: number, pz: number): ITransformEntity;
    setPosition(pv: IVector3D): ITransformEntity;
    getPosition(pv?: IVector3D): IVector3D;
    setRotation3(rotV: IVector3D): ITransformEntity;
    setRotationXYZ(rx: number, ry: number, rz: number): ITransformEntity;
    setScaleXYZ(sx: number, sy: number, sz: number): ITransformEntity;
    getRotationXYZ(pv?: IVector3D): IVector3D;
    getScaleXYZ(pv?: IVector3D): IVector3D;
    localToGlobal(pv: IVector3D): void;
    globalToLocal(pv: IVector3D): void;
    
    getGlobalBounds(): IAABB;
    getLocalBounds(): IAABB;
    update(): void;
    destroy(): void;
}

export default ITransformEntity;