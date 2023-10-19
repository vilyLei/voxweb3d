import { WGRUniform } from "./uniform/WGRUniform";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import { IWGRUnit } from "./IWGRUnit";
import IAABB from "../../vox/geom/IAABB";

class WGRUnitRunSt {
	pipeline: GPURenderPipeline;
	rc: GPURenderPassEncoder;
	gt: WGRPrimitive;
	ibuf: GPUBuffer;
}
const __$urst = new WGRUnitRunSt();
class WGRUnit implements IWGRUnit {

	private mUniformValues: WGRUniformValue[];
	private mFlag = true;

	uniforms?: WGRUniform[];
	pipeline: GPURenderPipeline;
	pipelinectx: IWGRPipelineContext;
	geometry: WGRPrimitive;

	bounds: IAABB;

	enabled = true;
	passes: WGRUnit[];

	clone(): WGRUnit {

		const r = new WGRUnit();
		r.mUniformValues = this.mUniformValues;
		r.uniforms = this.uniforms;
		r.pipeline = this.pipeline;
		r.pipelinectx = this.pipelinectx;
		r.geometry = this.geometry;
		return r;
	}
	setUniformValues(values: WGRUniformValue[]): void {
		this.mUniformValues = values;
	}
	runBegin(rc: GPURenderPassEncoder): void {

		this.mFlag = this.enabled;
		if (this.mFlag) {
			const gt = this.geometry;
			if (this.pipelinectx) {
				this.pipeline = this.pipelinectx.pipeline;
			}
			if (gt && this.pipeline) {
				// 这里面的诸多判断逻辑不应该出现，加入渲染器内部渲染流程之前必须处理好， 后续优化

				const st = __$urst;
				if (st.rc != rc) {
					st.pipeline = null;
					st.ibuf = null;
					st.gt = null;
					st.rc = rc;
				}

				if (st.gt != gt) {
					st.gt = gt;
					gt.run(rc);
				}
				if (st.pipeline != this.pipeline) {
					st.pipeline = this.pipeline;
					rc.setPipeline(st.pipeline);
				}

				const ufs = this.uniforms;
				if (ufs) {
					for (let i = 0, ln = ufs.length; i < ln; i++) {
						const uf = ufs[i];
						if (uf.isEnabled()) {
							// console.log("uf.groupIndex: ", uf.groupIndex, uf.bindGroup);
							rc.setBindGroup(uf.groupIndex, uf.bindGroup);
						} else {
							this.mFlag = false;
						}
					}
					if (this.mFlag) {
						const ufvs = this.mUniformValues;
						if (ufvs) {
							// console.log("ufvs.length: ", ufvs.length);
							for (let i = 0, ln = ufvs.length; i < ln; i++) {
								ufs[ufvs[i].index].setValue(ufvs[i]);
							}
						}
					}
				}
			} else {
				this.mFlag = false;
			}
		}
	}
	run(rc: GPURenderPassEncoder): void {
		if (this.mFlag) {
			const gt = this.geometry;
			const st = __$urst;
			if (gt.ibuf) {
				if (st.ibuf != gt.ibuf) {
					st.ibuf = gt.ibuf;
					rc.setIndexBuffer(gt.ibuf, gt.ibuf.dataFormat);
				}
				// console.log(gt.indexCount, ", gt.instanceCount: ", gt.instanceCount);
				rc.drawIndexed(gt.indexCount, gt.instanceCount);
			} else {
				rc.draw(gt.vertexCount, gt.instanceCount);
			}
		}
	}
}

export { WGRUnit };
