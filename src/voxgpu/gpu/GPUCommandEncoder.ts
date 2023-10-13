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
	/**
	 * Begins encoding a render pass described by descriptor.
	 */
	beginRenderPass(descriptor?: GPURenderPassDescriptor): GPURenderPassEncoder;
	/**
	 * Begins encoding a compute pass described by descriptor.
	 */
	beginComputePass(descriptor?: GPUComputePassDescriptor): GPUComputePassEncoder;
	/**
	 * A GPUCommandBuffer containing the commands recorded by the GPUCommandEncoder can be created by calling finish().
	 * Once finish() has been called the command encoder can no longer be used.
	 * Completes recording of the commands sequence and returns a corresponding GPUCommandBuffer.
	 */
	finish(descriptor?: {label:string}): GPUCommandBuffer;
	/**
	 * Encode a command into the GPUCommandEncoder that fills a sub-region of a GPUBuffer with zeros.
	 */
	clearBuffer(buffer: GPUBuffer, offset?: number, size?: number): void;
	/**
	 * Encode a command into the GPUCommandEncoder that copies data from a sub-region of a GPUBuffer to a sub-region of another GPUBuffer.
	 */
	copyBufferToBuffer(source: GPUBuffer, sourceOffset: number, destination: GPUBuffer, destinationOffset: number, size: number): void;
	/**
	 * Encode a command into the GPUCommandEncoder that copies data from a sub-region of a GPUBuffer to 
	 * a sub-region of one or multiple continuous texture subresources.
	 * See: https://gpuweb.github.io/gpuweb/#dom-gpucommandencoder-copybuffertotexture
	 */
	copyBufferToTexture(source: GPUImageCopyBuffer, destination: GPUImageCopyTexture, copySize: GPUExtent3D): void;
	/**
	 * Encode a command into the GPUCommandEncoder that copies data from a sub-region of one or multiple continuous texture subresources 
	 * to a sub-region of a GPUBuffer.
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
