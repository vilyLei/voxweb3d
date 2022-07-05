import { ITaskReceiveData } from "../thread/base/ITaskReceiveData";
import { GeometryModelDataType, OBJModelDataType, OBJDescriptorType } from "./OBJDescriptorType";
import { ThreadTask } from "../thread/control/ThreadTask";
import {
	TaskUniqueNameDependency,
	TaskJSFileDependency,
} from "../thread/control/TaskDependency";

interface OBJParseTaskListener {
	objParseFinish(models: GeometryModelDataType[], url: string): void;
}

/**
 * obj 几何模型数据加载/解析任务对象
 */
class OBJParseTask extends ThreadTask {
	private m_listener: OBJParseTaskListener = null;
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
	setListener(l: OBJParseTaskListener): void {
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
		data: ITaskReceiveData<OBJModelDataType, OBJDescriptorType>, flag: number
	): boolean {
		// console.log("OBJParseTask::parseDone(), this.m_listener != null:", this.m_listener != null, data);
		if (this.m_listener != null) {
			let modelData = data.data;
			this.m_listener.objParseFinish(modelData.models, data.descriptor.url);
		}
		return true;
	}
	destroy(): void {
		super.destroy();
		this.m_listener = null;
	}
}

export { OBJParseTaskListener, OBJModelDataType, OBJParseTask };
