import { GPUComputePipeline } from "./GPUComputePipeline";
import { GPUBuffer } from "./GPUBuffer";
import { GPUBindGroup } from "./GPUBindGroup";
interface GPUComputePassEncoder {
	label?: string;
	// see: https://gpuweb.github.io/gpuweb/#gpurenderpassencoder
	//		https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder

	setBlendConstant(color: { r: number; g: number; b: number; a: number } | number[] | Float32Array): void;

	setPipeline(pipeline: GPUComputePipeline): void;

	dispatchWorkgroupsIndirect(indirectBuffer: GPUBuffer, indirectOffset?: number): void;
	setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: number, dynamicOffsetsStart?: number,dynamicOffsetsLength?: number):void;

	dispatchWorkgroups(workgroupCountX: number, workgroupCountY?: number, workgroupCountZ?: number): void;

	end(): void;

	insertDebugMarker(markerLabel: string): void;
	popDebugGroup(): void;
	pushDebugGroup(groupLabel: string): void;

}
export { GPUComputePassEncoder };
