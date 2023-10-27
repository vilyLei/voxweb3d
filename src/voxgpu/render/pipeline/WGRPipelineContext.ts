import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBindGroupDescriptor } from "../../gpu/GPUBindGroupDescriptor";
import { GPUBindGroupLayout } from "../../gpu/GPUBindGroupLayout";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUBufferDescriptor } from "../../gpu/GPUBufferDescriptor";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPURenderPipelineEmpty } from "../../gpu/GPURenderPipelineEmpty";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { BufDataParamType, VtxDescParam, VtxPipelinDescParam, IWGRPipelineContext } from "./IWGRPipelineContext";
import { WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
import { WGRUniformParam, WGRUniformContext } from "../uniform/WGRUniformContext";

class WGRPipelineContext implements IWGRPipelineContext {

	private mInit = true;
	private mWGCtx: WebGPUContext;
	private mBGLayouts: GPUBindGroupLayout[] = new Array(8);
	private mPipelineParams: WGRPipelineCtxParams;

	pipeline: GPURenderPipeline = new GPURenderPipelineEmpty();

	uid = 0;
	name = "PipelineContext";
	readonly uniform = new WGRUniformContext();

	constructor(wgCtx?: WebGPUContext) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	private init(): void {
		if (this.mInit) {
			this.mInit = false;
			const ctx = this.mWGCtx;
			const p = this.mPipelineParams;
			if (p) {
				p.build(ctx.device);
				this.pipeline = ctx.device.createRenderPipeline(p);
			}
		}
	}
	runBegin(): void {
		this.init();
		this.uniform.runBegin();
	}
	runEnd(): void {
		this.uniform.runEnd();
	}
	initialize(wgCtx: WebGPUContext): void {
		this.mWGCtx = wgCtx;
		this.uniform.initialize(this);
	}

	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	createUniformBuffer(desc: GPUBufferDescriptor): GPUBuffer {
		const buf = this.mWGCtx.device.createBuffer(desc);
		return buf;
	}
	createUniformBufferWithParam(bufSize: number, usage: number, mappedAtCreation = false): GPUBuffer {
		const desc = {
			size: bufSize,
			usage: usage,
			mappedAtCreation
		};
		const buf = this.mWGCtx.device.createBuffer(desc);
		return buf;
	}
	createUniformsBuffer(params: { sizes: number[]; usage: number }, mappedAtCreation = false): GPUBuffer | null {
		if (params && params.sizes.length > 0) {
			let total = params.sizes.length;
			let size = params.sizes[0];
			let bufSize = size;
			let segs: { index: number; size: number }[] = new Array(total);
			segs[0] = { index: 0, size: size };

			for (let i = 1; i < total; ++i) {

				size = size <= 256 ? size : size % 256;
				size = size > 0 ? 256 - size : 0;

				bufSize += size;
				size = params.sizes[i];
				segs[i] = { index: bufSize, size: size };
				bufSize += size;
			}
			const desc = {
				size: bufSize,
				usage: params.usage
			};
			const buf = this.mWGCtx.device.createBuffer(desc);
			buf.segs = segs;
			console.log("createUniformsBuffer(), segs: ", segs);
			console.log("createUniformsBuffer(), bufSize: ", bufSize, ", usage: ", params.usage);
			return buf;
		}
		return null;
	}
	updateUniformBufferAt(buffer: GPUBuffer, td: NumberArrayDataType, index: number, offset = 0): void {
		// console.log("buffer.segs[index].index + offset: ", buffer.segs[index].index + offset);
		// console.log("	td: ", td);
		this.mWGCtx.device.queue.writeBuffer(buffer, buffer.segs[index].index + offset, td.buffer, td.byteOffset, td.byteLength);
	}
	createUniformBindGroup(
		groupIndex: number,
		dataParams?: { index: number; buffer: GPUBuffer; bufferSize: number }[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[]
	): GPUBindGroup {
		const device = this.mWGCtx.device;

		if (!this.mBGLayouts[groupIndex]) {
			this.mBGLayouts[groupIndex] = this.pipeline.getBindGroupLayout(groupIndex);
		}
		let desc = {
			layout: this.mBGLayouts[groupIndex],
			entries: []
		} as GPUBindGroupDescriptor;

		let bindIndex = 0;
		if (dataParams) {
			const dps = dataParams;
			for (let i = 0; i < dps.length; ++i) {
				const dp = dps[i];
				if (dp.buffer && dp.bufferSize > 0) {
					const ed = {
						binding: bindIndex++,
						resource: {
							offset: 256 * dp.index,
							buffer: dp.buffer,
							size: dp.bufferSize
						}
					};
					desc.entries.push(ed);
				}
			}
		}

		if (texParams && texParams.length > 0) {
			let sampler = device.createSampler({
				magFilter: "linear",
				minFilter: "linear",
				mipmapFilter: "linear"
			});
			for (let i = 0; i < texParams.length; ++i) {
				const t = texParams[i];
				if (t.texView) {
					let es = {
						binding: bindIndex++,
						resource: t.sampler ? t.sampler : sampler
					};
					let et = {
						binding: bindIndex++,
						resource: t.texView
					};
					desc.entries.push(es, et);
				}
			}
		}
		if(desc.entries.length < 1) {
			throw Error("Illegal operation !!!");
		}
		return device.createBindGroup(desc);
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams, descParams: VtxDescParam[]): GPURenderPipeline {
		const ctx = this.mWGCtx;
		if (descParams) {
			let location = 0;
			for (let k = 0; k < descParams.length; ++k) {
				const vtx = descParams[k].vertex;
				pipelineParams.addVertexBufferLayout({ arrayStride: vtx.arrayStride, attributes: [], stepMode: "vertex" });
				const params = vtx.params;
				for (let i = 0; i < params.length; ++i) {
					const p = params[i];
					pipelineParams.addVertexBufferAttribute(
						{
							shaderLocation: location++,
							offset: p.offset,
							format: p.format
						},
						k
					);
				}
				if (pipelineParams.buildDeferred) {
					this.mPipelineParams = pipelineParams;
				} else {
					pipelineParams.build(ctx.device);
				}
			}
		}
		console.log("createRenderPipeline(), pipelineParams:\n", pipelineParams);
		if (!this.mPipelineParams) {
			this.pipeline = ctx.device.createRenderPipeline(pipelineParams);
		}
		return this.pipeline;
	}

	createRenderPipelineWithBuf(pipelineParams: WGRPipelineCtxParams, vtxDesc: VtxPipelinDescParam): GPURenderPipeline {
		const vtx = vtxDesc.vertex;
		const vtxDescParams = this.createRenderPipelineVtxParams(vtx.buffers, vtx.attributeIndicesArray);
		console.log("vtxDescParams: ", vtxDescParams);
		return this.createRenderPipeline(pipelineParams, vtxDescParams);
	}
	createRenderPipelineVtxParam(vtxBuf: GPUBuffer, attributeIndices: number[]): VtxDescParam {
		const p: VtxDescParam = {
			vertex: {
				arrayStride: vtxBuf.arrayStride,
				params: []
			}
		};
		const params = p.vertex.params;
		const ls = attributeIndices;
		for (let i = 0; i < attributeIndices.length; ++i) {
			params.push({ offset: vtxBuf.vectorOffsets[ls[i]], format: vtxBuf.vectorFormats[ls[i]] });
		}
		return p;
	}
	createRenderPipelineVtxParams(vtxBufs: GPUBuffer[], attributeIndicesArray: number[][]): VtxDescParam[] {
		const ls: VtxDescParam[] = new Array(attributeIndicesArray.length);
		for (let i = 0; i < attributeIndicesArray.length; ++i) {
			ls[i] = this.createRenderPipelineVtxParam(vtxBufs[i], attributeIndicesArray[i]);
		}
		return ls;
	}
}
export { VtxPipelinDescParam, BufDataParamType, WGRUniformParam, WGRPipelineContext };
