import { ITaskReceiveData } from "../thread/base/ITaskReceiveData";
import { ThreadTask } from "../thread/control/ThreadTask";
import {
	TaskUniqueNameDependency,
	TaskJSFileDependency,
} from "../thread/control/TaskDependency";

import { PNGDescriptorType } from "./PNGDescriptorType";

interface PNGParseTaskListener {
	pngParseFinish(pngBuffer: Uint8Array, des: PNGDescriptorType): void;
}

/**
 * png 解析任务对象
 */
class PNGParseTask extends ThreadTask {
	private m_listener: PNGParseTaskListener = null;
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
	setListener(l: PNGParseTaskListener): void {
		this.m_listener = l;
	}
	addBinaryData(buffer: Uint8Array, url: string): void {
		if (buffer != null) {
			this.addDataWithParam("", [buffer], { url: url, width:0, height:0 });
		}
	}
	// return true, task finish; return false, task continue...
	parseDone(
		data: ITaskReceiveData<Uint8Array, PNGDescriptorType>, flag: number
	): boolean {
		// console.log("CTMParseTask::parseDone(), this.m_listener != null:", this.m_listener != null, data);
		if (this.m_listener != null) {

			this.m_listener.pngParseFinish(data.data, data.descriptor);
		}
		return true;
	}
	// 这个函数的返回值与子线程中的对应处理代码模块 getTaskClass() 函数返回值必须一致。不同类型的任务此返回值务必保持唯一性
	getTaskClass(): number {
		return 104;
	}
	destroy(): void {
		super.destroy();
		this.m_listener = null;
	}
}

export { PNGDescriptorType, PNGParseTaskListener, PNGParseTask };
