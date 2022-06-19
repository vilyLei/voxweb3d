import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";

import DebugFlag from "../../../vox/debug/DebugFlag";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

import DataMesh from "../../../vox/mesh/DataMesh";
import DivLog from "../../../vox/utils/DivLog";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { CoSpace } from "../../CoSpace";
import { DataFormat } from "../../schedule/base/DataUnit";
import { GeometryDataUnit } from "../../schedule/base/GeometryDataUnit";
import { NormalViewerMaterial } from "../material/NormalViewerMaterial";
import RendererState from "../../../vox/render/RendererState";
import { FBXBufferLoader } from "../../modules/fbx/FBXBufferLoader";
import AABB from "../../../vox/geom/AABB";
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


	private loadCTMByUrl(url: string): void {

		DivLog.ShowLogOnce("正在解析原数据...");
		this.m_cospace.geometry.getCPUDataByUrlAndCallback(
			url,
			DataFormat.CTM,
			(unit: GeometryDataUnit, status: number): void => {
				let model: GeometryModelDataType = unit.data.model;
				if (model.normals == null) {
					console.error("model.normals == null, url: ", url);
				}

				this.initEntity(model);
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
/*
dealWithFolders(items) {
	if (items.length > 1) {
		this.loading = false;
		return this.$message.info("一次只允许上传一个文件夹");
	}
	var item = items[0].webkitGetAsEntry();
	if (item) {
		this.checkFolders(item);
	}
},
// 判断是否为文件夹  
checkFolders(item) {
	if (item.isDirectory) {
		let result = this.traverseFileTree(item);
		setTimeout(() => {
			this.transferFiles(result);
		}, 3 * 1000);
	} else {
		this.loading = false;
		this.$message.info("只支持上传文件夹");
	}
},
traverseFileTree(item) {
	let res = [];
	var internalProces = (item, path, res) => {
		if (item.isFile) {
			item.file(file => {
				file.path = path + file.name;
				var newFile = new File([file], file.path, { type: file.type });
				res.push(newFile);
			});
		} else if (item.isDirectory) {
			var dirReader = item.createReader();
			dirReader.readEntries(
				entries => {
					for (let i = 0; i < entries.length; i++) {
						internalProces(entries[i], path + item.name + "/", res);
					}
				},
				function (e) {
					console.log(e);
				}
			);
		}
	};
	internalProces(item, "", res);
	return res;
}
//*/