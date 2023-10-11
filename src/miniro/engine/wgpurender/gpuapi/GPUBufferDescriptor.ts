interface GPUBufferDescriptor {
	label?: string;
	size: number
	usage: number;
	mappedAtCreation?: boolean;
}
export { GPUBufferDescriptor };
