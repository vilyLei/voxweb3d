import { ITaskReceiveData } from "../thread/base/ITaskReceiveData";
import { TaskUniqueNameDependency, TaskJSFileDependency } from "../thread/control/TaskDependency";
import { ThreadTask } from "../thread/control/ThreadTask";
import { DracoTaskCMD } from "./DracoTaskCMD";

type DracoSrcGeomObject = {vertices: ArrayBuffer, texcoords: ArrayBuffer, normals: ArrayBuffer, indices: ArrayBuffer};
interface DracoGeomEncodeTaskListener {
    dracoEncodeFinish(buf: ArrayBuffer, url: string, index: number): void;
}

/**
 * draco 几何模型数据编码任务对象
 */
class DracoGeomEncodeTask extends ThreadTask {
    private m_listener: DracoGeomEncodeTaskListener = null;

    /**
     * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
     * @param thrScheDule 多线程调度器
     */
    constructor(src: string) {
        super();
        if(src.indexOf("/") > 0) {
            this.dependency = new TaskJSFileDependency(src);
        }else {
            this.dependency = new TaskUniqueNameDependency(src);
        }
    }
    setListener(l: DracoGeomEncodeTaskListener): void {
        this.m_listener = l;
    }
    setParseData(geomObject: DracoSrcGeomObject, url: string, index: number): void {

        if (geomObject != null) {
			let streams = [
				geomObject.vertices
				,geomObject.texcoords
				,geomObject.normals
				,geomObject.indices
			]
            this.addDataWithParam(DracoTaskCMD.ENCODE, streams, {url: url, index: index});
        }
    }

    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {

        console.log("XXXX DracoGeomEncodeTask::parseDone(), data: ", data);

        if(this.m_listener != null) {
            this.m_listener.dracoEncodeFinish(data.data.buf, data.descriptor.url, data.descriptor.index);
        }
        return true;
    }
    destroy(): void {
      super.destroy();
      this.m_listener = null;
    }
}

export { DracoSrcGeomObject, DracoGeomEncodeTaskListener, DracoGeomEncodeTask };
