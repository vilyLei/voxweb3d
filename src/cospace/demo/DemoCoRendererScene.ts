import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";

import { RendererDevice, VoxRScene } from "../voxengine/VoxRScene";
import { VoxUIInteraction } from "../voxengine/ui/VoxUIInteraction";

/**
 * cospace renderer scene
 */
export class DemoCoRendererScene {

	private m_rscene: IRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;

	constructor() { }

	initialize(): void {
		VoxRScene.initialize((urls: string[]): void => {
			this.initREngine();
			VoxUIInteraction.initialize((urls: string[]): void => {
				this.initMouseInteraction();
			});
		});
	}
	private initMouseInteraction(): void {
		this.m_mouseInteraction = VoxUIInteraction.createMouseInteraction();
		this.m_mouseInteraction.initialize(this.m_rscene, 2, true);
		this.m_mouseInteraction.setSyncLookAtEnabled(true);
	}

	private initREngine(): void {

		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = VoxRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = VoxRScene.createRendererScene(rparam, 3);

			let axis = VoxRScene.createAxis3DEntity();
			this.m_rscene.addEntity(axis);
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

export default DemoCoRendererScene;
