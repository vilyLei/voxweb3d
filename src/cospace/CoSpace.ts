import { ThreadSchedule } from "./modules/thread/ThreadSchedule";
import { GeometryResourceSchedule } from "./schedule/GeometryResourceSchedule";
import { ReceiverSchedule } from "./schedule/ReceiverSchedule";
import { TextureResourceSchedule } from "./schedule/TextureResourceSchedule";
/**
 * 引擎数据/资源协同空间
 */
class CoSpace {

    private m_inited: boolean = true;
    private m_receiver: ReceiverSchedule = new ReceiverSchedule();

    readonly thread: ThreadSchedule = new ThreadSchedule();

    readonly geometry: GeometryResourceSchedule = new GeometryResourceSchedule();
    readonly texture: TextureResourceSchedule = new TextureResourceSchedule();

    constructor() {
    }
    /**
     * 初始化引擎数据资源协同空间实例
     * @param maxThreadsTotal 最大线程数量
     * @param threadCoreCodeUrl 线程源码字符串url
     * @param autoSendData 是否自动从任务池里取出并发送数据到子线程, 默认值是false
     */
    initialize(maxThreadsTotal: number, threadCoreCodeUrl: string, autoSendData: boolean = false): void {
        if (this.m_inited) {
            this.m_inited = false;

            this.thread.setParams(autoSendData);
            // 初始化多线程调度器(多线程系统)
            this.thread.initialize(maxThreadsTotal, threadCoreCodeUrl);

            let taskModuleUrls: string[] = [
                "cospace/modules/ctm/ModuleCTMGeomParser.umd.js"
            ];
            this.geometry.initialize(this.m_receiver, this.thread, taskModuleUrls);

            // 启动循环定时调度
            this.update();
        }
    }
    /**
     * 通过唯一标识名
     * @param uniqueName 主线程功能模块唯一标识名
     */
    addModuleByUniqueName(uniqueName: string): void {

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
