import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";

import { RendererDevice, VoxRScene } from "../voxengine/VoxRScene";
import { VoxUIInteraction } from "../voxengine/ui/VoxUIInteraction";

import { IRendererSceneAccessor } from "../../vox/scene/IRendererSceneAccessor";

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
		/*
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
		//*/
		
		VoxRScene.initialize((urls: string[]): void => {
			this.initREngine();
			VoxUIInteraction.initialize((urls: string[]): void => {
				this.initMouseInteraction();
			});
		});	
	}
	isEngineEnabled(): boolean {
		return VoxRScene.isEnabled();
	}
	private initMouseInteraction(): void {

		let r = this.m_rscene;
		if (r != null && this.m_mouseInteraction == null && VoxUIInteraction.isEnabled()) {

			this.m_mouseInteraction = VoxUIInteraction.createMouseInteraction();
			this.m_mouseInteraction.initialize(this.m_rscene, 2, true);
			this.m_mouseInteraction.setSyncLookAtEnabled(true);
		}
	}

	private initREngine(): void {

		if (this.m_rscene == null) {

			// let RendererDevice = RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = VoxRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = VoxRScene.createRendererScene(rparam, 3);

			let axis = VoxRScene.createAxis3DEntity(200);
			this.m_rscene.addEntity(axis);

			// this.m_rsubscene = this.m_rscene.createSubScene(rparam, 3, true);
			this.m_rsubscene = this.m_rscene.createSubScene(rparam, 3, false);
			this.m_rsubscene.setAccessor(new SceneAccessor());

			let rnode = this.m_rsubscene;
			this.m_rscene.appendRenderNode(rnode);

			let scale = 190.0;
			// let boxMesh = this.m_rscene.entityBlock.unitBox.getMesh();
			let material = VoxRScene.createDefaultMaterial(true);
			let entityBox = VoxRScene.createDisplayEntity();
			entityBox.setMaterial(material);
			entityBox.copyMeshFrom(this.m_rscene.entityBlock.unitBox);
			entityBox.setScaleXYZ(scale, scale, scale);
			this.m_rscene.addEntity(entityBox);


			axis = VoxRScene.createAxis3DEntity(80);
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
