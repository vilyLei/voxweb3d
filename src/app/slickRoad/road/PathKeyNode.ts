
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

    /**
     * 当前半径平滑过渡变换因子(0.0 -> 1.0)
     */
    pathRadiusChangeFactor: number = 1.0;
    /**
     * 当前半径平滑过渡变换的幅度(-1.0 -> 1.0)
     */
    pathRadiusChangeAmplitude: number = 1.0;
    /**
     * 记录当前位置的半径(半宽度)值
     */
    pathRadius: number = 60.0;
    /**
     * 记录自身是否可以被当前编辑改变的状态
     */
    status: KeyNodeStatus = KeyNodeStatus.None;
    /**
     * 记录自身在数组中的序号
     */
    index: number = -1;
    /**
     * 自身所代表的一段路径的细分分段估算距离
     */
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