import { GeometryModelDataType } from "../base/GeometryModelDataType";
import { FBXBufferObject } from "./FBXBufferObject";

class ElementGeomData {

	constructor() {}
	

	private calcVtxIVS(sivs: number[]): Uint32Array | Uint16Array {
		//[0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 3, 1, 9, 7, -6, 6, 7, 9, -9, 8, 9, 1, -1, 0, 2, 4, 6, -9]
		// console.log("sivs: ",sivs);
		let s = sivs;
		//let ivs: number[] = [];
		let step = 0;
		let sivsLen = sivs.length;
		let ivsLen: number = 0;
		for(let i = 0; i < sivsLen; ++i) {
			step++;

			if(s[i] < 0) {
				
				if(step == 4) {
					// ivs.push(i - 3, i - 2, i-1);
					// ivs.push(i, i - 3, i-1);
					ivsLen += 6;
				}else if(step == 3) {
					// ivs.push(i - 2, i - 1, i);
					ivsLen += 3;
				}else {

					for(let j: number = step - 2; j > 0; j--) {
						// ivs.push(i, i - j - 1, i - j);
						ivsLen += 3;
					}
				}
				step = 0;
			}
		}

		let ivs = ivsLen > 65535 ? new Uint32Array(ivsLen) : new Uint16Array(ivsLen);
		let k = 0;
		for(let i = 0; i < sivsLen; ++i) {
			step++;

			if(s[i] < 0) {
				
				if(step == 4) {
					ivs[k] = i - 3;
					ivs[k + 1] = i - 2;
					ivs[k + 2] = i - 1;
					ivs[k + 3] = i;
					ivs[k + 4] = i - 3;
					ivs[k + 5] = i - 1;

					k += 6;
					// ivs.push(i - 3, i - 2, i-1);
					// ivs.push(i, i - 3, i-1);
				}else if(step == 3) {
					// ivs.push(i - 2, i - 1, i);
					ivs[k] = i - 2;
					ivs[k + 1] = i - 1;
					ivs[k + 2] = i;
					k += 3;
				}else {
					
					for(let j: number = step - 2; j > 0; j--) {
						// ivs.push(i, i - j - 1, i - j);
						ivs[k] = i;
						ivs[k + 1] = i - j - 1;
						ivs[k + 2] = i - j;
						k += 3;
					}
				}
				step = 0;
			}
		}
		return ivs;
	}
	private buildBufs(obj: FBXBufferObject, sivs: number[], svs: number[], snvs: number[]): void {

		let vsLen = sivs.length * 3;
		
		let nvs: Float32Array = null;
		let ivs = this.calcVtxIVS(sivs);		
		let vs = new Float32Array(vsLen);
		
		let sivsLen = sivs.length;
		let sk: number = 0;
		let k: number = 0;
		if(snvs.length == vs.length) {
			nvs = new Float32Array(snvs);
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

		} else {
			nvs = new Float32Array( vsLen );
			for(let i: number = 0; i < sivsLen; ++i) {
	
				k = i * 3;
				sk = sivs[i];
				if(sk < 0) sk = (sk * -1) - 1;
				sk *= 3;
				vs[k] = svs[sk];
				vs[k+1] = svs[sk+1];
				vs[k+2] = svs[sk+2];

				
				nvs[k] = snvs[sk];
				nvs[k+1] = snvs[sk+1];
				nvs[k+2] = snvs[sk+2];
	
				k+=3;
			}
		}

		obj.vertex = vs;
		obj.normal = nvs;
		obj.indices = ivs;
	}

	createBufObject(geoInfo: any): FBXBufferObject {
		
		let obj = new FBXBufferObject();
		this.buildBufs(obj, geoInfo.vertexIndices, geoInfo.vertexPositions, geoInfo.normal.buffer);
		let uvsLen = 2 * obj.vertex.length/3;
		let uvs = new Float32Array(uvsLen);

		// console.log("vs.length: ",vs.length);
		// console.log("nvs.length: ",nvs.length);
		obj.isEntity = true;
		// obj.indices = ivs.length > 65535 ? new Uint32Array(ivs) : new Uint16Array(ivs);
		// obj.vertex = new Float32Array(vs);
		// obj.normal = new Float32Array(nvs);
		obj.uvs = [ uvs ];

		return obj;
	}
};
export { ElementGeomData };
