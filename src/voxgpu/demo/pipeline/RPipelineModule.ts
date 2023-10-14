
import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBindGroupDescriptor } from "../../gpu/GPUBindGroupDescriptor";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUBufferDescriptor } from "../../gpu/GPUBufferDescriptor";
import { GPUDevice } from "../../gpu/GPUDevice";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTexture } from "../../gpu/GPUTexture";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { calculateMipLevels, WebGPUContext } from "../../gpu/WebGPUContext";
import { RPipelineParams } from "./RPipelineParams";

class RPipelineModule {
    private mWGCtx: WebGPUContext | null = null;
	private mUniformBuffer: GPUBuffer | null = null;
	pipeline: GPURenderPipeline | null = null;

    constructor(wgCtx?: WebGPUContext) {
        if (wgCtx) {
            this.initialize(wgCtx);
        }
    }
    initialize(wgCtx: WebGPUContext): void {
        this.mWGCtx = wgCtx;
    }
	async createMaterialTexture(generateMipmaps: boolean) {

        const device = this.mWGCtx.device;
        const mipmapG = this.mWGCtx.mipmapGenerator;

		let tex: GPUTexture;
        
		const response = await fetch("static/assets/box.jpg");
		const imageBitmap = await createImageBitmap(await response.blob());
		const mipLevelCount = generateMipmaps ? calculateMipLevels(imageBitmap.width, imageBitmap.height) : 1;
		const textureDescriptor = {
			size: { width: imageBitmap.width, height: imageBitmap.height, depthOrArrayLayers: 1 },
			format: "rgba8unorm",
			mipLevelCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
		};
		tex = device.createTexture(textureDescriptor);
		device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture: tex }, [imageBitmap.width, imageBitmap.height]);

		if (generateMipmaps) {
			mipmapG.generateMipmap(tex, textureDescriptor);
		}
        
		return tex;
	}
    createUniformBuffer(desc: GPUBufferDescriptor): GPUBuffer {
        this.mUniformBuffer = this.mWGCtx.device.createBuffer( desc );
        return this.mUniformBuffer;
    }
    updateUniformBufferAt(td: DataView | Float32Array | Uint32Array | Uint16Array, index: number): void {
        this.mWGCtx.device.queue.writeBuffer(this.mUniformBuffer, index * 256, td.buffer, td.byteOffset, td.byteLength);
    }
    createUniformBindGroup(index: number,dataSize: number, texView: GPUTextureView, sampler?: GPUSampler): GPUBindGroup {

        const device = this.mWGCtx.device;

        if(texView && !sampler) {
            sampler = device.createSampler({
                magFilter: 'linear',
                minFilter: 'linear',
                mipmapFilter: 'linear',
            });
        }
        const et0 = {
            binding: 0,
            resource: {
                offset: 256 * index,
                buffer: this.mUniformBuffer,
                size: dataSize
            }
        };
        let desc = {
            layout: this.pipeline.getBindGroupLayout(0),
            entries: null
        } as GPUBindGroupDescriptor;
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

        return device.createBindGroup(desc);
    }
	createRenderPipeline(pipelineParams: RPipelineParams, descParam: {vertex: {size: number, params: {offset: number, format: string}[]}}): GPURenderPipeline {

		const ctx = this.mWGCtx;
        const vtx = descParam.vertex;

		pipelineParams.setVertexBufferArrayStrideAt(vtx.size);
        const params = vtx.params;
        for(let i = 0; i < params.length; ++i) {
            const p = params[i];
            pipelineParams.addVertexBufferAttribute({
                shaderLocation: i,
                offset: p.offset,
                format: p.format,
            });
        }        
		pipelineParams.build(ctx.device);
		this.pipeline = ctx.device.createRenderPipeline(pipelineParams);
        return this.pipeline;
	}
}
export { RPipelineModule }