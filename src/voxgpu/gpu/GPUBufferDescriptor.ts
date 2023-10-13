/**
 * See: https://gpuweb.github.io/gpuweb/#gpubufferdescriptor
 */
interface GPUBufferDescriptor {
	label?: string;
	/**
	 * The size of the buffer in bytes.
	 */
	size: number
	/**
	 * The allowed usages for the buffer.
	 * In GPUBufferUsage: https://gpuweb.github.io/gpuweb/#typedefdef-gpubufferusageflags
	 * See: src\voxgpu\gpu\GPUBufferUsage.d.ts
	 */
	usage: number;
	/**
	 * the default value is false.
	 * If true creates the buffer in an already mapped state, allowing getMappedRange() to be called immediately.
	 * It is valid to set mappedAtCreation to true even if usage does not contain MAP_READ or MAP_WRITE.
	 * This can be used to set the buffer’s initial data.
	 * Guarantees that even if the buffer creation eventually fails,
	 * it will still appear as if the mapped range can be written/read to until it is unmapped.
	 */
	mappedAtCreation?: boolean;
}
export { GPUBufferDescriptor };
