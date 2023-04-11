import IRendererScene from "../../../vox/scene/IRendererScene";
import { IAwardSceneParam } from "./IAwardSceneParam";

class VoxAwardScene {
	private m_init = true;
	private m_uisc: IRendererScene;
	private m_vasParam: IAwardSceneParam;
	constructor() {}

	initialize(uisc: IRendererScene, vasParam: IAwardSceneParam): void {

		if (this.m_init) {
			this.m_init = false;
			this.m_uisc = uisc;
			this.m_vasParam = vasParam;
			this.initScene();
		}
	}
	private initScene(): void {
		// let rst = this.m_uisc.getRenderProxy().renderingState;
		let vparam = this.m_vasParam;
		let tex = vparam.getTexByUrl("static/assets/vox.png");
		tex.flipY = true;
		let pw = 130;
		let ph = 130;
		let pl0 = vparam.createXOYPlane(0,0, pw, ph, tex);
		let st = this.m_uisc.getStage3D();
		pl0.setXYZ(st.stageWidth - pw - 20, st.stageHeight - ph - 20, 0);
		this.m_uisc.addEntity(pl0, vparam.pid);
	}
}
export { VoxAwardScene };
