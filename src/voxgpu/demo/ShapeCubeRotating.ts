import { cubeVertexArray, cubeVertexSize, cubeUVOffset, cubePositionOffset, cubeVertexCount } from "./mesh/cubeData";

import basicVertWGSL from "./shaders/basic.vert.wgsl";
import vertexPositionColorWGSL from "./shaders/vertexPositionColor.frag.wgsl";

import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { GPURenderPassDescriptor } from "../gpu/GPURenderPassDescriptor";
import { GPUTextureView } from "../gpu/GPUTextureView";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPUBindGroup } from "../gpu/GPUBindGroup";
import { GPUTexture } from "../gpu/GPUTexture";

export class ShapeCubeRotating {
	private mWGCtx = new WebGPUContext();
	private mRPipeline: GPURenderPipeline | null = null;
	private mRTexView: GPUTextureView | null = null;
	private mVerticesBuffer: GPUBuffer | null = null;
	private mUniformBuffer: GPUBuffer | null = null;
	private mUniformBindGroup: GPUBindGroup | null = null;
	private mDepthTexture: GPUTexture | null = null;

	constructor() {}
	initialize(): void {
		console.log("ShapeCubeRotating::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		// const devicePixelRatio = window.devicePixelRatio || 1;
		// canvas.width = canvas.clientWidth * devicePixelRatio;
		// canvas.height = canvas.clientHeight * devicePixelRatio;

		const ctx = this.mWGCtx;

		const cfg = {
			alphaMode: "premultiplied"
		};
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization success ...");

			this.mRPipeline = this.createRenderPipeline(4);

			this.renderFrame();
		});
	}
	private createRenderPipeline(sampleCount: number): GPURenderPipeline {
		const ctx = this.mWGCtx;
		const device = ctx.device;
		const canvas = ctx.canvas;

		// const texture = device.createTexture({
		// 	size: [ctx.canvas.width, ctx.canvas.height],
		// 	sampleCount,
		// 	format: ctx.presentationFormat,
		// 	usage: GPUTextureUsage.RENDER_ATTACHMENT
		// });
		// this.mRTexView = texture.createView();

		// Create a vertex buffer from the cube data.
		const verticesBuffer = device.createBuffer({
			size: cubeVertexArray.byteLength,
			usage: GPUBufferUsage.VERTEX,
			mappedAtCreation: true
		});
		new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
		verticesBuffer.unmap();
		this.mVerticesBuffer = verticesBuffer;

		const depthTexture = device.createTexture({
			size: [canvas.width, canvas.height],
			format: "depth24plus",
			usage: GPUTextureUsage.RENDER_ATTACHMENT
		});
		this.mDepthTexture = depthTexture;

		const uniformBufferSize = 4 * 16; // 4x4 matrix
		const uniformBuffer = device.createBuffer({
			size: uniformBufferSize,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});
		this.mUniformBuffer = uniformBuffer;

		const pipeline = device.createRenderPipeline({
			layout: "auto",
			vertex: {
				module: device.createShaderModule({
					code: basicVertWGSL
				}),
				entryPoint: "main",
				buffers: [
					{
						arrayStride: cubeVertexSize,
						attributes: [
							{
								// position
								shaderLocation: 0,
								offset: cubePositionOffset,
								format: "float32x4"
							},
							{
								// uv
								shaderLocation: 1,
								offset: cubeUVOffset,
								format: "float32x2"
							}
						]
					}
				]
			},
			fragment: {
				module: device.createShaderModule({
					code: vertexPositionColorWGSL
				}),
				entryPoint: "main",
				targets: [
					{
						format: ctx.presentationFormat
					}
				]
			},
			primitive: {
				topology: "triangle-list",
				cullMode: "back"
			},
			// multisample: {
			// 	count: sampleCount
			// },
			depthStencil: {
				depthWriteEnabled: true,
				depthCompare: "less",
				format: "depth24plus"
			}
		});

		const uniformBindGroup = device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: {
						buffer: uniformBuffer
					}
				}
			]
		});
		this.mUniformBindGroup = uniformBindGroup;

		return pipeline;
	}
	private mMatVS = new Float32Array([
		1.368185043334961,
		0.07154789566993713,
		-0.09674333035945892,
		-0.09577590227127075,
		0.07154789566993713,
		0.751859188079834,
		0.8444470763206482,
		0.8360026478767395,
		-0.13182421028614044,
		1.1506588459014893,
		-0.5457598567008972,
		-0.5403022766113281,
		0,
		0,
		3.0303030014038086,
		4
	]);
	private renderFrame(): void {
		const ctx = this.mWGCtx;
		const device = ctx.device;
		const context = ctx.context;
		const pipeline = this.mRPipeline;

		const commandEncoder = device.createCommandEncoder();
		// const currTexView = context.getCurrentTexture().createView();

		const uniformBuffer = this.mUniformBuffer;
		const transformationMatrix = this.mMatVS;
		device.queue.writeBuffer(uniformBuffer, 0, transformationMatrix.buffer, transformationMatrix.byteOffset, transformationMatrix.byteLength);

		// const renderPassDescriptor: GPURenderPassDescriptor = {
		// 	colorAttachments: [
		// 		{
		// 			view: this.mRTexView,
		// 			resolveTarget: currTexView,
		// 			clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
		// 			loadOp: "clear",
		// 			storeOp: "store"
		// 		}
		// 	]
		// };

		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [
				{
					// view: undefined, // Assigned later
					view: ctx.createCurrentView(),

					clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
					loadOp: "clear",
					storeOp: "store"
				}
			],
			depthStencilAttachment: {
				view: this.mDepthTexture.createView(),

				depthClearValue: 1.0,
				depthLoadOp: "clear",
				depthStoreOp: "store"
			}
		};

		// renderPassDescriptor.colorAttachments[0].view = ctx.createCurrentView();

		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
		passEncoder.setPipeline(pipeline);
		passEncoder.setBindGroup(0, this.mUniformBindGroup);
		passEncoder.setVertexBuffer(0, this.mVerticesBuffer);
		passEncoder.draw(cubeVertexCount);
		passEncoder.draw(3);
		passEncoder.end();

		device.queue.submit([commandEncoder.finish()]);
	}
	run(): void {}
}
