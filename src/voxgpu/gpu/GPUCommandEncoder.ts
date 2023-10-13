import { GPURenderPassDescriptor } from "./GPURenderPassDescriptor";
import { GPUComputePassDescriptor } from "./GPUComputePassDescriptor";
import { GPURenderPassEncoder } from "./GPURenderPassEncoder";
import { GPUComputePassEncoder } from "./GPUComputePassEncoder";
import { GPUCommandBuffer } from "./GPUCommandBuffer";
import { GPUBuffer } from "./GPUBuffer";
import { GPUImageCopyBuffer } from "./GPUImageCopyBuffer";
import { GPUImageCopyTexture } from "./GPUImageCopyTexture";
import { GPUExtent3D } from "./GPUExtent3D";
interface GPUCommandEncoder {
	label?: string;

	beginRenderPass(descriptor?: GPURenderPassDescriptor): GPURenderPassEncoder;
	beginComputePass(descriptor?: GPUComputePassDescriptor): GPUComputePassEncoder;
	finish(descriptor?: {label:string}): GPUCommandBuffer;
	clearBuffer(buffer: GPUBuffer, offset?: number, size?: number): void;
	copyBufferToBuffer(source: GPUBuffer, sourceOffset: number, destination: GPUBuffer, destinationOffset: number, size: number): void;
	/**
	 * See: https://gpuweb.github.io/gpuweb/#dom-gpucommandencoder-copybuffertotexture
	 */
	copyBufferToTexture(source: GPUImageCopyBuffer, destination: GPUImageCopyTexture, copySize: GPUExtent3D): void;
	/**
	 * See: https://gpuweb.github.io/gpuweb/#dom-gpucommandencoder-copytexturetobuffer
	 */
	copyTextureToBuffer(source: GPUImageCopyTexture, destination: GPUImageCopyBuffer, copySize: GPUExtent3D): void;
	/**
	 * Encode a command into the GPUCommandEncoder that copies data from a sub-region of one or multiple contiguous texture subresources 
	 * to another sub-region of one or multiple continuous texture subresources.
	 * See: https://gpuweb.github.io/gpuweb/#dom-gpucommandencoder-copytexturetotexture
	 */
	 copyTextureToTexture(source: GPUImageCopyTexture, destination: GPUImageCopyTexture, copySize: GPUExtent3D): void;
}
export { GPUCommandEncoder };
