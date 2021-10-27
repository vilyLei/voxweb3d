import Vector3D from "../../../vox/math/Vector3D";

enum KeyNodeStatus {
    None,
    Normal,
    Freeze
}

class PathKeyNode {

    status: KeyNodeStatus = KeyNodeStatus.None;
    index: number = -1;
    /**
     * 是否曲率冻结
     */
    curvationFreeze: boolean = false;
    /**
     * 当前位置的3d空间的坐标
     */
    pos: Vector3D = new Vector3D();
    /**
     * 朝向曲线大方向的切线，控制点在切线和位置构成的直线上
     */
    tv: Vector3D = new Vector3D();
    
    /**
     * 和曲线走向相反的控制点
     */
    negativeCtrlPos: Vector3D = new Vector3D();
    /**
     * 和曲线走向相同的控制点
     */
    positiveCtrlPos: Vector3D = new Vector3D();
    /**
     * 和曲线走向相反的控制长度因子
     */
    negativeCtrlFactor: number = 0.3;
    /**
     * 和曲线走向相同的控制点
     */
    positiveCtrlFactor: number = 0.3;
    constructor() { }
}
export { KeyNodeStatus, PathKeyNode };