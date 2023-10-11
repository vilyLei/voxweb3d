import { GPUDevice } from "../../gpuapi/GPUDevice";
import { GPURenderPipeline } from "../../gpuapi/GPURenderPipeline";
import { WGUniformObject } from "../wgmaterial/WGUniformObject";
import { WGVertexObject } from "../wgmesh/WGVertexObject";

class WGRasterRenderPipeline {

	private mLabel = "WGRasterRenderPipeline";
	private mUniform: WGUniformObject | null = null;
	private mVertex: WGVertexObject | null = null;

	pipeline: GPURenderPipeline = null;

	constructor(label = "") {

		if(label !== "") {
			this.mLabel = label;
		}
	}

	initialize(device: GPUDevice, canvasFormat: string, uniform: WGUniformObject, vertex: WGVertexObject): WGRasterRenderPipeline {
		this.init(device, canvasFormat, uniform, vertex);
		return this;
	}

	private init(device: GPUDevice, canvasFormat: string, uniform: WGUniformObject, vertex: WGVertexObject): void {

		this.mUniform = uniform;
		this.mVertex = vertex;

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

		@fragment
		fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
			let c = input.cell/grid;
			return vec4f(c, 1.0 - c.x, 1);
		}
		`;

		const pipelineLayout = device.createPipelineLayout({
			label: this.mLabel + "-PipelineLayout",
			bindGroupLayouts: [ uniform.bindGroupLayout ],
		});
		const cellShaderModule = device.createShaderModule({
			label: this.mLabel + "-Shader",
			code: shaderCodes
		});

		this.pipeline = device.createRenderPipeline({
			label: this.mLabel + "-Pipeline",
			layout: pipelineLayout,
			vertex: {
				module: cellShaderModule,
				entryPoint: "vertexMain",
				buffers: [vertex.layout]
			},
			fragment: {
				module: cellShaderModule,
				entryPoint: "fragmentMain",
				targets: [{
					format: canvasFormat
				}]
			},
		});
	}

	run(pass: any, insCount: number, groupIndex: number): void {

		pass.setPipeline(this.pipeline);
		pass.setVertexBuffer(0, this.mVertex.buffer);
		pass.setBindGroup(0, this.mUniform.bindGroups[groupIndex]);
		pass.draw(this.mVertex.vtxCount, insCount);
	}
}

export { WGRasterRenderPipeline }
