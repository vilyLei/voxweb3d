class ModuleFlag {

    static readonly AppEngine: number = 1;
    static readonly AppBase: number = 1 << 1;
    static readonly AppEnvLight: number = 1 << 2;
    static readonly AppLight: number = 1 << 3;
    static readonly AppShadow: number = 1 << 4;
    static readonly AppObjData: number = 1 << 5;
    static readonly AppLambert: number = 1 << 6;
    static readonly AppPBR: number = 1 << 7;
    
    static readonly ENGINE_LOADED: number = 3;
    static readonly SYS_MODULE_LOADED: number = 31;

    private m_flag: number = 0x0;
    constructor(){

    }
    static Initialize(): void {
        let MF = ModuleFlag;
        let mf: any = ModuleFlag;
        // mf.SYS_MODULE_LOADED = 31 | mf.AppLambert;
        mf.SYS_MODULE_LOADED = MF.AppEnvLight | MF.AppLight;// | MF.AppLambert;
    }

    reset(): void {
        this.m_flag = 0x0;
    }
    addFlag(bit: number): void {
        this.m_flag |= bit;
    }
    getFlag(): number {
        return this.m_flag;
    }
    hasEngineModule(): boolean {
        return (ModuleFlag.ENGINE_LOADED & this.m_flag) == ModuleFlag.ENGINE_LOADED;
    }
    hasAllSysModules(): boolean {
        return (ModuleFlag.SYS_MODULE_LOADED & this.m_flag) == ModuleFlag.SYS_MODULE_LOADED;
    }
    hasEnvLightModule(): boolean {
        return (ModuleFlag.AppEnvLight & this.m_flag) == ModuleFlag.AppEnvLight;
    }
    hasLightModule(): boolean {
        return (ModuleFlag.AppLight & this.m_flag) == ModuleFlag.AppLight;
    }
    hasObjDataModule(): boolean {
        return (ModuleFlag.AppObjData & this.m_flag) == ModuleFlag.AppObjData;
    }
    isObjDataModule(flag: number): boolean {
        return flag == ModuleFlag.AppObjData;
    }
    isLambert(flag: number): boolean {
        return flag == ModuleFlag.AppLambert;
    }
    isPBR(flag: number): boolean {
        return flag == ModuleFlag.AppPBR;
    }
}
export default ModuleFlag;