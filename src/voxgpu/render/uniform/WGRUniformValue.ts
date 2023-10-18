class WGRUniformValue {
	name?: string;

	uid = 0;
	/**
	 * uniform Index of RUnit instance uniforms array
	 */
	index = 0;

	version = -1;
	bufferIndex: number;
	data?: NumberArrayDataType;

	byteOffset = 0
	arrayStride = 1;
	usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
	constructor(data: NumberArrayDataType, bufferIndex = 0, uniformIndexInRUnit = 0) {
		this.data = data;
		this.bufferIndex = bufferIndex;
		this.index = uniformIndexInRUnit;
		this.upate();
	}
	upate(): void {
		this.version ++;
	}
	clone(data: NumberArrayDataType): WGRUniformValue {
		const u = new WGRUniformValue(data, this.bufferIndex, this.index);
		u.name = this.name;
		u.byteOffset = this.byteOffset;
		u.arrayStride = this.arrayStride;
		u.usage = this.usage;

		return u
	}
}
export { WGRUniformValue }
