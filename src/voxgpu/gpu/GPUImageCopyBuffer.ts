import { GPUBuffer } from "./GPUBuffer";
/**
 * See: https://gpuweb.github.io/gpuweb/#dictdef-gpuimagecopybuffer
 * 		https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/copyTextureToBuffer
 */
interface GPUImageCopyBuffer {
	label?: string;
	buffer: GPUBuffer;
	/**
	 * The offset, in bytes, from the beginning of data to the start position to write the copied data to.
	 * If omitted, offset defaults to 0.
	 */
	offset?: number;
	/**
	 * A number representing the stride, in bytes,
	 * between the start of each block row (i.e. a row of complete texel blocks) and the subsequent block row.
	 * This is required if there are multiple block rows (i.e. the copy height or depth is more than one block).
	 */
	bytesPerRow?: number;
	/**
	 * The number of block rows per single image inside the data.
	 * bytesPerRow × rowsPerImage will give you the stride, in bytes, between the start of each complete image.
	 * This is required if there are multiple images to copy.
	 */
	rowsPerImage?: number;
}
export { GPUImageCopyBuffer };
