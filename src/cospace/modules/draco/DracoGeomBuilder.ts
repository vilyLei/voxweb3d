import { ThreadSchedule } from "../thread/ThreadSchedule";
import { DracoGeomParseTask, DracoGeomParseTaskListener } from "./DracoGeomParseTask";
import { DracoGeomParseTaskDataRouter } from "./DracoGeomParseTaskDataRouter";
/**
 * draco 几何模型数据加载和解析
 */
class DracoGeomBuilder {

    private m_inited: boolean = true;
    private m_thrSchedule: ThreadSchedule = null;
    private m_meshBuf: ArrayBuffer = null;
    private m_listener: DracoGeomParseTaskListener = null;
    private m_dracoTask: DracoGeomParseTask = null;
    private m_dracoWasmVersion: number;
    private m_taskModuleUrl: string;

    private m_segRangeList: number[] = null;
    
    constructor(taskModuleUrl:string, dracoWasmVersion: number = 2) {
        this.m_taskModuleUrl = taskModuleUrl;
        this.m_dracoWasmVersion = dracoWasmVersion;
    }
    
    setListener(l: DracoGeomParseTaskListener): void {
        this.m_listener = l;
        if(this.m_dracoTask != null) {
            this.m_dracoTask.setListener(l);
        }
    }
    initialize(threadSchedule: ThreadSchedule, urlDir: string = "cospace/modules/dracoLib/"): void {

        if(this.m_inited) {

            this.m_inited = false;
            this.m_thrSchedule = threadSchedule;

            let wasmUrl: string = "d2.md";
            let wapperUrl: string = "w2.js";
            if(this.m_dracoWasmVersion != 2) {
                wasmUrl = "d1.md";
                wapperUrl = "w1.js";
            }
            this.buildTask( urlDir + wapperUrl, urlDir + wasmUrl );
        }
    }
    /**
     * 加载未加密的draco模型文件
     * @param dracoDataUrl draco模型文件url
     * @param segRangeList draco模型文件字节分段信息
     */
    load(dracoDataUrl: string, segRangeList: number[]): void {
        if(this.m_dracoTask != null) {
            if(!this.m_dracoTask.isFinished()) {
                console.error("the draco mesh parseing do not finish, can not load other draco data.");
            }
            this.m_dracoTask.reset();
        }
        this.m_segRangeList = segRangeList.slice(0);
        this.loadDracoFile( dracoDataUrl );
    }
    private loadDracoFile(dracoDataUrl: string): void {

        const reader = new FileReader();
        reader.onload = e => {
            this.m_meshBuf = <ArrayBuffer>reader.result;
            this.m_dracoTask.setParseSrcData(this.m_meshBuf, this.m_segRangeList);
        };
        const request = new XMLHttpRequest();
        request.open("GET", dracoDataUrl, true);
        request.responseType = "blob";
        request.onload = () => {
            reader.readAsArrayBuffer(request.response);
        };
        request.send(null);
    }
    private buildTask(wapperUrl: string, wasmUrl: string): void {

        let threadSchedule = this.m_thrSchedule;
        if(threadSchedule != null) {
            
            // 创建和多线程关联的任务, 通过外部js文件url的形式创建任务实例
            // this.m_dracoTask = new DracoGeomParseTask( this.m_taskModuleUrl, threadSchedule );
            // 创建和多线程关联的任务, 通过外部js文件的依赖唯一名称的形式创建任务实例
            this.m_dracoTask = new DracoGeomParseTask( "dracoGeomParser", threadSchedule );
            this.m_dracoTask.setListener( this.m_listener );
            // 初始化draco解析所需的基本库, 因为有依赖管理器，这一句代码可以不用(依赖关系机制会完成对应的功能)
            //threadSchedule.initModules([wapperUrl]);
            
            if(!threadSchedule.hasRouterByTaskClass(this.m_dracoTask.getTaskClass())) {
                // 设置draco解析任务功能所需的数据路由
                let router = new DracoGeomParseTaskDataRouter(this.m_dracoTask.getTaskClass(), wasmUrl);
                threadSchedule.setTaskDataRouter( router );
            }
            // 多线程任务调度器绑定当前的 draco task
            threadSchedule.bindTask(this.m_dracoTask);
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
        this.m_meshBuf = null;
        this.m_listener = null;
        this.m_thrSchedule = null;
    }
}
export { DracoGeomBuilder };