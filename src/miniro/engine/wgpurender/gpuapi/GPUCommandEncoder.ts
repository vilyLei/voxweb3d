import { GPURenderPassDescriptor } from "./GPURenderPassDescriptor";
import { GPUComputePassDescriptor } from "./GPUComputePassDescriptor";
import { GPURenderPassEncoder } from "./GPURenderPassEncoder";
import { GPUComputePassEncoder } from "./GPUComputePassEncoder";
import { GPUCommandBuffer } from "./GPUCommandBuffer";
import { GPUBuffer } from "./GPUBuffer";
interface GPUCommandEncoder {
	label?: string;

	beginRenderPass(descriptor?: GPURenderPassDescriptor): GPURenderPassEncoder;
	beginComputePass(descriptor?: GPUComputePassDescriptor): GPUComputePassEncoder;
	finish(descriptor?: {label:string}): GPUCommandBuffer;
	clearBuffer(buffer: GPUBuffer, offset?: number, size?: number): void;
}
export { GPUCommandEncoder };
