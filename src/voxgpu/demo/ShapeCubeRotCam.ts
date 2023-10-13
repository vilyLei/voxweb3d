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
import CameraBase from "../../vox/view/CameraBase";
import Vector3D from "../../vox/math/Vector3D";
import ROTransform from "../../vox/display/ROTransform";
import Matrix4 from "../../vox/math/Matrix4";

export class ShapeCubeRotCam {
	private mWGCtx = new WebGPUContext();
	private mRPipeline: GPURenderPipeline | null = null;
	private mRTexView: GPUTextureView | null = null;
	private mVerticesBuffer: GPUBuffer | null = null;
	private mUniformBuffer: GPUBuffer | null = null;
	private mUniformBindGroup: GPUBindGroup | null = null;
	private mDepthTexture: GPUTexture | null = null;
	private mCam = new CameraBase();
	private mEntityTrans: ROTransform | null;// = new ROTransform();
	constructor() {}
	initialize(): void {
		console.log("ShapeCubeRotCam::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		// const devicePixelRatio = window.devicePixelRatio || 1;
		// canvas.width = canvas.clientWidth * devicePixelRatio;
		// canvas.height = canvas.clientHeight * devicePixelRatio;

		const ctx = this.mWGCtx;

		let scale = 100.0;
		const vs = cubeVertexArray;
		for(let i = 0; i < vs.length; i+=10) {
			vs[i] *= scale;
			vs[i+1] *= scale;
			vs[i+2] *= scale;
		}
		// console.log("cubeVertexArray: ", cubeVertexArray);

		const cam = this.mCam;
		const camPosition = new Vector3D(1000.0, 1000.0, 1000.0);
		const camLookAtPos = new Vector3D(0.0, 0.0, 0.0);
		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, canvas.width / canvas.height, 0.1, 5000);
		cam.lookAtRH(camPosition, camLookAtPos, camUpDirect);
		cam.setViewXY(0, 0);
        cam.setViewSize(canvas.width, canvas.height);
		cam.update();
		this.mEntityTrans = ROTransform.Create();
		this.mEntityTrans.update();

		const cfg = {
			alphaMode: "premultiplied"
		};
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization success ...");

			this.mRPipeline = this.createRenderPipeline(4);

			// this.renderFrame();
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
	private mTransMat = new Matrix4();
	private mRotateV = new Vector3D();
	private mScaleV = new Vector3D(1.0,1.0,1.0);
	private rotate(): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;

		const rv = this.mRotateV;
		const sv = this.mScaleV;
		const s = Math.abs(Math.cos(sv.w += 0.01)) + 0.2;
		sv.setXYZ(s, s, s);

		const trans = this.mEntityTrans;
		rv.x += 1.0;
		rv.y += 0.5;
		trans.setRotationV3( rv );
		trans.setScaleV3( sv );
		trans.update();

		const mat = this.mTransMat;
		mat.copyFrom(trans.getMatrix());
		mat.append(this.mCam.getVPMatrix());
		const uniformBuffer = this.mUniformBuffer;
		let transformationMatrix = this.mCam.getVPMatrix().getLocalFS32();
		transformationMatrix = mat.getLocalFS32();
		device.queue.writeBuffer(uniformBuffer, 0, transformationMatrix.buffer, transformationMatrix.byteOffset, transformationMatrix.byteLength);

	}
	private renderFrame(): void {
		const ctx = this.mWGCtx;
		if(ctx.enabled) {

			const device = ctx.device;
			const context = ctx.context;
			const pipeline = this.mRPipeline;

			this.rotate();

			const commandEncoder = device.createCommandEncoder();
			// const currTexView = context.getCurrentTexture().createView();

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
			passEncoder.end();

			device.queue.submit([commandEncoder.finish()]);
		}
	}
	run(): void {
		this.renderFrame();
	}
}
