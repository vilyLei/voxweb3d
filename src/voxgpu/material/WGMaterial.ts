import { WGTextureWrapper, WGTexture } from "../texture/WGTexture";

import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, IWGRPipelineContext } from "../render/pipeline/IWGRPipelineContext";
import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { WGRUniform } from "../render/uniform/WGRUniform";

class WGMaterial implements WGMaterialDescripter {

	private mRCtx: IWGRPipelineContext;
	/**
	 * unique shading process uuid
	 */
	shadinguuid = "base-material";

	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;

	uniforms: WGRUniform[];

	// readonly textures: { [key: string]: WGTextureWrapper } = {};
	readonly textures: WGTextureWrapper[];

	constructor(descriptor?: WGMaterialDescripter) {
		this.setDescriptor(descriptor);
	}

	getRCtx(): IWGRPipelineContext {
		return this.mRCtx;
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		if (descriptor) {
			this.shadinguuid = descriptor.shadinguuid;
			this.shaderCodeSrc = descriptor.shaderCodeSrc;
			this.pipelineVtxParam = descriptor.pipelineVtxParam;
			this.pipelineDefParam = descriptor.pipelineDefParam;
		}
	}
	initialize(pipelineCtx: IWGRPipelineContext): void {
		if (!this.mRCtx) {
			if (!pipelineCtx) {
				throw Error("pipelineCtx is undefined.");
			}
			this.mRCtx = pipelineCtx;
		}
	}
	copyfrom(src: WGMaterial): WGMaterial {
		return this;
	}
}
export { WGMaterial };
