import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";

import { RendererDevice, VoxRScene } from "../voxengine/VoxRScene";
import { VoxUIInteraction } from "../voxengine/ui/VoxUIInteraction";

import { IRendererSceneAccessor } from "../../vox/scene/IRendererSceneAccessor";
import IRendererSceneGraph from "../../vox/scene/IRendererSceneGraph";

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
export class DemoCoRendererSceneGraph {

	private m_rscene: IRendererScene = null;
	private m_rsubscene: IRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;
	private m_graph: IRendererSceneGraph = null;
	
	constructor() { }

	initialize(): void {
		console.log("DemoCoRendererSceneGraph::initialize() ...");
		
		VoxRScene.initialize((urls: string[]): void => {
			this.initREngine();
			VoxUIInteraction.initialize((urls: string[]): void => {
				this.initMouseInteraction();
			});
		});	
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

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let graph = this.m_graph = VoxRScene.createRendererSceneGraph();
			let rparam = graph.createRendererParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = graph.createScene(rparam, 3);

			let axis = VoxRScene.createAxis3DEntity(200);
			this.m_rscene.addEntity(axis);

			// this.m_rsubscene = this.m_rscene.createSubScene(rparam, 3, true);
			this.m_rsubscene = graph.createSubScene(rparam, 3, false);
			this.m_rsubscene.setAccessor(new SceneAccessor());

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

		let graph = this.m_graph;
		if(graph != null) {
			if (this.m_mouseInteraction != null) {
				this.m_mouseInteraction.setLookAtPosition(null);
				this.m_mouseInteraction.run();
			}
			graph.run();
		}
	}
}

export default DemoCoRendererSceneGraph;
