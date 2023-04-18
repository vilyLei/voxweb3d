import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import RendererScene from "../vox/scene/RendererScene";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import RemoveBlackBGMaterial from "./material/RemoveBlackBGMaterial";
import MouseEvent from "../vox/event/MouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";
import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../orthoui/usage/ParamCtrlUI";
import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "./base/DropFileController";
import Color4 from "../vox/material/Color4";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { CookieSystem } from "./bgtoy/fio/CookieSystem";

import CanvasTextureTool from "../orthoui/assets/CanvasTextureTool";
import SelectionBar from "../orthoui/button/SelectionBar";
import RendererState from "../vox/render/RendererState";
import { HttpFileLoader } from "../cospace/modules/loaders/HttpFileLoader";
import { UIBuilder } from "./bgtoy/ui/UIBuilder";
import Vector3D from "../vox/math/Vector3D";
import EventBase from "../vox/event/EventBase";

export class DemoUI {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_dropController = new DropFileController();
	constructor() {}

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {
		console.log("DemoUI::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setCamProject(45, 0.1, 3000.0);
			rparam.setCamPosition(0.0, 0.0, 1500.0);
			// rparam.setAttriAlpha(true);
			// rparam.setAttriAntialias(true);
			rparam.cameraPerspectiveEnabled = false;
			// rparam.autoSyncRenderBufferAndWindowSize = true;
			// 保持 html body color 和 renderer clear color 同步，以便正确表现alpha混合
			// rparam.syncBgColor = false;

			let rscene = this.m_graph.createScene(rparam);
			// rscene.initialize(rparam).setAutoRunning(true);
			rscene.setClearRGBAColor4f(0.2, 0.3, 0.2, 0.0);
			rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);
			this.m_rscene.enableMouseEvent(true);
			// new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			// new RenderStatusDisplay(rscene, true);

			// this.m_graph.setAutoRunning(true);

			this.m_dropController.initialize(document.body as any, this);

			CanvasTextureTool.GetInstance().initialize(this.m_rscene);
			CanvasTextureTool.GetInstance().initializeAtlas(1024, 1024, new Color4(1.0, 1.0, 1.0, 0.0), true);
			let st = rscene.getStage3D();
			// rscene.setViewPort(0, 0, st.stageWidth, st.stageHeight);
			rscene.addEventListener(EventBase.ENTER_FRAME, this, (evt: any): void => {
				rscene.getCamera().translationXYZ(st.stageHalfWidth, st.stageHalfHeight, 1500.0);
				rscene.getCamera().update();
			});
			this.initScene();
		}
	}
	private initScene(): void {
		let uirsc = this.m_rscene;
		let btn = new SelectionBar();
		// btn.fontColor.setRGBA4f(0,0,0,1);
		// btn.fontBgColor.setRGBA4f(1,1,1,1);
		let fontSize = 23;
		let ins = CanvasTextureTool.GetInstance();
		ins.heightOffset = 9;
		btn.bodyVisible = false;
		btn.initialize(uirsc, "图像处理方式1", "输出颜色值翻转1", "错误呈现效果", fontSize);
		// btn.setScale(1.0 / 2.0);
		btn.setXY(210, 50)
		btn.setRenderState(RendererState.BACK_ALPHA_ADD_ALWAYS_STATE);

		let uiBuilder = new UIBuilder();
		let btn2 = uiBuilder.createBtnWithIcon(
			"图像处理方式1-25-rgba(255,255,255,1)-rgba(255,255,255,0.3)-0",
			null,
			250,
			40,
			"图像处理方式1",
			fontSize,
			new Vector3D(),
			new Vector3D(),
			new Color4(1, 1, 1, 1),
			new Color4(1, 1, 1, 0.5)
		);
		btn2.setXY(210, 130);
		uirsc.addEntity(btn2);


		let btn3 = uiBuilder.createBtnWithIcon(
			"vvv",
			null,
			170,
			40,
			"图像处理方式2",
			fontSize,
			new Vector3D(),
			new Vector3D(),
			new Color4(1, 1, 1, 1),
			new Color4(1, 1, 1, 0.3)
		);
		btn3.setXY(270, 170);
		uirsc.addEntity(btn3);

		let tex = ins.getAtlasAt(0).getTexture();
		let pl = new Plane3DEntity();
		pl.transparentBlend = true;
		pl.doubleFace = true;
		pl.initializeXOY(0,-0.5, 1,1, [tex]);
		pl.setScaleXYZ(1021.0, -1021.0, 0.0);
		pl.setXYZ(20.5, 20.7, 1.0);
		// pl.setScaleXYZ(1.0, 1.0, 1.0);
		uirsc.addEntity(pl, 2);
	}
	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		console.log("initFileLoad(), files.length: ", files.length);
		for (let i = 0; i < files.length; ++i) {
			this.loadedRes(files[i].url, files[i].name);
		}
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}
	private m_name = "";
	private loadedRes(url: string, name: string): void {
		// console.log("loadedRes A, url: ", url,", name: ", name);
		if (name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadedRes, url: ", url, ", name: ", name);
		this.m_name = name;
	}
	private mouseDown(evt: any): void {
		console.log("mouseDown() ...");
	}
	run(): void {
		this.m_graph.run();
	}
}
export default DemoUI;
