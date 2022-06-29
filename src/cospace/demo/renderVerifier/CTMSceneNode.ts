import DivLog from "../../../vox/utils/DivLog";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { CTMGeomDataParser } from "../../modules/ctm/CTMGeomDataParser";
import { FileLoader } from "../../modules/loaders/FileLoader";
import { DataFormat } from "../../schedule/base/DataUnit";
import { GeometryDataUnit } from "../../schedule/base/GeometryDataUnit";
import { SceneNode } from "./SceneNode";

class CTMSceneNode extends SceneNode {

	private m_index: number = 0;
	constructor() { super(); }

	load(urls: string[]): void {
		if (urls != null) {

			super.load(urls);

			this.m_index = 0;
			this.m_modelsTotal = urls.length;
			this.m_waitPartsTotal = this.m_modelsTotal;
			this.m_showTotal = 0;
			for (let i: number = 0; i < this.m_modelsTotal; ++i) {
				this.loadCTMByUrl(urls[i]);
			}
		}
	}
	/*
	private textCTM(url: string): void {

		new FileLoader().load(
			url,
			(buf: ArrayBuffer, url: string): void => {
				console.log("主线程正在解析CTM数据...");
				DivLog.ShowLogOnce("主线程正在解析CTM数据...");
				// this.m_parseTask.addBinaryData(new Uint8Array(buf), url);
				// new CTMGeomDataParser
				let parser = new CTMGeomDataParser();
				let fileBody = parser.parserBinaryData(new Uint8Array(buf));
				let len: number = fileBody.uvMaps.length;

				let uvsList: Float32Array[] = [];
				for (let i: number = 0; i < len; ++i) {
					uvsList.push(fileBody.uvMaps[i].uv);
				}
				// 因为 uv 和 下面三个数据实际公用一个buffer
				// transfers.push(fileBody.vertices);
				// transfers.push(fileBody.normals);
				// transfers.push(fileBody.indices);
				len = fileBody.indices.length;
				if(len < 65536) {
					let ivs = new Uint16Array(fileBody.indices.buffer);
					for(let i = 0; i < len; ++i) {
						ivs[i] = fileBody.indices[i];
					}
					fileBody.indices = ivs.subarray(0,len);
					console.log("数据变为 uint16.");
				}
				let model: GeometryModelDataType = {
					uvsList: uvsList,
					vertices: fileBody.vertices,
					normals: fileBody.normals,
					indices: fileBody.indices
				};
				this.initEntity(model, null, this.m_index);
				this.m_index++;
				if (this.m_index == this.m_modelsTotal) {
					this.m_waitPartsTotal = 0;
				}
			},
			(evt: ProgressEvent, url: string): void => {
				// let k = Math.round(100 * evt.loaded/evt.total);
				// DivLog.ShowLogOnce("ctm file loading " + k + "%");
			},
			(status: number, url: string): void => {
				console.error("load ctm mesh data error, url: ", url);
			}
		);
	}
	//*/
	private loadCTMByUrl(url: string): void {
		// this.textCTM(url);
		// return;
		this.m_cospace.geometry.getCPUDataByUrlAndCallback(
			url,
			DataFormat.CTM,
			(unit: GeometryDataUnit, status: number): void => {
				let model: GeometryModelDataType = unit.data.models[0];
				if (model.normals == null) {
					console.error("model.normals == null, url: ", url);
				}

				this.initEntity(model, null, this.m_index);
				this.m_index++;

				if (this.m_index == this.m_modelsTotal) {
					this.m_waitPartsTotal = 0;
				}
			},
			true
		);
	}
}

export { CTMSceneNode };