import { GeometryModelDataType } from "../base/GeometryModelDataType";
import { FBXBufferObject } from "./FBXBufferObject";

class ElementGeomData {

	constructor() {}
	

	private calcVtxIVS(sivs: number[]): number[] {
		//[0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 3, 1, 9, 7, -6, 6, 7, 9, -9, 8, 9, 1, -1, 0, 2, 4, 6, -9]
		// console.log("sivs: ",sivs);
		let s = sivs;
		let ivs: number[] = [];
		let step = 0;
		let sivsLen = sivs.length;
		let flag: boolean = true;
		for(let i = 0; i < sivsLen; ++i) {
			step++;

			if(s[i] < 0) {
				
				if(step == 4) {
					ivs.push(i - 3, i - 2, i-1);
					ivs.push(i, i - 3, i-1);
				}else if(step == 3) {
					ivs.push(i - 2, i - 1, i);
				}else {
					
					for(let j: number = step - 2; j > 0; j--) {
						ivs.push(i, i - j - 1, i - j);
					}
				}
				step = 0;
			}
			// else if(step == 4){
			// 	console.log("### +++4, i,sivs[i]: ",i,sivs[i]);
			// 	// ivs.push(i - 3, i - 2, i-1);
			// 	// ivs.push(i - 3, i - 2, i-1);
			// 	// ivs.push(i - 3, i - 2, i-1);
			// 	// ivs.push(i, i - 3, i-1);
				
			// 	// ivs.push(i - 4, i - 3, i+1);
			// 	// ivs.push(i, i - 3, i-1);

			// 	i = i-3;
			// 	step = 0;
			// }
		}
		return ivs;
	}
	private buildIVSAndVS(sivs: number[], svs: number[]): number[][] {

		let vs: number[] = new Array(sivs.length * 3);
		let ivs: number[] = this.calcVtxIVS(sivs);
		//let ivs: number[] = new Array( snivs.length );

		// console.log("buildIVSAndVS, ivs: ", ivs);

		let ivsLen = ivs.length;
		let sivsLen = sivs.length;
		let sk: number = 0;
		let k: number = 0;
		// for(let i: number = 0; i < sivsLen; ++i) {
		// 	if(sivs[i] < 0) sivs[i] = (sivs[i] * -1) - 1;
		// }
		for(let i: number = 0; i < sivsLen; ++i) {

			k = i * 3;
			sk = sivs[i];
			if(sk < 0) sk = (sk * -1) - 1;
			sk *= 3;
			vs[k] = svs[sk];
			vs[k+1] = svs[sk+1];
			vs[k+2] = svs[sk+2];

			k+=3;
		}

		return[ivs, vs];
	}

	createBufObject(geoInfo: any): FBXBufferObject {
		/*
		if(geoInfo.vertexIndices.length == 3) geoInfo.vertexIndices = this.buildInt32Data(geoInfo.vertexIndices);
		if(geoInfo.vertexPositions.length == 3) geoInfo.vertexPositions = this.buildNumberData(geoInfo.vertexPositions);
		if(geoInfo.normal.buffer.length == 3) geoInfo.normal.buffer = this.buildNumberData(geoInfo.normal.buffer);
		if(geoInfo.normal.indices.length == 3) geoInfo.normal.indices = this.buildInt32Data(geoInfo.normal.indices);
		if(geoInfo.uv[0].buffer.length == 3) geoInfo.uv[0].buffer = this.buildNumberData( geoInfo.uv[0].buffer);
		*/
		let vsData = this.buildIVSAndVS(geoInfo.vertexIndices, geoInfo.vertexPositions);
		let ivs: number[] = vsData[0];
		let vs: number[] = vsData[1];
		let nvs: number[] = geoInfo.normal.buffer;
		let uvsLen = 2 * vs.length/3;
		let uvs: number[] = new Array(uvsLen);
		uvs.fill(0);

		let obj = new FBXBufferObject();
		obj.isEntity = true;
		obj.indices = ivs.length > 65535 ? new Uint32Array(ivs) : new Uint16Array(ivs);
		obj.vertex = new Float32Array(vs);
		obj.normal = new Float32Array(nvs);
		obj.uvs = [new Float32Array( uvs )];

		return obj;
	}
	private createTestModel2(): GeometryModelDataType {

		let src_ivs = [0, 4, 6, -3, 3, 2, 6, -8, 7, 6, 4, -6, 5, 1, 3, -8, 1, 0, 2, -4, 5, 4, 0, -2];
		// 用了24个点,先把这24个点的顶点数据转换出来转为 3 * 24 长度的顶点数据


		let src_vs = [1, 1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1];
		let src_nvs = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
		// 28个长度也就是14个点的uv数据
		let src_uvs = [0.625, 1, 0.625, 0.25, 0.375, 0.5, 0.875, 0.5, 0.625, 0.75, 0.375, 1, 0.375, 0.75, 0.625, 0, 0.375, 0, 0.375, 0.25, 0.125, 0.5, 0.875, 0.75, 0.125, 0.75, 0.625, 0.5];
		// 24个长度
		let uvIVS = [13, 3, 11,  4, 6, 4,  0, 5, 8,  7, 1, 9,  10, 2, 6,  12, 2, 13,  4, 6, 9,  1, 13, 2];
		

		let newVSData = this.buildIVSAndVS(src_ivs, src_vs);
		console.log("newVSData: \n", newVSData);

		let ivs = newVSData[0];
		let vs = newVSData[1];
		let uvs = new Array(2 * 8 * 3);
		uvs.fill(0.5);
		let nvs = src_nvs;
		// let ivs = this.calcVtxIVS(src_ivs);

		let model: GeometryModelDataType = {
			uvsList: [new Float32Array(uvs)],
			vertices: new Float32Array(vs),
			normals: new Float32Array(nvs),
			indices: new Uint16Array(ivs)
		}
		return model;
	}
};
export { ElementGeomData };
