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

		// return this.createTestModel();
		// return this.createTestModel2();

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
	private getIVSStep3(pivs: number[]): number[] {
		if(pivs[3] < 0) {
			let s = pivs;
			let ivs: number[] = [];
			for(let i = 0; i < s.length; ++i) {
				if(s[i] < 0) {
					s[i] = -1 * s[i] - 1;
					ivs.push(s[i - 3], s[i - 2], s[i-1]);
					ivs.push(s[i], s[i - 3], s[i-1]);
				}
			}
			return ivs;
		}

		return pivs;
	}
	// private getIVSStep2(pivs: number[]): number[] {

	// }
	private createTestModel(): GeometryModelDataType {
		let srcIvs = [0, 2, 4, -2, 5, 4, 2, -4];

		let vs = [1, 1, 1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1];
		let nvs = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0];
		let uvs = [0.875, 0.5, 0.625, 0, 0.375, 0.25, 0.375, 0, 0.875, 0.75, 0.625, 0.25, 0.625, 0.75, 0.625, 0.5];
		let ivs = [0,2,4, 1,0,4, 5,4,2, 3,5,2];
		// let ivs = [4,2,0, 4,0,1, 2,4,5, 2,5,3];
		let tivs = this.getIVSStep3(srcIvs);
		console.log("ivs: ",ivs);
		console.log("tivs: ",tivs);
		ivs = tivs;
		let model: GeometryModelDataType = {
			uvsList: [new Float32Array(uvs)],
			vertices: new Float32Array(vs),
			normals: new Float32Array(nvs),
			indices: new Uint16Array(ivs)
		}
		return model;
	}
	
	private createTestModel2(): GeometryModelDataType {
		let srcIvs = [0, 4, 6, -3, 3, 2, 6, -8, 7, 6, 4, -6, 5, 1, 3, -8, 1, 0, 2, -4, 5, 4, 0, -2];
		// 用了24个点,先把这24个点的顶点数据转换出来转为 3 * 24 长度的顶点数据


		let vs = [1, 1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1];
		let nvs = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
		// 28个长度也就是14个点的uv数据
		let uvs = [0.625, 1, 0.625, 0.25, 0.375, 0.5, 0.875, 0.5, 0.625, 0.75, 0.375, 1, 0.375, 0.75, 0.625, 0, 0.375, 0, 0.375, 0.25, 0.125, 0.5, 0.875, 0.75, 0.125, 0.75, 0.625, 0.5];
		// 24个长度
		let uvIVS = [13, 3, 11,  4, 6, 4,  0, 5, 8,  7, 1, 9,  10, 2, 6,  12, 2, 13,  4, 6, 9,  1, 13, 2];
		

		let ivs = this.getIVSStep3(srcIvs);

		let model: GeometryModelDataType = {
			uvsList: [new Float32Array(uvs)],
			vertices: new Float32Array(vs),
			normals: new Float32Array(nvs),
			indices: new Uint16Array(ivs)
		}
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
