import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
import { GPUBuffer } from "./GPUBuffer";
interface GPUBindGroupDescriptorEntityResource {
	buffer: GPUBuffer;
}
interface GPUBindGroupDescriptorEntity {
	binding: number;
	resource: GPUBindGroupDescriptorEntityResource;
}
interface GPUBindGroupDescriptor {
	label?: string;
	layout: GPUBindGroupLayout;
	entries: GPUBindGroupDescriptorEntity[];
}
export { GPUBindGroupDescriptor };
