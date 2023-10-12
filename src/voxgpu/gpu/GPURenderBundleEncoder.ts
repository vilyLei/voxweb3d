import { GPUBuffer } from "./GPUBuffer";
import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPUBindGroup } from "./GPUBindGroup";
import { GPURenderBundle } from "./GPURenderBundle";

interface GPURenderBundleEncoder {
	label?:string;
	
	draw(vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void;
	drawIndexed(indexCount: number, instanceCount?: number, firstIndex?: number, baseVertex?: number, firstInstance?: number): void;
	drawIndirect(indirectBuffer: GPUBuffer , indirectOffset?: number): void;
	drawIndexedIndirect(indirectBuffer: GPUBuffer, indirectOffset?: number): void;

	setPipeline(pipeline: GPURenderPipeline): void;
	setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: number, dynamicOffsetsStart?: number,dynamicOffsetsLength?: number):void;
	setVertexBuffer(index: number, vtxBuffer: GPUBuffer, offset?: number, size?: number): void;

	/**
	 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPURenderBundleEncoder/setIndexBuffer
	 * @param indexBuffer GPUBuffer instance
	 * @param indexFormat "uint16" or "uint32"
	 * @param offset the default value is 0
	 * @param size the default value is indexBuffer.size
	 */
	setIndexBuffer(indexBuffer: GPUBuffer, indexFormat: string, offset?: number, size?: number): void;

	finish(descriptor?: {label:string}): GPURenderBundle;
	
	insertDebugMarker(markerLabel: string): void;
	popDebugGroup(): void;
	pushDebugGroup(groupLabel: string): void;
}
export { GPURenderBundleEncoder };
