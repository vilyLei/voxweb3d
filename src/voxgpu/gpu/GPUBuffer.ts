interface GPUBuffer {
	uid?: number
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
