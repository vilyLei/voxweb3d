import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoEdit } from "../../edit/ICoEdit";
import { ICoUI } from "../../voxui/ICoUI";
import { ICoTexture } from "../../voxtexture/ICoTexture";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { ICoRScene } from "../../voxengine/ICoRScene";

import { ICoUIInteraction } from "../../voxengine/ui/ICoUIInteraction";
import ViewerMaterialCtx from "../../demo/coViewer/ViewerMaterialCtx";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IRendererSceneAccessor } from "../../../vox/scene/IRendererSceneAccessor";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";
import { CoPostOutline } from "../../app/effect/CoPostOutline";
import { NVTransUI } from "../../app/normalViewer/ui/NVTransUI";
import { NVNavigationUI } from "../../app/normalViewer/ui/NVNavigationUI";
import { NormalViewer } from "../../app/normalViewer/sc/NormalViewer";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
import { PromptSystem } from "../../voxui/system/PromptSystem";
import { ICoText } from "../../voxtext/ICoText";
import { CoModuleLoader } from "../../app/utils/CoModuleLoader";
import { TipsSystem } from "../../voxui/system/TipsSystem";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
declare var CoEdit: ICoEdit;
declare var CoUI: ICoUI;
declare var CoTexture: ICoTexture;
declare var CoText: ICoText;

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
export class DemoTransEditor {
	private m_rsc: ICoRendererScene = null;
	private m_editUIRenderer: ICoRendererScene = null;
	private m_uirsc: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;
	private m_interact: IMouseInteraction = null;
	private m_transUI = new NVTransUI();
	private m_nvaUI = new NVNavigationUI();

	private m_vmctx: ViewerMaterialCtx;
	private m_outline: CoPostOutline;
	private m_viewer: NormalViewer = null;

	constructor() { }

	initialize(): void {

		document.oncontextmenu = function (e) {
			e.preventDefault();
		}

		console.log("DemoTransEditor::initialize() ...");
		// //<a href="D:\Series\Breaking Bad">Click to open a folder</a>
		// //D:\resource\
		// let a = document.createElement('a');
		// a.href = "D:\\resource\\";
		// a.text = "ddfdfdfdf"
		// document.body.appendChild(a);
		// (a as any).style = 'display: none';
		// a.click();
		// // a.remove();
		// return;
		this.initEngineModule();
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

				this.initScene();
				new CoModuleLoader(3, (): void => {

					console.log("math module loaded ...");

					new CoModuleLoader(7, (): void => {
						console.log("ageom module loaded ...");
						this.initEditUI();
					}).load(url3).load(url4).load(url6).load(url7).load(url9).load(url10).load(url11);

				}).load(url2).load(url5).load(url8);
			}
		}).addLoader(uiInteractML)
			.load(url0)
			.load(url1);

		uiInteractML.load(url);
	}
	private initEditUI(): void {

		this.m_coUIScene = CoUI.createUIScene();
		this.m_coUIScene.initialize(this.m_rsc, 512, 5);
		this.m_uirsc = this.m_coUIScene.rscene;
		this.m_graph.addScene(this.m_uirsc);

		let promptSys = new PromptSystem();
		promptSys.initialize( this.m_coUIScene );
		this.m_coUIScene.prompt = promptSys;
		let tipsSys = new TipsSystem();
		tipsSys.initialize( this.m_coUIScene );
		this.m_coUIScene.tips = tipsSys;

		// this.m_transUI.tip = this.m_tip;
		this.m_transUI.setOutline(this.m_outline);
		this.m_transUI.initialize(this.m_rsc, this.m_editUIRenderer, this.m_coUIScene);
		// this.m_nvaUI.tip = this.m_tip;
		this.m_nvaUI.initialize(this.m_rsc, this.m_editUIRenderer, this.m_coUIScene);

		let minV = CoMath.createVec3(-100, 0, -100);
		let maxV = minV.clone().scaleBy(-1);
		let scale = 10.0
		let grid = CoEdit.createFloorLineGrid();
		grid.initialize(this.m_rsc, 0, minV.scaleBy(scale), maxV.scaleBy(scale), 30);

		let viewer = new NormalViewer();
		viewer.initialize(this.m_coUIScene, this.m_transUI);
		viewer.open();
		this.m_viewer = viewer;
		let entitySC = viewer.normalScene.entityScene;
		entitySC.initialize( this.m_rsc );
	}

	private initScene(): void {

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

			// console.log("60/255: ", 60/255);
			// rscene.setClearUint24Color((60 << 16) + (60 << 8) + 60);

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
		console.log("DemoTransEditor::mouseDownListener() ...");
	}
	private keyDown(evt: any): void {

		console.log("DemoTransEditor::keyDown() ..., evt.keyCode: ", evt.keyCode);

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
				this.m_interact.run();
			}
			if (this.m_transUI != null) {
				this.m_transUI.run();
			}
			this.m_graph.run();
		}
	}
}

export default DemoTransEditor;
