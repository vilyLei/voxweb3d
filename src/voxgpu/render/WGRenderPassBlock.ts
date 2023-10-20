import { WGRPassParams, WGRendererPass } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { IWGRUnit } from "./IWGRUnit";
import { WGRUnit } from "./WGRUnit";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGMaterialDescripter } from "../material/WGMaterialDescripter";

class WGRenderPassBlock {
	private mWGCtx: WebGPUContext;
	private mPipelineCtxs: WGRPipelineContext[] = [];
	private mUnits: IWGRUnit[] = [];
	private rendererPass = new WGRendererPass();

	enabled = true;
	rcommands: GPUCommandBuffer[];
	constructor(wgCtx?: WebGPUContext, param?: WGRPassParams) {
		this.initialize(wgCtx, param);
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	initialize(wgCtx: WebGPUContext, param?: WGRPassParams): void {
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			this.rendererPass.initialize(wgCtx);
			this.rendererPass.build(param);
		}
	}
	addRUnit(unit: IWGRUnit): void {
		/**
		 * 正式加入渲染器之前，对shader等的分析已经做好了
		 */
		if(unit) {
			this.mUnits.push(unit);
		}
	}
	/**
	 * for test
	 */
	createRUnit(
		p?: WGRPrimitive,
		geomParam?: { indexBuffer?: GPUBuffer; vertexBuffers: GPUBuffer[]; indexCount?: number; vertexCount?: number },
		addIntoRendering = true
	): WGRUnit {
		const u = new WGRUnit();
		u.geometry = p;
		if (geomParam) {
			u.geometry = new WGRPrimitive();
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
		const plp = pipelineParam;
		const pipeParams = new WGRPipelineCtxParams({
			vertShaderSrc: shdSrc.vertShaderSrc,
			fragShaderSrc: shdSrc.fragShaderSrc,
			depthStencilEnabled: plp ? (plp.depthStencilEnabled === false ? false : true) : true
		});
		if (plp) {
			if (plp.blendMode === "transparent") {
				pipeParams.setTransparentBlendParam(0);
			}
			if(plp.depthStencil) {
				pipeParams.setDepthStencil( plp.depthStencil );
			}else {
				pipeParams.setDepthWriteEnabled(plp.depthWriteEnabled === true);
			}
			pipeParams.setPrimitiveState(plp.primitiveState ? plp.primitiveState : {cullMode: plp.faceCullMode});
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
			const rc = this.rendererPass.passEncoder;
			const uts = this.mUnits;
			const utsLen = uts.length;
			for (let i = 0; i < utsLen; ++i) {
				const ru = uts[i];
				if (ru.enabled) {
					if(ru.passes) {
						const ls = ru.passes;
						// console.log("multi passes total", ls.length);
						for(let i = 0, ln = ls.length;i < ln; ++i) {
							ls[i].runBegin(rc);
							ls[i].run(rc);
						}
					}else {
						// console.log("single passes ...");
						ru.runBegin(rc);
						ru.run(rc);
					}
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
