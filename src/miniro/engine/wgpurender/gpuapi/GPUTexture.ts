import { GPUTextureView } from "./GPUTextureView";

interface GPUTexture {
	label?: string;

	depthOrArrayLayers: number;
	/**
	 * "1d", "2d", "3d"
	 */
	dimension: string;
	/**
	 * see: https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
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
	 * see: 
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

	createView(): GPUTextureView;
	destroy(): void;
}
export { GPUTexture };
