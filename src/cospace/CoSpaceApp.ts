/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ITaskCodeModuleParam } from "./schedule/base/ITaskCodeModuleParam";
import { CoSpace } from "./CoSpace";
import { DataFormat } from "./schedule/base/DataFormat";
import { DataUnit } from "./schedule/base/DataUnit";
import { ResourceSchedule } from "./schedule/ResourceSchedule";

type UnitDataCall = (unit: DataUnit, status: number) => void;
class ReqNode {
	private static s_uid = 0;
	private m_uid = ReqNode.s_uid++;

	url: string;
	dataFormat = DataFormat.CTM;
	callback: UnitDataCall = null;
	constructor() {
		this.url = "";
	}
	getUid(): number {
		return this.m_uid;
	}
	reset(): void {
		this.callback = null;
	}
}
class Instance {

	protected m_withCredentials: boolean = false;
	private m_loadingTotal = 0;
	private m_cpuReqNodes: ReqNode[] = [];
    /**
     * (引擎)数据协同中心实例
     */
    readonly cospace: CoSpace = new CoSpace();
	/**
	 * the default value is 8
	 */
	netLoadingMaxCount = 8;
    constructor() { }

    /**
     * 设置线程中子模块间依赖关系的json描述字符串
     * @param graphJsonStr json描述字符串
     */
    setThreadDependencyGraphJsonString(jsonStr: string): void {
        this.cospace.setThreadDependencyGraphJsonString(jsonStr);
    }
    setTaskModuleParams(params: ITaskCodeModuleParam[]): void {
        this.cospace.setTaskModuleParams(params);
    }
    initialize(threadsTotal: number, coreCodeUrl: string, autoSendData: boolean = true): void {

        this.cospace.initialize(threadsTotal, coreCodeUrl, autoSendData);
    }

	private testCPUReqNode(): void {
		let len = this.m_cpuReqNodes.length;
		if (len > 0) {
			if (this.netLoadingMaxCount < len) len = this.netLoadingMaxCount;
			for (let i = 0; i < len; ++i) {
				if (this.m_loadingTotal <= this.netLoadingMaxCount) {
					const node = this.m_cpuReqNodes.shift();
					const url = node.url;
					const dataFormat = node.dataFormat;
					const callback = node.callback;
					node.reset();
					console.log("NNNNNNN deferred call getCPUDataByUrlAndCallback()......");
					this.getCPUDataByUrlAndCallback(url, dataFormat, callback);
				} else {
					console.log("MMMMMMM 正在加载的总数量已达上限: ", this.netLoadingMaxCount);
					break;
				}
			}
		}
	}

	private m_timeoutId: any = -1;
	private m_updating = false;
	private cpuLoadTest(): void {
		if (this.m_timeoutId < 0) {
			console.log("启动 cpuLoadTest timer !!!");
		}
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
			this.m_timeoutId = -1;
		}
		if (this.m_cpuReqNodes.length > 0) {
			this.testCPUReqNode();
			this.m_timeoutId = setTimeout(this.cpuLoadTest.bind(this), 25); // 40 fps
		} else {
            this.m_updating = false;
			console.log("关闭 cpuLoadTest timer !!!");
		}
	}
    /**
     * 注意: 不建议过多使用这个函数,因为回调函数不安全如果是lambda表达式则由性能问题。
     * 立即获得CPU侧的数据单元实例, 但是数据单元中的数据可能是空的, 因为数据获取的操作实际是异步的。
     * 需要通过 isCpuPhase() 或者 isGpuPhase() 等函数来判定具体数据情况
     * @param url 数据资源url
     * @param dataFormat 数据资源类型
     * @param callback 数据资源接收回调函数, 其值建议为lambda函数表达式
     * @param immediate 是否立即返回数据, 默认是false
     * @returns 数据单元实例，用户只能访问不能更改这个实例内部的数据状态，如果必要则可以申请复制一份
     */
    getCPUDataByUrlAndCallback(url: string, dataFormat: DataFormat, callback: (unit: DataUnit, status: number) => void, immediate: boolean = false): DataUnit {
		let reqCall = callback;

		if (this.m_loadingTotal > this.netLoadingMaxCount) {
			const node = new ReqNode();
			node.url = url;
			node.dataFormat = dataFormat;
			node.callback = callback;
			this.m_cpuReqNodes.push(node);

			if (!this.m_updating) {
				this.m_updating = true;
				this.cpuLoadTest();
			}
			return null;
		} else {
			reqCall = (unit: DataUnit, status: number): void => {
				this.m_loadingTotal--;
				console.log("*** *** loaded a req this.m_loadingTotal: ", this.m_loadingTotal);
				callback(unit, status);
				// this.testCPUReqNode();
			};
			this.m_loadingTotal++;
			return this.getCPUDataByUrlAndCallback2(url, dataFormat, reqCall, immediate);
		}
		// let resShd: ResourceSchedule<DataUnit> = null;
        // switch (dataFormat) {
        //     case DataFormat.CTM:
        //     case DataFormat.OBJ:
        //     case DataFormat.Draco:
        //     case DataFormat.FBX:
        //     case DataFormat.GLB:
		// 		resShd = this.cospace.geometry;
        //         // return this.cospace.geometry.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
        //         break;
        //     case DataFormat.Jpg:
        //     case DataFormat.Png:
        //     case DataFormat.Gif:
		// 		resShd = this.cospace.texture;
        //         // return this.cospace.texture.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
        //         break;
        //     default:
        //         break;
        // }
		// if(resShd != null) {
		// 	// resShd.setWithCredentials(this.m_withCredentials);
		// 	return resShd.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
		// }
        // return null;
    }
	private getCPUDataByUrlAndCallback2(url: string, dataFormat: DataFormat, callback: (unit: DataUnit, status: number) => void, immediate: boolean = false): DataUnit {

		let resShd: ResourceSchedule<DataUnit> = null;
        switch (dataFormat) {
            case DataFormat.CTM:
            case DataFormat.OBJ:
            case DataFormat.Draco:
            case DataFormat.FBX:
            case DataFormat.GLB:
				resShd = this.cospace.geometry;
                // return this.cospace.geometry.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
                break;
            case DataFormat.Jpg:
            case DataFormat.Png:
            case DataFormat.Gif:
				resShd = this.cospace.texture;
                // return this.cospace.texture.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
                break;
            default:
                break;
        }
		if(resShd != null) {
			// resShd.setWithCredentials(this.m_withCredentials);
			return resShd.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
		}
        return null;
    }
    destroy(): void {
    }
}
function createInstance(): Instance {
    return new Instance();
}
export { createInstance, Instance };
