
import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBindGroupDescriptor } from "../../gpu/GPUBindGroupDescriptor";
import { GPUBindGroupLayout } from "../../gpu/GPUBindGroupLayout";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUBufferDescriptor } from "../../gpu/GPUBufferDescriptor";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { RPipelineParams } from "./RPipelineParams";
import { WRORUniformContext } from "../render/WRORUniformContext";
// import { WROBufferContext } from "../pipeline/WROBufferContext";
// import { WROTextureContext } from "../pipeline/WROTextureContext";

class WROPipelineContext {
    private mWGCtx: WebGPUContext | null = null;
	private mBindGroupLayouts: GPUBindGroupLayout[] = new Array(8);
	pipeline: GPURenderPipeline | null = null;
	readonly uniform = new WRORUniformContext();
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
        const buf = this.mWGCtx.device.createBuffer( desc );
        return buf;
    }
    createUniformBufferWithParam(bufSize: number, usage: number): GPUBuffer {
		const desc = {
			size: bufSize,
			usage: usage
		};
        const buf = this.mWGCtx.device.createBuffer( desc );
        return buf;
    }
	createUniformBufferBlock(params: {sizes: number[], usage: number}): GPUBuffer {
		let total = params.sizes.length;
		let size = 256 * (total - 1) + params.sizes[0];
		const desc = {
			size: size,
			usage: params.usage
		};
        const buf = this.mWGCtx.device.createBuffer( desc );
		console.log("createUniformBufferBlock(), size: ", size, ", usage: ", params.usage);
        return buf;
    }
    updateUniformBufferAt(buffer: GPUBuffer, td: DataView | Float32Array | Uint32Array | Uint16Array, index: number): void {
        this.mWGCtx.device.queue.writeBuffer(buffer, index * 256, td.buffer, td.byteOffset, td.byteLength);
    }
    createUniformBindGroup(groupIndex: number, dataParams?: {index: number, buffer: GPUBuffer, bufferSize: number}[], texParams?: {texView?: GPUTextureView, sampler?: GPUSampler}[]): GPUBindGroup {

        const device = this.mWGCtx.device;

        // if(texView && !sampler) {
        //     sampler = device.createSampler({
        //         magFilter: 'linear',
        //         minFilter: 'linear',
        //         mipmapFilter: 'linear',
        //     });
        // }


		if(!this.mBindGroupLayouts[groupIndex]) {
			this.mBindGroupLayouts[groupIndex] = this.pipeline.getBindGroupLayout(groupIndex);
		}
        let desc = {
            layout: this.mBindGroupLayouts[groupIndex],
            entries: []
        } as GPUBindGroupDescriptor;

		let bindIndex = 0;
		if(dataParams) {
			const dps = dataParams;
			for(let i = 0; i < dps.length; ++i) {

				const dp = dps[i];
				if(dp.buffer && dp.bufferSize > 0) {
					const ed = {
						binding: bindIndex ++,
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

		if(texParams) {
			let sampler = device.createSampler({
                magFilter: 'linear',
                minFilter: 'linear',
                mipmapFilter: 'linear',
            });
			for(let i = 0; i < texParams.length; ++i) {
				const t = texParams[i];
				if(t.texView) {
					let es = {
						binding: bindIndex ++,
						resource: t.sampler ? t.sampler : sampler,
					};
					let et = {
						binding: bindIndex ++,
						resource: t.texView,
					}
					desc.entries.push(es, et);
				}
			}
		}
		/*
        if(texView) {
            desc.entries = [
                et0
                ,
                {
                    binding: 1,
                    resource: sampler,
                },
                {
                    binding: 2,
                    resource: texView,
                },
            ];
        }else {
            desc.entries = [et0];
        }
		//*/

        return device.createBindGroup(desc);
    }
	createRenderPipeline(pipelineParams: RPipelineParams, descParams: {vertex: {size: number, params: {offset: number, format: string}[]}}[]): GPURenderPipeline {

		const ctx = this.mWGCtx;
		if(descParams) {
			let location = 0;
			for(let k = 0; k < descParams.length; ++k) {

				const vtx = descParams[k].vertex;
				pipelineParams.addVertexBufferLayout( { arrayStride: vtx.size, attributes: [], stepMode: "vertex" } );
				const params = vtx.params;
				for(let i = 0; i < params.length; ++i) {
					const p = params[i];
					pipelineParams.addVertexBufferAttribute({
						shaderLocation: location++,
						offset: p.offset,
						format: p.format,
					},
					k);
				}
				pipelineParams.build(ctx.device);
			}
		}
		console.log("createRenderPipeline(), pipelineParams:\n",pipelineParams);
		this.pipeline = ctx.device.createRenderPipeline(pipelineParams);
        return this.pipeline;
	}
}
export { WROPipelineContext }
