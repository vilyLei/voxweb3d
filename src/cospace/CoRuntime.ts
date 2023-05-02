/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/**
 * (引擎)数据/资源协同空间运行时，用以管理运行时的相关程序或功能
 */
class CoRuntime {

    constructor() {
    }
    /**
     */
    initialize(): void {
    }
    /**
     * 通过唯一标识名添加一个动态模块, 依赖关系管理器会自动加载添加其他被依赖的模块
     * @param uniqueName 主线程功能模块唯一标识名
     */
    addModuleByUniqueName(uniqueName: string): void {

    }
    /**
     * 通过唯一标识名启动一个动态模块
     * @param uniqueName 主线程功能模块唯一标识名
     */
    startupModuleByUniqueName(uniqueName: string): void {

    }
    destroy(): void {
    }
}

export { CoRuntime };
