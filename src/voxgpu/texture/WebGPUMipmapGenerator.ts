import { GPUBindGroupLayout } from "../gpu/GPUBindGroupLayout";
import { GPUDevice } from "../gpu/GPUDevice";
import { GPUPipelineLayout } from "../gpu/GPUPipelineLayout";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { GPUSampler } from "../gpu/GPUSampler";
import { GPUShaderModule } from "../gpu/GPUShaderModule";
import { GPUTexture } from "../gpu/GPUTexture";
import { TexSizeDescriptor, GPUTextureDescriptor } from "../gpu/GPUTextureDescriptor";

/**
 * Determines the number of mip levels needed for a full mip chain given the width and height of texture level 0.
 *
 * @param {number} width of texture level 0.
 * @param {number} height of texture level 0.
 * @returns {number} Ideal number of mip levels.
 */
 export function calculateMipLevels(width: number, height: number): number {
	return Math.floor(Math.log2(Math.max(width, height))) + 1;
}
/**
 * thanks: https://github.com/toji/web-texture-tool/blob/main/src/webgpu-mipmap-generator.js
 */
export class WebGPUMipmapGenerator {

	private device: GPUDevice | null = null;
	private sampler: GPUSampler | null = null;
	private mipmapShaderModule: GPUShaderModule | null = null;
	private bindGroupLayout: GPUBindGroupLayout | null = null;
	private pipelineLayout: GPUPipelineLayout | null = null;
	private pipelines: any = null;
	
	constructor(device: GPUDevice) {
		this.device = device;
		this.sampler = device.createSampler({ minFilter: 'linear' });
		// We'll need a new pipeline for every texture format used.
		this.pipelines = {};
	}
	/**
	 * @param {string} format - format of the texture
	 * @returns {GPURenderPipeline} pipeline - a GPURenderPipeline instance
	 */
	private getMipmapPipeline(format: string) {
		let pipeline = this.pipelines[format];
		if (!pipeline) {
			// Shader modules is shared between all pipelines, so only create once.
			if (!this.mipmapShaderModule) {
				this.mipmapShaderModule = this.device.createShaderModule({
					label: 'Mipmap Generator',
					code: `
            var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
              vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));

            struct VertexOutput {
              @builtin(position) position : vec4<f32>,
              @location(0) texCoord : vec2<f32>,
            };

            @vertex
            fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
              var output : VertexOutput;
              output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
              output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
              return output;
            }

            @group(0) @binding(0) var imgSampler : sampler;
            @group(0) @binding(1) var img : texture_2d<f32>;

            @fragment
            fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
              return textureSample(img, imgSampler, texCoord);
            }
          `,
				});

				this.bindGroupLayout = this.device.createBindGroupLayout({
					label: 'Mipmap Generator',
					entries: [{
						binding: 0,
						visibility: GPUShaderStage.FRAGMENT,
						sampler: {},
					}, {
						binding: 1,
						visibility: GPUShaderStage.FRAGMENT,
						texture: {},
					}]
				});
				this.pipelineLayout = this.device.createPipelineLayout({
					label: 'Mipmap Generator',
					bindGroupLayouts: [this.bindGroupLayout],
				})
			}

			pipeline = this.device.createRenderPipeline({
				layout: this.pipelineLayout,
				vertex: {
					module: this.mipmapShaderModule,
					entryPoint: 'vertexMain',
				},
				fragment: {
					module: this.mipmapShaderModule,
					entryPoint: 'fragmentMain',
					targets: [{ format }],
				}
			});
			this.pipelines[format] = pipeline;
		}
		return pipeline;
	}

	/**
	 * Generates mipmaps for the given GPUTexture from the data in level 0.
	 *
	 * @param {GPUTexture} texture - Texture to generate mipmaps for.
	 * @param {object} textureDescriptor - GPUTextureDescriptor the texture was created with.
	 * @returns {module:External.GPUTexture} - The originally passed texture
	 */
	generateMipmap(texture: GPUTexture, textureDescriptor: GPUTextureDescriptor): GPUTexture {
		// TODO: Does this need to handle sRGB formats differently?
		const pipeline = this.getMipmapPipeline(textureDescriptor.format);

		if (textureDescriptor.dimension == '3d' || textureDescriptor.dimension == '1d') {
			throw new Error('Generating mipmaps for non-2d textures is currently unsupported!');
		}
		const texSizeDesc = textureDescriptor.size as TexSizeDescriptor;
		let mipTexture = texture;
		const arrayLayerCount = texSizeDesc.depthOrArrayLayers || 1; // Only valid for 2D textures.

		// If the texture was created with RENDER_ATTACHMENT usage we can render directly between mip levels.
		const renderToSource = textureDescriptor.usage & GPUTextureUsage.RENDER_ATTACHMENT;
		if (!renderToSource) {
			// Otherwise we have to use a separate texture to render into. It can be one mip level smaller than the source
			// texture, since we already have the top level.
			const mipTextureDescriptor = {
				size: {
					width: Math.max(1, texSizeDesc.width >>> 1),
					height: Math.max(1, texSizeDesc.height >>> 1),
					depthOrArrayLayers: arrayLayerCount,
				},
				format: textureDescriptor.format,
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
				mipLevelCount: textureDescriptor.mipLevelCount - 1,
			};
			mipTexture = this.device.createTexture(mipTextureDescriptor);
		}

		const commandEncoder = this.device.createCommandEncoder({});
		for (let arrayLayer = 0; arrayLayer < arrayLayerCount; ++arrayLayer) {
			let srcView = texture.createView({
				baseMipLevel: 0,
				mipLevelCount: 1,
				dimension: '2d',
				baseArrayLayer: arrayLayer,
				arrayLayerCount: 1,
			});

			let dstMipLevel = renderToSource ? 1 : 0;
			for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
				const dstView = mipTexture.createView({
					baseMipLevel: dstMipLevel++,
					mipLevelCount: 1,
					dimension: '2d',
					baseArrayLayer: arrayLayer,
					arrayLayerCount: 1,
				});

				const passEncoder = commandEncoder.beginRenderPass({
					colorAttachments: [{
						view: dstView,
						loadOp: 'clear',
						storeOp: 'store'
					}],
				});

				const bindGroup = this.device.createBindGroup({
					layout: this.bindGroupLayout,
					entries: [{
						binding: 0,
						resource: this.sampler,
					}, {
						binding: 1,
						resource: srcView,
					}],
				});

				passEncoder.setPipeline(pipeline);
				passEncoder.setBindGroup(0, bindGroup);
				passEncoder.draw(3, 1, 0, 0);
				passEncoder.end();

				srcView = dstView;
			}
		}

		// If we didn't render to the source texture, finish by copying the mip results from the temporary mipmap texture
		// to the source.
		if (!renderToSource) {
			const mipLevelSize = {
				width: Math.max(1, texSizeDesc.width >>> 1),
				height: Math.max(1, texSizeDesc.height >>> 1),
				depthOrArrayLayers: arrayLayerCount,
			};

			for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
				commandEncoder.copyTextureToTexture({
					texture: mipTexture,
					mipLevel: i - 1,
				}, {
					texture: texture,
					mipLevel: i,
				}, mipLevelSize);

				mipLevelSize.width = Math.max(1, mipLevelSize.width >>> 1);
				mipLevelSize.height = Math.max(1, mipLevelSize.height >>> 1);
			}
		}

		this.device.queue.submit([commandEncoder.finish()]);

		if (!renderToSource) {
			mipTexture.destroy();
		}

		return texture;
	}
}
