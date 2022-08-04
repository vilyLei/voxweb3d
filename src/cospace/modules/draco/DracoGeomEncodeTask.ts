import { ITaskReceiveData } from "../thread/base/ITaskReceiveData";
import { TaskUniqueNameDependency, TaskJSFileDependency } from "../thread/control/TaskDependency";
import { ThreadTask } from "../thread/control/ThreadTask";
import { DracoTaskCMD } from "./DracoTaskCMD";

type DracoSrcGeomObject = {vertices: Float32Array, texcoords: Float32Array, normals: Float32Array, indices: Uint16Array | Uint32Array};
interface DracoGeomEncodeTaskListener {
    dracoEncodeFinish(buf: ArrayBuffer, url: string, index: number): void;
}

/**
 * draco 几何模型数据编码任务对象
 */
class DracoGeomEncodeTask extends ThreadTask {

    private m_listener: DracoGeomEncodeTaskListener = null;

	private m_compressionLevel: number = 5;
	private m_posQuantization: number = 11;
	private m_uvQuantization: number = 10;
	private m_nvQuantization: number = 8;
	private m_genericQuantization: number = 8;
/*

		encoder.SetAttributeQuantization(encoderModule.POSITION, 11);
		encoder.SetAttributeQuantization(encoderModule.TEX_COORD, 10);
		encoder.SetAttributeQuantization(encoderModule.NORMAL, 8);
		encoder.SetAttributeQuantization(encoderModule.GENERIC, 8);
*/
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
	setCompressLevel(compressionLevel: number): void {
		this.m_compressionLevel = compressionLevel;
	}
	setPosQuantization(posQuantization: number): void {
		this.m_posQuantization = posQuantization;
	}
	setUVQuantization(uvQuantization: number): void {
		this.m_uvQuantization = uvQuantization;
	}
	setNVQuantization(nvQuantization: number): void {
		this.m_nvQuantization = nvQuantization;
	}
	setGenericQuantization(genericQuantization: number): void {
		this.m_genericQuantization = genericQuantization;
	}

    setParseData(geomObject: DracoSrcGeomObject, url: string, index: number): void {

        if (geomObject != null) {
			let streams = [
				geomObject.vertices
				,geomObject.texcoords
				,geomObject.normals
				,geomObject.indices
			]
			let discriptor: any = {
				url: url,
				index: index,
				compressionLevel: this.m_compressionLevel,
				posQuantization: this.m_posQuantization,
				uvQuantization: this.m_uvQuantization,
				nvQuantization: this.m_nvQuantization,
				genericQuantization: this.m_genericQuantization,
			};
            this.addDataWithParam(DracoTaskCMD.ENCODE, streams, discriptor);
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
