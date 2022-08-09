import { CoDataFormat } from "../app/CoSpaceAppData";

import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { CoMaterialContextParam, ICoRScene } from "../voxengine/ICoRScene";

import { ICoMouseInteraction } from "../voxengine/ui/ICoMouseInteraction";
import ViewerMaterialCtx from "./coViewer/ViewerMaterialCtx";
import { ModuleLoader } from "../modules/base/ModuleLoader";
import { ViewerCoSApp } from "./coViewer/ViewerCoSApp";
import { SceneNode } from "./coViewer/SceneNode";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;

/**
 * cospace renderer
 */
export class DemoCoViewer {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() {}

	initialize(): void {

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		this.initEngineModule();
	}

	private initEngineModule(): void {
		let url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";
		let mouseInteractML = new ModuleLoader(2);
		mouseInteractML.setCallback((): void => {
			this.initInteract();
		});

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		new ModuleLoader(2)
			.setCallback((): void => {
				if (this.isEngineEnabled()) {
					console.log("engine modules loaded ...");
					this.initRenderer();
					mouseInteractML.use();

					this.m_vcoapp = new ViewerCoSApp();
					this.m_vcoapp.initialize((): void => {
						this.loadOBJ();
					});

					this.initMaterialModule();
				}
			})
			.loadModule(url0)
			.loadModule(url1);

		mouseInteractML.loadModule(url);
	}
	
	private initMaterialModule(): void {
		this.m_vmctx = new ViewerMaterialCtx();
		this.m_vmctx.initialize(this.m_rscene, (): void => {
			this.m_node.applyMaterial();
			
		});
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initInteract(): void {
		if (this.m_rscene != null && this.m_interact == null && typeof CoMouseInteraction !== "undefined") {
			this.m_interact = CoMouseInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rscene);
			this.m_interact.setSyncLookAtEnabled(true);
		}
	}
	private initRenderer(): void {

		if (this.m_rscene == null) {

			let RendererDevice = CoRenderer.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("#888888");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_rscene.setClearUint24Color(0x888888);
			CoRScene.applySceneBlock(this.m_rscene);

			let axis = CoRScene.createAxis3DEntity();
			this.m_rscene.addEntity(axis);
		}
	}
	private m_node: SceneNode = null;
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";

		let node: SceneNode = new SceneNode(this.m_rscene, this.m_vmctx, this.m_vcoapp);
		node.setScale(23.0).loadGeomModel(url, CoDataFormat.OBJ);
		this.m_node = node;
	}
	private mouseDown(evt: any): void {}
	run(): void {
		if (this.m_rscene != null) {
			this.m_vmctx.run();
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoViewer;
