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
    localToGlobal(pv: IVector3D): void;
    globalToLocal(pv: IVector3D): void;
    getTransform(): IROTransform;
    getGlobalBoundsVer(): number;
}

export default ITransformEntity;