import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPUBuffer } from "./GPUBuffer";
import { GPUBindGroup } from "./GPUBindGroup";
interface GPURenderPassEncoder {
	label?: string;
	// see: https://gpuweb.github.io/gpuweb/#gpurenderpassencoder
	//		https://developer.mozilla.org/en-US/docs/Web/API/GPURenderPassEncoder

	setBlendConstant(color: { r: number; g: number; b: number; a: number } | number[] | Float32Array): void;

	setPipeline(pipeline: GPURenderPipeline): void;
	setViewport(x: number, y:number, width: number, height: number, minDepth?: number, maxDepth?: number): void;
	setScissorRect(x: number, y:number, width: number, height: number): void;
	setVertexBuffer(index: number, vtxBuffer: GPUBuffer, offset?: number, size?: number): void;

	/**
	 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPURenderPassEncoder/setIndexBuffer
	 * @param indexBuffer GPUBuffer instance
	 * @param indexFormat "uint16" or "uint32"
	 * @param offset the default value is 0
	 * @param size the default value is indexBuffer.size
	 */
	setIndexBuffer(indexBuffer: GPUBuffer, indexFormat: string, offset?: number, size?: number): void;

	setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: number, dynamicOffsetsStart?: number,dynamicOffsetsLength?: number):void;

	drawIndirect(indirectBuffer: GPUBuffer , indirectOffset?: number): void;
	draw(vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void;
	drawIndexed(indexCount: number, instanceCount?: number, firstIndex?: number, baseVertex?: number, firstInstance?: number): void;
	end(): void;
}
export { GPURenderPassEncoder };
