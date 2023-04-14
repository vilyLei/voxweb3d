import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import ScreenFixedAlignPlaneEntity from "../../../vox/entity/ScreenFixedAlignPlaneEntity";
import IAABB2D from "../../../vox/geom/IAABB2D";
import Color4 from "../../../vox/material/Color4";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
import RendererState from "../../../vox/render/RendererState";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IRendererScene from "../../../vox/scene/IRendererScene";

class Background {
	private m_rscene: IRendererScene = null;
	private leftBG = new Plane3DEntity();
	private rightBG = new Plane3DEntity();
	private m_bgTex: IRenderTexture;
	bg: ScreenFixedAlignPlaneEntity = null;
	constructor() {}

	initialize(sc: IRendererScene, bgTex: IRenderTexture): void {
		if (this.m_rscene == null && sc != null) {
			this.m_rscene = sc;
			this.m_bgTex = bgTex;
			this.init();
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
		(this.bg.getMaterial() as IColorMaterial).setRGBA4f(c.r, c.g, c.b, 1.0);
	}
	private init(): void {
		let sc = this.m_rscene;
		console.log("xxx init builder .....");
		let bg = new ScreenFixedAlignPlaneEntity();
		let ts = this.m_bgTex ? [this.m_bgTex] : null;
		bg.initialize(-1, -1, 2.0, 2.0, ts);
		(bg.getMaterial() as IColorMaterial).setColor(new Color4().randomRGB());
		bg.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		sc.addEntity( bg, 1 );
		this.bg = bg;
		bg.intoRendererListener = (): void => {
			this.leftBG.initializeXOY(-512, -256, 512, 512);
			// this.leftBG.initializeXOY(-128, -64, 256, 128);
			(this.leftBG.getMaterial() as IColorMaterial).setRGBA4f(0.0, 0.0, 0.0, 0.3);
			this.leftBG.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
			sc.addEntity( this.leftBG, 1 );
		}

		// this.rightBG.initializeXOY(0, -256, 512, 512);
		// (this.rightBG.getMaterial() as IColorMaterial).setRGBA4f(0.11, 0.21, 0.11, 0.6);
		// this.rightBG.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
		// sc.addEntity( this.rightBG );


	}
	updateLayout(rect: IAABB2D): void {
		let sc = this.m_rscene;
		// let st = sc.getStage3D();
	}
}

export { Background };
