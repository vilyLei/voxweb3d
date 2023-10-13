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
import { GPUAdapter } from "../../../../voxgpu/gpu/GPUAdapter";
import { GPUDevice } from "../../../../voxgpu/gpu/GPUDevice";
import { GPUCanvasContext } from "../../../../voxgpu/gpu/GPUCanvasContext";
import { GPUPipelineLayoutDescriptor } from "../../../../voxgpu/gpu/GPUPipelineLayoutDescriptor";

import vertShaderCode from './shaders/triangle.vert.wgsl';
import fragShaderCode from './shaders/triangle.frag.wgsl';

// Position Vertex Buffer Data
const positions = new Float32Array([
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0,
    0.0, 1.0, 0.0
]);
// Color Vertex Buffer Data
const colors = new Float32Array([
    1.0,0.0,0.0,
    0.0,1.0,0.0,
    0.0,0.0,1.0
]);

// Index Buffer Data
const indices = new Uint16Array([0, 1, 2]);

export class ColorTriangle {

    canvas: HTMLCanvasElement;

    // API Data Structures
    adapter: GPUAdapter;
    device: GPUDevice;
    queue: GPUQueue;

    // Frame Backings
    context: GPUCanvasContext;
    colorTexture: GPUTexture;
    colorTextureView: GPUTextureView;
    depthTexture: GPUTexture;
    depthTextureView: GPUTextureView;

    // Resources
    positionBuffer: GPUBuffer;
    colorBuffer: GPUBuffer;
    indexBuffer: GPUBuffer;
    vertModule: GPUShaderModule;
    fragModule: GPUShaderModule;
    pipeline: GPURenderPipeline;

    commandEncoder: GPUCommandEncoder;
    passEncoder: GPURenderPassEncoder;

	private mWGCtx = new WebGPUContext();
	constructor() {}

	initialize(): void {
		console.log("ColorTriangle::initialize() ...");
		console.log("ColorTriangle::initialize() ...");
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
		const ctx = this.mWGCtx;
		ctx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization finish ...");

			this.canvas = ctx.canvas;
			this.adapter = ctx.gpuAdapter;
			this.device = ctx.device;
			this.queue = ctx.queue;
			this.context = ctx.context;

			this.start();
		});
	}
	run(): void {

	}
	private async start() {
        this.resizeBackings();
		await this.initializeResources();
		this.render();
    }

    // Initialize resources to render triangle (buffers, shaders, pipeline)
    private async initializeResources() {
        // Buffers
        const createBuffer = (
            arr: Float32Array | Uint16Array,
            usage: number
        ) => {
            // 📏 Align to 4 bytes (thanks @chrimsonite)
            let desc = {
                size: (arr.byteLength + 3) & ~3,
                usage,
                mappedAtCreation: true
            } as GPUBufferDescriptor;
            let buffer = this.device.createBuffer(desc);
            const writeArray =
                arr instanceof Uint16Array
                    ? new Uint16Array(buffer.getMappedRange())
                    : new Float32Array(buffer.getMappedRange());
            writeArray.set(arr);
            buffer.unmap();
            return buffer;
        };

        this.positionBuffer = createBuffer(positions, GPUBufferUsage.VERTEX);
        this.colorBuffer = createBuffer(colors, GPUBufferUsage.VERTEX);
        this.indexBuffer = createBuffer(indices, GPUBufferUsage.INDEX);

        // Shaders
        const vsmDesc = {
            code: vertShaderCode
        };
        this.vertModule = this.device.createShaderModule(vsmDesc);

        const fsmDesc = {
            code: fragShaderCode
        };
        this.fragModule = this.device.createShaderModule(fsmDesc);

        // Graphics Pipeline

        // Input Assembly
        const positionAttribDesc: GPUVertexAttribute = {
            shaderLocation: 0, // [[location(0)]]
            offset: 0,
            format: 'float32x3'
        };
        const colorAttribDesc: GPUVertexAttribute = {
            shaderLocation: 1, // [[location(1)]]
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

        // Depth
        const depthStencil: GPUDepthStencilState = {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus-stencil8'
        };

        // Uniform Data
        const pipelineLayoutDesc = { bindGroupLayouts: [] } as GPUPipelineLayoutDescriptor;
        const layout = this.device.createPipelineLayout(pipelineLayoutDesc);

        // Shader Stages
        const vertex: GPUVertexState = {
            module: this.vertModule,
            entryPoint: 'main',
            buffers: [positionBufferDesc, colorBufferDesc]
        };

        // Color/Blend State
        const colorState: GPUColorTargetState = {
            format: 'bgra8unorm'
        };

        const fragment: GPUFragmentState = {
            module: this.fragModule,
            entryPoint: 'main',
            targets: [colorState]
        };

        // Rasterization
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
        this.pipeline = this.device.createRenderPipeline(pipelineDesc);
    }

    // Resize swapchain, frame buffer attachments
    private resizeBackings() {

        const depthStencilTextureDesc: GPUTextureDescriptor = {
            size: [this.canvas.width, this.canvas.height, 1],
            // dimension: '2d',
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        };

        this.depthTexture = this.device.createTexture(depthStencilTextureDesc);
        this.depthTextureView = this.depthTexture.createView();
    }

    // Write commands to send to the GPU
    private encodeCommands() {

        let colorAttachment: GPURenderPassColorAttachment = {
            view: this.colorTextureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store'
        };

        const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
            view: this.depthTextureView,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
            stencilClearValue: 0,
            stencilLoadOp: 'clear',
            stencilStoreOp: 'store'
        };

        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: [colorAttachment],
            depthStencilAttachment: depthStencilAttachment
        };

        this.commandEncoder = this.device.createCommandEncoder();

        // Encode drawing commands
        this.passEncoder = this.commandEncoder.beginRenderPass(renderPassDesc);
        const pass = this.passEncoder;

        pass.setPipeline(this.pipeline);
        pass.setViewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height,
            0,
            1
        );
        pass.setScissorRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        pass.setVertexBuffer(0, this.positionBuffer);
        pass.setVertexBuffer(1, this.colorBuffer);
        pass.setIndexBuffer(this.indexBuffer, indices.BYTES_PER_ELEMENT == 2 ? 'uint16' : 'uint32');
        // pass.drawIndexed(positions.length / 3, 1);
        pass.drawIndexed(positions.length / 3);
        pass.end();

        this.queue.submit([this.commandEncoder.finish()]);
    }

    private render(): void{
        // Acquire next image from context
        this.colorTexture = this.context.getCurrentTexture();
        this.colorTextureView = this.colorTexture.createView();

        this.encodeCommands();

    };
}
export default ColorTriangle;
