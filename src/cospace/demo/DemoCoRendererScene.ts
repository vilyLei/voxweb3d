import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoMouseInteraction } from "../voxengine/ui/ICoMouseInteraction";
import { ModuleLoader } from "../modules/base/ModuleLoader";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
/**
 * cospace renderer
 */
export class DemoCoRendererScene {


	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	constructor() { }

	initialize(): void {

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.min.js";
		let url2 = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.min.js";


		let mouseInteractML = new ModuleLoader(2);
		mouseInteractML.setCallback((): void => {
			this.initInteract();
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
	private initInteract(): void {
		if(this.m_rscene != null && this.m_interact == null && (typeof CoMouseInteraction !== "undefined")) {

			this.m_interact = CoMouseInteraction.createMouseInteraction();
			this.m_interact.initialize( this.m_rscene );
			this.m_interact.setSyncLookAtEnabled( true );
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


			this.initInteract();

			let axis = CoRScene.createAxis3DEntity();
			this.m_rscene.addEntity(axis);
		}
	}
	private mouseDown(evt: any): void {

	}

	run(): void {
		if (this.m_rscene != null) {
			if(this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoRendererScene;
