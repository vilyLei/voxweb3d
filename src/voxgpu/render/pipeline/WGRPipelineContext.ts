import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBindGroupDescriptor } from "../../gpu/GPUBindGroupDescriptor";
import { GPUBindGroupLayout } from "../../gpu/GPUBindGroupLayout";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUBufferDescriptor } from "../../gpu/GPUBufferDescriptor";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { BufDataParamType, VtxDescParam, VtxPipelinDescParam, IWGRPipelineContext } from "./IWGRPipelineContext";
import { WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
// import { WRORUniformContext } from "../../demo/render/WRORUniformContext";
import { WGRUniformContext } from "../uniform/WGRUniformContext";

// type BufDataParamType = { size: number; usage: number; defaultData?: Float32Array | Int32Array | Uint32Array | Uint16Array | Int16Array };
// type VtxDescParam = { vertex: { arrayStride: number; params: { offset: number; format: string }[] } };
// type VtxPipelinDescParam = { vertex: { buffers: GPUBuffer[]; attributeIndicesArray: number[][] } };
class WGRPipelineContext implements IWGRPipelineContext {
	private mWGCtx: WebGPUContext | null = null;
	private mBindGroupLayouts: GPUBindGroupLayout[] = new Array(8);

	pipeline: GPURenderPipeline | null = null;

	uid = 0;
	name = "PipelineContext";
	readonly uniform = new WGRUniformContext();
	constructor(wgCtx?: WebGPUContext) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	runBegin(): void {
		this.uniform.runBegin();
	}
	runEnd(): void {
		this.uniform.runEnd();
	}
	initialize(wgCtx: WebGPUContext): void {
		this.mWGCtx = wgCtx;
		this.uniform.initialize(this);
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
			let size = 256 * (total - 1) + params.sizes[0];
			const desc = {
				size: size,
				usage: params.usage
			};
			const buf = this.mWGCtx.device.createBuffer(desc);
			console.log("createUniformsBuffer(), size: ", size, ", usage: ", params.usage);
			return buf;
		}
		return null;
	}
	updateUniformBufferAt(buffer: GPUBuffer, td: NumberArrayDataType, index: number): void {
		this.mWGCtx.device.queue.writeBuffer(buffer, index * 256, td.buffer, td.byteOffset, td.byteLength);
	}
	createUniformBindGroup(
		groupIndex: number,
		dataParams?: { index: number; buffer: GPUBuffer; bufferSize: number }[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[]
	): GPUBindGroup {
		const device = this.mWGCtx.device;

		if (!this.mBindGroupLayouts[groupIndex]) {
			this.mBindGroupLayouts[groupIndex] = this.pipeline.getBindGroupLayout(groupIndex);
		}
		let desc = {
			layout: this.mBindGroupLayouts[groupIndex],
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

		if (texParams) {
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
				pipelineParams.build(ctx.device);
			}
		}
		// console.log("createRenderPipeline(), pipelineParams:\n",pipelineParams);
		this.pipeline = ctx.device.createRenderPipeline(pipelineParams);
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
export { VtxPipelinDescParam, BufDataParamType, WGRPipelineContext };
