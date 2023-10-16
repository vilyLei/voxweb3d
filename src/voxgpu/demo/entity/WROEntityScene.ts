import { GPUTexture } from "../../gpu/GPUTexture";
import { RPipelineModule } from "../pipeline/RPipelineModule";
import { WROEntity } from "./WROEntity";

import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset, cubeVertexCount } from "../mesh/cubeData";
import CameraBase from "../../../vox/view/CameraBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { RPipelineParams } from "../pipeline/RPipelineParams";

import basicVertWGSL from "../shaders/basic.vert.wgsl";
import sampleTextureMixColorWGSL from "../shaders/sampleTextureMixColor.frag.wgsl";
import vertexPositionColorWGSL from "../shaders/vertexPositionColor.frag.wgsl";

import { RRendererPass } from "../pipeline/RRendererPass";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";

class WROEntityScene {
	wgCtx: WebGPUContext | null = null;
	rendererPass = new RRendererPass();

	entities: WROEntity[] = [];
	verticesBuffer: GPUBuffer | null = null;
	enabled = true;
	camera: CameraBase | null;
	renderCommand: GPUCommandBuffer | null;

	generateMipmaps = true;
	msaaRenderEnabled = true;
	mEnabled = false;

	constructor() {}

	private initCamera(width: number, height: number): void {
		if (this.camera == null) {
			this.camera = new CameraBase();
		}
		const cam = this.camera;

		const camPosition = new Vector3D(1000.0, 1000.0, 1000.0);
		const camLookAtPos = new Vector3D(0.0, 0.0, 0.0);
		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		cam.lookAtRH(camPosition, camLookAtPos, camUpDirect);
		cam.setViewXY(0, 0);
		cam.setViewSize(width, height);

		cam.update();
	}
	initialize(canvas: HTMLCanvasElement): void {

		this.initCamera(canvas.width, canvas.height);

		console.log("msaaRenderEnabled: ", this.msaaRenderEnabled);

		let sampleCount = 4;
		let entitiesTotal = 1;
		// let texEnabled = false;

		this.rendererPass.initialize(this.wgCtx);
		this.rendererPass.build({
			sampleCount: sampleCount,
			multisampleEnabled: this.msaaRenderEnabled
		});

		this.createRenderGeometry();

		this.createRenderPipeline(sampleCount, entitiesTotal, false);
		this.createRenderPipeline(sampleCount, entitiesTotal, true);

		console.log("entitiesTotal: ", this.entities.length);
	}
	private createRenderPipeline(sampleCount: number, entitiesTotal: number, texEnabled = false): void {

		let pipeParams = new RPipelineParams({
			sampleCount: sampleCount,
			multisampleEnabled: this.msaaRenderEnabled,
			vertShaderSrc: { code: basicVertWGSL },
			fragShaderSrc: { code: texEnabled ? sampleTextureMixColorWGSL : vertexPositionColorWGSL },
			depthStencilEnabled: true,
			fragmentEnabled: true
		});
		pipeParams.setVertexBufferArrayStrideAt(cubeVertexSize);


		let pipelineModule = new RPipelineModule();
		pipelineModule.initialize( this.wgCtx );

		let vtxDescParam = {
			vertex: {
				size: cubeVertexSize,
				params: [
					{ offset: cubePositionOffset, format: "float32x4" },
					{ offset: cubeUVOffset, format: "float32x2" }
				]
			}
		};

		pipelineModule.createRenderPipeline(pipeParams, vtxDescParam);

		if (texEnabled) {
			pipelineModule.createMaterialTexture(this.msaaRenderEnabled).then((tex: GPUTexture) => {
				console.log("webgpu texture res build success, tex: ", tex);

				this.createEntities(pipelineModule, entitiesTotal, tex);
				this.mEnabled = true;
			});
		} else {
			this.createEntities(pipelineModule, entitiesTotal, null);
			this.mEnabled = true;
		}
	}
	private createRenderGeometry(): void {

		let scale = 100.0;
		const vs = cubeVertexArray;
		for (let i = 0; i < vs.length; i += 10) {
			vs[i] *= scale;
			vs[i + 1] *= scale;
			vs[i + 2] *= scale;
		}

		const ctx = this.wgCtx;
		const device = ctx.device;
		// Create a vertex buffer from the cube data.
		const verticesBuffer = device.createBuffer({
			size: cubeVertexArray.byteLength,
			usage: GPUBufferUsage.VERTEX,
			mappedAtCreation: true
		});

		new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
		verticesBuffer.unmap();
		this.verticesBuffer = verticesBuffer;
	}
	private createEntities(pipelineModule: RPipelineModule, total: number, tex: GPUTexture): void {

		const matrixSize = 4 * 16;		// 4x4 matrix
		const texView = tex ? tex.createView() : null;

		let uniformParams: {sizes: number[], usage: number} = {sizes: new Array(total), usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST};

		for (let i = 0; i < total; ++i) {
			uniformParams.sizes[i] = matrixSize;
		}
		let vtxUniformBuffer = pipelineModule.createUniformBufferBlock(uniformParams);

		let entities: WROEntity[] = new Array( total );

		for (let i = 0; i < total; ++i) {
			let entity = new WROEntity();
			entity.trans.scaleFactor *= 1.5;
			entity.trans.dataIndex = i;
			entity.trans.intialize(this.camera);
			entity.pipeline = pipelineModule.pipeline;
			entity.pipelineModule = pipelineModule;
			entity.vtxBuffer = this.verticesBuffer;
			entity.vtxUniformBuffer = vtxUniformBuffer;
			entity.vtCount = cubeVertexCount;
			entity.uniformBindGroup = pipelineModule.createUniformBindGroup(i, vtxUniformBuffer, matrixSize, texView);
			entities[i] = (entity);
			// console.log("entity.trans.posV: ", entity.trans.posV, ",tex != null: ", tex != null);
		}
		this.entities = this.entities.concat(entities);
		if (total == 1) {
			// this.entities[0].trans.scaleFactor = 1.0;
			// this.entities[0].trans.posV.setXYZ(0, 0, 0);
		}
	}
	runBegin(): void {
		this.rendererPass.runBegin();
	}
	runEnd(): void {
		this.renderCommand = this.rendererPass.runEnd();
	}
	update(): void {
		const ctx = this.wgCtx;
		if (ctx.enabled) {
			let entities = this.entities;
			let entitiesTotal = entities.length;
			for (let i = 0; i < entitiesTotal; ++i) {
				entities[i].trans.run(this.camera);
			}
		}
	}
}
export { WROEntityScene };
