import RenderableEntityContainer from "../../../vox/entity/RenderableEntityContainer";
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
	private m_leftRectPl = new Plane3DEntity();
	// private m_rightRectPl = new Plane3DEntity();
	private m_bgTex: IRenderTexture;
	private m_bg: ScreenFixedAlignPlaneEntity = null;
	private m_bgContainer = new RenderableEntityContainer()
	constructor() {}

	initialize(sc: IRendererScene, bgTex: IRenderTexture): void {
		if (this.m_rscene == null && sc != null) {
			this.m_rscene = sc;
			this.m_bgTex = bgTex;
			this.init();
		}
	}
	disable(): void {
		this.m_leftRectPl.setVisible(false);
		// this.m_rightRectPl.setVisible(false);
		console.log("Background()::disable() ...");
	}
	enable(): void {
		this.m_leftRectPl.setVisible(true);
		// this.m_rightRectPl.setVisible(true);
		console.log("Background()::enable() ...");
	}
	setBGRGBAColor(c: Color4): void {
		(this.m_bg.getMaterial() as IColorMaterial).setRGBA4f(c.r, c.g, c.b, 1.0);
	}
	private initWorkSpaceBG(wbg: Plane3DEntity): void {
		wbg.materialName = "left_bg";
		let fcode = `
		vec4 fc = vec4(1.0,1.0,0.0,0.5);
		vec2 fuv = fract(gl_FragCoord.xy/vec2(512.0, 512.0));
		fuv = fract(gl_FragCoord.xy/vec2(30.0)) - vec2(0.5);
		vec2 flagUV = max(sign(fuv), vec2(0.0));
		float flag = flagUV.y > 0.0 ? flagUV.x : 1.0 - flagUV.x;
		fc.xyz = mix(vec3(0.9), vec3(0.5), flag);
		FragColor0 = fc;
		`;
		this.m_leftRectPl.materialFragBodyTailCode = fcode;
	}
	private m_bgColor = new Color4();
	changeBGColor(color: Color4 = null): void {
		this.m_bgColor.randomRGB(0.25, 0.05);
		this.m_bgColor.rgbSizeTo(0.3 + Math.random() * 0.3);
		color = color ? color : this.m_bgColor;
		this.m_rscene.setClearRGBAColor4f(color.r, color.g, color.b, 0.0);
		this.setBGRGBAColor(color);
	}
	private init(): void {
		let sc = this.m_rscene;
		console.log("xxx init builder .....");
		let bg = new ScreenFixedAlignPlaneEntity();
		let ts = this.m_bgTex ? [this.m_bgTex] : null;
		bg.initialize(-1, -1, 2.0, 2.0, ts);
		// (m_bg.getMaterial() as IColorMaterial).setColor(new Color4().randomRGB());
		bg.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		this.m_bgContainer.addChild(bg);
		// sc.addEntity( m_bg, 1 );
		this.m_bg = bg;
		bg.intoRendererListener = (): void => {
			this.initWorkSpaceBG(this.m_leftRectPl);
			this.m_leftRectPl.initializeXOY(-512, -256, 512, 512);
			(this.m_leftRectPl.getMaterial() as IColorMaterial).setRGBA4f(0.0, 0.0, 0.0, 0.6);
			this.m_leftRectPl.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
			// sc.addEntity( this.m_leftRectPl, 1 );
			this.m_bgContainer.addChild(this.m_leftRectPl);
			this.m_leftRectPl.setVisible(false);
		}
		this.changeBGColor();
		// this.m_rightRectPl.initializeXOY(0, -256, 512, 512);
		// (this.m_rightRectPl.getMaterial() as IColorMaterial).setRGBA4f(0.11, 0.21, 0.11, 0.6);
		// this.m_rightRectPl.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
		// sc.addEntity( this.m_rightRectPl );
		sc.addEntity( this.m_bgContainer, 1 );
		this.disable();

	}
	updateLayout(rect: IAABB2D): void {
	}
}

export { Background };
