import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
import { GPUBuffer } from "./GPUBuffer";
import { GPUTextureView } from "./GPUTextureView";
import { GPUSampler } from "./GPUSampler";
interface GPUBindGroupDescriptorEntityResource {
	buffer?: GPUBuffer;
	offset?: number;
	size?: number;
}
interface GPUBindGroupDescriptorEntity {
	binding: number;
	resource: GPUBindGroupDescriptorEntityResource | GPUTextureView | GPUSampler;
}
interface GPUBindGroupDescriptor {
	label?: string;
	layout: GPUBindGroupLayout;
	entries: GPUBindGroupDescriptorEntity[];
}
export { GPUBindGroupDescriptorEntity, GPUBindGroupDescriptor };
