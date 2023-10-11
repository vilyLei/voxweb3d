interface GPUBuffer {
	label?: string;
	unmap(): void;
	getMappedRange(): number;
}
export { GPUBuffer };
