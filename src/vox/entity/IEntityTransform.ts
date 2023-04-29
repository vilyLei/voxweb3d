/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IAABB from "../../vox/geom/IAABB";

interface IEntityTransform {
    setXYZ(px: number, py: number, pz: number): IEntityTransform;
    setPosition(pv: IVector3D): IEntityTransform;
    getPosition(pv?: IVector3D): IVector3D;
    setRotation3(rotV: IVector3D): IEntityTransform;
    setRotationXYZ(rx: number, ry: number, rz: number): IEntityTransform;
    setScaleXYZ(sx: number, sy: number, sz: number): IEntityTransform;
    getRotationXYZ(pv?: IVector3D): IVector3D;
    getScaleXYZ(pv?: IVector3D): IVector3D;
    localToGlobal(pv: IVector3D): void;
    globalToLocal(pv: IVector3D): void;
    
    getGlobalBounds(): IAABB;
    getLocalBounds(): IAABB;
    update(): void;
    destroy(): void;
	transFlag?: number;
}

export default IEntityTransform;