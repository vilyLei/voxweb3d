/**
 * 表示数据所处的阶段, 当数据由网路载入到 gpu 则 其phase = PHASE_NET | PHASE_CPU | PHASE_GPU
 */
class DataPhaseFlag {
    /**
     * 表示处于未定义的情况
     */
    static readonly PHASE_NONE: number = 0;
    /**
     * 表示数据处于网路请求的阶段
     */
    static readonly PHASE_NET: number = 1<<2;
    /**
     * 表示数据处于cpu阶段
     */
    static readonly PHASE_CPU: number = 1<<3;
    /**
     * 表示数据处于gpu阶段
     */
    static readonly PHASE_GPU: number = 1<<4;

    
    static clearAllPhase(phaseFlag: number = 0): number {
        return DataPhaseFlag.PHASE_NONE;
    }
    static addNetPhase(phaseFlag: number): number {
        return DataPhaseFlag.PHASE_NET | phaseFlag;
    }
    static addCpuPhase(phaseFlag: number): number {
        return DataPhaseFlag.PHASE_CPU | phaseFlag;
    }
    static addGpuPhase(phaseFlag: number): number {
        return DataPhaseFlag.PHASE_GPU | phaseFlag;
    }
    
    static removeNetPhase(phaseFlag: number): number {
        return (~DataPhaseFlag.PHASE_NET) & phaseFlag;
    }
    static removeCpuPhase(phaseFlag: number): number {
        return (~DataPhaseFlag.PHASE_CPU) & phaseFlag;
    }
    static removeGpuPhase(phaseFlag: number): number {
        return (~DataPhaseFlag.PHASE_GPU) & phaseFlag;
    }

    static isNonePhase(phaseFlag: number): boolean {
        return DataPhaseFlag.PHASE_NONE == phaseFlag;
    }
    
    static isNetPhase(phaseFlag: number): boolean {
        return (DataPhaseFlag.PHASE_NET & phaseFlag) == DataPhaseFlag.PHASE_NET;
    }
    static isCpuPhase(phaseFlag: number): boolean {
        return (DataPhaseFlag.PHASE_CPU & phaseFlag) == DataPhaseFlag.PHASE_CPU;
    }
    static isGpuPhase(phaseFlag: number): boolean {
        return (DataPhaseFlag.PHASE_GPU & phaseFlag) == DataPhaseFlag.PHASE_GPU;
    }
}

export { DataPhaseFlag }