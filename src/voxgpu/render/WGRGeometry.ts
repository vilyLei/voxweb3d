import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";

class WGRGeometry {

	layoutUid = 0;
	vbufs: GPUBuffer[];
	ibuf: GPUBuffer;
	indexCount = 0;
	instanceCount = 1;
	vertexCount = 0;

	run(rc: GPURenderPassEncoder): void {
		const vs = this.vbufs;
		if(vs) {
			for (let j = 0, ln = vs.length; j < ln; ++j) {
				rc.setVertexBuffer(j, vs[j]);
			}
		}
	}
	update(): void {

		if(this.ibuf) {
			this.indexCount = this.indexCount > 0 ? this.indexCount : this.ibuf.elementCount;
		}else {
			this.vertexCount = this.vertexCount > 0 ? this.vertexCount : this.vbufs[0].vectorCount;
		}
	}
	clone(): WGRGeometry {
		const g = new WGRGeometry();
		g.layoutUid = this.layoutUid;
		g.vbufs = this.vbufs;
		g.ibuf = this.ibuf;
		g.indexCount = this.indexCount;
		g.instanceCount = this.instanceCount;
		g.vertexCount = this.vertexCount;
		return g;
	}
}
export { WGRGeometry }
