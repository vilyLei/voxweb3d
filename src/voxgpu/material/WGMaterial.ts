import { WGTextureWrapper, WGTexture } from "../texture/WGtexture";

import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, IWGRPipelineContext } from "../render/pipeline/IWGRPipelineContext";
import { WGMaterialDescripter } from "./WGMaterialDescripter";

class WGMaterial implements WGMaterialDescripter {

	private mRCtx: IWGRPipelineContext;
	/**
	 * unique shading process uuid
	 */
	shadinguuid = "base-material";

	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;

	readonly textures: { [key: string]: WGTextureWrapper } = {};

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
