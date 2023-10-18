import { GPUSampler } from "../gpu/GPUSampler";
import { GPUTexture } from "../gpu/GPUTexture";
import { GPUTextureView } from "../gpu/GPUTextureView";

class WGTexture {
	name = "WGTexture";
	flipY = true;
	texture: GPUTexture;
	view: GPUTextureView;
}
class WGTextureWrapper {

	shdTextureVarName = "";
	shdSamperVarName = "";

	bindGroupIndex = 0;

	texture: WGTexture;
	sampler: GPUSampler;

}
export { WGTextureWrapper, WGTexture }
