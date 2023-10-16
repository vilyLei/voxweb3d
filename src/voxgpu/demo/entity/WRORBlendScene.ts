import { GPUTexture } from "../../gpu/GPUTexture";
import { WROPipelineContext } from "../pipeline/WROPipelineContext";
import { WRORUnit } from "./WRORUnit";

import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset, cubeVertexCount } from "../mesh/cubeData";
import CameraBase from "../../../vox/view/CameraBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { RPipelineParams } from "../pipeline/RPipelineParams";

import basicVertWGSL from "../shaders/basic.vert.wgsl";
import sampleTextureMixColorWGSL from "../shaders/sampleTextureMixColor.frag.wgsl";
import sampleTextureMixColorBrnWGSL from "../shaders/sampleTextureMixColorBrn.frag.wgsl";
import vertexPositionColorWGSL from "../shaders/vertexPositionColor.frag.wgsl";
import vertexPositionColorBrnWGSL from "../shaders/vertexPositionColorBrn.frag.wgsl";

import { RRendererPass } from "../pipeline/RRendererPass";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { WROBufferContext } from "../pipeline/WROBufferContext";
import { WROTextureContext } from "../pipeline/WROTextureContext";
import { GPUTextureView } from "../../gpu/GPUTextureView";

class WRORBlendScene {
	private mPipelineCtxs: WROPipelineContext[] = [];
	private mVtxBufs: GPUBuffer[] | null = null;
	private mIndexBuf: GPUBuffer | null = null;
	private mIndices: (Uint16Array | Uint32Array) | null = null;

	readonly vtxCtx = new WROBufferContext();
	readonly texCtx = new WROTextureContext();

	wgCtx: WebGPUContext | null = null;
	rendererPass = new RRendererPass();

	runits: WRORUnit[] = [];
	enabled = true;
	camera: CameraBase | null = null;
	renderCommand: GPUCommandBuffer | null = null;

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

		this.vtxCtx.initialize(this.wgCtx);
		this.texCtx.initialize(this.wgCtx);

		this.rendererPass.initialize(this.wgCtx);
		this.rendererPass.build({
			sampleCount: sampleCount,
			multisampleEnabled: this.msaaRenderEnabled
		});

		let shapePipeline = this.createRenderPipeline(sampleCount);
		let shapeBrnPipeline = this.createRenderPipeline(sampleCount, false, true);
		let texPipeline = this.createRenderPipeline(sampleCount, true);
		let texBrnPipeline = this.createRenderPipeline(sampleCount, true, true);

		this.createRenderGeometry();

		let urls: string[] = ["static/assets/box.jpg", "static/assets/default.jpg", "static/assets/decorativePattern_01.jpg"];

		this.buildTextures(urls, (texs: GPUTexture[]): void => {
			
			this.createEntities("shapeUniform", shapePipeline, 3);

			// /*
			this.createEntities("shapeUniform", shapePipeline, 3);
			this.createEntities("shapeBrnUniform", shapeBrnPipeline, 3, null, true);

			let texViews: GPUTextureView[] = [];
			for (let i = 0; i < texs.length; ++i) {
				const tex = texs[i];
				const texView = tex ? tex.createView() : null;
				if (texView) {
					texView.label = "(view)" + tex.label;
					texViews.push(texView);
				}
			}

			for (let i = 0; i < 5; ++i) {
				this.createEntities("texBrnUniform", texBrnPipeline, 1, texViews[Math.round(Math.random() * (texViews.length - 1))], true);
			}
			for (let i = 0; i < 2; ++i) {
				this.createEntities("texUniform", texPipeline, 1, texViews[Math.round(Math.random() * (texViews.length - 1))]);
			}
			this.createEntities("shapeUniform", shapePipeline, 2);
			//*/

			console.log("runitsTotal: ", this.runits.length);
			this.mEnabled = true;
		});
	}
	private buildTextures(urls: string[], callback: (texs: GPUTexture[]) => void, mipmap: boolean = true): void {
		if (urls && urls.length > 0) {
			let texs: GPUTexture[] = [];
			let total = urls.length;
			for (let i = 0; i < urls.length; ++i) {
				this.texCtx.createMaterialTexture(mipmap, urls[i]).then((tex: GPUTexture) => {
					tex.label = urls[i];
					texs.push(tex);
					total--;
					if (total < 1) {
						if (callback) {
							callback(texs);
						}
					}
				});
			}
		} else {
			this.texCtx.createMaterialTexture(true).then((tex: GPUTexture) => {
				// console.log("webgpu texture res build success, tex: ", tex);
				if (callback) {
					callback([tex]);
				}
			});
		}
	}
	private getFragShdCode(texEnabled = false, brnEnabled: boolean = false): string {
		const shapeCode = brnEnabled ? vertexPositionColorBrnWGSL : vertexPositionColorWGSL;
		const texCode = brnEnabled ? sampleTextureMixColorBrnWGSL : sampleTextureMixColorWGSL;
		let code = texEnabled ? texCode : shapeCode;
		return code;
	}
	private mCombinedBuf = false;
	private createRenderPipeline(sampleCount: number, texEnabled = false, brnEnabled: boolean = false): WROPipelineContext {
		let pipeParams = new RPipelineParams({
			sampleCount: sampleCount,
			multisampleEnabled: this.msaaRenderEnabled,
			vertShaderSrc: { code: basicVertWGSL },
			fragShaderSrc: { code: this.getFragShdCode(texEnabled, brnEnabled) },
			depthStencilEnabled: true,
			fragmentEnabled: true
		});

		let pipelineCtx = new WROPipelineContext();
		pipelineCtx.initialize(this.wgCtx);

		this.mPipelineCtxs.push(pipelineCtx);
		if (this.mCombinedBuf) {
			let vtxDescParams = [
				{
					vertex: {
						size: cubeVertexSize,
						params: [
							{ offset: cubePositionOffset, format: "float32x4" },
							{ offset: cubeUVOffset, format: "float32x2" }
						]
					}
				}
			];
			pipelineCtx.createRenderPipeline(pipeParams, vtxDescParams);
		} else {
			let vtxDescParams = [
				{
					vertex: {
						size: 4 * 4,
						params: [{ offset: 0, format: "float32x4" }]
					}
				},
				{
					vertex: {
						size: 4 * 2,
						params: [{ offset: 0, format: "float32x2" }]
					}
				}
			];
			pipelineCtx.createRenderPipeline(pipeParams, vtxDescParams);
		}

		return pipelineCtx;
	}
	private createRenderGeometry(): void {

		let scale = 100.0;
		const dvs = cubeVertexArray;
		let vtxTotal = 0;

		for (let i = 0; i < dvs.length; i += 10) {
			vtxTotal++;
		}
		
		this.mIndices = this.vtxCtx.createIndicesWithSize( vtxTotal );
		for (let i = 0; i < vtxTotal; ++i) {
			this.mIndices[i] = i;
		}
		this.mIndexBuf = this.vtxCtx.createIndexBuffer( this.mIndices );

		console.log("vtxTotal: ", vtxTotal);
		let vs = new Float32Array(vtxTotal * 4);
		let cvs = new Float32Array(vtxTotal * 4);
		let uvs = new Float32Array(vtxTotal * 2);
		let vsi = 0;
		let cvsi = 0;
		let uvsi = 0;
		for (let i = 0; i < dvs.length; i += 10) {
			dvs[i] *= scale;
			dvs[i + 1] *= scale;
			dvs[i + 2] *= scale;

			vs[vsi] = dvs[i];
			vs[vsi + 1] = dvs[i + 1];
			vs[vsi + 2] = dvs[i + 2];
			vs[vsi + 3] = dvs[i + 3];

			cvs[cvsi] = dvs[i + 4];
			cvs[cvsi + 1] = dvs[i + 5];
			cvs[cvsi + 2] = dvs[i + 6];
			cvs[cvsi + 3] = dvs[i + 7];

			uvs[uvsi] = dvs[i + 8];
			uvs[uvsi + 1] = dvs[i + 9];

			vsi += 4;
			cvsi += 4;
			uvsi += 2;
		}

		if (this.mCombinedBuf) {
			let buf = this.vtxCtx.createVertexBuffer(dvs);
			this.mVtxBufs = [buf];
		} else {
			// console.log("vs: ", vs);
			// console.log("uvs: ", uvs);
			let vsBuf = this.vtxCtx.createVertexBuffer(vs);
			let uvsBuf = this.vtxCtx.createVertexBuffer(uvs);
			this.mVtxBufs = [vsBuf, uvsBuf];
		}
	}
	private createEntities(
		uniformLayoutName: string,
		pipelineCtx: WROPipelineContext,
		total: number,
		texView?: GPUTextureView,
		brnEnabled = false
	): void {
		const matrixSize = 4 * 16;	// 4x4 matrix
		const brnSize = 4 * 4;		// 4x4 matrix
		const uniformUsage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;

		for (let i = 0; i < total; ++i) {
			const unit = new WRORUnit();
			unit.trans.scaleFactor *= 1.5;
			unit.trans.intialize(this.camera);
			unit.pipeline = pipelineCtx.pipeline;
			unit.pipelineCtx = pipelineCtx;
			unit.vtxBuffers = this.mVtxBufs;
			unit.vtCount = cubeVertexCount;
			unit.indexBuffer = this.mIndexBuf;

			if (brnEnabled) {
				unit.brnData = new Float32Array([Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5, 1]);
				unit.uniform = pipelineCtx.uniform.createUniform(
					uniformLayoutName,
					0,
					[
						{ size: matrixSize, usage: uniformUsage },
						{ size: brnSize, usage: uniformUsage }
					],
					[{ texView: texView }]
				);
			} else {
				unit.uniform = pipelineCtx.uniform.createUniform(
					uniformLayoutName,
					0,
					[{ size: matrixSize, usage: uniformUsage }],
					[{ texView: texView }]
				);
			}
			this.runits.push(unit);
		}
		if (total == 1) {
			this.runits[0].trans.scaleFactor = 1.0;
			this.runits[0].trans.posV.setXYZ(0, 0, 0);
		}
	}
	runBegin(): void {
		this.rendererPass.runBegin();
		for (let i = 0; i < this.mPipelineCtxs.length; ++i) {
			this.mPipelineCtxs[i].runBegin();
		}
	}
	runEnd(): void {
		for (let i = 0; i < this.mPipelineCtxs.length; ++i) {
			this.mPipelineCtxs[i].runEnd();
		}
		this.renderCommand = this.rendererPass.runEnd();
	}
	update(): void {
		const ctx = this.wgCtx;
		if (ctx.enabled) {
			let units = this.runits;
			let unitsTotal = units.length;
			for (let i = 0; i < unitsTotal; ++i) {
				units[i].trans.run(this.camera);
			}
		}
	}
}
export { WRORBlendScene };
