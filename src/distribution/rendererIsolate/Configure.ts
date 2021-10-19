enum InstantiationType {
    /**
     * 系统和用户都可能创建多个实例
     */
    MULTIPLE = "multiple",
    /**
     * 只会由系统创建一个实例，全局使用
     */
    SINGLE = "single",
    /**
     * 由用户可能创建多个实例
     */
    DEFAULT = "default"
}
enum ModuleRuntimeType {
    /**
     * 系统会主动执行当前模块的run()
     */
    SYSTEM_RUNNING = "system_running",
    /**
     * 由用户具体需要的时候才会执行run()
     */
    SYSTEM_MODULE = "system_module"
}
export {InstantiationType, ModuleRuntimeType};