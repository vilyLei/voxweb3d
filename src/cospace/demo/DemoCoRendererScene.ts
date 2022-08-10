import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoMouseInteraction } from "../voxengine/ui/ICoMouseInteraction";
import { ModuleLoader } from "../modules/base/ModuleLoader";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;

/**
 * cospace renderer scene
 */
export class DemoCoRendererScene {

	private m_rscene: ICoRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;

	constructor() { }

	initialize(): void {

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.min.js";
		let url2 = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.min.js";

		let mouseInteractML = new ModuleLoader(2);
		mouseInteractML.setCallback((): void => {
			this.initMouseInteraction();
		});

		new ModuleLoader(2)
			.setCallback((): void => {
				if (this.isEngineEnabled()) {
					console.log("engine modules loaded ...");
					this.initRenderer();
					mouseInteractML.use();
				}
			})
			.loadModule(url0)
			.loadModule(url1);

		mouseInteractML.loadModule(url2);
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initMouseInteraction(): void {
		if(this.m_rscene != null && this.m_mouseInteraction == null && (typeof CoMouseInteraction !== "undefined")) {

			this.m_mouseInteraction = CoMouseInteraction.createMouseInteraction();
			this.m_mouseInteraction.initialize( this.m_rscene );
			this.m_mouseInteraction.setSyncLookAtEnabled( true );
		}
	}

	private initRenderer(): void {

		if (this.m_rscene == null) {

			let RendererDevice = CoRenderer.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene();
			this.m_rscene.initialize(rparam, 3);

			this.initMouseInteraction();

			let axis = CoRScene.createAxis3DEntity();
			this.m_rscene.addEntity(axis);
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			if(this.m_mouseInteraction != null) {
				this.m_mouseInteraction.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoRendererScene;
