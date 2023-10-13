import { GPUBuffer } from "./GPUBuffer";
import { GPUTexture } from "./GPUTexture";
import { GPUCommandBuffer } from "./GPUCommandBuffer";
import { GPUImageCopyTexture } from "./GPUImageCopyTexture";

type SrcType = {source: ImageBitmap | HTMLVideoElement | HTMLCanvasElement, origin?:number[] | {x: number, y: number}, flipY?: boolean};
type DstType = {texture: GPUTexture, premultipliedAlpha?:boolean, origin?:number[] | {x: number, y: number}, mipLevel?: number, colorSpace?: string, aspect?: string};
type SizeType = {width:number, height: number, depthOrArrayLayers?: number} | number[];
/**
 * See: https://gpuweb.github.io/gpuweb/#dictdef-gpuimagedatalayout
 * An object that defines the layout of the content contained in data
 */
 interface GPUImageDataLayout {
	/**
	 * The offset, in bytes, from the beginning of data to the start of the image data to be copied.
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
	 * The number of block rows per single image of the texture.
	 * bytesPerRow × rowsPerImage will give you the stride, in bytes,
	 * between the start of each complete image.
	 * This is required if there are multiple images to copy.
	 */
    rowsPerImage?: number;
 }
interface GPUQueue {
	/**
	 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/copyExternalImageToTexture
	 */
	copyExternalImageToTexture(source: SrcType, destination: DstType, copySize: SizeType): void;
	writeBuffer(buffer: GPUBuffer, bufferOffset: number, data: ArrayBuffer | DataView, dataOffset?: number, size?: number): void;
	/**
	 * This is a convenience function,
	 * which provides an alternative to setting texture data via buffer mapping and buffer-to-texture copies.
	 * It lets the user agent determine the most efficient way to copy the data over.
	 * For example: device.queue.writeTexture({ texture }, data, {}, { width: 1, height: 1 });
	 * See: https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/writeTexture
	 * 		https://gpuweb.github.io/gpuweb/#dom-gpuqueue-writetexture
	 */
	writeTexture(destination: GPUImageCopyTexture, data: ArrayBuffer | DataView, dataLayout: GPUImageDataLayout, size: number): void;
	submit(cmds: GPUCommandBuffer[]): void;
	onSubmittedWorkDone(): void;
}
export { GPUQueue };
