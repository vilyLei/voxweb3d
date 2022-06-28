import { SceneNode } from "./SceneNode";
import { ObjDataParser } from "../../../vox/assets/ObjDataParser";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { FileLoader } from "../../modules/loaders/FileLoader";

class OBJSceneNode extends SceneNode {

	constructor() { super(); }

	load(urls: string[]): void {
		if (urls != null) {

			super.load(urls);

			this.m_showTotal = 0;
			// for (let i: number = 0; i < urls.length; ++i) {
			// 	this.loadOBJByUrl(urls[i]);
			// }
			if(urls.length > 0) {
				this.loadOBJByUrl(urls[0 ]);
			}
		}
	}

	private parseFromStr(dataStr: string): void {
		let objParser = new ObjDataParser();
		let objMeshes = objParser.Parse( dataStr );
		this.m_modelsTotal = objMeshes.length;
		let len: number = this.m_modelsTotal;
		for (let i: number = 0; i < len; ++i) {
			const geom: any = objMeshes[i].geometry;
			const model = this.createModel( geom );
			this.initEntity(model);
		}
		this.m_waitPartsTotal = 0;
	}
	private loadOBJByUrl(url: string): void {

		const readerBuf = new FileReader();
		readerBuf.onload = (e) => {
			this.showInfo("正在解析obj模型数据...");
			this.parseFromStr( <string>readerBuf.result );
		};
		let fileLoader: FileLoader = new FileLoader();
		fileLoader.load(
			url,
			(buf: ArrayBuffer, url: string): void => {
				readerBuf.readAsText( new Blob([buf]) );
			},
			(e: ProgressEvent, url: string): void => {
				let k = Math.round(100 * e.loaded/e.total);
				this.showInfo("obj file loading " + k + "%");
			},
			(status: number, url: string): void => {
				console.error("load error, request.status: ",status,", url: ",url);
			}
		);
		return;
		const reader = new FileReader();
		reader.onload = (e) => {
			this.showInfo("正在解析obj模型数据...");
			this.parseFromStr( <string>reader.result );
		};

		const request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "blob";

		request.onload = (e) => {
			console.log("loaded binary buffer request.status: ", request.status, e, request.response);
			if (request.status <= 206) {
				reader.readAsText(request.response);
			} else {
				console.error("load error, request.status: ",request.status,", url: ",url);
			}
		};
		request.onprogress = (e: ProgressEvent) => {
			let k = Math.round(100 * e.loaded/e.total);
			this.showInfo("obj file loading " + k + "%");
		}
		request.onerror = (e) => {
			console.error("load error, request.status: ",request.status,", url: ",url);
		};
		request.send(null);
		/*
		let request: XMLHttpRequest = new XMLHttpRequest();
		request.open('GET', url, true);
		request.onload = () => {
			if (request.status <= 206 && request.responseText.indexOf(" OBJ ") > 0) {
				
				let objParser = new ObjDataParser();
				let objMeshes = objParser.Parse( request.responseText );
				this.m_modelsTotal = objMeshes.length;
				let len: number = this.m_modelsTotal;
				for (let i: number = 0; i < len; ++i) {
					const geom: any = objMeshes[i].geometry;
					const model = this.createModel( geom );
					this.initEntity(model);
				}
				this.m_waitPartsTotal = 0;
				
			}
			else {
				console.error("load obj format module url error: ", url);
			}
		};
		request.onerror = e => {
			console.error("load obj format module url error: ", url);
		};
		request.send(null);
		//*/
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