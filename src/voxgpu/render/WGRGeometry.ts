import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";

class WGRGeometry {

	layoutUid = 0;
	vbufs: GPUBuffer[] = null;
	ibuf: GPUBuffer = null;
	indexCount = 0;
	instanceCount = 1;
	vertexCount = 0;

	run(rc: GPURenderPassEncoder): void {
		for (let j = 0, ln = this.vbufs.length; j < ln; ++j) {
			rc.setVertexBuffer(j, this.vbufs[j]);
		}
	}
	update(): void {
		if(this.ibuf) {
			this.indexCount = this.indexCount > 0 ? this.indexCount : this.ibuf.elementCount;
		}else {
			this.vertexCount = this.vbufs[0].vectorCount;
		}
	}
}
export { WGRGeometry }
