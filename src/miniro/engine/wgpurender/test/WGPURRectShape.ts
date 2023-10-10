import Color4 from "../../../../vox/material/Color4";

declare var GPUBufferUsage: any;
export class WGPURRectShape {
	private mRVertices: Float32Array = null;
	private mRPipeline: any | null = null;
	private mVtxBuffer: any | null = null;
	private mCanvasFormat: any | null = null;
	private mWGPUDevice: any | null = null;
	private mWGPUContext: any | null = null;
	constructor() {}
	initialize(): void {
		console.log("WGPURRectShape::initialize() ...");
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
			this.clearWGPUCanvas( new Color4( Math.random(), Math.random(), Math.random()) );
		}
	}
	private createRectGeometryData(device: any, pass: any): void {
		// WGSL: https://gpuweb.github.io/gpuweb/wgsl/
		// webGPU Source github: https://github.com/vilyLei/gpuweb

		console.log("WGPURRectShape::createRectGeometryData() ...");
		console.log("GPUBufferUsage: ", GPUBufferUsage);

		let vertices = this.mRVertices;
		let vertexBuffer = this.mVtxBuffer;
		let cellPipeline = this.mRPipeline;
		if(!cellPipeline) {

			vertices = new Float32Array([
			//   X,    Y,
				-0.8, -0.8, // Triangle 1 (Blue)
				 0.8,  -0.8,
				 0.8,   0.8,

				-0.8, -0.8, // Triangle 2 (Red)
				0.8,   0.8,
				-0.8,  0.8,
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
			@vertex
			fn vertexMain(@location(0) pos: vec2f) ->
				@builtin(position) vec4f {
						return vec4f(pos * 0.7, 0, 1);
			}
			@fragment
			fn fragmentMain() -> @location(0) vec4f {
				return vec4f(1, 0, 0, 1);
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
		}
		pass.setPipeline(cellPipeline);
		pass.setVertexBuffer(0, vertexBuffer);
		pass.draw(vertices.length / 2);
	}
	// private mCmdEncoder: any | null = null;
	// private mRPass: any | null = null;
	// private mRPassParam: any | null = null;
	private clearWGPUCanvas(clearColor: Color4 = null): void {

		console.log("WGPURRectShape::clearWGPUCanvas() ...");
		// thanks: https://developer.mozilla.org/zh-CN/docs/Web/API/WebGPU_API
		// const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };

		clearColor = clearColor ? clearColor : new Color4(0.5, 0.2, 1.0);
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

export default WGPURRectShape;
