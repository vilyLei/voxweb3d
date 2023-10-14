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
import { RRendererPass } from "./pipeline/RRendererPass";

class CubeEntity extends TransEntity { }
export class BaseRPipeline {

	private mWGCtx = new WebGPUContext();

	private mRPipeline: GPURenderPipeline | null = null;
	private mVerticesBuffer: GPUBuffer | null = null;
	private mUniformBuffer: GPUBuffer | null = null;
	private mUniformBindGroups: GPUBindGroup[] | null = null;
	private mCam = new CameraBase();
	private mEntities: CubeEntity[] = [];
	private mFPS = new RenderStatusDisplay();
	private mTexture: GPUTexture | null = null;
	private mEnabled = false;

	private mRendererPass = new RRendererPass();
	private mipmapGenerator = new GPUMipmapGenerator();
	generateMipmaps = true;
	msaaRenderEnabled = true;
	entitiesTotal = 1;

	constructor() { }

	private initCamera(width: number, height: number): void {
		const cam = this.mCam;

		const camPosition = new Vector3D(1000.0, 1000.0, 1000.0);
		const camLookAtPos = new Vector3D(0.0, 0.0, 0.0);
		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		cam.lookAtRH(camPosition, camLookAtPos, camUpDirect);
		cam.setViewXY(0, 0);
		cam.setViewSize(width, height);

		cam.update();

	}
	initialize(): void {
		console.log("BaseRPipeline::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		const ctx = this.mWGCtx;
		this.initCamera(canvas.width, canvas.height);
		let scale = 100.0;
		const vs = cubeVertexArray;
		for (let i = 0; i < vs.length; i += 10) {
			vs[i] *= scale;
			vs[i + 1] *= scale;
			vs[i + 2] *= scale;
		}
		// console.log("cubeVertexArray: ", cubeVertexArray);

		this.mFPS.initialize(null, false);

		const cfg = {
			alphaMode: "premultiplied"
		};
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization success ...");

			console.log("msaaRenderEnabled: ", this.msaaRenderEnabled);
			console.log("entitiesTotal: ", this.entitiesTotal);

			this.mipmapGenerator.initialize(this.mWGCtx.device);

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
				vertShaderSrc: { code: basicVertWGSL },
				fragShaderSrc: { code: sampleTextureMixColorWGSL },
				depthStencilEnabled: true,
				fragmentEnabled: true,
			});
			pipeParams.setVertexBufferArrayStrideAt(cubeVertexSize);

			this.createRenderGeometry();

			this.mRPipeline = this.createRenderPipeline(pipeParams);

			this.mRendererPass.initialize(ctx);
			this.mRendererPass.build(pipeParams);

			this.createMaterialTexture(ctx.device, this.msaaRenderEnabled).then(() => {
				console.log("webgpu texture res build success ...");
				this.createUniforms(this.mRPipeline, total);
				this.mEnabled = true;
			});
		});
	}

	private createRenderGeometry(): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;
		// Create a vertex buffer from the cube data.
		const verticesBuffer = device.createBuffer({
			size: cubeVertexArray.byteLength,
			usage: GPUBufferUsage.VERTEX,
			mappedAtCreation: true
		});
		new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
		verticesBuffer.unmap();
		this.mVerticesBuffer = verticesBuffer;
	}
	private createRenderPipeline(params: RPipelineParams): GPURenderPipeline {

		const ctx = this.mWGCtx;
		params.setVertexBufferArrayStrideAt(cubeVertexSize);
		params.addVertexBufferAttribute({
			// position
			shaderLocation: 0,
			offset: cubePositionOffset,
			format: "float32x4"
		});
		params.addVertexBufferAttribute({
			// uv
			shaderLocation: 1,
			offset: cubeUVOffset,
			format: "float32x2"
		});
		params.build(ctx.device);
		return this.mWGCtx.device.createRenderPipeline(params);
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

		const matrixSize = 4 * 16;		// 4x4 matrix
		const offsetRange = 256;		// uniformBindGroup offset must be 256-byte aligned
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
	private renderFrame(): void {

		const ctx = this.mWGCtx;
		if (ctx.enabled) {

			const device = ctx.device;
			const pipeline = this.mRPipeline;

			this.mRendererPass.runBegin();

			const passEncoder = this.mRendererPass.passEncoder;

			passEncoder.setPipeline(pipeline);
			passEncoder.setVertexBuffer(0, this.mVerticesBuffer);

			const uniformBuffer = this.mUniformBuffer;
			let entities = this.mEntities;
			let entitiesTotal = entities.length;
			for (let i = 0; i < entitiesTotal; ++i) {
				const et = entities[i];
				if (et.enabled) {
					const td = et.transData;
					device.queue.writeBuffer(uniformBuffer, i * 256, td.buffer, td.byteOffset, td.byteLength);
					passEncoder.setBindGroup(0, this.mUniformBindGroups[i]);
					passEncoder.draw(cubeVertexCount);
				}
			}

			const cmd = this.mRendererPass.runEnd();

			device.queue.submit([cmd]);
		}
	}

	private renderPreCalc(): void {
		const ctx = this.mWGCtx;
		if (ctx.enabled) {
			let entities = this.mEntities;
			let entitiesTotal = entities.length;
			for (let i = 0; i < entitiesTotal; ++i) {
				entities[i].run(this.mCam);
			}
		}
	}

	run(): void {
		if (this.mEnabled) {
			this.mFPS.update();
			this.renderPreCalc();
			this.renderFrame();
		}
	}
}
