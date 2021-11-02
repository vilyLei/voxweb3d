/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用于视觉表现上的渲染控制, 而和transform或者非渲染的逻辑无关
// 一个 Vector3DPool 和一个 IRPODisplay一一对应, 一个Vector3DPool也只会和一个renderer相关联

import Vector3D from "../../../vox/math/Vector3D";


class Pos3D extends Vector3D {
    uid: number = -1;
    constructor(px: number = 0.0, py: number = 0.0, pz: number = 0.0, pw: number = 1.0) {
        super(px, py, pz, pw);
    }
}
export { Pos3D };