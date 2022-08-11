import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoMouseInteraction } from "../voxengine/ui/ICoMouseInteraction";
import { ModuleLoader } from "../modules/base/ModuleLoader";
import { ViewerCoSApp } from "./coViewer/ViewerCoSApp";
import { CoDataFormat } from "../app/CoSpaceAppData";
import { PostOutlineSceneNode } from "./coViewer/PostOutlineSceneNode";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;

/**
 * cospace renderer scene
 */
export class DemoPostOutline {
	private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
	private m_rscene: ICoRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	constructor() {}

	initialize(): void {
		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		let url2 = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";

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
					this.m_statusDisp.initialize();

					this.m_vcoapp = new ViewerCoSApp();
					this.m_vcoapp.initialize((): void => {
						this.loadOBJ();
					});
				}
			})
			.load(url0)
			.load(url1);

		mouseInteractML.load(url2);
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initMouseInteraction(): void {
		if (this.m_rscene != null && this.m_mouseInteraction == null && typeof CoMouseInteraction !== "undefined") {
			this.m_mouseInteraction = CoMouseInteraction.createMouseInteraction();
			this.m_mouseInteraction.initialize(this.m_rscene);
			this.m_mouseInteraction.setSyncLookAtEnabled(true);
		}
	}

	private initRenderer(): void {
		if (this.m_rscene == null) {
			// CoRScene.RendererDevice = CoRenderer.RendererDevice;
			// CoRScene.RendererState = CoRenderer.RendererState;
			let RendererDevice = CoRScene.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");
			// CoRScene.RendererDevice = RendererDevice;

			let rparam = CoRScene.createRendererSceneParam();
			// rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setAttriAntialias(true);
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);

			this.initMouseInteraction();

			let axis = CoRScene.createAxis3DEntity();
			this.m_rscene.addEntity(axis);
		}
	}

	private m_node: PostOutlineSceneNode = null;
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";

		let node: PostOutlineSceneNode = new PostOutlineSceneNode(this.m_rscene, this.m_vcoapp);
		node.setScale(25.0).loadGeomModel(url, CoDataFormat.OBJ);
		this.m_node = node;

		this.m_rscene.appendRenderNode( node );
	}

	run(): void {
		this.m_statusDisp.update();
		if (this.m_rscene != null) {
			if (this.m_mouseInteraction != null) {
				this.m_mouseInteraction.run();
			}
			this.m_rscene.run(true);
		}
	}
}

export default DemoPostOutline;
