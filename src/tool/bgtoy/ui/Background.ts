import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import AABB2D from "../../../vox/geom/AABB2D";
import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";

class Background {
	private m_rscene: IRendererScene = null;
	leftBG = new ScreenAlignPlaneEntity();
	// rightBG = new ScreenAlignPlaneEntity();
	constructor() {}

	initialize(sc: IRendererScene, pw: number = 0, ph: number = 0): void {
		if (this.m_rscene == null && sc != null) {
			this.m_rscene = sc;
			this.init(pw, ph);
		}
	}
	disable(): void {
		this.leftBG.setVisible(false);
		// this.rightBG.setVisible(false);
	}
	enable(): void {
		this.leftBG.setVisible(true);
		// this.rightBG.setVisible(true);
	}
	private init(pw: number, ph: number): void {
		let sc = this.m_rscene;

		this.leftBG.initialize(-256, -256, 512, 512);
		this.leftBG.setRGBA4f(0.0, 0.0, 0.0, 0.5);
		this.leftBG.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		this.leftBG.setXYZ(-256, 0, 0);
		sc.addEntity( this.leftBG );
		// this.rightBG.copyMeshFrom(this.leftBG);
		// this.rightBG.initialize(-256, -256, 512, 512);
		// this.rightBG.setRGB3f(0.12, 0.21, 0.21);
		// this.rightBG.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
		// this.rightBG.setXYZ(256, 0, 0);
		// sc.addEntity( this.rightBG );
	}
	updateLayout(rect: AABB2D): void {

	}
}

export { Background };
