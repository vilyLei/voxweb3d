interface GPUBufferDescriptor {
	label?: string;
	size: number
	usage: number;
	/**
	 * the default value is false
	 */
	mappedAtCreation?: boolean;
}
export { GPUBufferDescriptor };
