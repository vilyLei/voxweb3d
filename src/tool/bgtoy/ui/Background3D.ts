import RenderableEntityContainer from "../../../vox/entity/RenderableEntityContainer";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import ScreenFixedAlignPlaneEntity from "../../../vox/entity/ScreenFixedAlignPlaneEntity";
import IAABB2D from "../../../vox/geom/IAABB2D";
import Color4 from "../../../vox/material/Color4";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
import RendererState from "../../../vox/render/RendererState";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UIBuilder } from "./UIBuilder";
import TextureConst from "../../../vox/texture/TextureConst";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";
import { IRendererSceneAccessor } from "../../../vox/scene/IRendererSceneAccessor";
import IFBOInstance from "../../../vox/scene/IFBOInstance";
import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import RendererDevice from "../../../vox/render/RendererDevice";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import Cloud01Material from "../../../pixelToy/cloud/material/Cloud01Material";
class SceneAccessor implements IRendererSceneAccessor {
	constructor() { }
	renderBegin(rendererScene: IRendererScene): void {
		let p = rendererScene.getRenderProxy();
		p.clearDepth(1.0);
	}
	renderEnd(rendererScene: IRendererScene): void {
	}
}
class Background3D {
	private m_graph: IRendererSceneGraph = null;
	private m_rscene: IRendererScene = null;
	private m_leftRectPl = new Plane3DEntity();
	// private m_rightRectPl = new Plane3DEntity();
	private m_bgTex: IRenderTexture;
	private m_bg: ScreenFixedAlignPlaneEntity = null;
	private m_bgContainer = new RenderableEntityContainer();
	private m_bgTopInfoContainer = new RenderableEntityContainer();
	uiBuilder: UIBuilder = null;
	constructor() {}

	initialize(graph: IRendererSceneGraph, bgTex: IRenderTexture): void {
		if (this.m_rscene == null && graph != null) {
			this.m_graph = graph;

			let rparam = graph.createRendererParam();
			rparam.cameraPerspectiveEnabled = false;
			rparam.setCamProject(45.0, 0.1, 3000.0);
			rparam.setCamPosition(0.0, 0.0, 1500.0);

			this.m_rscene = graph.createSubScene(rparam);
			this.m_rscene.setAccessor(new SceneAccessor());
			this.initFBO(this.m_rscene);

			// this.m_rscene = this.m_graph.getNodeAt(0).getRScene();
			// this.m_bgTex = bgTex;
			this.m_bgTex = this.m_fboIns.getRTTAt(0);
			this.init();
		}
	}
	getRScene(): IRendererScene {
		return this.m_rscene;
	}
	private m_fboIns: IFBOInstance = null;
	private m_fixPlane = new ScreenAlignPlaneEntity();
	private m_currFboEntity: IRenderEntity = null;
	private initFBO(rc: IRendererScene): void {
		let rscene = rc;
		let pw = 256;
		let ph = 256;
		if(RendererDevice.IsMobileWeb()) {
			pw = 128;
		}
		let fboIns = rscene.createFBOInstance();
		fboIns.setClearRGBAColor4f(0.3, 0.0, 0.0, 1.0); // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
		fboIns.createFBOAt(0, pw, ph, false, false);
		fboIns.setRenderToRTTTextureAt(0); // apply the first rtt texture, and apply the fbo framebuffer color attachment 0
		fboIns.asynFBOSizeWithViewport();
		fboIns.setRProcessIDList([0], false);
		fboIns.setAutoRunning(true);
		this.m_fboIns = fboIns;

		let whiteTex = rscene.textureBlock.createRGBATex2D(pw, ph, new Color4());
		let material_cloud01 = new Cloud01Material();
		material_cloud01.fixScreen = true;
		material_cloud01.setSize(pw, ph);
		material_cloud01.setTextureList([whiteTex]);
		material_cloud01.setTime(Math.random() * 200);
		material_cloud01.setFactor(1.7 + Math.random() * 0.5);
		this.m_fixPlane.setMaterial(material_cloud01);
		this.m_fixPlane.initialize(-1, -1, 2, 2);
		// this.m_fboIns.drawEntity(this.m_fixPlane);
		this.m_fixPlane.intoRendererListener = (): void => {
			this.m_currFboEntity = this.m_fixPlane;
		};
		rscene.addEntity(this.m_fixPlane, 0);

		// let viewPlane = new Plane3DEntity();
		// viewPlane.initializeXOY(0, 0, pw, ph, [fboIns.getRTTAt(0)]);
		// viewPlane.setXYZ(200, 200, 0);
		// this.rscene.addEntity(viewPlane, 1);

		// let viewPlane = new ScreenAlignPlaneEntity();
		// viewPlane.initialize(-1, -1, 2, 2, [fboIns.getRTTAt(0)]);
		// viewPlane.setRGB3f(0.3, 0.3, 0.3);
		// rscene.addEntity(viewPlane, 1);
	}
	private m_times = 4;

	run(): void {
		if (this.m_currFboEntity) {
			if (this.m_times > 0) {
				this.m_times--;
				if (this.m_times == 1) {
					this.m_currFboEntity = null;
					this.m_fboIns.setAutoRunning(false);
					this.m_rscene.removeRenderNode(this.m_fboIns);
				}
			}
		}
	}

	disable(): void {
		this.m_leftRectPl.setVisible(false);
		// this.m_rightRectPl.setVisible(false);
		console.log("Background3D()::disable() ...");
	}
	enable(): void {
		this.m_leftRectPl.setVisible(true);
		// this.m_rightRectPl.setVisible(true);
		console.log("Background3D()::enable() ...");
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
		this.m_bg = bg;
		let ts = this.m_bgTex ? [this.m_bgTex] : null;
		bg.depthAlwaysFalse = true;
		bg.transparentBlend = true;
		bg.initialize(-1, -1, 2.0, 2.0, ts);
		// this.changeBGColor();

		this.m_bgContainer.addChild(bg);

		let pl0 = this.m_leftRectPl;
		bg.intoRendererListener = (): void => {
			this.initWorkSpaceBG(this.m_leftRectPl);

			pl0.depthAlwaysFalse = true;
			pl0.transparentBlend = true;
			pl0.initializeXOY(-512, -256, 512, 512);
			pl0.setRGBA4f(0.0, 0.0, 0.0, 0.6);
			// sc.addEntity( this.m_leftRectPl, 1 );
			this.m_bgContainer.addChild(pl0);
			pl0.setVisible(false);
		};
		this.changeBGColor();
		// this.m_rightRectPl.initializeXOY(0, -256, 512, 512);
		// (this.m_rightRectPl.getMaterial() as IColorMaterial).setRGBA4f(0.11, 0.21, 0.11, 0.6);
		// this.m_rightRectPl.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
		// sc.addEntity( this.m_rightRectPl );

		this.m_bgContainer.addChild(this.m_bgTopInfoContainer);

		sc.addEntity(this.m_bgContainer, 1);
		this.disable();
		// this.buildBGInfo();
	}
	buildInfo(): void {
		this.buildBGInfo();
	}
	private buildBGInfo(): void {
		let builder = this.uiBuilder;
		let container = this.m_bgTopInfoContainer;
		let tex = builder.createCharsTexFixSize(800, 150, "去除黑色或其他颜色背景, 生成透明背景PNG图", 30);
		tex.flipY = true;
		let pw = tex.getWidth();
		let ph = tex.getHeight();
		let plane = new Plane3DEntity();
		plane.depthAlwaysFalse = true;
		plane.transparentBlend = true;
		plane.initializeXOY(-0.5 * pw, -0.5 * ph, pw, ph, [tex]);
		plane.setColor(new Color4().scaleBy(0.7).setAlpha(0.8));
		container.addChild(plane);
	}

	updateLayout(rect: IAABB2D): void {
		let st = this.m_rscene.getStage3D();
		let container = this.m_bgTopInfoContainer;
		if (container) {
			container.setXYZ(0, rect.height * 0.75, 0);
			container.update();
			// this.m_bgContainer.update();
		}
	}
}

export { Background3D };
