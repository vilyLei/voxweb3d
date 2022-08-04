import { ITaskReceiveData } from "../thread/base/ITaskReceiveData";
import { TaskUniqueNameDependency, TaskJSFileDependency } from "../thread/control/TaskDependency";
import { ThreadTask } from "../thread/control/ThreadTask";
import { ThreadSchedule } from "../thread/ThreadSchedule";
import { GeometryModelDataType, DracoDataType } from "./DracoDataType";
import { DracoTaskCMD } from "./DracoTaskCMD";

interface DracoGeomParseTaskListener {
    dracoParseSingle?(model: GeometryModelDataType, url: string, index: number): void;
    dracoParse(model: GeometryModelDataType, index: number, total: number): void;
    dracoParseFinish(models: GeometryModelDataType[], total: number): void;
}
/**
 * draco 几何模型数据解析任务对象
 */
class DracoGeomParseTask extends ThreadTask {
    private m_enabled: boolean = true;
    private m_thrScheDule: ThreadSchedule;
    private m_listener: DracoGeomParseTaskListener = null;
    private m_models: GeometryModelDataType[] = [];
    private m_srcBuf: ArrayBuffer = null;
    private m_segs: number[] = null;
    private m_segIndex: number = 0;
    private m_single: boolean = false;
    /**
     * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
     * @param thrScheDule 多线程调度器
     */
    constructor(src: string, thrScheDule: ThreadSchedule) {
        super();
        if(src.indexOf("/") > 0) {
            this.dependency = new TaskJSFileDependency(src);
        }else {
            this.dependency = new TaskUniqueNameDependency(src);
        }
        this.m_thrScheDule = thrScheDule;
    }
    setListener(l: DracoGeomParseTaskListener): void {
        this.m_listener = l;
    }
    reset(): void {
        super.reset();
        this.m_models = [];
        this.m_segIndex = 0;
		this.m_segs = null;
		this.m_enabled = true;
    }
    
    setSingleSegData(bufData: ArrayBuffer, url: string, index: number = 0): void {

        if (bufData != null) {
            this.m_single = true;
            this.addDataWithParam(DracoTaskCMD.PARSE, [new Uint8Array(bufData)], {beginI: 0, endI: bufData.byteLength, status: 0, url: url, index: index});
        }
    }
    private parseData(bufData: ArrayBuffer, beginI: number, endI: number): void {

        if (bufData != null) {
            this.m_enabled = false;
            this.addDataWithParam(DracoTaskCMD.PARSE, [new Uint8Array(bufData)], {beginI: beginI, endI: endI, status: 0});
        }
    }

    private parseNextSeg(): void {

        if (this.m_enabled && this.m_segs != null && this.m_segIndex < this.m_segs.length) {
			let tot = this.m_thrScheDule.getMaxThreadsTotal() > 0 ? this.m_thrScheDule.getMaxThreadsTotal() : 1;
            for (let i: number = 0; i < tot; i++) {
                if (this.m_segIndex < this.m_segs.length) {

					let begin = this.m_segs[this.m_segIndex];
					let end = this.m_segs[this.m_segIndex + 1];

					if(begin < 0) {
						begin = 0;
					}
					if(end < 8 || end > this.m_srcBuf.byteLength) {
						end = this.m_srcBuf.byteLength;
					}
                    let buf: ArrayBuffer = this.m_srcBuf.slice(begin, end);
                    this.parseData(buf, 0, buf.byteLength);
                    this.m_segIndex += 2;
                }
                else {
                    break;
                }
            }
        }
    }
    setParseSrcData(bufData: ArrayBuffer, segs: number[]): void {

        if (bufData != null && segs != null && this.m_segs == null) {
            this.m_single = false;
            this.m_segIndex = 0;
            this.m_srcBuf = bufData;
            this.m_segs = segs;
            this.setParseTotal(segs.length / 2);
            this.parseNextSeg();
        }
    }
    // return true, task finish; return false, task continue...
    parseDone(data: ITaskReceiveData<DracoDataType>, flag: number): boolean {

        console.log("XXXX DracoGeomParseTask::parseDone(), data: ", data);

        switch (data.taskCmd) {
            case DracoTaskCMD.PARSE:
                this.m_enabled = true;

                let model = data.data.model;
                if(model.normals == undefined) model.normals = null;
                if(model.uvsList == undefined) model.uvsList = null;
                if(this.m_single) {
                    let desc: any = data.descriptor as any;
                    this.m_listener.dracoParseSingle(model, desc.url, desc.index);
                }else {
                    this.m_parseIndex++;
                    this.m_models.push(model);
                    if (this.m_listener != null) {
                        if (this.isFinished()) {
                            this.m_listener.dracoParseFinish(this.m_models, this.getParseTotal());
                        }
                        else {
                            this.parseNextSeg();
                            this.m_listener.dracoParse(model, this.getParsedIndex(), this.getParseTotal());
                        }
                    }
                }
                break;
            default:
                break;
        }
        return true;
    }
    destroy(): void {
      super.destroy();
      this.m_listener = null;
      this.m_srcBuf = null;
      this.m_models = [];
      this.m_segIndex = 0;
	  this.m_segs = null;
    }
}

export { DracoGeomParseTaskListener, DracoGeomParseTask };
