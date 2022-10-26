/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ITaskCodeModuleParam } from "./schedule/base/ITaskCodeModuleParam";
import { CoSpace } from "./CoSpace";
import { DataFormat } from "./schedule/base/DataFormat";
import { DataUnit } from "./schedule/base/DataUnit";

class Instance {

    /**
     * (引擎)数据协同中心实例
     */
    readonly cospace: CoSpace = new CoSpace();
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
        switch (dataFormat) {
            case DataFormat.CTM:
            case DataFormat.OBJ:
            case DataFormat.Draco:
            case DataFormat.FBX:
            case DataFormat.GLB:
                return this.cospace.geometry.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
                break;
            case DataFormat.Jpg:
            case DataFormat.Png:
            case DataFormat.Gif:
                return this.cospace.texture.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);
                break;
            default:
                break;
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
