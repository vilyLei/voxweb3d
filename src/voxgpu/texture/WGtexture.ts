import { GPUSampler } from "../gpu/GPUSampler";
import { GPUTexture } from "../gpu/GPUTexture";
import { GPUTextureView } from "../gpu/GPUTextureView";

interface WGTextureType {
	shdVarName: string;
	texture: GPUTexture;
	flipY?: boolean;
	name?:string;
}
interface WGTexSamplerType {
	shdVarName: string;
	sampler: GPUSampler;
	name?:string;
}
class WGTexture implements WGTextureType {
	name = "WGTexture";

	shdVarName = "";
	flipY = true;
	texture: GPUTexture;

	view?: GPUTextureView;
}
class WGTexSampler implements WGTexSamplerType {
	name = "WGTexture";

	shdVarName = "";
	sampler: GPUSampler;
}
class WGTextureWrapper {

	bindGroupIndex = 0;

	texture: WGTexture;
	sampler?: WGTexSampler;

	constructor(param: {texture: WGTextureType, sampler?: WGTexSamplerType }) {

		const tp = param.texture;
		this.texture = new WGTexture();
		const tex = this.texture as any;
		for (var k in tp) {
			tex[k] = (tp as any)[k];
		}

		// const tex = this.texture;
		// tex.shdVarName = tp.shdVarName;
		// tex.texture = tp.texture;
		// tex.flipY = tp.flipY === true;

		const sp = param.sampler;
		if(sp) {
			this.sampler = new WGTexSampler();
			const s = this.sampler as any;
			for (var k in sp) {
				s[k] = (sp as any)[k];
			}
		}
	}

}
export { WGTextureType, WGTexSamplerType, WGTextureWrapper, WGTexture }
