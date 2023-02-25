/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IGeomModelData from "./IGeomModelData";
import IRenderMaterial from "../render/IRenderMaterial";
import IDataMesh from "./IDataMesh";
import DataMesh from "./DataMesh";

export default class MeshFactory {

	
	/**
	 * @param model geometry model data
	 * @param material IRenderMaterial instance, the default value is null.
	 * @param texEnabled the default value is false;
	 */
	static createDataMeshFromModel(model: IGeomModelData, material: IRenderMaterial = null, texEnabled: boolean = false): IDataMesh {
		if (material != null) {
			texEnabled = texEnabled || material.getTextureAt(0) != null;
		}
		const vbWhole = model.vbWhole ? model.vbWhole : false;
		let stride = Math.round(model.stride ? model.stride : 3);
		stride = stride > 0 && stride < 4 ? stride : 3;
		const dataMesh = new DataMesh();
		dataMesh.wireframe = model.wireframe ? model.wireframe : false;
		dataMesh.vbWholeDataEnabled = vbWhole;

		let vtxTotal = model.vertices.length / stride;
		dataMesh.setVS(model.vertices);
		if (model.uvsList && model.uvsList.length > 0) {
			dataMesh.setUVS(model.uvsList[0]);
			if (model.uvsList.length > 1) {
				dataMesh.setUVS2(model.uvsList[0]);
			}
		} else if (texEnabled) {
			dataMesh.setUVS(new Float32Array(Math.floor(model.vertices.length / stride) * 2));
			console.error("hasn't uv data !!!, it happened in the MeshBuilder::createDataMeshFromModel(...) function.");
		}
		if (model.normals) {
			dataMesh.setNVS(model.normals);
		}
		if (model.indices) {
			dataMesh.setIVS(model.indices);
		} else {
			let ivs = vtxTotal <= 65535 ? new Uint16Array(vtxTotal) : new Uint32Array(vtxTotal);
			for (let i = 0; i < vtxTotal; ++i) {
				ivs[i] = i;
			}
			dataMesh.setIVS(ivs);
			console.warn("hasn't indices data !, it happened in the MeshBuilder::createDataMeshFromModel(...) function.");
		}

		if (material != null) {
			material.initializeByCodeBuf(texEnabled);
			dataMesh.setVtxBufRenderData(material);
		} else {
			console.warn("the material parameter value is null, so this mesh will build all vtx bufs.");
		}
		dataMesh.initialize();
		return dataMesh;
	}
}
