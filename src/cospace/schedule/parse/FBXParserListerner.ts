/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { HttpFileLoader } from "../../modules/loaders/HttpFileLoader";
import { DataUnitPool } from "../base/DataUnitPool";
import { ReceiverSchedule } from "../ReceiverSchedule";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { ThreadSchedule } from "../../modules/thread/ThreadSchedule";
import { ITaskCodeModuleParam } from "../base/ITaskCodeModuleParam";

import { DataFormat, DataUnitLock, GeometryDataUnit } from "../base/GeometryDataUnit";
import { FBXParseTask } from "../../modules/fbx/FBXParseTask";
import DivLog from "../../../vox/utils/DivLog";

class ModelNode {
	models: GeometryModelDataType[] = null;
	transforms: Float32Array[] = null;
	constructor() { }
	destroy(): void {
		this.models = null;
		this.transforms = null;
	}
}
class FBXParserListerner {

	private m_parseTask: FBXParseTask = null;
	private m_unitPool: DataUnitPool<GeometryDataUnit>;
	private m_receiverSchedule: ReceiverSchedule;
	private m_threadSchedule: ThreadSchedule;
	private m_moduleUrl: string;
	private m_nodeMap: Map<string, ModelNode> = new Map();

	constructor(unitPool: DataUnitPool<GeometryDataUnit>, threadSchedule: ThreadSchedule, module: ITaskCodeModuleParam, receiverSchedule: ReceiverSchedule) {

		this.m_moduleUrl = module.url;
		this.m_unitPool = unitPool;
		this.m_threadSchedule = threadSchedule;
		this.m_receiverSchedule = receiverSchedule;
		// console.log("this.m_moduleUrl: ",this.m_moduleUrl);
	}

	addUrlToTask(url: string): void {

		if (!this.m_unitPool.hasUnitByUrl(url)) {

			if (this.m_parseTask == null) {
				// 创建ctm 加载解析任务
				let parseTask = new FBXParseTask(this.m_moduleUrl);
				// 绑定当前任务到多线程调度器
				this.m_threadSchedule.bindTask(parseTask);
				parseTask.setListener(this);
				this.m_parseTask = parseTask;
			}

			new HttpFileLoader().load(
				url,
				(buf: ArrayBuffer, url: string): void => {
					console.log("正在解析fbx数据...");
					DivLog.ShowLogOnce("正在解析fbx数据...");
					this.m_parseTask.addBinaryData(buf, url);
				},
				(progress: number, url: string): void => {
					let k = Math.round(100 * progress);
					DivLog.ShowLogOnce("fbx file loading " + k + "%");
				},
				(status: number, url: string): void => {
					console.error("load fbx mesh data error, url: ", url);
				}
			);
		}
	}
	// 一个任务数据处理完成后的侦听器回调函数
	fbxParseFinish(models: GeometryModelDataType[], transform: Float32Array, url: string, index: number, total: number): void {

		// console.log("FbxParserListerner::fbxParseFinish(), models: ", models, ", url: ", url);
		// console.log("AAAYYYT01 this.m_unitPool.hasUnitByUrl(url): ", this.m_unitPool.hasUnitByUrl(url));
		// let unit = this.m_unitPool.hasUnitByUrl(url);

		if (this.m_unitPool.hasUnitByUrl(url)) {
			let unit = this.m_unitPool.getUnitByUrl(url);

			let m = this.m_nodeMap;
			if (m.has(url)) {
				let node = m.get(url);
				//ls = ls.concat(models);
				for (let i = 0; i < models.length; ++i) {
					node.models.push(models[i]);
					node.transforms.push(transform);
				}
			} else {
				let node = new ModelNode();
				node.models = models;
				node.transforms = [transform];
				m.set(url, node);
			}
			if(unit.data.modelReceiver != null) {
				unit.data.modelReceiver(models, [transform]);
			}
			if ((index + 1) < total) {
				return;
			}

			// console.log("AAAYYYT02 unit != null: ", unit != null, index, total);
			if (unit != null) {
				let node = m.get(url);
				unit.lossTime = Date.now() - unit.lossTime;
				unit.data.dataFormat = DataFormat.FBX;
				unit.data.models = node.models;
				unit.data.transforms = node.transforms;
				node.destroy();

				m.delete(url);
				//if (transform != null) unit.data.transforms = [transform];
				DataUnitLock.lockStatus = 209;

				unit.toCpuPhase();
				if (unit.immediate) {
					// console.log("geom data receive at once.");
					this.m_receiverSchedule.testUnit(unit);
					// this.m_receiverSchedule.testUnitForce(unit);
				}
			}
		}
	}
	destroy(): void {
		if (this.m_parseTask != null) {
			this.m_parseTask.destroy();
			this.m_parseTask = null;
		}
		this.m_unitPool = null;
		this.m_threadSchedule = null;
		this.m_receiverSchedule = null;
	}
}
export { FBXParserListerner };
