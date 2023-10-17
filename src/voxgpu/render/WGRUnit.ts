import { WRORUniform } from "../demo/render/WRORUniform";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRGeometry } from "./WGRGeometry";
import { WGRUniformValue } from "./uniform/WGRUniformValue";

class WGRUnit {
	private mUniformValues: WGRUniformValue[];
	uniforms?: WRORUniform[];
	pipeline: GPURenderPipeline;
	geometry = new WGRGeometry();

	enabled = true;
	setUniformValues(values: WGRUniformValue[]): void {
		this.mUniformValues = values;
	}
	runBegin(rc: GPURenderPassEncoder): void {
		const gt = this.geometry;
		gt.run(rc);
		rc.setPipeline(this.pipeline);
		const ufs = this.uniforms;
		if (ufs) {
			for (let i = 0, ln = ufs.length; i < ln; i++) {
				const uf = ufs[i];
				// 这种判断逻辑不应该出现，加入渲染器内部渲染流程之前必须处理好
				if (uf.isEnabled()) {
					rc.setBindGroup(uf.groupIndex, uf.bindGroup);
				} else {
					this.enabled = false;
				}
			}
			if (this.enabled) {
				const uvs = this.mUniformValues;
				if (uvs) {
					for (let i = 0, ln = uvs.length; i < ln; i++) {
						ufs[uvs[i].index].setValue(uvs[i]);
					}
				}
			}
		}
	}
	run(rc: GPURenderPassEncoder): void {
		if (this.enabled) {
			const gt = this.geometry;
			if (gt.ibuf) {
				rc.setIndexBuffer(gt.ibuf, gt.ibuf.dataFormat);
				rc.drawIndexed(gt.indexCount, gt.instanceCount);
			} else {
				rc.draw(gt.vertexCount, gt.instanceCount);
			}
		}
		this.enabled = true;
	}
}

export { WGRUnit };
