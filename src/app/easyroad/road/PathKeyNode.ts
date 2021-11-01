
import { Pos3D } from "../base/Pos3D";
import { Pos3DPool } from "../base/Pos3DPool";

enum KeyNodeStatus {
    None,
    Normal,
    Freeze
}

class PathKeyNode {
    private static s_uid: number = 0;
    private m_uid: number = 0;
    status: KeyNodeStatus = KeyNodeStatus.None;
    index: number = -1;
    stepDistance: number = 20.0;
    /**
     * 是否曲率冻结
     */
    curvationFreeze: boolean = false;
    /**
     * 当前位置的3d空间的坐标
     */
    pos: Pos3D = Pos3DPool.Create();
    /**
     * 朝向曲线大方向的切线，控制点在切线和位置构成的直线上
     */
    tv: Pos3D = Pos3DPool.Create();
    
    /**
     * 和曲线走向相反的控制点
     */
    //negativeCtrlPos: Pos3D = Pos3DPool.Create();
    /**
     * 和曲线走向相同的控制点
     */
    //positiveCtrlPos: Pos3D = Pos3DPool.Create();
    /**
     * 和曲线走向相反的控制长度因子
     */
    negativeCtrlFactor: number = 0.3;
    /**
     * 和曲线走向相同的控制点
     */
    positiveCtrlFactor: number = 0.3;
    constructor() {
        this.m_uid = PathKeyNode.s_uid ++;
    }
    destroy(): void {
        Pos3DPool.Restore( this.pos );
        Pos3DPool.Restore( this.tv );
        this.pos = null;
        this.tv = null;
    }
}
export { KeyNodeStatus, PathKeyNode };