import { GPUDevice } from "../../../../../voxgpu/gpu/GPUDevice";

// declare var GPUBufferUsage: any;
// declare var GPUShaderStage: any;

class WGUniformObject {
	private mLabel = "WGUniformObject";

	bindGroups: any[] | null = null;
	bindGroupLayout: any | null = null;

	constructor(label = "") {
		if(label !== "") {
			this.mLabel = label;
		}
	}
	initialize(device: GPUDevice, gridSize: number): WGUniformObject {
		this.createUniform(device, gridSize);
		return this;
	}

	private createStorage(device: GPUDevice, gridSize: number): any {
		// Create an array representing the active state of each cell.
		const cellStateArray = new Uint32Array(gridSize * gridSize);
		// Create two storage buffers to hold the cell state.
		const cellStateStorage = [
			device.createBuffer({
				label: this.mLabel + "-State0",
				size: cellStateArray.byteLength,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
			}),
			device.createBuffer({
				label: this.mLabel + "-State1",
				size: cellStateArray.byteLength,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
			})
		];
		// Mark every third cell of the first grid as active.
		// for (let i = 0; i < cellStateArray.length; i+=3) {
		// 	cellStateArray[i] = 1;
		// }
		for (let i = 0; i < cellStateArray.length; ++i) {
			cellStateArray[i] = Math.random() > 0.6 ? 1 : 0;
		}
		device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);
		// Mark every other cell of the second grid as active.
		for (let i = 0; i < cellStateArray.length; i++) {
			cellStateArray[i] = i % 2;
		}
		device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray);

		return cellStateStorage;
	}
	private createUniform(device: any, gridSize: number): void {
		// Create a uniform buffer that describes the grid.
		const uniformArray = new Float32Array([gridSize, gridSize]);
		const uniformBuffer = device.createBuffer({
			label: this.mLabel + "-Uniforms",
			size: uniformArray.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(uniformBuffer, 0, uniformArray);


		const cellStateStorage = this.createStorage(device, gridSize);

		// Create the bind group layout and pipeline layout.
		const bindGroupLayout = device.createBindGroupLayout({
			label: this.mLabel + "-BindGroupLayout",
			entries: [{
				binding: 0,
				visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
				buffer: {} // Grid uniform buffer
			}, {
				binding: 1,
				visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
				buffer: { type: "read-only-storage"} // Cell state input buffer
			}, {
				binding: 2,
				visibility: GPUShaderStage.COMPUTE,
				buffer: { type: "storage"} // Cell state output buffer
			}]
		});
		const bindGroups = [
			device.createBindGroup({
				label: this.mLabel + "-RendererBindGroup0",
				layout: bindGroupLayout,
				entries: [
					{
						binding: 0,
						resource: { buffer: uniformBuffer }
					}, {
						binding: 1,
						resource: { buffer: cellStateStorage[0] }
					}, {
						binding: 2,
						resource: { buffer: cellStateStorage[1] }
					}
				],
			}),
			device.createBindGroup({
				label: this.mLabel + "-RendererBindGroup1",
				layout: bindGroupLayout,
				entries: [
					{
						binding: 0,
						resource: { buffer: uniformBuffer }
					}, {
						binding: 1,
						resource: { buffer: cellStateStorage[1] }
					}, {
						binding: 2,
						resource: { buffer: cellStateStorage[0] }
					}
				],
			})
		];

		this.bindGroups = bindGroups;

		this.bindGroupLayout = bindGroupLayout;
	}
}

export { WGUniformObject }
