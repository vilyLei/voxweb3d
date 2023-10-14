import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPUBuffer } from "./GPUBuffer";
import { GPUBindGroup } from "./GPUBindGroup";
import { GPURenderBundle } from "./GPURenderBundle";
/**
 * see: https://gpuweb.github.io/gpuweb/#gpurenderpassencoder
 * 		https://developer.mozilla.org/en-US/docs/Web/API/GPURenderPassEncoder
 */
interface GPURenderPassEncoder {
	label?: string;

	/**
	 * Sets the constant blend color and alpha values used with "constant" and "one-minus-constant" blend factors
	 * (as set in the descriptor of the GPUDevice.createRenderPipeline() method, in the blend property).
	 */
	setBlendConstant(color: { r: number; g: number; b: number; a: number } | number[] | Float32Array): void;

	setViewport(x: number, y: number, width: number, height: number, minDepth?: number, maxDepth?: number): void;
	setScissorRect(x: number, y: number, width: number, height: number): void;
	/**
	 * Sets the stencil reference value using during stencil tests with the "replace" stencil
	 * operation (as set in the descriptor of the GPUDevice.createRenderPipeline() method, in the
	 * properties defining the various stencil operations).
	 */
	setStencilReference(): void;

	setPipeline(pipeline: GPURenderPipeline): void;
	setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: number, dynamicOffsetsStart?: number, dynamicOffsetsLength?: number): void;
	/**
	 * A number referencing the vertex buffer slot to set the vertex buffer for.
	 * @param index A number referencing the vertex buffer slot to set the vertex buffer for.
	 * @param vtxBuffer GPUBuffer instance
	 * @param offset A number representing the offset, in bytes, into buffer where the vertex data begins. If omitted, offset defaults to 0.
	 * @param size A number representing the size, in bytes, of the vertex data contained in buffer. If omitted, size defaults to the buffer's GPUBuffer.size - offset.
	 */
	setVertexBuffer(index: number, vtxBuffer: GPUBuffer, offset?: number, size?: number): void;

	/**
	 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPURenderPassEncoder/setIndexBuffer
	 * @param indexBuffer GPUBuffer instance
	 * @param indexFormat "uint16" or "uint32"
	 * @param offset the default value is 0
	 * @param size the default value is indexBuffer.size
	 */
	setIndexBuffer(indexBuffer: GPUBuffer, indexFormat: string, offset?: number, size?: number): void;

	draw(vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void;
	drawIndirect(indirectBuffer: GPUBuffer, indirectOffset?: number): void;
	drawIndexed(indexCount: number, instanceCount?: number, firstIndex?: number, baseVertex?: number, firstInstance?: number): void;
	drawIndexedIndirect(indirectBuffer: GPUBuffer, indirectOffset?: number): void;

	executeBundles(bundles: GPURenderBundle[]): void;
	end(): void;

	insertDebugMarker(markerLabel: string): void;
	popDebugGroup(): void;
	pushDebugGroup(groupLabel: string): void;
}
export { GPURenderPassEncoder };
