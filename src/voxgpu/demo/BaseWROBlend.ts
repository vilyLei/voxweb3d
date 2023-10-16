import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUBuffer } from "../gpu/GPUBuffer";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import { WRORBlendScene } from "./entity/WRORBlendScene";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";

export class BaseWROBlend {
	private mRenderingFlag = 0;
	private mWGCtx = new WebGPUContext();
	private mFPS = new RenderStatusDisplay();

	private mRScene = new WRORBlendScene();

	constructor() {}

	initialize(): void {
		console.log("BaseWROBlend::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		this.mFPS.initialize(null, false);
		this.mRScene.wgCtx = this.mWGCtx;

		const cfg = {
			alphaMode: "premultiplied"
		};
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization success ...");
			this.mRScene.initialize(canvas);

			document.onmousedown = evt => {
				this.mRenderingFlag = 1;
				this.runDo();
			};
		});
	}

	private renderFrame(): void {
		const ctx = this.mWGCtx;
		if (ctx.enabled) {
			const device = ctx.device;

			this.mRScene.runBegin();

			const passEncoder = this.mRScene.rendererPass.passEncoder;

			// let vtxBuffer: GPUBuffer;
			let pipeline: GPURenderPipeline;
			let entities = this.mRScene.runits;
			let entitiesTotal = entities.length;
			for (let i = 0; i < entitiesTotal; ++i) {
				const ut = entities[i];
				if (ut.enabled) {
					if (pipeline != ut.pipeline) {
						pipeline = ut.pipeline;
						passEncoder.setPipeline(pipeline);
					}
					// if(vtxBuffer != ut.vtxBuffers[0]) {
					// 	vtxBuffer = ut.vtxBuffers[0];
					// 	passEncoder.setVertexBuffer(ut.bindIndex, vtxBuffer );
					// }

					for (let j = 0; j < ut.vtxBuffers.length; ++j) {
						passEncoder.setVertexBuffer(j, ut.vtxBuffers[j] );
					}

					const uf = ut.uniform;

					// if(!uf.vtxUniformBuffer) {
					// 	throw Error("uf.vtxUniformBuffer is invalid.");
					// }

					if (uf.isEnabled()) {
						passEncoder.setBindGroup(uf.groupIndex, uf.bindGroup);
						if (ut.brnData) {
							uf.updateData(ut.brnData, 1);
						}
						if (uf.upateFlag >= 2) {
							uf.updateData(ut.trans.transData);
						} else if (uf.upateFlag > 0) {
							uf.upateFlag = 0;
							uf.updateData(ut.trans.transData);
						}

						if(ut.indexBuffer) {

							passEncoder.setIndexBuffer( ut.indexBuffer, ut.indexBuffer.dataFormat );
							// passEncoder.drawIndexed( ut.indexVtxCount, 1 );
							// console.log("ut.indexBuffer.elementCount: ", ut.indexBuffer.elementCount);
							passEncoder.drawIndexed( ut.indexBuffer.elementCount, 1 );
						}else {
							passEncoder.draw(ut.vtCount);
						}
					}
				}
			}

			this.mRScene.runEnd();
			const cmd = this.mRScene.renderCommand;
			device.queue.submit([cmd]);
		}
	}

	run(): void {
		if (this.mRenderingFlag < 1) {
			this.runDo();
		}
	}
	private runDo(): void {
		if (this.mRScene.enabled) {
			this.mFPS.update();
			this.mRScene.update();
			this.renderFrame();
		}
	}
}
