import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset, cubeVertexCount } from "./mesh/cubeData";

import basicVertWGSL from "./shaders/basic.vert.wgsl";
import sampleTextureMixColorWGSL from "./shaders/sampleTextureMixColor.frag.wgsl";
import vertexPositionColorWGSL from "./shaders/vertexPositionColor.frag.wgsl";

import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPUTexture } from "../gpu/GPUTexture";
import CameraBase from "../../vox/view/CameraBase";
import Vector3D from "../../vox/math/Vector3D";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import { RPipelineParams } from "./pipeline/RPipelineParams";
import { RRendererPass } from "./pipeline/RRendererPass";
import { RPipelineModule } from "./pipeline/RPipelineModule";
import { WROEntity } from "./entity/WROEntity";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";

export class BaseRPipeline {

	private mWGCtx = new WebGPUContext();

	private mVerticesBuffer: GPUBuffer | null = null;
	private mCam = new CameraBase();
	private mEntities: WROEntity[] = [];
	private mFPS = new RenderStatusDisplay();
	private mEnabled = false;

	private mRendererPass = new RRendererPass();
	generateMipmaps = true;
	msaaRenderEnabled = true;
	entitiesTotal = 3;

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

			let sampleCount = 4;

			let total = this.entitiesTotal;

			let texEnabled = false;
			let pipeParams = new RPipelineParams({
				sampleCount: sampleCount,
				multisampleEnabled: this.msaaRenderEnabled,
				vertShaderSrc: { code: basicVertWGSL },
				fragShaderSrc: { code: texEnabled ? sampleTextureMixColorWGSL : vertexPositionColorWGSL },
				depthStencilEnabled: true,
				fragmentEnabled: true,
			});
			pipeParams.setVertexBufferArrayStrideAt(cubeVertexSize);

			this.createRenderGeometry();

			let pipelineModule = new RPipelineModule();
			pipelineModule.initialize(this.mWGCtx);

			let vtxDescParam = {
				vertex: {
					size: cubeVertexSize, params: [
						{ offset: cubePositionOffset, format: "float32x4" },
						{ offset: cubeUVOffset, format: "float32x2" }
					]
				}
			};

			pipelineModule.createRenderPipeline(pipeParams, vtxDescParam);

			this.mRendererPass.initialize(ctx);
			this.mRendererPass.build( {
				sampleCount: sampleCount,
				multisampleEnabled: this.msaaRenderEnabled
			});
			if(texEnabled) {

				pipelineModule.createMaterialTexture(this.msaaRenderEnabled).then((tex: GPUTexture) => {
					console.log("webgpu texture res build success, tex: ", tex);
					
					this.createEntities(pipelineModule, total, tex);
					this.mEnabled = true;
				});
			}else {
				this.createEntities( pipelineModule, total, null );
				this.mEnabled = true;
			}
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


	private createEntities(pipelineModule: RPipelineModule, total: number, tex: GPUTexture): void {

		const matrixSize = 4 * 16;		// 4x4 matrix
		const offsetRange = 256;		// uniformBindGroup offset must be 256-byte aligned
		const uniformBufferSize = offsetRange * (total - 1) + matrixSize;

		const uniformDesc = {
			size: uniformBufferSize,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		};
		pipelineModule.createUniformBuffer(uniformDesc);
		const texView = tex ? tex.createView() : null;

		for (let i = 0; i < total; ++i) {
			let entity = new WROEntity();
			entity.trans.scaleFactor *= 1.5;
			entity.trans.dataIndex = i;
			entity.trans.intialize(this.mCam);
			entity.pipeline = pipelineModule.pipeline;
			entity.pipelineModule = pipelineModule;
			entity.vtxBuffer = this.mVerticesBuffer;
			entity.vtCount = cubeVertexCount;
			entity.uniformBindGroup = pipelineModule.createUniformBindGroup(i, matrixSize, texView);
			this.mEntities.push(entity);
		}
		if (total == 1) {
			this.mEntities[0].trans.scaleFactor = 1.0;
			this.mEntities[0].trans.posV.setXYZ(0, 0, 0);
		}
	}
	private renderFrame(): void {

		const ctx = this.mWGCtx;
		if (ctx.enabled) {

			const device = ctx.device;

			this.mRendererPass.runBegin();

			const passEncoder = this.mRendererPass.passEncoder;

			let vtxBuffer: GPUBuffer;
			let pipeline: GPURenderPipeline;
			let entities = this.mEntities;
			let entitiesTotal = entities.length;
			for (let i = 0; i < entitiesTotal; ++i) {
				const et = entities[i];
				if (et.enabled) {
					if(pipeline != et.pipeline) {
						pipeline = et.pipeline;
						passEncoder.setPipeline( pipeline );
					}
					if(vtxBuffer != et.vtxBuffer) {
						vtxBuffer = et.vtxBuffer;
						passEncoder.setVertexBuffer(et.bindIndex, vtxBuffer );
					}
					et.pipelineModule.updateUniformBufferAt(et.trans.transData, et.trans.dataIndex);
					passEncoder.setBindGroup(et.bindIndex, et.uniformBindGroup);
					passEncoder.draw(et.vtCount);
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
				entities[i].trans.run(this.mCam);
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
