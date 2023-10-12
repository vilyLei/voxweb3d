interface GPUBindGroupLayoutDescriptorEntityBuffer {
	type?: string;
}
interface GPUBindGroupLayoutDescriptorEntity {
	binding: number;
	visibility: number;
	buffer: GPUBindGroupLayoutDescriptorEntityBuffer;
}
interface GPUBindGroupLayoutDescriptor {
	label?: string;
	entries: GPUBindGroupLayoutDescriptorEntity[];
}
export { GPUBindGroupLayoutDescriptor };
