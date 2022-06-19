import { DataPhaseFlag } from "./DataPhaseFlag";

enum DataClass {
  Geometry,
  Texture,
  Undefined
}
/**
 * 数据文件类型，例如 ctm, draco
 */
enum DataFormat {
  CTM = "ctm",
  Draco = "draco",
  OBJ = "obj",
  Jpg = "jpg",
  Png = "png"
}
class DataUnitLock {
  /**
   * f防止误操作故意为之
   */
  static lockStatus: number = 0;
}
class DataUnit {
  private m_uuid: number;
  private static s_uuid: number = 0;

  // 表示 none/net/cpu/gpu 三个阶段的信息, 初始值必须是DataPhaseFlag.PHASE_NONE, 外部用户不能操作
  protected m_dataPhaseFlag: number = DataPhaseFlag.PHASE_NONE;
  dataClass: DataClass;
  url: string;
  /**
   * 当数据结果生成之后，是否立即向接收者发送数据结果
   */
  immediate: boolean = false;
  /**
   * 数据生成过程耗时
   */
  lossTime: number = 0;
  constructor() {
    // 故意写成这样，防止误操作
    if(DataUnitLock.lockStatus !== 207) {
      throw Error("illegal operation !!!");
    }
    this.m_uuid = DataUnit.s_uuid++;
    DataUnitLock.lockStatus = 0;
  }
  getUUID(): number {
    return this.m_uuid;
  }
  clone(): DataUnit {
    return null;
  }
  test(): void {
  }
  /**
   * @returns 返回CPU端数据是否可用
   */
  isNetPhase(): boolean {
    return DataPhaseFlag.isCpuPhase(this.m_dataPhaseFlag);
  }
  /**
   * @returns 返回CPU端数据是否可用
   */
  isCpuPhase(): boolean {
    return DataPhaseFlag.isCpuPhase(this.m_dataPhaseFlag);
  }
  /**
   * @returns 返回GPU端数据是否可用
   */
  isGpuPhase(): boolean {
    return DataPhaseFlag.isGpuPhase(this.m_dataPhaseFlag);
  }
  clearAllPhase(): void {
    this.m_dataPhaseFlag = DataPhaseFlag.clearAllPhase( this.m_dataPhaseFlag );
  }
  toNetPhase(): void {
		if (DataUnitLock.lockStatus !== 208) {
			throw Error('illegal operation !!!');
		}
    this.m_dataPhaseFlag = DataPhaseFlag.addNetPhase( this.m_dataPhaseFlag );
  }
  toCpuPhase(): void {
    if(DataUnitLock.lockStatus !== 209) {
      throw Error("illegal operation !!!");
    }
    this.m_dataPhaseFlag = DataPhaseFlag.addCpuPhase( this.m_dataPhaseFlag );
  }
  toGpuPhase(): void {
		if (DataUnitLock.lockStatus !== 210) {
			throw Error('illegal operation !!!');
		}
    this.m_dataPhaseFlag = DataPhaseFlag.addGpuPhase( this.m_dataPhaseFlag );
  }
  
}

export { DataClass, DataFormat, DataUnitLock, DataUnit };
