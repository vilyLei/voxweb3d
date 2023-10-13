// declare var GPUBufferUsage: any;
class WGVertexObject {
	private mLabel = "WGVertexObject";
	private mVertices: Float32Array = null;
	layout: any | null = null;
	buffer: any | null = null;
	/**
	 * array data byte stride
	 */
	arrayStride = 8;
	vtxCount = 6;
	constructor(label = "") {
		if(label !== "") {
			this.mLabel = label;
		}
	}
	initialize(device: any): WGVertexObject {
		this.initVertices(device);
		return this;
	}
	private initVertices(device: any): void {

		let hsize = 0.8;
		let vertices = new Float32Array([
		//   X,    Y,
			-hsize, -hsize, // Triangle 1 (Blue)
			 hsize, -hsize,
			 hsize,  hsize,

			-hsize, -hsize, // Triangle 2 (Red)
			 hsize,  hsize,
			-hsize,  hsize,
		]);

		let buffer = device.createBuffer({
			label: this.mLabel,
			size: vertices.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(buffer, 0, vertices);

		const elementStride = 2;
		this.arrayStride = elementStride * vertices.BYTES_PER_ELEMENT;
		this.vtxCount = vertices.length / elementStride;
		this.mVertices = vertices;
		this.buffer = buffer;

		const vertexBufferLayout = {
			arrayStride: this.arrayStride,
			attributes: [{
				format: "float32x2",
				offset: 0,
				shaderLocation: 0, // Position, see vertex shader
			}],
		};
		this.layout = vertexBufferLayout;
	}
}
export { WGVertexObject };
