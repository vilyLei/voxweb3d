import { type } from "jquery";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { BufDataParamType, WROPipelineContext } from "../pipeline/WROPipelineContext";
import { WRORUniform } from "./WRORUniform";

class WROUniformWrapper {
	uniform: WRORUniform | null = null;
	bufDataParams?: BufDataParamType[];
	bufDataDescs?: { index: number; buffer: GPUBuffer; bufferSize: number }[];
	texParams?: { texView: GPUTextureView; sampler?: GPUSampler }[];
	usage = 0;
	groupIndex = 0;
}

class UCtxInstance {
	private mList: WROUniformWrapper[] = [];
	private mPipelineCtx: WROPipelineContext | null = null;
	private mBuffers: GPUBuffer[] | null = null;
	constructor() {}

	private getFreeIndex(): number {
		for (let i = 0; i < this.mList.length; ++i) {
			if (this.mList[i].uniform == null) {
				return i;
			}
		}
		return -1;
	}
	initialize(pipelineCtx: WROPipelineContext | null): void {
		this.mPipelineCtx = pipelineCtx;
	}
	runBegin(): void {
		if (!this.mBuffers) {
			let ls = this.mList;
			if (ls.length > 0) {
				this.mBuffers = [];

				let wp = ls[0];

				if (wp.bufDataParams) {
					for (let i = 0; i < wp.bufDataParams.length; ++i) {
						let uniformParams = { sizes: new Array(ls.length), usage: wp.bufDataParams[i].usage };

						for (let j = 0; j < ls.length; ++j) {
							uniformParams.sizes[j] = ls[j].bufDataParams[i].size;
						}
						const buffer = this.mPipelineCtx.createUniformsBuffer(uniformParams);
						this.mBuffers.push(buffer);
					}
				}

				for (let i = 0; i < ls.length; ++i) {
					const uf = this.mList[i].uniform;
					if (uf) {
						wp = ls[i];
						uf.buffers = this.mBuffers;
						uf.versions = new Array(uf.buffers.length);
						uf.versions.fill(-1);
						if (wp.bufDataParams) {
							const dataParams = [];
							for (let j = 0; j < wp.bufDataParams.length; ++j) {
								dataParams.push({ index: i, buffer: uf.buffers[j], bufferSize: wp.bufDataParams[j].size });
							}
							wp.bufDataDescs = dataParams;
							uf.bindGroup = this.mPipelineCtx.createUniformBindGroup(wp.groupIndex, dataParams, wp.texParams);
						} else {
							uf.bindGroup = this.mPipelineCtx.createUniformBindGroup(wp.groupIndex, null, wp.texParams);
						}
					}
				}
				// console.log("UCtxInstance::runBegin(), this.mList: ", this.mList);
			}
		}
	}
	runEnd(): void {}
	createUniform(
		groupIndex: number,
		bufDataParams?: BufDataParamType[],
		texParams?: { texView: GPUTextureView; sampler?: GPUSampler }[]
	): WRORUniform {
		const index = this.getFreeIndex();
		const u = new WRORUniform(this.mPipelineCtx, this);
		u.groupIndex = groupIndex;

		if (index >= 0) {
			this.mList[index].uniform = u;
			u.index = index;
		} else {
			const wrapper = new WROUniformWrapper();
			u.index = this.mList.length;
			wrapper.uniform = u;
			wrapper.bufDataParams = bufDataParams;
			// wrapper.usage = bufDataParams.usage;
			wrapper.texParams = texParams;
			this.mList.push(wrapper);
		}

		return u;
	}
	updateUniformTextureView(u: WRORUniform, texParams: { texView: GPUTextureView; sampler?: GPUSampler }[]): void {
		if (u && u.index >= 0 && this.mList[u.index]) {
			const wp = this.mList[u.index];
			const uf = wp.uniform;
			if (uf) {
				uf.bindGroup = this.mPipelineCtx.createUniformBindGroup(wp.groupIndex, wp.bufDataDescs, texParams);
			}
		}
	}
	removeUniform(u: WRORUniform): void {
		if (u && u.index >= 0 && this.mList[u.index]) {
			const wp = this.mList[u.index];
			wp.uniform = null;
			wp.texParams = null;
			u.__$$destroy();
		}
	}
	destroy(): void {
		if (this.mPipelineCtx) {
			if (this.mBuffers) {
				for (let i = 0; i < this.mBuffers.length; ++i) {
					this.mBuffers[i].destroy();
				}
				this.mBuffers = null;
			}
			this.mPipelineCtx = null;
			let ls = this.mList;
			for (let i = 0; i < ls.length; ++i) {
				if (this.mList[i]) {
					this.removeUniform(this.mList[i].uniform);
				}
			}
		}
	}
}
class WRORUniformContext {
	private mInit = true;
	private mMap: Map<string, UCtxInstance> = new Map();
	private mPipelineCtx: WROPipelineContext | null = null;
	constructor() {}

	private getUCtx(layoutName: string, creation: boolean = true): UCtxInstance | null {
		let uctx: UCtxInstance = null;
		const m = this.mMap;
		if (m.has(layoutName)) {
			uctx = m.get(layoutName);
		} else {
			if (creation) {
				uctx = new UCtxInstance();
				uctx.initialize(this.mPipelineCtx);
				m.set(layoutName, uctx);
			}
		}
		return uctx;
	}
	initialize(pipelineCtx: WROPipelineContext | null): void {
		this.mPipelineCtx = pipelineCtx;
	}
	runBegin(): void {
		if (this.mInit) {
			this.mInit = false;
			for (var [k, v] of this.mMap) {
				v.runBegin();
			}
		}
	}
	runEnd(): void {
		if (!this.mInit) {
			for (var [k, v] of this.mMap) {
				v.runBegin();
			}
		}
	}
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: { size: number; usage: number }[],
		texParams?: { texView: GPUTextureView; sampler?: GPUSampler }[]
	): WRORUniform | null {
		if (this.mPipelineCtx) {
			const uctx = this.getUCtx(layoutName);
			return uctx.createUniform(groupIndex, bufDataParams, texParams);
		}
		return null;
	}
	removeUniform(u: WRORUniform): void {
		if (this.mPipelineCtx) {
			if (u.layoutName) {
				const m = this.mMap;
				if (m.has(u.layoutName)) {
					const uctx = m.get(u.layoutName);
					uctx.removeUniform(u);
				}
			}
		}
	}
	destroy(): void {
		if (this.mPipelineCtx) {
			for (var [k, v] of this.mMap) {
				v.destroy();
			}
			this.mPipelineCtx = null;
		}
	}
}
export { BufDataParamType, WRORUniformContext };
