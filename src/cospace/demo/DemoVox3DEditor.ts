import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoMath } from "../math/ICoMath";
import { ICoEdit } from "../edit/ICoEdit";
import { ICoUI } from "../voxui/ICoUI";
import { ICoTexture } from "../voxtexture/ICoTexture";
import { ICoUIScene } from "../voxui/scene/ICoUIScene";
import { ICoRScene } from "../voxengine/ICoRScene";

import { ICoUIInteraction } from "../voxengine/ui/ICoUIInteraction";
import ViewerMaterialCtx from "../demo/coViewer/ViewerMaterialCtx";
import { IRendererSceneAccessor } from "../../vox/scene/IRendererSceneAccessor";
import IRendererSceneGraph from "../../vox/scene/IRendererSceneGraph";
import { CoPostOutline } from "../app/effect/CoPostOutline";
import { NVTransUI } from "../app/normalViewer/ui/NVTransUI";
import { NVNavigationUI } from "../app/normalViewer/ui/NVNavigationUI";
import { NormalViewer } from "../app/normalViewer/sc/NormalViewer";
import { ICoText } from "../voxtext/ICoText";
import { CoModuleLoader } from "../app/utils/CoModuleLoader";
import { UIConfig } from "../voxui/system/UIConfig";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
declare var CoEdit: ICoEdit;
declare var CoUI: ICoUI;
declare var CoTexture: ICoTexture;
declare var CoText: ICoText;
//*
class LoadingUI {
	constructor() { }
	private m_bodyDiv: HTMLDivElement = null;
	private m_infoDiv: HTMLDivElement = null;
	initUI(): void {
		document.body.style.background = "#000000";
		if (this.m_bodyDiv == null) {
			this.m_bodyDiv = document.createElement('div');
			this.m_bodyDiv.style.width = "100vw";
			this.m_bodyDiv.style.height = "100vh";
			this.m_bodyDiv.style.zIndex = "9999";
			this.elementCenter(this.m_bodyDiv);
			document.body.appendChild(this.m_bodyDiv);
			document.body.style.margin = '0';
		}
	}

	showInfo(str: string): void {

		if (this.m_infoDiv == null) {
			this.m_infoDiv = document.createElement('div');
			this.m_infoDiv.style.backgroundColor = "rgba(255,255,255,0.1)";
			this.m_infoDiv.style.color = "#00ee00";
			this.m_infoDiv.style.zIndex = "10000";
			this.elementCenter(this.m_infoDiv);
			this.m_bodyDiv.appendChild(this.m_infoDiv);
		}
		// this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
		// this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
		// document.body.appendChild(this.m_bodyDiv);
		this.m_infoDiv.innerHTML = str;
	}
	showLoadProgressInfo(progress: number): void {
		let str = "loading " + Math.round(100.0 * progress) + "% ";
		this.showInfo(str);
	}

	showLoadStart(): void {
		this.showInfo("loading 0%");
	}
	showLoaded(): void {
		this.showInfo("100%");
	}
	loadFinish(index: number = 0): void {
		if (this.m_bodyDiv != null) {
			this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
			this.m_bodyDiv = null;
		}
	}
	private elementCenter(ele: HTMLElement, top: string = "50%", left: string = "50%", position: string = "absolute"): void {

		ele.style.textAlign = "center";
		ele.style.display = "flex";
		ele.style.flexDirection = "column";
		ele.style.justifyContent = "center";
		ele.style.alignItems = "center";
		// ele.style.top = top;
		// ele.style.left = left;
		// ele.style.position = position;
		// ele.style.transform = "translate(-50%, -50%)";
	}

}
//*/
class SceneAccessor implements IRendererSceneAccessor {
	constructor() { }
	renderBegin(rendererScene: IRendererScene): void {
		let p = rendererScene.getRenderProxy();
		p.clearDepth(1.0);
	}
	renderEnd(rendererScene: IRendererScene): void {
	}
}
/**
 * cospace renderer
 */
export class DemoVox3DEditor {
	private m_rsc: IRendererScene = null;
	private m_editUIRenderer: IRendererScene = null;
	private m_uirsc: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;
	private m_interact: IMouseInteraction = null;
	private m_transUI = new NVTransUI();
	private m_nvaUI = new NVNavigationUI();

	private m_vmctx: ViewerMaterialCtx;
	private m_outline: CoPostOutline;
	private m_loadingUI: LoadingUI = new LoadingUI();
	private m_viewer: NormalViewer = null;
	constructor() { }

	initialize(): void {

		document.oncontextmenu = function (e) {
			e.preventDefault();
		}
		console.log("DemoVox3DEditor::initialize() ...");

		this.initEngineModule();
		this.m_loadingUI.initUI();
		this.m_loadingUI.showInfo("initializing rendering engine...");
	}
	private initEngineModule(): void {

		let url = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
		let uiInteractML = new CoModuleLoader(2, (): void => {
			this.initInteract();
		});

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		let url2 = "static/cospace/math/CoMath.umd.js";
		let url3 = "static/cospace/ageom/CoAGeom.umd.js";
		let url4 = "static/cospace/coedit/CoEdit.umd.js";
		let url5 = "static/cospace/comesh/CoMesh.umd.js";
		let url6 = "static/cospace/coentity/CoEntity.umd.js";
		let url7 = "static/cospace/particle/CoParticle.umd.js";
		let url8 = "static/cospace/coMaterial/CoMaterial.umd.js";
		let url9 = "static/cospace/cotexture/CoTexture.umd.js";
		let url10 = "static/cospace/coui/CoUI.umd.js";
		let url11 = "static/cospace/cotext/CoText.umd.js";

		new CoModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();

				this.init3DScene();
				this.m_loadingUI.showInfo("initializing editor system...");
				new CoModuleLoader(3, (): void => {

					console.log("math module loaded ...");

					new CoModuleLoader(7, (): void => {
						console.log("ageom module loaded ...");
						this.initEditUI();
						this.m_loadingUI.loadFinish(0);
					}).load(url3).load(url4).load(url6).load(url7).load(url9).load(url10).load(url11);

				}).load(url2).load(url5).load(url8);
			}
		}).addLoader(uiInteractML)
			.load(url0)
			.load(url1);

		uiInteractML.load(url);
	}
	private initEditUI(): void {


		let uiConfig = new UIConfig();
		let cfgUrl = "static/apps/normalViewer/ui/zh-CN/uicfg.json";
		let language = CoRScene.RendererDevice.GetLanguage();
		console.log("XXX language: ", language);
		if (language != "zh-CN") {
			cfgUrl = "static/apps/normalViewer/ui/en-US/uicfg.json";
		}
		uiConfig.initialize(cfgUrl, (): void => {

			this.m_coUIScene = CoUI.createUIScene( uiConfig, this.m_rsc, 512, 5 );
			let coui = this.m_coUIScene;
			// coui.initialize(this.m_rsc, 512, 5);
			this.m_uirsc = coui.rscene;
			this.m_graph.addScene(this.m_uirsc);

			// coui.uiConfig = uiConfig;
			this.initEditSceneSys();
		});

	}
	private initEditSceneSys(): void {

		let coui = this.m_coUIScene;

		// let promptSys = new PromptSystem();
		// promptSys.initialize(coui);
		// coui.prompt = promptSys;
		// let tipsSys = new TipsSystem();
		// tipsSys.initialize(coui);
		// coui.tips = tipsSys;

		this.m_transUI.setOutline(this.m_outline);
		this.m_transUI.initialize(this.m_rsc, this.m_editUIRenderer, coui);
		this.m_nvaUI.initialize(this.m_rsc, this.m_editUIRenderer, coui);

		let minV = CoMath.createVec3(-100, 0, -100);
		let maxV = minV.clone().scaleBy(-1);
		let scale = 10.0;
		let grid = CoEdit.createFloorLineGrid();
		grid.initialize(this.m_rsc, 0, minV.scaleBy(scale), maxV.scaleBy(scale), 30);

		let viewer = new NormalViewer();
		viewer.initialize(coui, this.m_transUI);
		viewer.open();
		this.m_viewer = viewer;
		let entitySC = viewer.normalScene.entityScene;
		entitySC.initialize(this.m_rsc);
	}
	private init3DScene(): void {

	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initInteract(): void {

		let r = this.m_rsc;
		if (r != null && this.m_interact == null && typeof CoUIInteraction !== "undefined") {

			this.m_interact = CoUIInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rsc, 2, true);
			this.m_interact.setSyncLookAtEnabled(true);
		}
	}

	private m_graph: IRendererSceneGraph = null;
	private initRenderer(): void {

		if (this.m_rsc == null) {

			let RendererDevice = CoRScene.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("#606060");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			let rscene = CoRScene.createRendererScene(rparam, 3);
			rscene.setClearRGBColor3f(0.23, 0.23, 0.23);

			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

			// rscene.addEventListener(CoRScene.KeyboardEvent.KEY_DOWN, this, this.keyDown);
			// rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_CLICK, this, this.mouseClickListener);
			// rscene.addEventListener(CoRScene.MouseEvent.MOUSE_RIGHT_UP, this, this.mouseUpListener, true, true);

			this.m_rsc = rscene;

			let subScene = this.m_rsc.createSubScene(rparam, 3, false);
			subScene.enableMouseEvent(true);
			subScene.setAccessor(new SceneAccessor());

			this.m_editUIRenderer = subScene;
			this.m_graph = CoRScene.createRendererSceneGraph();
			this.m_graph.addScene(this.m_rsc);
			this.m_graph.addScene(this.m_editUIRenderer);
			this.m_outline = new CoPostOutline(rscene);

		}
	}
	private mouseUpListener(evt: any): void {
		console.log("mouse up action...");
	}
	private mouseDownListener(evt: any): void {
		console.log("DemoVox3DEditor::mouseDownListener() ...");
	}
	private keyDown(evt: any): void {

		console.log("DemoVox3DEditor::keyDown() ..., evt.keyCode: ", evt.keyCode);

		let KEY = CoRScene.Keyboard;
		switch (evt.keyCode) {
			case KEY.S:

				break;
			default:
				break;
		}
	}
	run(): void {
		if (this.m_graph != null) {
			if (this.m_interact != null) {
				this.m_interact.setLookAtPosition(null);
				this.m_interact.run();
			}
			if (this.m_transUI != null) {
				this.m_transUI.run();
			}
			this.m_graph.run();
		}
	}
}

export default DemoVox3DEditor;
