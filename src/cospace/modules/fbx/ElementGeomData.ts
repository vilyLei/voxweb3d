import { FBXBufferObject } from "./FBXBufferObject";

class ElementGeomData {

	constructor() { }

	private calcVtxIVS(sivs: number[]): Uint32Array | Uint16Array {
		//[0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 3, 1, 9, 7, -6, 6, 7, 9, -9, 8, 9, 1, -1, 0, 2, 4, 6, -9]
		// console.log("sivs: ",sivs);
		let s = sivs;
		//let ivs: number[] = [];
		let step = 0;
		let sivsLen = sivs.length;
		let ivsLen: number = 0;
		for (let i = 0; i < sivsLen; ++i) {
			step++;

			if (s[i] < 0) {

				if (step == 4) {
					// ivs.push(i - 3, i - 2, i-1);
					// ivs.push(i, i - 3, i-1);
					ivsLen += 6;
				} else if (step == 3) {
					// ivs.push(i - 2, i - 1, i);
					ivsLen += 3;
				} else {

					for (let j: number = step - 2; j > 0; j--) {
						// ivs.push(i, i - j - 1, i - j);
						ivsLen += 3;
					}
				}
				step = 0;
			}
		}

		let ivs = ivsLen > 65535 ? new Uint32Array(ivsLen) : new Uint16Array(ivsLen);
		let k = 0;
		for (let i = 0; i < sivsLen; ++i) {
			step++;

			if (s[i] < 0) {

				if (step == 4) {
					ivs[k] = i - 3;
					ivs[k + 1] = i - 2;
					ivs[k + 2] = i - 1;
					ivs[k + 3] = i;
					ivs[k + 4] = i - 3;
					ivs[k + 5] = i - 1;

					k += 6;
					// ivs.push(i - 3, i - 2, i-1);
					// ivs.push(i, i - 3, i-1);
				} else if (step == 3) {
					// ivs.push(i - 2, i - 1, i);
					ivs[k] = i - 2;
					ivs[k + 1] = i - 1;
					ivs[k + 2] = i;
					k += 3;
				} else {

					for (let j: number = step - 2; j > 0; j--) {
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
	private buildVS(sivs: number[], svs: number[], sivsLen: number): Float32Array {
		let vsLen = sivs.length * 3;
		let vs = new Float32Array(vsLen);
		let sk = 0;
		let k = 0;
		for (let i = 0; i < sivsLen; ++i) {

			k = i * 3;
			sk = sivs[i];
			if (sk < 0) sk = (sk * -1) - 1;
			sk *= 3;
			vs[k] = svs[sk];
			vs[k + 1] = svs[sk + 1];
			vs[k + 2] = svs[sk + 2];

			k += 3;
		}
		return vs;
	}

	private buildNVS(sivs: number[], snvs: number[], sivsLen: number): Float32Array {
		let nvs: Float32Array = null;
		let vsLen = sivs.length * 3;
		if (snvs == null || snvs.length == vsLen) {
			if (snvs != null) {
				nvs = new Float32Array(snvs);
			}
		} else {
			let sk = 0;
			let k = 0;
			nvs = new Float32Array(vsLen);
			for (let i = 0; i < sivsLen; ++i) {

				k = i * 3;
				sk = sivs[i];
				if (sk < 0) sk = (sk * -1) - 1;
				sk *= 3;

				nvs[k] = snvs[sk];
				nvs[k + 1] = snvs[sk + 1];
				nvs[k + 2] = snvs[sk + 2];

				k += 3;
			}
		}
		return nvs;
	}
	
	private buildUVS(sivs: number[], suvs: number[]): Float32Array {
		let uvs: Float32Array = null;
		let vsLen = sivs.length * 2;
		if (suvs == null || suvs.length == vsLen) {
			if (suvs != null) {
				uvs = new Float32Array(suvs);
			}
		} else {
			let sk = 0;
			let k = 0;
			uvs = new Float32Array(vsLen);
			for (let i = 0; i < vsLen; ++i) {

				k = i * 2;
				sk = sivs[i];
				if (sk < 0) sk = (sk * -1) - 1;
				sk *= 2;

				uvs[k] = suvs[sk];
				uvs[k + 1] = suvs[sk + 1];

				k += 2;
			}
		}
		return uvs;
	}
	private buildBufs(obj: FBXBufferObject, sivs: number[], svs: number[], snvs: number[], suvs: number[], suvivs: number[]): void {

		let vsLen = sivs.length * 3;
		let sivsLen = sivs.length;

		let nvs: Float32Array = null;
		let ivs = this.calcVtxIVS(sivs);


		obj.vertex = this.buildVS(sivs, svs, sivsLen);
		obj.normal = this.buildNVS(sivs, snvs, sivsLen);
		obj.uvs = [this.buildUVS(suvivs, suvs)];
		obj.indices = ivs;
		return;
		let vs = new Float32Array(vsLen);

		let sk = 0;
		let k = 0;

		if (snvs == null || snvs.length == vsLen) {
			if (snvs != null) {
				nvs = new Float32Array(snvs);
			}
			for (let i = 0; i < sivsLen; ++i) {

				k = i * 3;
				sk = sivs[i];
				if (sk < 0) sk = (sk * -1) - 1;
				sk *= 3;
				vs[k] = svs[sk];
				vs[k + 1] = svs[sk + 1];
				vs[k + 2] = svs[sk + 2];

				k += 3;
			}

		} else {
			if (snvs != null) {
				nvs = new Float32Array(vsLen);
				for (let i = 0; i < sivsLen; ++i) {

					k = i * 3;
					sk = sivs[i];
					if (sk < 0) sk = (sk * -1) - 1;
					sk *= 3;
					vs[k] = svs[sk];
					vs[k + 1] = svs[sk + 1];
					vs[k + 2] = svs[sk + 2];


					nvs[k] = snvs[sk];
					nvs[k + 1] = snvs[sk + 1];
					nvs[k + 2] = snvs[sk + 2];

					k += 3;
				}
			}
			else {
				for (let i = 0; i < sivsLen; ++i) {
					k = i * 3;
					sk = sivs[i];
					if (sk < 0) sk = (sk * -1) - 1;
					sk *= 3;
					vs[k] = svs[sk];
					vs[k + 1] = svs[sk + 1];
					vs[k + 2] = svs[sk + 2];
					k += 3;
				}
			}
		}

		obj.vertex = vs;
		obj.normal = nvs;
		obj.indices = ivs;
	}

	createBufObject(geoInfo: any): FBXBufferObject {
		console.log("createBufObject(), geoInfo: ", geoInfo);
		let obj = new FBXBufferObject();
		let puvs: any = null;
		let uvList: any[] = geoInfo.uv;
		if (uvList && uvList.length > 0) {
			puvs = uvList[0];
		}

		if (geoInfo.normal != null) {
			this.buildBufs(obj, geoInfo.vertexIndices, geoInfo.vertexPositions, geoInfo.normal.buffer, puvs.buffer, puvs.indices);
		}
		else {
			this.buildBufs(obj, geoInfo.vertexIndices, geoInfo.vertexPositions, null, puvs.buffer, puvs.indices);
			console.error("当前FBX模型法线数据缺失!!!");
		}
		// let uvsLen = 2 * obj.vertex.length / 3;
		// let uvs = new Float32Array(uvsLen);

		obj.isEntity = true;
		// obj.uvs = [uvs];

		return obj;
	}
};
export { ElementGeomData };
