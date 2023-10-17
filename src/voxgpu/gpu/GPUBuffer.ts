interface GPUBuffer {
	uid?: number;
	/**
	 * for example: 'uint16', 'uint32'
	 */
	dataFormat?: string;
	/**
	 * for example: 'float32x4', 'float32x2'
	 */
	vectorFormat?: string;
	elementCount?: number;
	label?: string;
	mapState: string;
	/**
	 * buffer size bytes total
	 */
	size: number;
	/**
	 * Bitwise flags value, come from GPUBufferUsage set.
	 */
	usage: number;
	unmap(): void;
	/**
	 * Returns an ArrayBuffer containing the mapped contents of the GPUBuffer in the specified range.
	 */
	getMappedRange(): ArrayBuffer;
	destroy(): void;
	/**
	 * @param mode Bitwise flags value, come from GPUMapMode set.
	 */
	mapAsync(mode: number, offset?:number, size?: number): any;
}
export { GPUBuffer };
