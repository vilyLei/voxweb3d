import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoUIInteraction } from "../voxengine/ui/ICoUIInteraction";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import { IRendererSceneAccessor } from "../../vox/scene/IRendererSceneAccessor";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;


class SceneAccessor implements IRendererSceneAccessor{
    constructor(){}

    renderBegin(rendererScene: IRendererScene): void {
        let rproxyy = rendererScene.getRenderProxy();
        rproxyy.clearDepth(1.0);
    }
    renderEnd(rendererScene: IRendererScene): void {
    }
}

/**
 * cospace renderer scene
 */
export class DemoCoRendererSubScene {

	private m_rscene: IRendererScene = null;
	private m_rsubscene: IRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;

	constructor() { }

	initialize(): void {

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		let url2 = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";

		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initMouseInteraction();
		});

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();
			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url2);
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initMouseInteraction(): void {

		let r = this.m_rscene;
		if (r != null && this.m_mouseInteraction == null && typeof CoUIInteraction !== "undefined") {

			this.m_mouseInteraction = CoUIInteraction.createMouseInteraction();
			this.m_mouseInteraction.initialize(this.m_rscene, 2, true);
			this.m_mouseInteraction.setSyncLookAtEnabled(true);
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
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);

			let axis = CoRScene.createAxis3DEntity(200);
			this.m_rscene.addEntity(axis);

			// this.m_rsubscene = this.m_rscene.createSubScene(rparam, 3, true);
			this.m_rsubscene = this.m_rscene.createSubScene(rparam, 3, false);
			this.m_rsubscene.setAccessor(new SceneAccessor());

			let rnode = this.m_rsubscene;
			this.m_rscene.appendRenderNode(rnode);

			let scale = 190.0;
			// let boxMesh = this.m_rscene.entityBlock.unitBox.getMesh();
			let material = CoRScene.createDefaultMaterial(true);
			let entityBox = CoRScene.createDisplayEntity();
			entityBox.setMaterial(material);
			entityBox.copyMeshFrom(this.m_rscene.entityBlock.unitBox);
			entityBox.setScaleXYZ(scale, scale, scale);
			this.m_rscene.addEntity(entityBox);


			axis = CoRScene.createAxis3DEntity(80);
			axis.setXYZ(50, 70, 90);
			this.m_rsubscene.addEntity(axis);
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_mouseInteraction != null) {
				this.m_mouseInteraction.setLookAtPosition(null);
				this.m_mouseInteraction.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoRendererSubScene;
