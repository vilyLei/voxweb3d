import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderEntity from "../../../vox/render/IRenderEntity";
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
	private m_pl: IRenderEntity = null;
	private m_pw = 60;
	private m_ph = 60;
	private m_areaRect: IAABB2D = null;
	private initScene(): void {
		// let rst = this.m_uisc.getRenderProxy().renderingState;
		let vparam = this.m_vasParam;
		let tex = vparam.getTexByUrl("static/assets/ui/vox.png");
		tex.flipY = true;
		let pw = 130;
		let ph = 130;
		let pl0 = vparam.createXOYPlane(0,0, 1.0, 1.0, tex);
		pl0.intoRendererListener = (): void => {

			pw = tex.getWidth();
			ph = tex.getHeight();
			pl0.setScaleXYZ(pw, ph, 1.0);
			//let st = this.m_uisc.getStage3D();
			// pl0.setXYZ(st.stageWidth - pw - 20, st.stageHeight - ph - 20, 0);
			// pl0.update();
			this.m_pw = pw;
			this.m_ph = ph;
			this.updateLayout(this.m_areaRect);
		}
		let st = this.m_uisc.getStage3D();
		pl0.setXYZ(st.stageWidth - pw - 20, st.stageHeight - ph - 20, 0);
		this.m_uisc.addEntity(pl0, vparam.pid);
		this.m_pl = pl0;
	}
	updateLayout(rect: IAABB2D): void {
		this.m_areaRect = rect;
		if(this.m_pl) {
			let pw = this.m_pw;
			let ph = this.m_ph;
			let pl0 = this.m_pl;
			// console.log("rect: ", rect);
			// pl0.setXYZ(rect.getRight() - pw - 20, rect.getTop() - ph - 20, 0);
			// pl0.setXYZ(100, 100, 0);

			let st = this.m_uisc.getStage3D();
			pl0.setXYZ(st.stageWidth - pw - 30, st.stageHeight - ph - 30, 0);
			pl0.update();
		}
	}
}
export { VoxAwardScene };
