/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { CoTextureDataUnit, CoGeomDataUnit, CoDataFormat, CoTaskCodeModuleParam } from "./CoSpaceAppData";
interface ICoSpaceAppIns {

	/**
	 * the default value is 8
	 */
	netLoadingMaxCount: number;
	/**
	 * 设置线程中子模块间依赖关系的json描述字符串
	 * @param graphJsonStr json描述字符串
	 */
	setThreadDependencyGraphJsonString(jsonStr: string): void;
	setTaskModuleParams(params: CoTaskCodeModuleParam[], type?: string): void;
	initialize(threadsTotal: number, coreCodeUrl: string, autoSendData: boolean): void;
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
    getCPUDataByUrlAndCallback(url: string, dataFormat: CoDataFormat, callback: (unit: CoGeomDataUnit | CoTextureDataUnit, status: number) => void, immediate?: boolean): CoGeomDataUnit;
	destroy(): void;
}
export { ICoSpaceAppIns };
