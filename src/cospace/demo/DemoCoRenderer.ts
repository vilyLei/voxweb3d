import { Camera } from "../../vox/view/Camera";
import RendererParam from "../../vox/scene/RendererParam";

import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import { IRendererInstance } from "../../vox/scene/IRendererInstance";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ModuleLoader } from "../modules/base/ModuleLoader";

declare var CoRenderer: ICoRenderer;
/**
 * cospace renderer
 */
export class DemoCoRenderer {

	private m_renderer: IRendererInstance;
	private m_rcontext: IRendererInstanceContext;
	private m_time: number = 0.0;
	
	constructor() { }

	initialize(): void {

		let url: string = "static/cospace/engine/renderer/CoRenderer.umd.min.js";

		new ModuleLoader(1)
			.setCallback((): void => {
				if (typeof CoRenderer !== "undefined") {
					this.initRenderer();
				}
			})
			.loadModule(url)
	}

	private initRenderer(): void {

		this.m_renderer = CoRenderer.createRendererInstance();
		this.m_renderer.initialize(new RendererParam(), new Camera(this.m_renderer.getRCUid()));
		this.m_rcontext = this.m_renderer.getRendererContext();
	}
	run(): void {
		if (this.m_rcontext != null) {
			let t: number = Math.abs(Math.cos(this.m_time += 0.01));
			this.m_rcontext.setClearRGBColor3f(0.0, t, 1.0 - t);

			this.m_rcontext.renderBegin();
			this.m_renderer.run();
			this.m_rcontext.runEnd();
		}
	}
}

export default DemoCoRenderer;
