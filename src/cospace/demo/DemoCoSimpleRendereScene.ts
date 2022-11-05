import IRendererScene from "../../vox/scene/IRendererScene";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoSimpleRScene } from "../voxengine/ICoSimpleRScene";

import { ModuleLoader } from "../modules/loaders/ModuleLoader";

declare var CoRenderer: ICoRenderer;
declare var CoSimpleRScene: ICoSimpleRScene;

/**
 * cospace renderer scene
 */
export class DemoCoSimpleRendereScene {

	private m_rscene: IRendererScene = null;
	private m_entity: ITransformEntity = null;

	constructor() {}

	initialize(): void {

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/simpleRScene/CoSimpleRScene.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();
			}
		})
			.load(url0)
			.load(url1);
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoSimpleRScene !== "undefined";
	}

	private initRenderer(): void {
		if (this.m_rscene == null) {

			let RendererDevice = CoRenderer.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = CoSimpleRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoSimpleRScene.createRendererScene(rparam, 3);

			let axis = CoSimpleRScene.createAxis3DEntity();

			this.m_rscene.addEntity(axis);
			this.m_entity = axis;
		}
	}
	private m_ry: number = 0.0;
	run(): void {
		if (this.m_rscene != null) {

			this.m_entity.setRotationXYZ(0.0, this.m_ry, 0.0);
			this.m_entity.update();

			this.m_ry += 1.0;

			this.m_rscene.run();
		}
	}
}

export default DemoCoSimpleRendereScene;
