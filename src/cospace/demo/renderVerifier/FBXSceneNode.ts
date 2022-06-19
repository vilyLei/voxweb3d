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

class FBXSceneNode extends SceneNode {


	constructor() { super(); }

	load(urls: string[]): void {

		super.load( urls);
		this.loadFBXBySteps(urls[0]);
	}
	private loadFBXBySteps(url: string): void {


		DivLog.ShowLogOnce("正在解析原数据...");
		this.m_partsTotal = 0;
		this.m_showTotal = 0;
		let fbxBufLoader = new FBXBufferLoader();
		fbxBufLoader.loadBySteps(
			url,
			(model: GeometryModelDataType, id: number, index: number, total: number, url: string): void => {

				// console.log("loadFBXBySteps(), model: ", index + "/" + total);
				this.m_modelsTotal = total;
				// this.m_showTotal = 0
				this.m_waitPartsTotal = total;
				this.initEntity(model);
				if ((index + 1) == total) {
					this.m_waitPartsTotal = 0;
				}
			}
		);
	}
	private loadFBX(): void {

		let url: string = "static/assets/fbx/test01.fbx";
		// url = "static/assets/fbx/box.fbx";
		// url = "static/private/fbx/test_500W.fbx";
		// url = "static/private/fbx/Samba_Dancing.fbx";

		let fbxBufLoader = new FBXBufferLoader();
		fbxBufLoader.load(
			url,
			(modelMap: Map<number, GeometryModelDataType>, url: string): void => {
				// this.m_scaleV.setXYZ(-2.0, -2.0, 2.0);
				// this.m_scaleV.setXYZ(56.0, 56.0, 56.0);
				//this.m_scaleV.setXYZ(2.0, 2.0, 2.0);
				// console.log("loadFBX(), modelMap: ",modelMap);
				this.m_partsTotal = 0;
				for (let [key, value] of modelMap) {
					this.m_partsTotal++;
					this.initEntity(value);
				}
				console.log("partsTotal: ", this.m_partsTotal);
				// 
				this.m_waitPartsTotal = 0;
			}
		);
	}
}

export { FBXSceneNode };
