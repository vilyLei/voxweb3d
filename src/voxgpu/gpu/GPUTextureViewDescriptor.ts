import { GPUVertexAttribute } from "./GPUVertexAttribute";
/**
 * see: https://gpuweb.github.io/gpuweb/#texture-view-creation
 *		https://developer.mozilla.org/en-US/docs/Web/API/GPUTexture/createView
 */
interface GPUTextureViewDescriptor {
	label?: string;

	/**
	 * The format of the texture view. Must be either the format of the texture or one of the viewFormats specified during its creation.
	 * see: https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
	 */
	format: string;
	/**
	 * The dimension to view the texture as.
	 * Possible values are(in GPUTextureViewDimension: https://gpuweb.github.io/gpuweb/#enumdef-gputextureviewdimension):
	 *		"1d","2d","2d-array","cube","cube-array","3d",
	 */
	dimension: string;
	/**
	 * Which aspect(s) of the texture are accessible to the texture view.
	 * The default value is "all".
	 * Possible values are(in GPUTextureAspect: https://gpuweb.github.io/gpuweb/#enumdef-gputextureaspect):
	 *		"all","stencil-only","depth-only",
	 */
	aspect?: string;

	/**
	 * The first (most detailed) mipmap level accessible to the texture view.
	 * The default value is 0.
	 */
	baseMipLevel?: number;
	/**
	 * How many mipmap levels, starting with baseMipLevel, are accessible to the texture view.
	 * A number defining how many mipmap levels are accessible to the view, starting with the baseMipLevel value.
	 * If mipLevelCount is omitted, it will be given a value of GPUTexture.mipLevelCount - baseMipLevel.
	 */
	mipLevelCount?: number;
	/**
	 * A number defining the index of the first array layer accessible to the view.
	 * If omitted, baseArrayLayer takes a value of 0.
	 */
	baseArrayLayer?: number;
	/**
	 * A number defining how many array layers are accessible to the view,
	 * starting with the baseArrayLayer value.
	 * If arrayLayerCount is omitted, it is given a value as follows:
	 * 		a. If dimension is "1d", "2d", or "3d", arrayLayerCount is 1.
	 * 		b. If dimension is "cube", arrayLayerCount is 6.
	 * 		c. If dimension is "2d-array", or "cube-array", arrayLayerCount is GPUTexture.depthOrArrayLayers - baseArrayLayer.
	 */
	arrayLayerCount?: number;
}
export { GPUTextureViewDescriptor };
