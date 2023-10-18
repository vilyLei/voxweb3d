import Vector3D from "../../../vox/math/Vector3D";
import Box3DMesh from "../../../vox/mesh/Box3DMesh";
import Cylinder3DMesh from "../../../vox/mesh/Cylinder3DMesh";
import RectPlaneMesh from "../../../vox/mesh/RectPlaneMesh";
import Sphere3DMesh from "../../../vox/mesh/Sphere3DMesh";
import Torus3DMesh from "../../../vox/mesh/Torus3DMesh";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRGeometry } from "../../render/WGRGeometry";
import { cubeVertexArray } from "../mesh/cubeData";
import { WROBufferContext } from "../pipeline/WROBufferContext";
import { VtxPipelinDescParam } from "../pipeline/WROPipelineContext";

type GeomRDataType = {vbufs: GPUBuffer[], ibuf: GPUBuffer, vtxDescParam: VtxPipelinDescParam, rgeom?: WGRGeometry};
class GeomDataBase {

	// readonly vtxCtx = new WROBufferContext();

	private mWGCtx: WebGPUContext;
	constructor(wgCtx?: WebGPUContext) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	initialize(wgCtx: WebGPUContext): void {
		this.mWGCtx = wgCtx;
		// this.mWGCtx.buffer.initialize(wgCtx);
	}
	expandFS32Data(vs: Float32Array, srcStride: number, dstStride: number, value = 1.0): Float32Array {

		let tvs = new Float32Array(dstStride * vs.length / srcStride);
		let k = 0;
		for(let i = 0; i < vs.length;) {

			for(let j = 0; j < srcStride; j++) {
				tvs[k + j] = vs[i + j];
			}
			for(let j = srcStride; j < dstStride; j++) {
				tvs[k + j] = value;
			}
			k += dstStride;
			i += srcStride;
		}
		return tvs;
	}

	createTorusRData(ringRadius: number, axisRadius: number = 20, longitudeNumSegments: number = 20, latitudeNumSegments: number = 20): GeomRDataType {
		let mesh = new Torus3DMesh();
		mesh.setBufSortFormat(0xfffffff);
		mesh.initialize(ringRadius, axisRadius, longitudeNumSegments, latitudeNumSegments);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = mesh.getVS();
		let uvs = mesh.getUVS();
		let nvs = mesh.getNVS();
		let ivs = mesh.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]);
		let uvsBuf = this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]);
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx.buffer.createIndexBuffer(ivs);

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam};
	}
	createCylinderRData(radius: number, height = 200, longitudeNumSegments: number = 20, latitudeNumSegments: number = 20): GeomRDataType {
		let mesh = new Cylinder3DMesh();
		mesh.setBufSortFormat(0xfffffff);
		mesh.initialize(radius, height, longitudeNumSegments, latitudeNumSegments);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = mesh.getVS();
		let uvs = mesh.getUVS();
		let nvs = mesh.getNVS();
		let ivs = mesh.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]);
		let uvsBuf = this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]);
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx.buffer.createIndexBuffer(ivs);

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam};
	}
	createSphereRData(radius: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 20): GeomRDataType {
		let mesh = new Sphere3DMesh();
		mesh.setBufSortFormat(0xfffffff);
		mesh.initialize(radius, longitudeNumSegments, latitudeNumSegments, false);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = mesh.getVS();
		let uvs = mesh.getUVS();
		let nvs = mesh.getNVS();
		let ivs = mesh.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]);
		let uvsBuf = this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]);
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx.buffer.createIndexBuffer(ivs);

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam};
	}
	createBoxRData(minV: Vector3D, maxV: Vector3D): GeomRDataType {
		let mesh = new Box3DMesh();
		mesh.setBufSortFormat(0xfffffff);
		mesh.initialize(minV, maxV);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = mesh.getVS();
		let uvs = mesh.getUVS();
		let nvs = mesh.getNVS();
		let ivs = mesh.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]);
		let uvsBuf = this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]);
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx.buffer.createIndexBuffer(ivs);

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam};
	}
	createPlaneRData(px: number, py: number, pw: number, ph: number, axisFlag = 0, expand = false): GeomRDataType {

		let mesh = new RectPlaneMesh();
		mesh.axisFlag = axisFlag
		mesh.setBufSortFormat(0xfffffff);
		mesh.initialize(px, py, pw, ph);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = mesh.getVS();
		let uvs = mesh.getUVS();
		let ivs = mesh.getIVS();
		if(expand) {
			vs = this.expandFS32Data( vs, 3, 4, 1.0 );
		}
		// console.log("vs: ", vs);
		// console.log("uvs: ", uvs);
		// console.log("ivs: ", ivs);

		let vsBuf = this.mWGCtx.buffer.createVertexBuffer(vs, 0, [expand ? 4 : 3]);
		let uvsBuf = this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [2]);
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx.buffer.createIndexBuffer(ivs);

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam};
	}
	createCubeRData(combined: boolean, scale = 100.0): GeomRDataType {

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		const data = this.createRawCubeGeometry( combined, scale );
		if (combined) {
			let buf = this.mWGCtx.buffer.createVertexBuffer(data.vs, 0, [4, 4, 2]);
			vbufs = [buf];
		} else {
			let vsBuf = this.mWGCtx.buffer.createVertexBuffer(data.vs, 0, [4]);
			let uvsBuf = this.mWGCtx.buffer.createVertexBuffer(data.uvs, 0, [2]);
			vbufs = [vsBuf, uvsBuf];
		}
		ibuf = this.mWGCtx.buffer.createIndexBuffer(data.ivs);

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: combined ? [[0, 2]] : [[0], [0]] } };
		return {vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam};
	}
	createRawCubeGeometry(combined: boolean, scale = 100.0): {vs?: Float32Array, uvs?: Float32Array, ivs?: Uint16Array | Uint32Array} {

		const dvs = cubeVertexArray;

		let vtxTotal = 0;

		for (let i = 0; i < dvs.length; i += 10) {
			vtxTotal++;
		}

		let indices = this.mWGCtx.buffer.createIndicesWithSize(vtxTotal);
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
			return {vs: dvs, ivs: indices};
		}
		return {vs: vs, uvs: uvs, ivs: indices};
	}
}
export { GeomRDataType, GeomDataBase }
