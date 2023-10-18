import { WGRPassParams, WGRendererPass } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { WGRUnit } from "./WGRUnit";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { WGRGeometry } from "./WGRGeometry";
import { WGMaterialDescripter } from "../material/WGMaterialDescripter";

class WGRenderPassBlock {
	private mPipelineCtxs: WGRPipelineContext[] = [];
	private mUnits: WGRUnit[] = [];
	private mWGCtx: WebGPUContext | null;
	private rendererPass = new WGRendererPass();

	enabled = true;
	rcommands: GPUCommandBuffer[];
	constructor(wgCtx?: WebGPUContext, param?: WGRPassParams) {
		this.initialize(wgCtx, param);
	}
	initialize(wgCtx: WebGPUContext, param?: WGRPassParams): void {
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			this.rendererPass.initialize(wgCtx);
			this.rendererPass.build(param);
		}
	}
	createRUnit(
		geom?: WGRGeometry,
		geomParam?: { indexBuffer?: GPUBuffer; vertexBuffers: GPUBuffer[]; indexCount?: number; vertexCount?: number },
		addIntoRendering = true
	): WGRUnit {
		const u = new WGRUnit();
		u.geometry = geom;
		if (geomParam) {
			u.geometry = new WGRGeometry();
			const g = u.geometry;
			g.ibuf = geomParam.indexBuffer;
			g.vbufs = geomParam.vertexBuffers;
			if (geomParam.indexCount) {
				g.indexCount = geomParam.indexCount;
			}
			if (geomParam.vertexCount) {
				g.vertexCount = geomParam.vertexCount;
			}
		}
		if (addIntoRendering) {
			this.mUnits.push(u);
		}
		return u;
	}

	createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): WGRPipelineContext {
		return this.createRenderPipelineCtx(material.shaderCodeSrc, material.pipelineVtxParam, material.pipelineDefParam);
	}
	// pipelineParam value likes {blendMode: "transparent", depthWriteEnabled: false, faceCullMode: "back"}
	createRenderPipelineCtx(
		shdSrc: WGRShderSrcType,
		pipelineVtxParam: VtxPipelinDescParam,
		pipelineParam?: WGRPipelineContextDefParam
	): WGRPipelineContext {
		const pipeParams = new WGRPipelineCtxParams({
			vertShaderSrc: shdSrc.vertShaderSrc,
			fragShaderSrc: shdSrc.fragShaderSrc,
			depthStencilEnabled: pipelineParam ? (pipelineParam.depthStencilEnabled === false ? false : true) : true
		});
		if (pipelineParam) {
			if (pipelineParam.blendMode === "transparent") {
				pipeParams.setTransparentBlendParam(0);
			}
			pipeParams.setDepthWriteEnabled(pipelineParam.depthWriteEnabled === true);
			pipeParams.setCullMode(pipelineParam.faceCullMode);
		}

		return this.createRenderPipeline(pipeParams, pipelineVtxParam);
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams, vtxDesc: VtxPipelinDescParam): WGRPipelineContext {
		let pipelineCtx = new WGRPipelineContext(this.mWGCtx);
		this.mPipelineCtxs.push(pipelineCtx);
		pipelineParams.setDepthStencilFormat(this.rendererPass.depthTexture.format);

		let passParam = this.rendererPass.getPassParams();
		if (passParam.multisampleEnabled) {
			pipelineParams.multisample = {
				count: passParam.sampleCount
			};
		}

		pipelineCtx.createRenderPipelineWithBuf(pipelineParams, vtxDesc);
		return pipelineCtx;
	}

	runBegin(): void {
		this.rcommands = [];
		if (this.enabled) {
			this.rendererPass.runBegin();
			for (let i = 0; i < this.mPipelineCtxs.length; ++i) {
				this.mPipelineCtxs[i].runBegin();
			}
		}
	}
	runEnd(): void {
		if (this.enabled) {
			for (let i = 0; i < this.mPipelineCtxs.length; ++i) {
				this.mPipelineCtxs[i].runEnd();
			}
			this.rcommands = [this.rendererPass.runEnd()];
		}
	}
	run(): void {
		if (this.enabled) {
			const passEncoder = this.rendererPass.passEncoder;
			const uts = this.mUnits;
			const utsLen = uts.length;
			for (let i = 0; i < utsLen; ++i) {
				const ru = uts[i];
				if (ru.enabled) {
					ru.runBegin(passEncoder);
					ru.run(passEncoder);
				}
			}
		}
	}
	destroy(): void {
		if (this.mWGCtx) {
			this.mWGCtx = null;
		}
	}
}
export { WGRPipelineContextDefParam, WGRPassParams, WGRenderPassBlock };
