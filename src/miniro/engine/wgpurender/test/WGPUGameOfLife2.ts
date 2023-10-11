import Color4 from "../../../../vox/material/Color4";
import { WGUniformObject } from "./wgmaterial/WGUniformObject";
import { WGVertexObject } from "./wgmesh/WGVertexObject";
import { WGRasterRenderPipeline } from "./wgpipeline/WGRasterRenderPipeline";
import { WGComputePipeline } from "./wgpipeline/WGComputePipeline";
import { WGContext } from "./wgrender/WGContext";

export class WGPUGameOfLife2 {

	private mGridSize = 128;
	private mShdWorkGroupSize = 8;
	private mWGCtx = new WGContext();

	private mWGVtxObj: WGVertexObject = null;
	private mWGUnifObj: WGUniformObject = null;
	private mWGRasterPipeline: WGRasterRenderPipeline = null;
	private mWComputePipeline: WGComputePipeline = null;
	constructor() {}
	initialize(): void {

		console.log("WGPUGameOfLife2::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		this.mWGCtx.initialize(canvas).then(() => {
			console.log("webgpu initialization finish ...");

			this.buildWGResource( this.mWGCtx.device );
			this.autoUpdate();
		});
	}

	private buildWGResource(device: any): void {

		if(!this.mWGVtxObj) {
			this.mWGVtxObj = new WGVertexObject().initialize(device);
			this.mWGUnifObj = new WGUniformObject().initialize(device, this.mGridSize);
			this.mWGRasterPipeline = new WGRasterRenderPipeline().initialize(device, this.mWGCtx.canvasFormat, this.mWGUnifObj, this.mWGVtxObj);
			this.mWComputePipeline = new WGComputePipeline().initialize(device, this.mWGUnifObj, this.mShdWorkGroupSize);
		}
	}

    private m_timeoutId: any = -1;
    private autoUpdate(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.autoUpdate.bind(this), 100);// 20 fps
        this.wgRender();
    }

	private mStep = 0;
	private renerPass(pass: any, computePass: any): void {

		const workgroupCount = Math.ceil(this.mGridSize / this.mShdWorkGroupSize);
		const step = this.mStep % 2;
		this.mWComputePipeline.run(computePass, step, workgroupCount);
		this.mWGRasterPipeline.run(pass, this.mGridSize * this.mGridSize, step);

		pass.end();
		computePass.end();

		this.mStep ++;
	}

	private wgRender(clearColor: Color4 = null): void {

		const ctx = this.mWGCtx;
		const device = ctx.device;
		const deviceQueue = ctx.deviceQueue;

		clearColor = clearColor ? clearColor : new Color4(0.05, 0.05, 0.1);

		const rasterRPassParam = {
			colorAttachments:	// see: https://gpuweb.github.io/gpuweb/#color-attachments
			[
				{
					clearValue: clearColor,
					view: ctx.createCurrentView(),
					loadOp: "clear",
					storeOp: "store"
				}
			]
		};

		const encoder = device.createCommandEncoder();
		const pass = encoder.beginRenderPass( rasterRPassParam );

		const computeEncoder = device.createCommandEncoder();
		const computePass = computeEncoder.beginComputePass();

		this.renerPass(pass, computePass);

		deviceQueue.submit([ encoder.finish() ]);
		deviceQueue.submit([ computeEncoder.finish() ]);
	}
	run(): void {}
}
export default WGPUGameOfLife2;
