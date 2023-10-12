import { WebGPUContext } from "../../../../voxgpu/gpu/WebGPUContext";
import { GPUQueue } from "../../../../voxgpu/gpu/GPUQueue";
import { GPUTexture } from "../../../../voxgpu/gpu/GPUTexture";
import { GPUTextureView } from "../../../../voxgpu/gpu/GPUTextureView";
import { GPUTextureDescriptor } from "../../../../voxgpu/gpu/GPUTextureDescriptor";
import { GPUBuffer } from "../../../../voxgpu/gpu/GPUBuffer";
import { GPUBufferDescriptor } from "../../../../voxgpu/gpu/GPUBufferDescriptor";
import { GPUShaderModule } from "../../../../voxgpu/gpu/GPUShaderModule";
import { GPUBindGroupLayout } from "../../../../voxgpu/gpu/GPUBindGroupLayout";
import { GPUBindGroup } from "../../../../voxgpu/gpu/GPUBindGroup";
import { GPUPipelineLayout } from "../../../../voxgpu/gpu/GPUPipelineLayout";
import { GPURenderPipeline } from "../../../../voxgpu/gpu/GPURenderPipeline";
import { GPUVertexAttribute } from "../../../../voxgpu/gpu/GPUVertexAttribute";
import { GPUVertexBufferLayout } from "../../../../voxgpu/gpu/GPUVertexBufferLayout";
import { GPUDepthStencilState } from "../../../../voxgpu/gpu/GPUDepthStencilState";
import { GPUVertexState } from "../../../../voxgpu/gpu/GPUVertexState";
import { GPUColorTargetState } from "../../../../voxgpu/gpu/GPUColorTargetState";
import { GPUFragmentState } from "../../../../voxgpu/gpu/GPUFragmentState";
import { GPUPrimitiveState } from "../../../../voxgpu/gpu/GPUPrimitiveState";
import { GPURenderPipelineDescriptor } from "../../../../voxgpu/gpu/GPURenderPipelineDescriptor";
import { GPUCommandEncoder } from "../../../../voxgpu/gpu/GPUCommandEncoder";
import { GPURenderPassEncoder } from "../../../../voxgpu/gpu/GPURenderPassEncoder";
import { GPURenderPassColorAttachment } from "../../../../voxgpu/gpu/GPURenderPassColorAttachment";
import { GPURenderPassDepthStencilAttachment } from "../../../../voxgpu/gpu/GPURenderPassDepthStencilAttachment";
import { GPURenderPassDescriptor } from "../../../../voxgpu/gpu/GPURenderPassDescriptor";

declare var GPUTextureUsage: any;
declare var GPUBufferUsage: any;
declare var GPUShaderStage: any;

export class WGPUApiTest {
	private mWGCtx = new WebGPUContext();
	constructor() {}
	initialize(): void {
		console.log("WGPUApiTest::initialize() ...");
		let value = (15 + 3) & ~3;
		console.log("value: ", value);
		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		const cfg = {
			format: "bgra8unorm",
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
			alphaMode: "opaque"
		};
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization finish ...");
		});
	}
	// thanks: https://alain.xyz/blog/raw-webgpu

	private createGPUResource(): void {
		const device = this.mWGCtx.device;

		this.createTexAttachments();
		this.createVertexBuffer();
	}
	private createTexAttachments(): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;
		const context = ctx.context;
		const canvas = ctx.canvas;

		// ✋ Declare attachment handles
		let depthTexture: GPUTexture = null;
		let depthTextureView: GPUTextureView = null;

		// 🤔 Create Depth Backing
		const depthTextureDesc: GPUTextureDescriptor = {
			size: [canvas.width, canvas.height, 1],
			dimension: "2d",
			format: "depth24plus-stencil8",
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
		};

		depthTexture = device.createTexture(depthTextureDesc);
		depthTextureView = depthTexture.createView();

		// ✋ Declare canvas context image handles
		let colorTexture: GPUTexture = null;
		let colorTextureView: GPUTextureView = null;

		colorTexture = context.getCurrentTexture();
		colorTextureView = colorTexture.createView();
	}
	private createVertexBuffer(): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;

		// 📈 Position Vertex Buffer Data
		const positions = new Float32Array([
			1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0
		]);

		// 🎨 Color Vertex Buffer Data
		const colors = new Float32Array([
			1.0,
			0.0,
			0.0, // 🔴
			0.0,
			1.0,
			0.0, // 🟢
			0.0,
			0.0,
			1.0 // 🔵
		]);

		// 📇 Index Buffer Data
		const indices = new Uint16Array([0, 1, 2]);

		// ✋ Declare buffer handles
		let positionBuffer: GPUBuffer = null;
		let colorBuffer: GPUBuffer = null;
		let indexBuffer: GPUBuffer = null;

		// 👋 Helper function for creating GPUBuffer(s) out of Typed Arrays
		const createBuf = (arr: Float32Array | Uint16Array, usage: number) => {
			// 📏 Align to 4 bytes (thanks @chrimsonite)
			let desc: GPUBufferDescriptor = {
				size: (arr.byteLength + 3) & ~3,
				usage,
				mappedAtCreation: true
			};
			let buffer = device.createBuffer(desc);

			const writeArray =
				arr instanceof Uint16Array
					? new Uint16Array(buffer.getMappedRange())
					: new Float32Array(buffer.getMappedRange());
			writeArray.set(arr);
			buffer.unmap();
			return buffer;
		};

		positionBuffer = createBuf(positions, GPUBufferUsage.VERTEX);
		colorBuffer = createBuf(colors, GPUBufferUsage.VERTEX);
		indexBuffer = createBuf(indices, GPUBufferUsage.INDEX);

		/*
		// 👔 Uniform Data
		const uniformData = new Float32Array([

			// ♟️ ModelViewProjection Matrix (Identity)
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0,

			// 🔴 Primary Color
			0.9, 0.1, 0.3, 1.0,

			// 🟣 Accent Color
			0.8, 0.2, 0.8, 1.0
		]);

		// ✋ Declare buffer handles
		let uniformBuffer: GPUBuffer = null;

		uniformBuffer = createBuf(uniformData, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
		//*/
	}
	private createShader(): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;

		const vertShaderCode = `
		struct VSOut {
			@builtin(position) nds_position: vec4<f32>,
			@location(0) color: vec3<f32>,
		};

		@vertex
		fn main(@location(0) in_pos: vec3<f32>,
				@location(1) in_color: vec3<f32>) -> VSOut {
			var vs_out: VSOut;
			vs_out.nds_position = vec4<f32>(in_pos, 1.0);
			vs_out.color = inColor;
			return vsOut;
		}
		`;
		const fragShaderCode = `
		@fragment
		fn main(@location(0) in_color: vec3<f32>) -> @location(0) vec4<f32> {
			return vec4<f32>(in_color, 1.0);
		}
		`;
		// ✋ Declare shader module handles
		let vertModule: GPUShaderModule = null;
		let fragModule: GPUShaderModule = null;

		const vsmDesc = { code: vertShaderCode };
		vertModule = device.createShaderModule(vsmDesc);

		const fsmDesc = { code: fragShaderCode };
		fragModule = device.createShaderModule(fsmDesc);
	}
	private createRenderPipelineLayout(pipeline: GPURenderPipeline, uniformBuffer: GPUBuffer): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;
		/*
		let bindGroupLayout: GPUBindGroupLayout = null;
		let uniformBindGroup: GPUBindGroup = null;

		// 👨‍🔧 Create your graphics pipeline...

		// 🧙‍♂️ Then get your implicit pipeline layout:
		bindGroupLayout = pipeline.getBindGroupLayout(0);

		// 🗄️ Bind Group
		// ✍ This would be used when *encoding commands*
		uniformBindGroup = device.createBindGroup({
			layout: bindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: uniformBuffer
					}
				}
			]
		});
		//*/
		// ✋ Declare handles
		let uniformBindGroupLayout: GPUBindGroupLayout = null;
		let uniformBindGroup: GPUBindGroup = null;
		let layout: GPUPipelineLayout = null;

		// 📁 Bind Group Layout
		uniformBindGroupLayout = device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX,
					buffer: {}
				}
			]
		});

		// 🗄️ Bind Group
		// ✍ This would be used when *encoding commands*
		uniformBindGroup = device.createBindGroup({
			layout: uniformBindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: uniformBuffer
					}
				}
			]
		});

		// 🗂️ Pipeline Layout
		// 👩‍🔧 This would be used as a member of a GPUPipelineDescriptor when *creating a pipeline*
		const pipelineLayoutDesc = { bindGroupLayouts: [uniformBindGroupLayout] };
		layout = device.createPipelineLayout(pipelineLayoutDesc);
	}
	private createRenderPipeline(vertModule: GPUShaderModule, fragModule: GPUShaderModule): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;

		// ✋ Declare pipeline handle
		let pipeline: GPURenderPipeline = null;

		// ⚗️ Graphics Pipeline

		// 🔣 Input Assembly
		const positionAttribDesc: GPUVertexAttribute = {
			shaderLocation: 0, // @location(0)
			offset: 0,
			format: 'float32x3'
		};
		const colorAttribDesc: GPUVertexAttribute = {
			shaderLocation: 1, // @location(1)
			offset: 0,
			format: 'float32x3'
		};
		const positionBufferDesc: GPUVertexBufferLayout = {
			attributes: [positionAttribDesc],
			arrayStride: 4 * 3, // sizeof(float) * 3
			stepMode: 'vertex'
		};
		const colorBufferDesc: GPUVertexBufferLayout = {
			attributes: [colorAttribDesc],
			arrayStride: 4 * 3, // sizeof(float) * 3
			stepMode: 'vertex'
		};

		// 🌑 Depth
		const depthStencil: GPUDepthStencilState = {
			depthWriteEnabled: true,
			depthCompare: 'less',
			format: 'depth24plus-stencil8'
		};

		// 🦄 Uniform Data
		const pipelineLayoutDesc = { bindGroupLayouts: [] as any[] };
		const layout = device.createPipelineLayout(pipelineLayoutDesc);

		// 🎭 Shader Stages
		const vertex: GPUVertexState = {
			module: vertModule,
			entryPoint: 'main',
			buffers: [positionBufferDesc, colorBufferDesc]
		};

		// 🌀 Color/Blend State
		const colorState: GPUColorTargetState = {
			format: 'bgra8unorm'
		};

		const fragment: GPUFragmentState = {
			module: fragModule,
			entryPoint: 'main',
			targets: [colorState]
		};

		// 🟨 Rasterization
		const primitive: GPUPrimitiveState = {
			frontFace: 'cw',
			cullMode: 'none',
			topology: 'triangle-list'
		};

		const pipelineDesc: GPURenderPipelineDescriptor = {
			layout,
			vertex,
			fragment,
			primitive,
			depthStencil
		};

		pipeline = device.createRenderPipeline(pipelineDesc);
	}
	private createRCmd(canvas: HTMLCanvasElement, pipeline: GPURenderPipeline, queue: GPUQueue, depthTextureView: GPUTextureView, colorTextureView: GPUTextureView): void {


		const ctx = this.mWGCtx;
		const device = ctx.device;


		let positionBuffer: GPUBuffer = null;
		let colorBuffer: GPUBuffer = null;
		let indexBuffer: GPUBuffer = null;

		// ✋ Declare command handles
		let commandEncoder: GPUCommandEncoder = null;
		let passEncoder: GPURenderPassEncoder = null;

	// ✍️ Write commands to send to the GPU
		const encodeCommands = () => {
			let colorAttachment: GPURenderPassColorAttachment = {
				view: colorTextureView,
				clearValue: { r: 0, g: 0, b: 0, a: 1 },
				loadOp: 'clear',
				storeOp: 'store'
			};

			const depthAttachment: GPURenderPassDepthStencilAttachment = {
				view: depthTextureView,
				depthClearValue: 1,
				depthLoadOp: 'clear',
				depthStoreOp: 'store',
				stencilClearValue: 0,
				stencilLoadOp: 'clear',
				stencilStoreOp: 'store'
			};

			const renderPassDesc: GPURenderPassDescriptor = {
				colorAttachments: [colorAttachment],
				depthStencilAttachment: depthAttachment
			};

			commandEncoder = device.createCommandEncoder();

			// 🖌️ Encode drawing commands
			passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
			passEncoder.setPipeline(pipeline);
			passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
			passEncoder.setScissorRect(0, 0, canvas.width, canvas.height);
			passEncoder.setVertexBuffer(0, positionBuffer);
			passEncoder.setVertexBuffer(1, colorBuffer);
			passEncoder.setIndexBuffer(indexBuffer, 'uint16');
			passEncoder.drawIndexed(3);
			passEncoder.end();

			queue.submit([commandEncoder.finish()]);
		}
	}
	private renderDo(): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;
		// ⏭ Acquire next image from context
		const colorTexture = ctx.context.getCurrentTexture();
		const colorTextureView = colorTexture.createView();

		// 📦 Write and submit commands to queue
		// encodeCommands();
	}
	run(): void {}
}
export default WGPUApiTest;
