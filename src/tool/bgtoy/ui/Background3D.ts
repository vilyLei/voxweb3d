import RenderableEntityContainer from "../../../vox/entity/RenderableEntityContainer";
import ScreenFixedAlignPlaneEntity from "../../../vox/entity/ScreenFixedAlignPlaneEntity";
import Color4 from "../../../vox/material/Color4";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IFBOInstance from "../../../vox/scene/IFBOInstance";
import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import RendererDevice from "../../../vox/render/RendererDevice";
import Cloud01Material from "../../../pixelToy/cloud/material/Cloud01Material";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
// import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
// import RendererState from "../../../vox/render/RendererState";

class Background3D {
	private m_rscene: IRendererScene = null;
	private m_bg: ScreenFixedAlignPlaneEntity = null;
	// private m_sph: Sphere3DEntity = null;
	private m_bgContainer = new RenderableEntityContainer();
	private m_bgColor = new Color4();
	bgEnabled = true;
	constructor() {}

	initialize(sc: IRendererScene): void {
		if (this.m_rscene == null && sc != null) {
			this.m_rscene = sc;
			this.initFBO(this.m_rscene);
			this.initBG();
		}
	}
	getRScene(): IRendererScene {
		return this.m_rscene;
	}
	getFBOTex(): IRenderTexture {
		return this.m_fboIns.getRTTAt(0);
	}
	private m_fboIns: IFBOInstance = null;
	private m_fixPlane = new ScreenAlignPlaneEntity();
	private initFBO(rc: IRendererScene): void {
		let rscene = rc;
		let pw = 256;
		let ph = 256;
		if (RendererDevice.IsMobileWeb()) {
			pw = 128;
		}
		let fboIns = rscene.createFBOInstance();
		fboIns.setClearRGBAColor4f(0.3, 0.0, 0.0, 1.0);
		fboIns.createFBOAt(0, pw, ph, false, false);
		fboIns.setRenderToRTTTextureAt(0);
		fboIns.asynFBOSizeWithViewport();

		this.m_fboIns = fboIns;
		let whiteTex = rscene.textureBlock.createRGBATex2D(pw, ph, new Color4());
		let material_cloud01 = new Cloud01Material();
		material_cloud01.fixScreen = true;
		material_cloud01.setSize(pw, ph);
		material_cloud01.setTextureList([whiteTex]);
		material_cloud01.setTime(Math.random() * 200);
		material_cloud01.setFactor(1.7 + Math.random() * 0.5);
		material_cloud01.initializeByCodeBuf(true);
		this.m_fixPlane.setMaterial(material_cloud01);
		this.m_fixPlane.initialize(-1, -1, 2, 2);
		this.m_fixPlane.intoRendererListener = (): void => {
			this.m_fixPlane.setVisible(true);
			fboIns.runBegin();
			fboIns.drawEntity(this.m_fixPlane);
			fboIns.runEnd();
			this.m_fixPlane.setVisible(false);
			rscene.setRenderToBackBuffer();
		};
		this.m_fixPlane.setVisible(false);
		rscene.addEntity(this.m_fixPlane, 0, false);

		// let viewPlane = new Plane3DEntity();
		// viewPlane.initializeXOY(0, 0, pw, ph, [fboIns.getRTTAt(0)]);
		// viewPlane.setXYZ(200, 200, 0);
		// this.rscene.addEntity(viewPlane, 1);

		// let viewPlane = new ScreenAlignPlaneEntity();
		// viewPlane.initialize(-1, -1, 2, 2, [fboIns.getRTTAt(0)]);
		// viewPlane.setRGB3f(0.3, 0.3, 0.3);
		// rscene.addEntity(viewPlane, 1);
	}

	setBGRGBAColor(c: Color4): void {
		this.m_bg.setRGBA4f(c.r, c.g, c.b, 1.0);
		// (this.m_sph.getMaterial() as IColorMaterial).setRGBA4f(c.r, c.g, c.b, 1.0);
	}
	changeBGColor(color: Color4 = null): void {
		this.m_bgColor.randomRGB(0.25, 0.05);
		this.m_bgColor.rgbSizeTo(0.3 + Math.random() * 0.3);
		color = color ? color : this.m_bgColor;
		this.m_rscene.setClearRGBAColor4f(color.r, color.g, color.b, 0.0);
		this.setBGRGBAColor(color);
	}
	private initBG(): void {
		if (this.bgEnabled) {
			let sc = this.m_rscene;
			console.log("xxx background3d init builder .....");
			let bg = new ScreenFixedAlignPlaneEntity();
			this.m_bg = bg;
			let ts = this.m_fboIns ? [this.m_fboIns.getRTTAt(0)] : null;
			bg.depthAlwaysFalse = true;
			bg.transparentBlend = true;
			bg.initialize(-1, -1, 2.0, 2.0, ts);

			this.m_bgContainer.addChild(bg);

			// let sph = new Sphere3DEntity();
			// // sph.toTransparentBlend();
			// // sph.setRenderState(RendererState.FRONT_TRANSPARENT_STATE)
			// sph.initialize(100, 30, 30, ts);
			// sph.setXYZ(-1000, 400, 800);
			// sph.setRotationXYZ(Math.random() * 300, Math.random() * 300, Math.random() * 300);
			// this.m_bgContainer.addChild(sph);
			// this.m_sph = sph;
			// this.changeBGColor();

			sc.addEntity(this.m_bgContainer, 0);
		}
	}
}

export { Background3D };
