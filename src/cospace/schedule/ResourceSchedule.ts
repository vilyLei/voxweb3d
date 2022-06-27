import { DataUnitPool } from "./base/DataUnitPool";
import { DataUnitReceiver } from "./base/DataUnitReceiver";
import { DataUnit } from "./base/GeometryDataUnit";
import { ReceiverSchedule } from "./ReceiverSchedule";
import { DataFormat } from "./base/DataUnit";
import { DataReceiverBase } from "../schedule/base/DataReceiverBase";
import { ThreadSchedule } from "../modules/thread/ThreadSchedule";

/**
 * 内置的资源接收器
 */
class ResourceReceiver<DataUnitType extends DataUnit> extends DataReceiverBase {
    private static s_total: number = 0;
    callback: (unit: DataUnitType, status: number) => void;
    constructor() {
        super();
        ResourceReceiver.s_total++
        // console.log("### ResourceReceiver.s_total: ",ResourceReceiver.s_total);
    }
    receiveDataUnit(unit: DataUnitType, status: number): void {
        // console.log("ResourceReceiver::receiveDataUnit(), unit: ", unit);
        let callback = this.callback;
        this.callback = null;
        if (callback != null) {
            callback(unit, status);
        }
    }
}

/**
 * 数据资源调度器基类
 */
class ResourceSchedule<DataUnitType extends DataUnit> {

    private m_receiverSchedule: ReceiverSchedule;
    private m_unitPool: DataUnitPool<DataUnitType> = new DataUnitPool();
    private m_threadSchedule: ThreadSchedule;
    private m_taskModuleUrls: string[] = null;

    constructor() {
    }
    /**
     * 被子类覆盖，以便实现具体功能
     */
    protected createDataUnit(url: string, dataFormat: DataFormat, immediate: boolean = false): DataUnitType {

        return null;
    }
    /**
     * 被子类覆盖，以便实现具体功能
     */
    protected initTask(unitPool: DataUnitPool<DataUnitType>, threadSchedule: ThreadSchedule, receiverSchedule: ReceiverSchedule, taskModuleUrls: string[]): void {

    }
    setTaskModuleUrls(taskModuleUrls: string[]): void {
        if(taskModuleUrls != null) {
            this.m_taskModuleUrls = taskModuleUrls.slice();
        }
    }
    initialize(receiverSchedule: ReceiverSchedule, threadSchedule: ThreadSchedule, taskModuleUrls: string[] = null): void {

        if (this.m_receiverSchedule == null && this.m_threadSchedule == null) {

            this.m_receiverSchedule = receiverSchedule;
            this.m_threadSchedule = threadSchedule;
            this.initTask( this.m_unitPool, threadSchedule, receiverSchedule, this.m_taskModuleUrls != null ? this.m_taskModuleUrls: taskModuleUrls);
        }
    }
    hasDataUnit(url: string): boolean {

        return this.m_unitPool.hasUnitByUrl(url);
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
    getCPUDataByUrlAndCallback(url: string, dataFormat: DataFormat, callback: (unit: DataUnitType, status: number) => void, immediate: boolean = false): DataUnitType {

        let unit: DataUnitType = this.m_unitPool.getUnitByUrl(url) as DataUnitType;
        if (unit != null) {
            if (callback != null) {
                if (unit.isCpuPhase()) {
                    console.log("getCPUDataUnitByUrlAndCallback(), the data unit is already available.");
                    unit.lossTime = 0;
                    callback(unit, 1);
                    return unit;
                }
            }
        }
        if (unit == null) {
            let r = new ResourceReceiver();
            r.callback = callback;
            unit = this.getCPUDataByUrl(url, dataFormat, r, immediate);
        }
        return unit;
    }

    /**
     * 立即获得CPU侧的数据单元实例, 但是数据单元中的数据可能是空的, 因为数据获取的操作实际是异步的。
     * 需要通过 isCpuPhase() 或者 isGpuPhase() 等函数来判定具体数据情况
     * @param url 数据资源url
     * @param dataFormat 数据资源类型
     * @param receiver 数据资源接收者,默认值是 null
     * @param immediate 是否立即返回数据, 默认是false
     * @returns 数据单元实例，用户只能访问不能更改这个实例内部的数据状态，如果必要则可以申请复制一份
     */
    getCPUDataByUrl(url: string, dataFormat: DataFormat, receiver: DataUnitReceiver = null, immediate: boolean = false): DataUnitType {

        let unit: DataUnitType = this.m_unitPool.getUnitByUrl(url) as DataUnitType;
        if (unit != null) {
            if (receiver != null) {
                if (unit.isCpuPhase()) {
                    console.log("getCPUDataUnitByUrl(), the data unit is already available.");
                    unit.lossTime = 0;
                    receiver.receiveDataUnit(unit, 1);
                    return unit;
                }
            }
        }
        if (unit == null) {
            unit = this.createDataUnit(url, dataFormat, immediate);
            unit.lossTime = Date.now();
            unit.url = url;
            this.m_unitPool.addUnit(url, unit);
        }

        this.m_receiverSchedule.addReceiver(receiver, unit);
        return unit;
    }
    getGPUDataByUrlAndCallback(url: string, dataFormat: DataFormat, callback: (unit: DataUnitType, status: number) => void, immediate: boolean = false): DataUnitType {
        return null;
    }
    getGPUDataByUrl(url: string, dataFormat: DataFormat, receiver: DataUnitReceiver = null, immediate: boolean = false): DataUnitType {
        return null;
    }
    getGPUDataByUUIDAndCallback(uuid: number, callback: (unit: DataUnitType, status: number) => void): DataUnitType {
        return null;
    }
    getGPUDataByUUID(uuid: number, receiver: DataUnitReceiver = null): DataUnitType {
        return null;
    }
    /**
     * 销毁当前实例
     */
    destroy(): void {
    }
}

export { ResourceSchedule };
