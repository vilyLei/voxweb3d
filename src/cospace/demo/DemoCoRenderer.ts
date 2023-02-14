import { Camera } from "../../vox/view/Camera";
import RendererParam from "../../vox/scene/RendererParam";

import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import { IRendererInstance } from "../../vox/scene/IRendererInstance";
import { VoxRenderer } from "../voxengine/VoxRenderer";


/**
 * cospace renderer
 */
export class DemoCoRenderer {

	private m_renderer: IRendererInstance;
	private m_rcontext: IRendererInstanceContext;
	private m_time = 0.0;

	constructor() { }

	initialize(): void {
		VoxRenderer.initialize((urls: string[]): void => {
			this.initRenderer();
		});
	}

	isEngineEnabled(): boolean {
		return VoxRenderer.isEnabled();
	}
	private initRenderer(): void {

		this.m_renderer = VoxRenderer.createRendererInstance();
		this.m_renderer.initialize(new RendererParam(), new Camera(this.m_renderer.getRCUid()));
		this.m_rcontext = this.m_renderer.getRendererContext();
	}
	run(): void {
		if (this.m_rcontext != null) {
			let t = Math.abs(Math.cos(this.m_time += 0.01));
			this.m_rcontext.setClearRGBColor3f(0.0, t, 1.0 - t);

			this.m_rcontext.renderBegin();
			this.m_renderer.run();
			this.m_rcontext.runEnd();
		}
	}
}

export default DemoCoRenderer;
