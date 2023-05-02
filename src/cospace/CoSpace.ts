/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ThreadSchedule } from "./modules/thread/ThreadSchedule";
import { GeometryResourceSchedule } from "./schedule/GeometryResourceSchedule";
import { ReceiverSchedule } from "./schedule/ReceiverSchedule";
import { TextureResourceSchedule } from "./schedule/TextureResourceSchedule";
import { ITaskCodeModuleParam } from "./schedule/base/ITaskCodeModuleParam";
import { CoSystem } from "./CoSystem";
import { CoRuntime } from "./CoRuntime";
/**
 * (引擎)数据/资源协同空间, 让一个应用程序的功能像种子一样，随着用户的使用而生根发芽枝叶茂盛，功能越加载越多，越使用越丰富
 * 使得基于算力&数据驱动的系统架构更趋于完善
 * 从cospace的角度看，每一个功能，都是可以动态载入并启动的模块集合。这些模块可能位于主线程也可能位于子线程，他们之间的协作情况由各自的依赖关系决定
 * cospace用以实现基于算力&数据驱动的能渐进生长方式的引擎/功能应用
 */
class CoSpace {

    private m_initing: boolean = true;
    private m_receiver: ReceiverSchedule = new ReceiverSchedule();

    readonly system: CoSystem = new CoSystem();
    readonly runtime: CoRuntime = new CoRuntime();
    readonly thread: ThreadSchedule = new ThreadSchedule();
    // 静态模块
    readonly geometry: GeometryResourceSchedule = new GeometryResourceSchedule();
    // 静态模块
    readonly texture: TextureResourceSchedule = new TextureResourceSchedule();

    constructor() {
    }
    
	/**
	 * 设置线程中子模块间依赖关系的json描述字符串
	 * @param graphJsonStr json描述字符串
	 */
    setThreadDependencyGraphJsonString(jsonStr: string): void {
        this.thread.setDependencyGraphJsonString(jsonStr);
    }
	setTaskModuleParams(taskModules: ITaskCodeModuleParam[]): void {
		if(taskModules != null) {
			this.geometry.setTaskModuleParams(taskModules);
			this.texture.setTaskModuleParams(taskModules);
		}
	}
    isInitialized(): boolean {
        return !this.m_initing;
    }
    /**
     * 初始化引擎数据资源协同空间实例
     * @param maxThreadsTotal 最大线程数量
     * @param threadCoreCodeUrl 线程源码字符串url
     * @param autoSendData 是否自动从任务池里取出并发送任务数据到子线程, 默认值是false
     */
    initialize(maxThreadsTotal: number, threadCoreCodeUrl: string, autoSendData: boolean = false, terminateDelayMS: number = 3000): void {
        if (this.m_initing) {
            this.m_initing = false;

            // let dependencyGraphObj: object = {
            //     nodes: [
            //         { uniqueName: "dracoGeomParser", path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js" },
            //         { uniqueName: "dracoWasmWrapper", path: "static/cospace/modules/dracoLib/w2.js" },
            //         { uniqueName: "ctmGeomParser", path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js" }
            //     ],
            //     maps: [
            //         { uniqueName: "dracoGeomParser", includes: [1] } // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
            //     ]
            // };
            // let jsonStr: string = JSON.stringify(dependencyGraphObj);
            // this.thread.setDependencyGraphJsonString(jsonStr);
    
            // 初始化多线程调度器

            this.thread.setParams(autoSendData, terminateDelayMS);
            // 初始化多线程调度器(多线程系统)
            this.thread.initialize(maxThreadsTotal, threadCoreCodeUrl);
            this.geometry.initialize(this.m_receiver, this.thread, null);
            this.texture.initialize(this.m_receiver, this.thread, null);
            // 启动循环定时调度
            this.update();
        }
    }

    private m_timeoutId: any = -1;
    /**
     * 定时调度
     */
    private update(): void {
        let delay: number = 40;      // 25 fps
        //console.log("this.thread.hasTaskData(): ",this.thread.hasTaskData());
        if (this.thread.isSupported() && (this.thread.hasTaskData() || this.m_receiver.getReceiversTotal() > 0)) {
            //console.log("mini time.",this.thread.hasTaskData(), this.m_receiver.getReceiversTotal());
            delay = 20;                 // 50 fps
        }
        this.thread.run();
        this.m_receiver.run();
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), delay);
    }
    destroy(): void {
    }
}

export { CoSpace };
