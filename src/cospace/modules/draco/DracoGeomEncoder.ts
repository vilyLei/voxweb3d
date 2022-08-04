import { ThreadSchedule } from "../thread/ThreadSchedule";
import { DracoSrcGeomObject, DracoGeomEncodeTask, DracoGeomEncodeTaskListener } from "./DracoGeomEncodeTask";
import { DracoGeomParseTaskDataRouter } from "./DracoGeomParseTaskDataRouter";
/**
 * draco 几何模型数据编码
 */
class DracoGeomEncoder {

    private m_inited: boolean = true;
    private m_thrSchedule: ThreadSchedule = null;
    private m_dracoBuf: ArrayBuffer = null;
    private m_listener: DracoGeomEncodeTaskListener = null;
    private m_dracoTask: DracoGeomEncodeTask = null;
    private m_taskModuleUrl: string;

    constructor(taskModuleUrl:string) {
        this.m_taskModuleUrl = taskModuleUrl;
    }

    setListener(l: DracoGeomEncodeTaskListener): void {
        this.m_listener = l;
        if(this.m_dracoTask != null) {
            this.m_dracoTask.setListener(l);
        }
    }
    initialize(threadSchedule: ThreadSchedule, urlDir: string = "static/cospace/modules/dracoLib/"): void {

        if(this.m_inited) {

            this.m_inited = false;
            this.m_thrSchedule = threadSchedule;

            let wasmUrl: string = "ed.md";
            let wapperUrl: string = "ew.js";
            this.buildTask( urlDir + wapperUrl, urlDir + wasmUrl );
        }
    }
	setParseData(geomObject: DracoSrcGeomObject, url: string, index: number): void {
		this.m_dracoTask.setParseData(geomObject, url, index);
	}
	setCompressParams(lv: number, pos: number = 11, uv: number = 10, normal: number = 8, eneric: number = 8): void {
		let task = this.m_dracoTask;
		task.setCompressLevel(lv);
		task.setPosQuantization(pos);
		task.setUVQuantization(uv);
		task.setNVQuantization(normal);
		task.setGenericQuantization(eneric);
	}
    private buildTask(wapperUrl: string, wasmUrl: string): void {

        let threadSchedule = this.m_thrSchedule;
        if(threadSchedule != null) {

            // 创建和多线程关联的任务, 通过外部js文件url的形式创建任务实例
            // this.m_dracoTask = new DracoGeomEncodeTask( this.m_taskModuleUrl, threadSchedule );
            // 创建和多线程关联的任务, 通过外部js文件的依赖唯一名称的形式创建任务实例
            this.m_dracoTask = new DracoGeomEncodeTask( "dracoGeomEncoder" );
            this.m_dracoTask.setListener( this.m_listener );
            // 初始化draco解析所需的基本库, 因为有依赖管理器，这一句代码可以不用(依赖关系机制会完成对应的功能)
            //threadSchedule.initModules([wapperUrl]);

            // 多线程任务调度器绑定当前的 draco task
            threadSchedule.bindTask(this.m_dracoTask);
            if(!threadSchedule.hasRouterByTaskClass(this.m_dracoTask.getTaskClass())) {
                // 设置draco解析任务功能所需的数据路由
                let router = new DracoGeomParseTaskDataRouter(this.m_dracoTask.getTaskClass(), wasmUrl);
                threadSchedule.setTaskDataRouter( router );
            }
        }
    }
    /**
     * 销毁当前实例
     */
    destroy(): void {
        if(this.m_dracoTask != null) {
            this.m_dracoTask.destroy();
            this.m_dracoTask = null;
        }
        this.m_dracoBuf = null;
        this.m_listener = null;
        this.m_thrSchedule = null;
    }
}
export { DracoSrcGeomObject, DracoGeomEncoder };
