import { TaskDataRouter } from "../thread/base/TaskDataRouter";

/**
 * 处理子线程和主线程之间任务模块之间相互依赖的数据交互
 */
class DracoGeomParseTaskDataRouter extends TaskDataRouter {
	private m_triggerFlag: boolean = true;
	private m_wasmBinBuf: ArrayBuffer;
	private m_wasmUrl: string;
	constructor(taskclass: number, wasmUrl: string) {
		super(taskclass);
		this.m_wasmUrl = wasmUrl;
	}

	setData(data: any): void {
		// 这里不一定是直接赋值，可能要经过处理和转化
		this.m_wasmBinBuf = data.streams[0];
		this.m_dataEnabled = true;
	}

	/**
	 * 由线程对象调用，以便启动数据处理的相应， 子类覆盖此函数以便实现具体的功能
	 */
	acquireTrigger(): void {
		if (!this.isTransmission()) {
			if (this.m_triggerFlag) {
				// load wasm bin file
				let wasmXHR: XMLHttpRequest = new XMLHttpRequest();
				wasmXHR.open("GET", this.m_wasmUrl, true);
				wasmXHR.responseType = "arraybuffer";
				wasmXHR.onload = () => {
					console.log("loaded wasm binary.");
					this.m_wasmBinBuf = wasmXHR.response;
					this.m_dataEnabled = true;
				};
				wasmXHR.send(null);

				this.m_triggerFlag = false;
			}
		}
	}
	/**
	 * 这个过程默认支持异步机制，如果有数据则使用，如果没数据，则进入到等待队列
	 * @returns 线程初始化需要的数据。数据可内存共享的方式使用或者复制的方式使用
	 */
	getData(): any {
		// 一旦获取数据就认为这个数据不可用了，直到重新得到数据为止
		this.m_dataEnabled = false;
		// 如果有，就直接返回，如果没有，则将自己加入到等等队列
		return { info: "draco wasm code file", streams: [this.m_wasmBinBuf] };
	}
	getTransfers(): ArrayBuffer[] {
		return [this.m_wasmBinBuf];
	}
}

export { DracoGeomParseTaskDataRouter };
