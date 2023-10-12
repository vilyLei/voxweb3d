import { GPUComputePipeline } from "../../../../../voxgpu/gpu/GPUComputePipeline";
import { GPUDevice } from "../../../../../voxgpu/gpu/GPUDevice";
import { WGUniformObject } from "../wgmaterial/WGUniformObject";

class WGComputePipeline {
	private mLabel = "WGComputePipeline";
	private mUniform: WGUniformObject | null = null;

	pipeline: GPUComputePipeline = null;

	constructor(label = "") {

		if(label !== "") {
			this.mLabel = label;
		}
	}

	initialize(device: GPUDevice, uniform: WGUniformObject, workGroupSize: number): WGComputePipeline {
		this.init(device, uniform, workGroupSize);
		return this;
	}

	private init(device: GPUDevice, uniform: WGUniformObject, workGroupSize: number): void {

		this.mUniform = uniform;

		const pipelineLayout = device.createPipelineLayout({
			label: this.mLabel + "PipelineLayout",
			bindGroupLayouts: [ uniform.bindGroupLayout ],
		});
		const simulationShaderModule = this.createComputeShader( device, workGroupSize );
		// Create a compute pipeline that updates the game state.
		this.pipeline = device.createComputePipeline({
				label: this.mLabel + "-Pipeline",
				layout: pipelineLayout,
				compute: {
				module: simulationShaderModule,
				entryPoint: "computeMain",
			}
		});
	}

	private createComputeShader(device: GPUDevice, workGroupSize: number): any {

		let sgs = workGroupSize;
		// Create the compute shader that will process the simulation.
		const simulationShaderModule = device.createShaderModule({
			label: "Game of Life simulation shader",
			code: `
			@group(0) @binding(0) var<uniform> grid: vec2f;

			@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
			@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

			// fn cellIndex(cell: vec2u) -> u32 {
			// 	return cell.y * u32(grid.x) + cell.x;
			// }
			fn cellIndex(cell: vec2u) -> u32 {
				return (cell.y % u32(grid.y)) * u32(grid.x) +
					   (cell.x % u32(grid.x));
			}

			fn cellActive(x: u32, y: u32) -> u32 {
				return cellStateIn[cellIndex(vec2(x, y))];
			}

			@compute @workgroup_size(${sgs}, ${sgs})
			fn computeMain(@builtin(global_invocation_id) cell: vec3u) {

				// Determine how many active neighbors this cell has.
				let activeNeighbors = cellActive(cell.x+1, cell.y+1) +
										cellActive(cell.x+1, cell.y) +
										cellActive(cell.x+1, cell.y-1) +
										cellActive(cell.x, cell.y-1) +
										cellActive(cell.x-1, cell.y-1) +
										cellActive(cell.x-1, cell.y) +
										cellActive(cell.x-1, cell.y+1) +
										cellActive(cell.x, cell.y+1);
				//
				let i = cellIndex(cell.xy);

				// Conway's game of life rules:
				switch activeNeighbors {
					case 2: { // Active cells with 2 neighbors stay active.
						cellStateOut[i] = cellStateIn[i];
					}
					case 3: { // Cells with 3 neighbors become or stay active.
						cellStateOut[i] = 1;
					}
					default: { // Cells with < 2 or > 3 neighbors become inactive.
						cellStateOut[i] = 0;
					}
				}
			}`
		});

		return simulationShaderModule;
	}

	run(pass: any, groupIndex: number, workgroupCount: number): void {

		pass.setPipeline(this.pipeline),
		pass.setBindGroup(0, this.mUniform.bindGroups[groupIndex]);
		pass.dispatchWorkgroups(workgroupCount, workgroupCount);
	}
}

export { WGComputePipeline }
