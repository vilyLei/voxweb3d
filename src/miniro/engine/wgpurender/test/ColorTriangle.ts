import { WebGPUContext } from "../gpuapi/WebGPUContext";
import { GPUQueue } from "../gpuapi/GPUQueue";
import { GPUTexture } from "../gpuapi/GPUTexture";
import { GPUTextureView } from "../gpuapi/GPUTextureView";
import { GPUTextureDescriptor } from "../gpuapi/GPUTextureDescriptor";
import { GPUBuffer } from "../gpuapi/GPUBuffer";
import { GPUBufferDescriptor } from "../gpuapi/GPUBufferDescriptor";
import { GPUShaderModule } from "../gpuapi/GPUShaderModule";
import { GPUBindGroupLayout } from "../gpuapi/GPUBindGroupLayout";
import { GPUBindGroup } from "../gpuapi/GPUBindGroup";
import { GPUPipelineLayout } from "../gpuapi/GPUPipelineLayout";
import { GPURenderPipeline } from "../gpuapi/GPURenderPipeline";
import { GPUVertexAttribute } from "../gpuapi/GPUVertexAttribute";
import { GPUVertexBufferLayout } from "../gpuapi/GPUVertexBufferLayout";
import { GPUDepthStencilState } from "../gpuapi/GPUDepthStencilState";
import { GPUVertexState } from "../gpuapi/GPUVertexState";
import { GPUColorTargetState } from "../gpuapi/GPUColorTargetState";
import { GPUFragmentState } from "../gpuapi/GPUFragmentState";
import { GPUPrimitiveState } from "../gpuapi/GPUPrimitiveState";
import { GPURenderPipelineDescriptor } from "../gpuapi/GPURenderPipelineDescriptor";
import { GPUCommandEncoder } from "../gpuapi/GPUCommandEncoder";
import { GPURenderPassEncoder } from "../gpuapi/GPURenderPassEncoder";
import { GPURenderPassColorAttachment } from "../gpuapi/GPURenderPassColorAttachment";
import { GPURenderPassDepthStencilAttachment } from "../gpuapi/GPURenderPassDepthStencilAttachment";
import { GPURenderPassDescriptor } from "../gpuapi/GPURenderPassDescriptor";
import { GPUAdapter } from "../gpuapi/GPUAdapter";
import { GPUDevice } from "../gpuapi/GPUDevice";
import { GPUCanvasContext } from "../gpuapi/GPUCanvasContext";
import { GPUPipelineLayoutDescriptor } from "../gpuapi/GPUPipelineLayoutDescriptor";

declare var GPUTextureUsage: any;
declare var GPUBufferUsage: any;
declare var GPUShaderStage: any;

const vertShaderCode = `
struct VSOut {
    @builtin(position) Position: vec4f,
    @location(0) color: vec3f,
 };

@vertex
fn main(@location(0) inPos: vec3f,
        @location(1) inColor: vec3f) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = vec4f(inPos, 1);
    vsOut.color = inColor;
    return vsOut;
}
`;
const fragShaderCode = `
@fragment
fn main(@location(0) inColor: vec3f) -> @location(0) vec4f {
    return vec4f(inColor, 1);
}
`;
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
            };
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

        const depthTextureDesc: GPUTextureDescriptor = {
            size: [this.canvas.width, this.canvas.height, 1],
            dimension: '2d',
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        };

        this.depthTexture = this.device.createTexture(depthTextureDesc);
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

        const depthAttachment: GPURenderPassDepthStencilAttachment = {
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
            depthStencilAttachment: depthAttachment
        };

        this.commandEncoder = this.device.createCommandEncoder();

        // Encode drawing commands
        this.passEncoder = this.commandEncoder.beginRenderPass(renderPassDesc);
        this.passEncoder.setPipeline(this.pipeline);
        this.passEncoder.setViewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height,
            0,
            1
        );
        this.passEncoder.setScissorRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.passEncoder.setVertexBuffer(0, this.positionBuffer);
        this.passEncoder.setVertexBuffer(1, this.colorBuffer);
        this.passEncoder.setIndexBuffer(this.indexBuffer, 'uint16');
        this.passEncoder.drawIndexed(3, 1);
        this.passEncoder.end();

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
