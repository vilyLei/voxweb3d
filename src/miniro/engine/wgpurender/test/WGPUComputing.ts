import Color4 from "../../../../vox/material/Color4";

// thanks: https://codelabs.developers.google.com/your-first-webgpu-app?hl=zh-cn#7

// declare var GPUBufferUsage: any;
// declare var GPUShaderStage: any;

export class WGPUComputing {

	private mRVertices: Float32Array = null;
	private mRPipeline: any | null = null;
	private mRSimulationPipeline: any | null = null;
	private mVtxBuffer: any | null = null;
	private mCanvasFormat: any | null = null;
	private mWGPUDevice: any | null = null;
	private mWGPUContext: any | null = null;
	private mUniformBindGroup: any | null = null;
	private mGridSize = 32;
	private mShdWorkGroupSize = 8;
	constructor() { }
	initialize(): void {
		console.log("WGPUComputing::initialize() ...");
		// const canvas = document.querySelector("canvas");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);
		console.log("ready init webgpu ...");
		this.initWebGPU(canvas).then(() => {
			console.log("webgpu initialization finish ...");

			this.updateWGPUCanvas();
		});
		document.onmousedown = (evt): void => {
			this.updateWGPUCanvas(new Color4(0.05, 0.05, 0.1));
		}
	}
	private mUniformObj: any = { uniformArray: null, uniformBuffer: null };

	private createStorage(device: any): any {
		// Create an array representing the active state of each cell.
		const cellStateArray = new Uint32Array(this.mGridSize * this.mGridSize);
		// Create two storage buffers to hold the cell state.
		const cellStateStorage = [
			device.createBuffer({
				label: "Cell State A",
				size: cellStateArray.byteLength,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
			}),
			device.createBuffer({
				label: "Cell State B",
				size: cellStateArray.byteLength,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
			})
		];
		// Mark every third cell of the first grid as active.
		for (let i = 0; i < cellStateArray.length; i += 3) {
			cellStateArray[i] = 1;
		}
		device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);
		// Mark every other cell of the second grid as active.
		for (let i = 0; i < cellStateArray.length; i++) {
			cellStateArray[i] = i % 2;
		}
		device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray);

		return cellStateStorage;
	}

	private createUniform(device: any): any {
		// Create a uniform buffer that describes the grid.
		const uniformArray = new Float32Array([this.mGridSize, this.mGridSize]);
		const uniformBuffer = device.createBuffer({
			label: "Grid Uniforms",
			size: uniformArray.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(uniformBuffer, 0, uniformArray);


		const cellStateStorage = this.createStorage(device);
		let entries = [{
			binding: 0,
			visibility: GPUShaderStage.COMPUTE, // GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
			buffer: { type: 'uniform' } // Grid uniform buffer
		}, {
			binding: 1,
			visibility: GPUShaderStage.COMPUTE, // GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
			buffer: { type: "read-only-storage" } // Cell state input buffer
		}, {
			binding: 2,
			visibility: GPUShaderStage.COMPUTE,
			buffer: { type: "storage" } // Cell state output buffer
		}];
		console.log("entries: ", entries);
		// Create the bind group layout and pipeline layout.
		const bindGroupLayout = device.createBindGroupLayout({
			label: "Cell Bind Group Layout",
			entries
		});

		/*
		let bindGroupEntries = [
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
		];
		console.log("bindGroupEntries: ", bindGroupEntries);
		const bindGroup = device.createBindGroup({
			label: "Cell renderer bind group A",
			layout: bindGroupLayout,
			entries: bindGroupEntries
		});
		this.mUniformBindGroup = bindGroup;
		//*/

		return bindGroupLayout;
	}
	private mStep = 0;
	private createComputeShader(device: any): any {
		let sgs = this.mShdWorkGroupSize;
		// Create the compute shader that will process the simulation.
		const simulationShaderModule = device.createShaderModule({
			label: "Game of Life simulation shader",
			code: `
			@group(0) @binding(0) var<uniform> grid: vec2f;

			@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
			@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

			fn cellIndex(cell: vec2u) -> u32 {
				return cell.y * u32(grid.x) + cell.x;
			}

			@compute @workgroup_size(${sgs}, ${sgs})
			fn computeMain(@builtin(global_invocation_id) cell: vec3u) {
				if (cellStateIn[cellIndex(cell.xy)] == 1) {
					cellStateOut[cellIndex(cell.xy)] = 0;
				} else {
					cellStateOut[cellIndex(cell.xy)] = 1;
				}
			}`
		});

		return simulationShaderModule;
	}
	private createPipeline(device: any, pass: any, computePass: any): void {
		// WGSL: https://gpuweb.github.io/gpuweb/wgsl/
		// webGPU Source github: https://github.com/vilyLei/gpuweb

		console.log("WGPUComputing::createPipeline() ...");
		// console.log("GPUBufferUsage: ", GPUBufferUsage);

		let simulationPipeline = this.mRSimulationPipeline;
		if (!simulationPipeline) {
			const bindGroupLayout = this.createUniform(device);
			const pipelineLayout = device.createPipelineLayout({
				label: "Cell Pipeline Layout",
				bindGroupLayouts: [bindGroupLayout],
			});
			const simulationShaderModule = this.createComputeShader(device);
			// Create a compute pipeline that updates the game state.
			let copmPipelineDesc = {
				label: "Simulation pipeline",
				layout: pipelineLayout,
				compute: {
					module: simulationShaderModule,
					entryPoint: "computeMain",
				}
			}
			console.log("copmPipelineDesc: ", copmPipelineDesc);
			simulationPipeline = device.createComputePipeline(copmPipelineDesc);
			console.log("device.createComputePipeline() finish .......");
			this.mRSimulationPipeline = simulationPipeline;
		}

		// computePass.setPipeline(simulationPipeline),
		// computePass.setBindGroup(0, this.mUniformBindGroup);
		// const workgroupCount = Math.ceil(this.mGridSize / this.mShdWorkGroupSize);
		// computePass.dispatchWorkgroups(workgroupCount, workgroupCount);
		this.mStep++;
	}

	private updateWGPUCanvas(clearColor: Color4 = null): void {

		console.log("WGPUComputing::updateWGPUCanvas() ...");
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

		// const encoder = device.createCommandEncoder();
		// const pass = encoder.beginRenderPass( rpassParam );

		const computeEncoder = device.createCommandEncoder();
		const computePass = computeEncoder.beginComputePass()

		this.createPipeline(device, null, computePass);

		// pass.end();
		computePass.end();

		// device.queue.submit([ encoder.finish() ]);
		device.queue.submit([computeEncoder.finish()]);
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
	run(): void { }
}

export default WGPUComputing;
