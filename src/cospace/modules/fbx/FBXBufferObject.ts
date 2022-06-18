import { GeometryModelDataType } from "../base/GeometryModelDataType";
class FBXBufferObject {

	uvs: number[][] = [];
	normal: number[] = [];
	vertex: number[] = [];
	indices: Uint16Array | Uint32Array = null;
	colors: number[] = [];
	materialIndex: number[] = [];
	vertexWeights: number[] = [];
	weightsIndices: number[] = [];

	constructor() {}
	
	toGeometryModel(): GeometryModelDataType {

		let vtxTotal = this.vertex.length;
		vtxTotal /= 3;
		let indices = this.indices;
		if(indices == null) {
			indices = vtxTotal <= 65535 ? new Uint16Array(vtxTotal) : new Uint32Array(vtxTotal);
	
			for (let i: number = 0; i < vtxTotal; ++i) {
				indices[i] = i;
			}
		}

		let uvsList: Float32Array[] = [];
		for (let i: number = 0; i < this.uvs.length; ++i) {
			uvsList.push( new Float32Array( this.uvs[i] ) );
		}

		let model: GeometryModelDataType = {
			uvsList: uvsList,
			vertices: new Float32Array( this.vertex ),
			normals: new Float32Array( this.normal ),
			indices: indices
		}
		// console.log("indices: ",indices);
		return model;
	}
};
export { FBXBufferObject };
