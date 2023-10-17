class WGRUniformValue {
	name?: string;
	index = 0;
	version = -1;
	bufferIndex: number;
	data?: NumberArrayDataType;

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
}
export { WGRUniformValue }
