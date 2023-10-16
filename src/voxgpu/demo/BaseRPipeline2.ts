import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset, cubeVertexCount } from "./mesh/cubeData";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUBuffer } from "../gpu/GPUBuffer";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import { RRendererPass } from "./pipeline/RRendererPass";
import { WROEntityScene } from "./entity/WROEntityScene";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";

export class BaseRPipeline2 {

	private mRenderingFlag = 0;
	private mWGCtx = new WebGPUContext();
	private mFPS = new RenderStatusDisplay();

	private mEntityScene = new WROEntityScene();

	constructor() { }

	initialize(): void {
		console.log("BaseRPipeline2::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		this.mFPS.initialize(null, false);
		this.mEntityScene.wgCtx = this.mWGCtx;
		// this.mEntityScene.rendererPass = this.mRendererPass;

		const cfg = {
			alphaMode: "premultiplied"
		};
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization success ...");
			this.mEntityScene.initialize( canvas );

			document.onmousedown = evt => {
				this.mRenderingFlag = 1;
				this.runDo();
			}
		});
	}

	private renderFrame(): void {

		const ctx = this.mWGCtx;
		if (ctx.enabled) {

			const device = ctx.device;

			this.mEntityScene.runBegin();

			const passEncoder = this.mEntityScene.rendererPass.passEncoder;

			let vtxBuffer: GPUBuffer;
			let pipeline: GPURenderPipeline;
			let entities = this.mEntityScene.entities;
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
					et.pipelineModule.updateUniformBufferAt(et.vtxUniformBuffer, et.trans.transData, et.trans.dataIndex);
					passEncoder.setBindGroup(et.bindIndex, et.uniformBindGroup);
					passEncoder.draw(et.vtCount);
				}
			}

			this.mEntityScene.runEnd();
			const cmd = this.mEntityScene.renderCommand;
			device.queue.submit([cmd]);
		}
	}


	run(): void {
		if(this.mRenderingFlag < 1) {
			this.runDo();
		}
	}
	private runDo(): void {
		if (this.mEntityScene.enabled) {
			this.mFPS.update();
			this.mEntityScene.update();
			this.renderFrame();
		}
	}
}
