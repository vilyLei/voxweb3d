import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import ScreenFixedAlignPlaneEntity from "../../../vox/entity/ScreenFixedAlignPlaneEntity";
import IAABB2D from "../../../vox/geom/IAABB2D";
import Color4 from "../../../vox/material/Color4";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";

class Background {
	private m_rscene: IRendererScene = null;
	// private leftBG = new ScreenAlignPlaneEntity();
	private leftBG = new Plane3DEntity();
	private rightBG = new Plane3DEntity();
	// bg: Plane3DEntity = null;
	bg: ScreenFixedAlignPlaneEntity = null;
	// bg: ScreenAlignPlaneEntity = null;
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
	setBGRGBAColor(c: Color4): void {
		(this.bg.getMaterial() as IColorMaterial).setRGBA4f(c.r, c.g, c.b, 0.5);
	}
	private init(pw: number, ph: number): void {
		let sc = this.m_rscene;

		let bg = new ScreenFixedAlignPlaneEntity();
		bg.initialize(-1, -1, 2.0, 2.0);
		(bg.getMaterial() as IColorMaterial).setRGBA4f(0.11, 0.21, 0.11, 1.0);
		bg.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		sc.addEntity( bg );
		this.bg = bg;

		this.leftBG.initializeXOY(-512, -256, 512, 512);
		// this.leftBG.initializeXOY(-128, -64, 256, 128);
		(this.leftBG.getMaterial() as IColorMaterial).setRGBA4f(0.0, 0.0, 0.0, 0.5);
		this.leftBG.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		sc.addEntity( this.leftBG );

		// this.rightBG.initializeXOY(0, -256, 512, 512);
		// (this.rightBG.getMaterial() as IColorMaterial).setRGBA4f(0.11, 0.21, 0.11, 0.6);
		// this.rightBG.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
		// sc.addEntity( this.rightBG );


	}
	updateLayout(rect: IAABB2D): void {
		let sc = this.m_rscene;
		let st = sc.getStage3D();
		// if(this.leftBG) {
		// 	this.bg.setScaleXYZ(st.stageWidth, st.stageHeight, 1.0);
		// 	this.bg.update();
		// 	// let dpr = sc.getDevicePixelRatio();
		// 	// dpr = 1.0;
		// 	// this.leftBG.setScaleXYZ(dpr, dpr, 1.0);
		// 	// this.leftBG.update();
		// }
	}
}

export { Background };
