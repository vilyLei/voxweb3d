import { cubeVertexArray } from "../mesh/cubeData";
import { WROBufferContext } from "../pipeline/WROBufferContext";

class GeomDataBase {

	readonly vtxCtx = new WROBufferContext();
	constructor(){}


	createRawCubeGeometry(combined: boolean, scale = 100.0): {vs?: Float32Array, uvs?: Float32Array, ivs?: Uint16Array | Uint32Array} {

		const dvs = cubeVertexArray;

		let vtxTotal = 0;

		for (let i = 0; i < dvs.length; i += 10) {
			vtxTotal++;
		}

		let indices = this.vtxCtx.createIndicesWithSize(vtxTotal);
		for (let i = 0; i < vtxTotal; ++i) {
			indices[i] = i;
		}

		let vs = new Float32Array(vtxTotal * 4);
		let cvs = new Float32Array(vtxTotal * 4);
		let uvs = new Float32Array(vtxTotal * 2);
		let vsi = 0;
		let cvsi = 0;
		let uvsi = 0;
		for (let i = 0; i < dvs.length; i += 10) {
			dvs[i] *= scale;
			dvs[i + 1] *= scale;
			dvs[i + 2] *= scale;

			vs[vsi] = dvs[i];
			vs[vsi + 1] = dvs[i + 1];
			vs[vsi + 2] = dvs[i + 2];
			vs[vsi + 3] = dvs[i + 3];

			cvs[cvsi] = dvs[i + 4];
			cvs[cvsi + 1] = dvs[i + 5];
			cvs[cvsi + 2] = dvs[i + 6];
			cvs[cvsi + 3] = dvs[i + 7];

			uvs[uvsi] = dvs[i + 8];
			uvs[uvsi + 1] = dvs[i + 9];

			vsi += 4;
			cvsi += 4;
			uvsi += 2;
		}
		if(combined) {
			return {vs: dvs};
		}
		return {vs: vs, uvs: uvs, ivs: indices};
	}
}
export { GeomDataBase }
