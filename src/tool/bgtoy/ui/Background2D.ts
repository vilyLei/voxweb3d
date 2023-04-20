import RenderableEntityContainer from "../../../vox/entity/RenderableEntityContainer";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import IAABB2D from "../../../vox/geom/IAABB2D";
import Color4 from "../../../vox/material/Color4";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UIBuilder } from "./UIBuilder";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";
import { IRendererSceneAccessor } from "../../../vox/scene/IRendererSceneAccessor";
import { Background3D } from "./Background3D";
class SceneAccessor implements IRendererSceneAccessor {
	constructor() { }
	renderBegin(rendererScene: IRendererScene): void {
		let p = rendererScene.getRenderProxy();
		p.clearDepth(1.0);
	}
	renderEnd(sc: IRendererScene): void {
	}
}
class Background2D {
	private m_graph: IRendererSceneGraph = null;
	private m_rscene: IRendererScene = null;
	private m_leftRectPl = new Plane3DEntity();
	// private m_rightRectPl = new Plane3DEntity();
	private m_bgContainer = new RenderableEntityContainer();
	private m_bgTopInfoContainer = new RenderableEntityContainer();
	uiBuilder: UIBuilder = null;
	bg3d: Background3D = null;
	constructor() {}

	initialize(graph: IRendererSceneGraph): void {
		if (this.m_graph == null && graph != null) {
			this.m_graph = graph;

			let rparam = graph.createRendererParam();
			rparam.cameraPerspectiveEnabled = false;
			rparam.setCamProject(45.0, 0.1, 3000.0);
			rparam.setCamPosition(0.0, 0.0, 1500.0);

			this.m_rscene = graph.createSubScene(rparam);
			this.m_rscene.setAccessor(new SceneAccessor());
			// this.m_rscene = this.m_graph.getNodeAt(0).getRScene();

			this.init();
		}
	}
	getRScene(): IRendererScene {
		return this.m_rscene;
	}

	disable(): void {
		this.m_leftRectPl.setVisible(false);
		// this.m_rightRectPl.setVisible(false);
		console.log("Background2D()::disable() ...");
	}
	enable(): void {
		this.m_leftRectPl.setVisible(true);
		// this.m_rightRectPl.setVisible(true);
		console.log("Background2D()::enable() ...");
	}
	setBGRGBAColor(c: Color4): void {
		if(this.bg3d) {
			this.bg3d.setBGRGBAColor(c);
		}
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
	changeBGColor(color: Color4 = null): void {
		if(this.bg3d) {
			this.bg3d.changeBGColor(color);
		}
	}
	private init(): void {
		let sc = this.m_rscene;
		console.log("xxx background2d init builder .....");
		let pl0 = this.m_leftRectPl;
		this.initWorkSpaceBG(pl0);
		pl0.depthAlwaysFalse = true;
		pl0.transparentBlend = true;
		pl0.initializeXOY(-512, -256, 512, 512);
		pl0.setRGBA4f(0.0, 0.0, 0.0, 0.6);
		this.m_bgContainer.addChild(pl0);
		pl0.setVisible(false);
		this.m_bgContainer.addChild(this.m_bgTopInfoContainer);
		sc.addEntity(this.m_bgContainer, 1);
		this.disable();
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
		// let st = this.m_rscene.getStage3D();
		let container = this.m_bgTopInfoContainer;
		if (container) {
			container.setXYZ(0, rect.height * 0.75, 0);
			container.update();
			// this.m_bgContainer.update();
		}
	}
}

export { Background2D };
