import { CoDataFormat } from "../app/CoSpaceAppData";

import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { CoMaterialContextParam, ICoRScene } from "../voxengine/ICoRScene";

import { ICoUIInteraction } from "../voxengine/ui/ICoUIInteraction";
import ViewerMaterialCtx from "./coViewer/ViewerMaterialCtx";
import { TextPackedLoader } from "../modules/loaders/TextPackedLoader";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "./coViewer/ViewerCoSApp";
import { ViewerSceneNode } from "./coViewer/ViewerSceneNode";
import { ViewerSCData } from "./coViewer/ViewerSCData";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;

/**
 * cospace renderer
 */
export class DemoCoViewer {
	
	private m_rscene: IRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	private m_scData: any;
	constructor() { }

	initialize(): void {

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		let scDataJsonUrl = "static/assets/scene/sc01.json";
		let scData = new ViewerSCData();
		// scData.build();
		let textLoader = new TextPackedLoader(1, (): void => {
			this.m_scData = JSON.parse( textLoader.getDataByUrl(scDataJsonUrl) as string );
			this.initEngineModule();
		}).load(scDataJsonUrl);

	}

	private initEngineModule(): void {

		let url = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initInteract();
		});

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();

				this.m_vcoapp = new ViewerCoSApp();
				this.m_vcoapp.initialize((): void => {
					this.loadOBJ();
				});

				this.initMaterialModule();
			}
		}).addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private initMaterialModule(): void {
		this.m_vmctx = new ViewerMaterialCtx();
		this.m_vmctx.initialize(this.m_rscene, this.m_scData.material, (): void => {
			this.m_node.applyMaterial();
		});
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initInteract(): void {
		let r = this.m_rscene;
		if (r != null && this.m_interact == null && typeof CoUIInteraction !== "undefined") {

			this.m_interact = CoUIInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rscene, 2, true);
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
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);
			this.m_rscene.setClearUint24Color(0x888888);

			// let axis = CoRScene.createAxis3DEntity();
			// this.m_rscene.addEntity(axis);
		}
	}
	private m_node: ViewerSceneNode = null;
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";

		let node: ViewerSceneNode = new ViewerSceneNode(this.m_rscene, this.m_vmctx, this.m_vcoapp);
		node.setScale(23.0).loadGeomModel(url, CoDataFormat.OBJ);
		this.m_node = node;
		this.m_rscene.appendRenderNode(node);
	}
	private mouseDown(evt: any): void { }
	run(): void {
		if (this.m_rscene != null) {
			this.m_vmctx.run();
			if (this.m_interact != null) {
				this.m_interact.setLookAtPosition(null);
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoViewer;
