import { GPUTextureView } from "./GPUTextureView";
import { GPUTextureViewDescriptor } from "./GPUTextureViewDescriptor";

interface GPUTexture {
	label?: string;

	depthOrArrayLayers: number;
	/**
	 * "1d", "2d", "3d"
	 */
	dimension: string;
	/**
	 * In GPUTextureFormat: https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
	 */
	format: string;

	/**
	 * A number representing the width of the GPUTexture in pixels
	 */
	width: number;
	/**
	 * A number representing the height of the GPUTexture in pixels
	 */
	height: number;
	/**
	 * The bitwise flags representing the allowed usages of the GPUTexture
	 * In GPUTextureUsage: https://gpuweb.github.io/gpuweb/#typedefdef-gputextureusageflags
	 */
	usage: number;
	/**
	 * A number representing the number of mip levels of the GPUTexture
	 */
	mipLevelCount: number;
	/**
	 * A number representing the sample count of the GPUTexture
	 */
	sampleCount: number;

	createView(descriptor?: GPUTextureViewDescriptor): GPUTextureView;
	destroy(): void;
}
export { GPUTexture };
