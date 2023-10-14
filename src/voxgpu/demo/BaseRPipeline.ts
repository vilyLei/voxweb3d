import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset, cubeVertexCount } from "./mesh/cubeData";

import basicVertWGSL from "./shaders/basic.vert.wgsl";
import sampleTextureMixColorWGSL from "./shaders/sampleTextureMixColor.frag.wgsl";

import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPUBindGroup } from "../gpu/GPUBindGroup";
import { GPUTexture } from "../gpu/GPUTexture";
import CameraBase from "../../vox/view/CameraBase";
import Vector3D from "../../vox/math/Vector3D";
import { TransEntity } from "./entity/TransEntity";

import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import { RPipelineParams } from "./pipeline/RPipelineParams";
import { RRendererPass } from "./pipeline/RRendererPass";
import { RPipelineModule } from "./pipeline/RPipelineModule";

class CubeEntity extends TransEntity { }
export class BaseRPipeline {

	private mWGCtx = new WebGPUContext();

	private mVerticesBuffer: GPUBuffer | null = null;
	private mUniformBuffer: GPUBuffer | null = null;
	private mUniformBindGroups: GPUBindGroup[] | null = null;
	private mCam = new CameraBase();
	private mEntities: CubeEntity[] = [];
	private mFPS = new RenderStatusDisplay();
	private mTexture: GPUTexture | null = null;
	private mEnabled = false;

	private mRendererPass = new RRendererPass();
	private mPipelineModule = new RPipelineModule();
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

			this.mPipelineModule.initialize( this.mWGCtx );

			let vtxDescParam = {vertex:{size: cubeVertexSize, params:[
				{offset: cubePositionOffset, format: "float32x4"},
				{offset: cubeUVOffset, format: "float32x2"}
			]}};
			
			this.mPipelineModule.createRenderPipeline( pipeParams,  vtxDescParam);

			this.mRendererPass.initialize(ctx);
			this.mRendererPass.build(pipeParams);

			this.mPipelineModule.createMaterialTexture(this.msaaRenderEnabled).then((tex: GPUTexture) => {
				this.mTexture = tex;
				console.log("webgpu texture res build success, tex: ", tex);
				this.createUniforms(this.mPipelineModule.pipeline, total);
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
	private createUniforms(pipeline: GPURenderPipeline, entitiesTotal: number): void {
		const ctx = this.mWGCtx;
		const device = ctx.device;

		const matrixSize = 4 * 16;		// 4x4 matrix
		const offsetRange = 256;		// uniformBindGroup offset must be 256-byte aligned
		const uniformBufferSize = offsetRange * (entitiesTotal - 1) + matrixSize;

		const uniformDesc = {
			size: uniformBufferSize,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		};
		// const uniformBuffer = device.createBuffer(uniformDesc);
		// this.mUniformBuffer = uniformBuffer;
		this.mUniformBuffer = this.mPipelineModule.createUniformBuffer( uniformDesc );

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
							buffer: this.mUniformBuffer,
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
			
			const pipeline = this.mPipelineModule.pipeline;

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
					this.mPipelineModule.updateUniformBufferAt( et.transData, i);
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
