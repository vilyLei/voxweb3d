import Color4 from "../../../../vox/material/Color4";

// thanks: https://codelabs.developers.google.com/your-first-webgpu-app?hl=zh-cn#6
declare var GPUBufferUsage: any;

export class WGPURStorage {
	private mRVertices: Float32Array = null;
	private mRPipeline: any | null = null;
	private mVtxBuffer: any | null = null;
	private mCanvasFormat: any | null = null;
	private mWGPUDevice: any | null = null;
	private mWGPUContext: any | null = null;
	private mUniformBindGroup: any | null = null;
	private mGridSize = 8;
	constructor() {}
	initialize(): void {
		console.log("WGPURStorage::initialize() ...");
		// const canvas = document.querySelector("canvas");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);
		console.log("ready init webgpu ...");
		this.initWebGPU(canvas).then(() => {
			console.log("webgpu initialization finish ...");

			this.clearWGPUCanvas();
		});
		document.onmousedown = (evt):void => {
			// this.updateUniform(this.mWGPUDevice);
			this.upateStorage(this.mWGPUDevice);
			// this.clearWGPUCanvas( new Color4( Math.random(), Math.random(), Math.random()) );
			this.clearWGPUCanvas( new Color4(0.05, 0.05, 0.1) );
		}
	}
	private mUniformObj: any = {uniformArray: null, uniformBuffer: null};
	private mStateObj: any = {cellStateArray: null, cellStateStorage: null};

	private simulate(state: Uint32Array): void {
		// for (let i = 0; i < state.length-1; ++i) {
		// 	if (state[i] == 1) {
		// 		state[i] = 0;
		// 		state[i+1] = 1;
		// 	}
		// }
		for (let i = 1; i < state.length; ++i) {
			if (state[i] == 1) {
				state[i] = 0;
				state[i-1] = 1;
			}
		}
	}
	private upateStorage(device: any): any {
		const obj = this.mStateObj;
		const vs = obj.cellStateArray;
		console.log("A obj.cellStateArray: ", obj.cellStateArray.slice());
		this.simulate(vs);
		console.log("B obj.cellStateArray: ", obj.cellStateArray);
		device.queue.writeBuffer(obj.cellStateStorage, 0, obj.cellStateArray);
	}
	private createStorage(device: any): any {
		// Create an array representing the active state of each cell.
		const cellStateArray = new Uint32Array(this.mGridSize * this.mGridSize);

		// Create a storage buffer to hold the cell state.
		const cellStateStorage = device.createBuffer({
			label: "Cell State",
			size: cellStateArray.byteLength,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		});
		// Mark every third cell of the grid as active.
		for (let i = 0; i < cellStateArray.length; i += 3) {
			cellStateArray[i] = 1;
		}
		device.queue.writeBuffer(cellStateStorage, 0, cellStateArray);

		const obj = this.mStateObj;
		obj.cellStateArray = cellStateArray;
		obj.cellStateStorage = cellStateStorage;

		return cellStateStorage;
	}

	private updateUniform(device: any): void {
		let n = Math.round(Math.random() * 3);
		this.mGridSize = 2 + n;
		this.mGridSize = 8;
		const obj = this.mUniformObj;
		obj.uniformArray[0] = this.mGridSize;
		obj.uniformArray[1] = this.mGridSize;
		device.queue.writeBuffer(obj.uniformBuffer, 0, obj.uniformArray);
	}
	private createUniform(device: any, pipeline: any): void {
		// Create a uniform buffer that describes the grid.
		const uniformArray = new Float32Array([this.mGridSize, this.mGridSize]);
		const uniformBuffer = device.createBuffer({
			label: "Grid Uniforms",
			size: uniformArray.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(uniformBuffer, 0, uniformArray);


		const cellStateStorage = this.createStorage(device);

		// create group object
		this.mUniformBindGroup = device.createBindGroup({
			label: "Cell renderer bind group",
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: { buffer: uniformBuffer }
				},
				{
					binding: 1,
					resource: { buffer: cellStateStorage }
				}
			],
		});
		const obj = this.mUniformObj;
		obj.uniformArray = uniformArray;
		obj.uniformBuffer = uniformBuffer;
	}
	private createRectGeometryData(device: any, pass: any): void {
		// WGSL: https://gpuweb.github.io/gpuweb/wgsl/
		// webGPU Source github: https://github.com/vilyLei/gpuweb

		console.log("WGPURStorage::createRectGeometryData() ...");
		// console.log("GPUBufferUsage: ", GPUBufferUsage);

		let vertices = this.mRVertices;
		let vertexBuffer = this.mVtxBuffer;
		let cellPipeline = this.mRPipeline;
		if(!cellPipeline) {
			let hsize = 0.8;
			vertices = new Float32Array([
			//   X,    Y,
				-hsize, -hsize, // Triangle 1 (Blue)
				 hsize, -hsize,
				 hsize,  hsize,

				-hsize, -hsize, // Triangle 2 (Red)
				 hsize,  hsize,
				-hsize,  hsize,
			]);

			vertexBuffer = device.createBuffer({
				label: "Cell vertices",
				size: vertices.byteLength,
				usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
			});
			device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);
			const vertexBufferLayout = {
				arrayStride: 8,
				attributes: [{
					format: "float32x2",
					offset: 0,
					shaderLocation: 0, // Position, see vertex shader
				}],
			};
			const shaderCodes = `
			struct VertexInput {
				@location(0) pos: vec2f,
				@builtin(instance_index) instance: u32,
			};

			struct VertexOutput {
				@builtin(position) pos: vec4f,
				@location(0) cell: vec2f,
			};

			@group(0) @binding(0) var<uniform> grid: vec2f;
			@group(0) @binding(1) var<storage> cellState: array<u32>;

			@vertex
			fn vertexMain(input: VertexInput) -> VertexOutput  {
				let i = f32(input.instance);
				let cell = vec2f(i % grid.x, floor(i / grid.x));
				let cellOffset = cell / grid * 2;

				let state = f32(cellState[input.instance]);
				let gridPos = (input.pos * state + 1) / grid - 1 + cellOffset;

				var output: VertexOutput;
				output.pos = vec4f(gridPos, 0, 1);
				output.cell = cell;
				return output;
			}
			// @fragment
			// fn fragmentMain() -> @location(0) vec4f {
			// 	return vec4f(0.8, 0.1, 0.1, 1);
			// }

			// @fragment
			// fn fragmentMain(@location(0) cell: vec2f) -> @location(0) vec4f {
			// 	// Remember, fragment return values are (Red, Green, Blue, Alpha)
			// 	// and since cell is a 2D vector, this is equivalent to:
			// 	// (Red = cell.x, Green = cell.y, Blue = 0, Alpha = 1)
			// 	return vec4f(cell, 0, 1);
			// }

			// struct FragInput {
			// 	@location(0) cellA: vec2f,
			// };
			// @fragment
			// fn fragmentMain(input: FragInput) -> @location(0) vec4f {
			// 	return vec4f(input.cellA, 0, 1);
			// }

			@fragment
			fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
				// return vec4f(input.cell, 0, 1);
				let c = input.cell/grid;
				return vec4f(c, 1.0 - c.x, 1);
			}
			`;
			const cellShaderModule = device.createShaderModule({
				label: "Cell shader",
				code: shaderCodes
				});
			cellPipeline = device.createRenderPipeline({
				label: "Cell pipeline",
				layout: "auto",
				vertex: {
					module: cellShaderModule,
					entryPoint: "vertexMain",
					buffers: [vertexBufferLayout]
				},
				fragment: {
					module: cellShaderModule,
					entryPoint: "fragmentMain",
					targets: [{
						format: this.mCanvasFormat
					}]
				},
			});
			this.mRVertices = vertices;
			this.mVtxBuffer = vertexBuffer;
			this.mRPipeline = cellPipeline;

			this.createUniform(device, cellPipeline);
		}
		pass.setPipeline(cellPipeline);
		pass.setVertexBuffer(0, vertexBuffer);
		pass.setBindGroup(0, this.mUniformBindGroup);
		pass.draw(vertices.length / 2, this.mGridSize * this.mGridSize);
	}

	private clearWGPUCanvas(clearColor: Color4 = null): void {

		console.log("WGPURStorage::clearWGPUCanvas() ...");
		// thanks: https://developer.mozilla.org/zh-CN/docs/Web/API/WebGPU_API
		// const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };

		clearColor = clearColor ? clearColor : new Color4(0.05, 0.05, 0.1);
		const device = this.mWGPUDevice;
		const context = this.mWGPUContext;
		const rpassParam = {
			colorAttachments: [
				{
					clearValue: clearColor,
					// clearValue: [0.3,0.7,0.5,1.0], // yes
					view: context.getCurrentTexture().createView(),
					loadOp: "clear",
					storeOp: "store"
				}
			]
		};

		const encoder = device.createCommandEncoder();
		const pass = encoder.beginRenderPass( rpassParam );


		this.createRectGeometryData(device, pass);
		pass.end();
		const commandBuffer = encoder.finish();
		device.queue.submit([commandBuffer]);
	}
	private async initWebGPU(canvas: HTMLCanvasElement) {
		// thanks: https://codelabs.developers.google.com/your-first-webgpu-app?hl=zh-cn#2
		const gpu = (navigator as any).gpu;
		if (gpu) {
			console.log("WebGPU supported on this browser.");

			const adapter = await gpu.requestAdapter();
			if (adapter) {
				console.log("Appropriate GPUAdapter found.");
				const device = await adapter.requestDevice();
				if (device) {
					this.mWGPUDevice = device;
					console.log("Appropriate GPUDevice found.");
					const context = canvas.getContext("webgpu") as any;
					const canvasFormat = gpu.getPreferredCanvasFormat();
					this.mWGPUContext = context;
					this.mCanvasFormat = canvasFormat;
					console.log("canvasFormat: ", canvasFormat);
					context.configure({
						device: device,
						format: canvasFormat,
						alphaMode: "premultiplied"
					});
				} else {
					throw new Error("No appropriate GPUDevice found.");
				}
			} else {
				throw new Error("No appropriate GPUAdapter found.");
			}
		} else {
			throw new Error("WebGPU not supported on this browser.");
		}
	}
	run(): void {}
}

export default WGPURStorage;
