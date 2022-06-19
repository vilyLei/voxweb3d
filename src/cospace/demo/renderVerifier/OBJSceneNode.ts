import { DataFormat } from "../../schedule/base/DataUnit";
import { GeometryDataUnit } from "../../schedule/base/GeometryDataUnit";
import { SceneNode } from "./SceneNode";
import { ObjDataParser } from "../../../vox/assets/ObjDataParser";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";

class OBJSceneNode extends SceneNode {

	private m_index: number = 0;
	constructor() { super(); }

	load(urls: string[]): void {
		if (urls != null) {

			super.load(urls);

			this.m_index = 0;
			// this.m_modelsTotal = urls.length;
			// this.m_waitPartsTotal = this.m_modelsTotal;
			this.m_showTotal = 0;
			for (let i: number = 0; i < urls.length; ++i) {
				this.loadOBJByUrl(urls[i]);
			}
		}
	}


	private loadOBJByUrl(url: string): void {
		let request: XMLHttpRequest = new XMLHttpRequest();
		request.open('GET', url, true);
		request.onload = () => {
			if (request.status <= 206 && request.responseText.indexOf(" OBJ ") > 0) {
				// this.initialize(request.responseText, texList);
				// if (this.m_index == this.m_modelsTotal) {
				// objParser.baseParsering = false;
				//objParser.parse(request.responseText);
				// this.m_modelsTotal = urls.length;
				
				let objParser = new ObjDataParser();
				let objMeshes = objParser.Parse( request.responseText );
				this.m_modelsTotal = objMeshes.length;
				//let vsTotalLen: number = 0;
				for (let i: number = 0; i < this.m_modelsTotal; ++i) {
					const geom: any = objMeshes[i].geometry;
					// console.log("geom: ",geom);
					const model = this.createModel( geom );
					this.initEntity(model);
					//vertices: Array(108), normals: Array(108), colors: Array(0), uvs
					//vsTotalLen += objMeshes[i].geometry.vertices.length;
				}
				this.m_waitPartsTotal = 0;
				// }
			}
			else {
				console.error("load obj format module url error: ", url);
			}
		};
		request.onerror = e => {
			console.error("load obj format module url error: ", url);
		};
		request.send(null);
	}
	private createModel(geom: any): GeometryModelDataType {

		let vtxTotal = geom.vertices.length;
		let vtCount = vtxTotal / 3;
		let indices: Uint16Array | Uint32Array = null;
		if(indices == null) {
			indices = vtCount <= 65535 ? new Uint16Array(vtCount) : new Uint32Array(vtCount);
	
			for (let i: number = 0; i < vtCount; ++i) {
				indices[i] = i;
			}
		}
		let model: GeometryModelDataType = {
			uvsList: [ new Float32Array(geom.uvs) ],
			vertices: new Float32Array(geom.vertices),
			normals: new Float32Array(geom.normals),
			indices: indices
		};

		return model;
	}
}

export { OBJSceneNode };