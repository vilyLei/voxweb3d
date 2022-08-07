import { ITaskReceiveData } from "../thread/base/ITaskReceiveData";
import { GeometryModelDataType } from "../base/GeometryModelDataType";
import { ThreadTask } from "../thread/control/ThreadTask";
import {
	TaskUniqueNameDependency,
	TaskJSFileDependency,
} from "../thread/control/TaskDependency";

interface FBXModelDataType {
    models: GeometryModelDataType[];
    transform: Float32Array;
    index: number;
    total: number;
}
interface FBXDescriptorType {
    url: string;
}

interface FBXParseTaskListener {
	fbxParseFinish(models: GeometryModelDataType[], transform: Float32Array, url: string, index: number, total: number): void;
}

/**
 * fbx 几何模型数据加载/解析任务对象
 */
class FBXParseTask extends ThreadTask {
	private m_listener: FBXParseTaskListener = null;
	/**
	 * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
	 */
	constructor(src: string) {
		super();
		if (src.indexOf("/") > 0) {
			this.dependency = new TaskJSFileDependency(src);
		} else {
			this.dependency = new TaskUniqueNameDependency(src);
		}
	}
	setListener(l: FBXParseTaskListener): void {
		this.m_listener = l;
	}
	addBinaryData(buffer: ArrayBuffer, url: string): void {
		if (buffer != null) {
			this.addDataWithParam("", [buffer], { url: url });
		}
	}
	addURL(url: string): void {
		if (url != "") {
			throw Error("illegal operation!!!");
		}
	}
	// return true, task finish; return false, task continue...
	parseDone(
		data: ITaskReceiveData<FBXModelDataType, FBXDescriptorType>, flag: number
	): boolean {
		// console.log("FBXParseTask::parseDone(), this.m_listener != null:", this.m_listener != null, data);
		if (this.m_listener != null) {
			let modelData = data.data;
			this.m_listener.fbxParseFinish(modelData.models, modelData.transform, data.descriptor.url, modelData.index, modelData.total);
		}
		return true;
	}
	destroy(): void {
		super.destroy();
		this.m_listener = null;
	}
}

export { FBXParseTaskListener, GeometryModelDataType, FBXParseTask };
