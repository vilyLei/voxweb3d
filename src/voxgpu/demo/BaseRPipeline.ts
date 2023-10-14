import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset, cubeVertexCount } from "./mesh/cubeData";

import basicVertWGSL from "./shaders/basic.vert.wgsl";
import sampleTextureMixColorWGSL from "./shaders/sampleTextureMixColor.frag.wgsl";

import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { GPURenderPassDescriptor } from "../gpu/GPURenderPassDescriptor";
import { GPUTextureView } from "../gpu/GPUTextureView";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPUBindGroup } from "../gpu/GPUBindGroup";
import { GPUTexture } from "../gpu/GPUTexture";
import CameraBase from "../../vox/view/CameraBase";
import Vector3D from "../../vox/math/Vector3D";
import { TransEntity } from "./entity/TransEntity";

import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import { GPURenderPassColorAttachment } from "../gpu/GPURenderPassColorAttachment";
import { GPUTextureDescriptor } from "../gpu/GPUTextureDescriptor";
import { GPURenderPipelineDescriptor } from "../gpu/GPURenderPipelineDescriptor";
import { calculateMipLevels, GPUMipmapGenerator } from "../texture/GPUMipmapGenerator";
import { GPUDevice } from "../gpu/GPUDevice";
import { RPipelineParams } from "./pipeline/RPipelineParams";

class CubeEntity extends TransEntity { }
export class BaseRPipeline {
	private mWGCtx = new WebGPUContext();
	private mRPipeline: GPURenderPipeline | null = null;
	private mRTexView: GPUTextureView | null = null;
	private mVerticesBuffer: GPUBuffer | null = null;
	private mUniformBuffer: GPUBuffer | null = null;
	private mUniformBindGroups: GPUBindGroup[] | null = null;
	private mDepthTexture: GPUTexture | null = null;
	private mCam = new CameraBase();
	private mEntities: CubeEntity[] = [];
	private mFPS = new RenderStatusDisplay();
	private mTexture: GPUTexture | null = null;
	private mEnabled = false;

	private mipmapGenerator = new GPUMipmapGenerator();
	generateMipmaps = true;
	msaaRenderEnabled = true;
	entitiesTotal = 1;

	constructor() { }
	initialize(): void {
		console.log("BaseRPipeline::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		const ctx = this.mWGCtx;

		let scale = 100.0;
		const vs = cubeVertexArray;
		for (let i = 0; i < vs.length; i += 10) {
			vs[i] *= scale;
			vs[i + 1] *= scale;
			vs[i + 2] *= scale;
		}
		// console.log("cubeVertexArray: ", cubeVertexArray);

		this.mFPS.initialize(null, false);

		const cam = this.mCam;
		const camPosition = new Vector3D(1000.0, 1000.0, 1000.0);
		const camLookAtPos = new Vector3D(0.0, 0.0, 0.0);
		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, canvas.width / canvas.height, 0.1, 5000);
		cam.lookAtRH(camPosition, camLookAtPos, camUpDirect);
		cam.setViewXY(0, 0);
		cam.setViewSize(canvas.width, canvas.height);
		cam.update();

		const cfg = {
			alphaMode: "premultiplied"
		};
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization success ...");

			console.log("msaaRenderEnabled: ", this.msaaRenderEnabled);
			console.log("entitiesTotal: ", this.entitiesTotal);

			let total = this.entitiesTotal;
			for (let i = 0; i < total; ++i) {
				let entity = new CubeEntity();
				entity.intialize(this.mCam);
				this.mEntities.push(entity);
			}
			if (total == 1) {
				this.mEntities[0].scaleFactor = 1.0;
				this.mEntities[0].posV.setXYZ(0, 0, 0);
			}

			let pipeParams = new RPipelineParams({
				sampleCount: 4,
				multisampleEnabled: this.msaaRenderEnabled,
				vertShaderSrc: {code: basicVertWGSL},
				fragShaderSrc: {code: sampleTextureMixColorWGSL},
				depthStencilEnabled: true,
				fragmentEnabled: true,
			});
			pipeParams.setVertexBufferArrayStrideAt(cubeVertexSize);
			pipeParams.addVertexBufferAttribute({
				// position
				shaderLocation: 0,
				offset: cubePositionOffset,
				format: "float32x4"
			});
			pipeParams.addVertexBufferAttribute({
				// uv
				shaderLocation: 1,
				offset: cubeUVOffset,
				format: "float32x2"
			});
			pipeParams.build( ctx.device );

			this.createRenderPassTexture(pipeParams);
			this.mRPipeline = this.createRenderPipeline(pipeParams);
			this.mipmapGenerator.initialize(this.mWGCtx.device);
			this.createMaterialTexture(ctx.device, this.msaaRenderEnabled).then(() => {
				console.log("webgpu texture res build success ...");
				this.createUniforms(this.mRPipeline, total);
				this.mEnabled = true;
			});
		});
	}

	private createRenderPassTexture(params: RPipelineParams): void {
		const ctx = this.mWGCtx;
		const device = ctx.device;
		const canvas = ctx.canvas;

		if (params.multisampleEnabled) {
			const texture = device.createTexture({
				size: [ctx.canvas.width, ctx.canvas.height],
				sampleCount: params.sampleCount,
				format: ctx.presentationFormat,
				usage: GPUTextureUsage.RENDER_ATTACHMENT
			});
			this.mRTexView = texture.createView();
		}

		// Create a vertex buffer from the cube data.
		const verticesBuffer = device.createBuffer({
			size: cubeVertexArray.byteLength,
			usage: GPUBufferUsage.VERTEX,
			mappedAtCreation: true
		});
		new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
		verticesBuffer.unmap();
		this.mVerticesBuffer = verticesBuffer;

		let depthTexDesc = {
			size: [canvas.width, canvas.height],
			format: "depth24plus",
			usage: GPUTextureUsage.RENDER_ATTACHMENT
		} as GPUTextureDescriptor;

		if (params.multisampleEnabled) {
			depthTexDesc.sampleCount = params.sampleCount;
		}
		
		const depthTexture = device.createTexture(depthTexDesc);
		this.mDepthTexture = depthTexture;
	}
	private createRenderPipeline(params: RPipelineParams): GPURenderPipeline {
		
		const ctx = this.mWGCtx;
		const device = ctx.device;

		const pipeline = device.createRenderPipeline(params);

		return pipeline;
	}
	private async createMaterialTexture(device: GPUDevice, generateMipmaps: boolean) {

		let tex: GPUTexture;
		const response = await fetch("static/assets/box.jpg");
		const imageBitmap = await createImageBitmap(await response.blob());
		const mipLevelCount = this.generateMipmaps ? calculateMipLevels(imageBitmap.width, imageBitmap.height) : 1;
		const textureDescriptor = {
			size: { width: imageBitmap.width, height: imageBitmap.height, depthOrArrayLayers: 1 },
			format: "rgba8unorm",
			mipLevelCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
		};
		tex = device.createTexture(textureDescriptor);
		device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture: tex }, [imageBitmap.width, imageBitmap.height]);

		if (generateMipmaps) {
			this.mipmapGenerator.generateMipmap(tex, textureDescriptor);
		}

		this.mTexture = tex;
	}
	private createUniforms(pipeline: GPURenderPipeline, entitiesTotal: number): void {
		const ctx = this.mWGCtx;
		const device = ctx.device;

		const matrixSize = 4 * 16; // 4x4 matrix
		const offsetRange = 256; // uniformBindGroup offset must be 256-byte aligned
		const uniformBufferSize = offsetRange * (entitiesTotal - 1) + matrixSize;

		const uniformBuffer = device.createBuffer({
			size: uniformBufferSize,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});
		this.mUniformBuffer = uniformBuffer;

		this.mUniformBindGroups = new Array(entitiesTotal);

		for (let i = 0; i < entitiesTotal; ++i) {
			const sampler = device.createSampler({
				magFilter: 'linear',
				minFilter: 'linear',
				mipmapFilter: 'linear',
			});
			console.log("sampler: ", sampler);
			let uniformBindGroup = device.createBindGroup({
				layout: pipeline.getBindGroupLayout(0),
				entries: [
					{
						binding: 0,
						resource: {
							offset: offsetRange * i,
							buffer: uniformBuffer,
							size: matrixSize
						}
					},
					{
						binding: 1,
						resource: sampler,
					},
					{
						binding: 2,
						resource: this.mTexture.createView(),
					},
				]
			});
			this.mUniformBindGroups[i] = uniformBindGroup;
		}
	}
	private renderFrame(msaaEnabled: boolean): void {
		const ctx = this.mWGCtx;
		if (ctx.enabled) {
			const device = ctx.device;
			const pipeline = this.mRPipeline;

			const commandEncoder = device.createCommandEncoder();

			let rpassColorAttachment = {
				clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
				loadOp: "clear",
				storeOp: "store"
			} as GPURenderPassColorAttachment;

			if (msaaEnabled) {
				rpassColorAttachment.view = this.mRTexView;
				rpassColorAttachment.resolveTarget = ctx.createCurrentView();
			} else {
				rpassColorAttachment.view = ctx.createCurrentView();
			}
			let colorAttachments: GPURenderPassColorAttachment[] = [rpassColorAttachment];
			const renderPassDescriptor: GPURenderPassDescriptor = {
				colorAttachments: colorAttachments,
				depthStencilAttachment: {
					view: this.mDepthTexture.createView(),
					depthClearValue: 1.0,
					depthLoadOp: "clear",
					depthStoreOp: "store"
				}
			};

			let passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

			passEncoder.setPipeline(pipeline);
			passEncoder.setVertexBuffer(0, this.mVerticesBuffer);

			const uniformBuffer = this.mUniformBuffer;
			let entities = this.mEntities;
			let entitiesTotal = entities.length;
			for (let i = 0; i < entitiesTotal; ++i) {
				const et = entities[i];
				if (et.enabled) {
					const transData = et.transData;
					device.queue.writeBuffer(uniformBuffer, i * 256, transData.buffer, transData.byteOffset, transData.byteLength);
					passEncoder.setBindGroup(0, this.mUniformBindGroups[i]);
					passEncoder.draw(cubeVertexCount);
				}
			}

			passEncoder.end();

			const cmd = commandEncoder.finish();

			device.queue.submit([cmd]);
		}
	}

	private renderPreCalc(): void {
		const ctx = this.mWGCtx;
		if (ctx.enabled) {
			let entities = this.mEntities;
			let entitiesTotal = entities.length;
			for (let i = 0; i < entitiesTotal; ++i) {
				const et = entities[i];
				et.run(this.mCam);
			}
		}
	}

	run(): void {
		if (this.mEnabled) {
			this.mFPS.update();

			this.renderPreCalc();
			this.renderFrame(this.msaaRenderEnabled);
		}
	}
}
