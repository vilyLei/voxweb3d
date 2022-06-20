import { GeometryModelDataType } from "../base/GeometryModelDataType";

class FBXBufferObject {

	i3: number = 0;
	i2: number = 0;

	uvs: Float32Array[] = [];
	normal: Float32Array = null;
	vertex: Float32Array = null;
	indices: Uint16Array | Uint32Array = null;
	colors: Float32Array = null;
	materialIndex: number[] = [];
	vertexWeights: number[] = [];
	weightsIndices: number[] = [];

	constructor() {}
	
	toGeometryModel(): GeometryModelDataType {

		let vtxTotal = this.vertex.length;
		let vtCount = vtxTotal / 3;
		let indices = this.indices;

		if(indices == null) {
			indices = vtCount <= 65535 ? new Uint16Array(vtCount) : new Uint32Array(vtCount);	
			for (let i: number = 0; i < vtCount; ++i) {
				indices[i] = i;
			}
		}
		
		let model: GeometryModelDataType = {
			uvsList: this.uvs,
			vertices: this.vertex,
			normals: this.normal,
			indices: indices
		}
		// console.log("indices: ",indices);

		return model;
	}

	destroy(): void {

		this.uvs = null;
		this.vertex = null;
		this.normal = null;
		this.colors = null;
		this.indices = null;
	}
};
export { FBXBufferObject };
