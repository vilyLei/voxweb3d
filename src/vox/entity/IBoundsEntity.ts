/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是为了做包围体测试或者被空间管理culling test的entity对象的逻辑实体,
// 内部的transform机制是完整的，但是不会构建实际的display对象，不会进入渲染运行时

import IVector3D from "../../vox/math/IVector3D";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import ITestRay from "../mesh/ITestRay";

export default interface IBoundsEntity extends ITransformEntity {

    initialize(minV: IVector3D, maxV: IVector3D): void;
    setBounds(minV: IVector3D, maxV: IVector3D): void;
    setRayTester(rayTester: ITestRay): void;
}