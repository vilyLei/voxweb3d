import { ITaskReceiveData } from "../thread/base/ITaskReceiveData";
import { GeometryModelDataType, CTMDescriptorType } from "./CTMDescriptorType";
import { ThreadTask } from "../thread/control/ThreadTask";
import {
	TaskUniqueNameDependency,
	TaskJSFileDependency,
} from "../thread/control/TaskDependency";
import { CTMTaskCMD } from "./CTMTaskCMD";

interface CTMParseTaskListener {
	ctmParseFinish(model: GeometryModelDataType, url: string): void;
}

/**
 * ctm 几何模型数据加载/解析任务对象
 */
class CTMParseTask extends ThreadTask {
	private m_listener: CTMParseTaskListener = null;
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
	setListener(l: CTMParseTaskListener): void {
		this.m_listener = l;
	}
	addBinaryData(buffer: Uint8Array, url: string): void {
		if (buffer != null) {
			this.addDataWithParam(CTMTaskCMD.PARSE, [buffer], { url: url });
		}
	}
	addURL(url: string): void {
		if (url != "") {
			this.addDataWithParam(CTMTaskCMD.LOAD_AND_PARSE, null, { url: url });
		}
	}
	// return true, task finish; return false, task continue...
	parseDone(
		data: ITaskReceiveData<GeometryModelDataType, CTMDescriptorType>, flag: number
	): boolean {
		// console.log("CTMParseTask::parseDone(), this.m_listener != null:", this.m_listener != null, data);
		if (this.m_listener != null) {
			let model = data.data;
			if (model.normals == undefined) model.normals = null;
			if (model.uvsList == undefined) model.uvsList = null;

			this.m_listener.ctmParseFinish(model, data.descriptor.url);
		}
		return true;
	}
	// 这个函数的返回值与子线程中的对应处理代码模块 getTaskClass() 函数返回值必须一致。不同类型的任务此返回值务必保持唯一性
	getTaskClass(): number {
		return 101;
	}
	destroy(): void {
		super.destroy();
		this.m_listener = null;
	}
}

export { CTMParseTask };
