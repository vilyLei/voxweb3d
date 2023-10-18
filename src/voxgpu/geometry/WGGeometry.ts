import { GPUSampler } from "../gpu/GPUSampler";
import { GPUTexture } from "../gpu/GPUTexture";
import { GPUTextureView } from "../gpu/GPUTextureView";

class WGGeometry {
	name = "WGTexture";
	flipY = true;
	texture: GPUTexture;
	view: GPUTextureView;
}
class WGWGGeometryWrapper {

	shdTextureVarName = "";
	shdSamperVarName = "";

	bindGroupIndex = 0;

	// texture: WGTexture;
	sampler: GPUSampler;

}
export { WGWGGeometryWrapper, WGGeometry }
