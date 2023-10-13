interface TexSizeDescriptor {
	width?: number;
	height?: number;
	depthOrArrayLayers?: number;
}
type TexSizeDescType  =  TexSizeDescriptor | number[];
/**
 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createTexture
 * 		https://gpuweb.github.io/gpuweb/#gputexturedescriptor
 */
interface GPUTextureDescriptor {
	label?: string;

	/**
	 * An object or array specifying the width, height, and depth/array layer count of the texture.
	 * The width value must always be specified, while the height and depth/array layer count values are optional and will default to 1 if omitted.
	 * see: https://gpuweb.github.io/gpuweb/#typedefdef-gpuextent3d
	 *
	 * for example: [16, 16, 2] or { width: 16, height: 16, depthOrArrayLayers: 2 }
	 */
	size: TexSizeDescType;
	/**
	 * Whether the texture is one-dimensional, an array of two-dimensional layers, or three-dimensional.
	 * The default value is "2d".
	 * Possible values are(in GPUTextureDimension: https://gpuweb.github.io/gpuweb/#enumdef-gputexturedimension):
	 *		"1d","2d","3d",
	 */
	dimension?: string;

	/**
	 * The format of the texture view. Must be either the format of the texture or one of the viewFormats specified during its creation.
	 * see: https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
	 */
	format?: string;
	/**
	 * The allowed usages for the texture.
	 * In GPUTextureUsage: https://gpuweb.github.io/gpuweb/#typedefdef-gputextureusageflags
	 */
	usage?: number;
	/**
	 * the default value is 1.
	 */
	mipLevelCount?: number;
	/**
	 * the default value is 1.
	 */
	sampleCount?: number;
	/**
	 * An array of enumerated values specifying other texture formats permitted when calling GPUTexture.createView() on this texture,
	 * in addition to the texture format specified in its format value.
	 */
	viewFormats?: string[];
}
export { TexSizeDescriptor, GPUTextureDescriptor };
