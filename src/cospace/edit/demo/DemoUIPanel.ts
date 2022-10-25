import { CoDataFormat } from "../../app/CoSpaceAppData";

import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoTexture } from "../../voxtexture/ICoTexture";
import { ICoUI } from "../../voxui/ICoUI";
import { ICoRScene } from "../../voxengine/ICoRScene";

import { ICoMouseInteraction } from "../../voxengine/ui/ICoMouseInteraction";
import ViewerMaterialCtx from "../../demo/coViewer/ViewerMaterialCtx";
import { TextPackedLoader } from "../../modules/loaders/TextPackedLoader";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "../../demo/coViewer/ViewerCoSApp";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IPlane from "../../ageom/base/IPlane";
// import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
// import ImageTexAtlas from "../../voxtexture/atlas/ImageTexAtlas";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { ClipLabel } from "../../voxui/entity/ClipLabel";
import { Button } from "../../voxui/button/Button";
import { ClipColorLabel } from "../../voxui/entity/ClipColorLabel";
import { ColorClipLabel } from "../../voxui/entity/ColorClipLabel";
import { CoUIScene } from "../../voxui/scene/CoUIScene";
import { LeftTopLayouter } from "../../voxui/layout/LeftTopLayouter";
import { ColorLabel } from "../../voxui/entity/ColorLabel";
import { PromptPanel } from "../../voxui/panel/PromptPanel";
import { RectTextTip } from "../../voxui/entity/RectTextTip";
import { TextLabel } from "../../voxui/entity/TextLabel";
import { ITextLabel } from "../../voxui/entity/ITextLabel";
import { NormalPptPanel } from "../../app/normalViewer/ui/NormalPptPanel";
import { NormalCtrlPanel } from "../../app/normalViewer/ui/NormalCtrlPanel";
import { PromptSystem } from "../../voxui/system/PromptSystem";
import { AxisAlignCalc } from "../../voxui/layout/AxisAlignCalc";

// import TextGeometryBuilder from "../../voxtext/base/TextGeometryBuilder";
// import { PlaneMeshBuilder } from "../../voxmesh/build/PlaneMeshBuilder";
// import { DragMoveController } from "../../../../voxeditor/entity/DragMoveController";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoTexture: ICoTexture;
declare var CoUI: ICoUI;

/**
 * cospace renderer
 */
export class DemoUIPanel {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() { }

	initialize(): void {
		console.log("DemoUIPanel::initialize() ...");

		// let layout = new AxisAlignCalc();

		// let sizes = [10, 10, 10];
		// let range = layout.calcRange(100, 0.3, 0.5);
		// console.log("range: ", range);
		// let posList = layout.avgLayout(sizes, range[0], range[1]);
		// console.log("posList: ", posList);

		// return;
		this.initEngineModule();
	}

	private initEngineModule(): void {

		let url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";
		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initInteract();
		});

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		let url2 = "static/cospace/math/CoMath.umd.js";
		let url3 = "static/cospace/ageom/CoAGeom.umd.js";
		let url4 = "static/cospace/coMaterial/CoMaterial.umd.js";
		let url5 = "static/cospace/comesh/CoMesh.umd.js";
		let url6 = " static/cospace/cotexture/CoTexture.umd.js";
		let url7 = "static/cospace/coentity/CoEntity.umd.js";
		let url8 = "static/cospace/coui/CoUI.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");

				this.initRenderer();
				this.initScene();

				new ModuleLoader(1, (): void => {
					console.log("math module loaded ...");

					new ModuleLoader(1, (): void => {
						console.log("ageom module loaded ...");

						new ModuleLoader(1, (): void => {
							console.log("CoMaterial module loaded ...");

							new ModuleLoader(1, (): void => {
								console.log("CoMesh module loaded ...");

								new ModuleLoader(1, (): void => {
									console.log("CoTexture module loaded ...");

									new ModuleLoader(1, (): void => {
										console.log("CoEntity module loaded ...");
										new ModuleLoader(1, (): void => {
											this.initUIScene();
											this.initUISC();
										}).load(url8);
									}).load(url7);
								}).load(url6);
							}).load(url5);
						}).load(url4);
					}).load(url3);
				}).load(url2);

				// this.m_vcoapp = new ViewerCoSApp();
				// this.m_vcoapp.initialize((): void => {
				// 	this.loadOBJ();
				// });
			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private m_uiScene: ICoUIScene = null;
	private initUIScene(): void {
		// let uisc = CoUI.createUIScene(); //new CoUIScene();
		let uisc = new CoUIScene();
		uisc.texAtlasNearestFilter = true;
		this.m_uiScene = uisc;
		let promptSys = new PromptSystem();
		promptSys.initialize(uisc);
		uisc.prompt = promptSys;

		uisc.initialize(this.m_rscene, 512, 3);
		console.log("uisc: ", uisc);
		console.log("uisc.rscene: ", uisc.rscene);

		//this.testUIEntity(uisc);
	}

	private initUISC(): void {
		let uisc = this.m_uiScene;

		/*
		let color4 = CoMaterial.createColor4();
		console.log("color4: ", color4);
		let texAtlas = uisc.texAtlas;
		let texObj = texAtlas.createTexObjWithStr("Start", 58, CoMaterial.createColor4(0, 0, 0, 1), CoMaterial.createColor4(1, 1, 1, 0));

		CoMesh.planeMeshBuilder.uvs = texObj.uvs;
		let mesh = CoMesh.planeMeshBuilder.createXOY(0, 0, texObj.getWidth(), texObj.getHeight());

		let texList = [texObj.texture];
		// let texList = [this.createTexByUrl()];
		let material = CoMaterial.createDefaultMaterial(false);
		material.setTextureList(texList);
		material.initializeByCodeBuf(true);
		let entity = CoRScene.createDisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setRenderState(CoRScene.RendererState.NONE_TRANSPARENT_ALWAYS_STATE);

		uisc.rscene.addEntity(entity);
		//*/
		// let canvas = ImageTexAtlas.CreateCharsCanvas("ABC",30);

		// let canvas = ImageTexAtlas.CreateCharsCanvasFixSize(100,40,"ABC",30);
		// document.body.appendChild(canvas);
		// canvas = ImageTexAtlas.CreateCharsCanvasFixSize(100,40,"ABCD",30);
		// canvas.style.top = '40px';
		// document.body.appendChild(canvas);

		// this.loadImgs();
		this.testPanel();
	}
	private m_textLabel: ITextLabel = null;
	private m_promptLabel: PromptPanel = null;
	private testPanelDepth(): void {

	}
	private testPanel(): void {
		console.log("testPanel()................");

		let uisc = this.m_uiScene;
		let texAtlas = uisc.texAtlas;
		let transparentTexAtlas = uisc.transparentTexAtlas;
		let urls: string[];
		let img: HTMLCanvasElement;

		let ta = texAtlas;
		let tta = transparentTexAtlas;


		// let textLabel = new TextLabel();
		// textLabel.initialize("hello", uisc, 24);
		// textLabel.setXY(200, 100);
		// this.m_uiScene.addEntity( textLabel );
		// this.m_textLabel = textLabel;
		// // let tip: RectTextTip = new RectTextTip();
		// // tip.initialize(this.m_uiScene, 1);
		// return;
		/*
		let panel = new PromptPanel();
		panel.initialize(this.m_uiScene, 1, 300, 200, 120, 50);
		let depth = 3;
		// panel.setZ(depth);
		// this.m_uiScene.addEntity(panel);
		// panel.open();
		panel.setBGColor(CoMaterial.createColor4(0.2, 0.3, 0.2));

		panel.setListener(
			(): void => {
				console.log("panel confirm...");
			},
			(): void => {
				console.log("panel cancel...");
			}
		);
		this.m_promptLabel = panel;
		//*/

		/*
		let panel1 = new NormalPptPanel();
		// let panel = new NormalCtrlPanel();
		panel1.initialize(this.m_uiScene, 0, 360, 300, 50);
		// this.m_uiScene.addEntity(panel);
		panel1.open();
		panel1.setBGColor(CoMaterial.createColor4(0.2, 0.2, 0.2));
		//*/
		return;
		let colorLabel = new ColorLabel();
		colorLabel.initialize(200, 130);
		colorLabel.setXY(330, 500);
		this.m_uiScene.addEntity(colorLabel);

		let colorClipLabel2 = new ClipColorLabel();
		colorClipLabel2.initializeWithoutTex(90, 40, 4);
		// let colorClipLabel2 = new ColorClipLabel();
		// colorClipLabel2.initialize(csLable2, 4);
		// colorClipLabel2.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		colorClipLabel2.getColorAt(0).setRGB3Bytes(40, 40, 40);
		colorClipLabel2.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		colorClipLabel2.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		// colorClipLabel2.setLabelClipIndex( 1 );
		// colorClipLabel.setXY(200,0);
		// colorClipLabel.setClipIndex(2);
		// this.m_uiScene.addEntity(colorClipLabel);
		// let colorBtn = CoUI.createButton(); //new Button();

		let fontColor = CoMaterial.createColor4(1, 1, 1, 1);
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		urls = ["BBB-0", "BBB-1", "BBB-2", "BBB-3"];
		img = tta.createCharsCanvasFixSize(90, 40, urls[0], 30, fontColor, bgColor);
		tta.addImageToAtlas(urls[0], img);
		img = tta.createCharsCanvasFixSize(90, 40, urls[1], 30, fontColor, bgColor);
		tta.addImageToAtlas(urls[1], img);

		let iconLable = new ClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [urls[1]]);
		// iconLable.setClipIndex(1);
		// iconLable.setXY(500, 70);
		// iconLable.setScaleXY(1.5, 1.5);
		// iconLable.update();
		// this.m_uiScene.addEntity(iconLable);

		let colorBtn2 = new Button();
		colorBtn2.addLabel(iconLable);
		colorBtn2.initializeWithLable(colorClipLabel2);
		colorBtn2.setXY(500, 600);
		this.m_uiScene.addEntity(colorBtn2, 1);

		let layouter = uisc.layout.createLeftTopLayouter();
		layouter.addUIEntity(colorBtn2);
	}
	private createDefaultEntity(): void {
		// let axis = CoRScene.createAxis3DEntity(700);
		// this.m_rscene.addEntity(axis);

		// let texList = [this.createTexByUrl()];
		// let material = CoRScene.createDefaultMaterial();
		// material.setTextureList(texList);
		// let entity = CoRScene.createDisplayEntity();
		// entity.setMaterial(material);
		// entity.copyMeshFrom(this.m_rscene.entityBlock.unitXOZPlane);
		// entity.setScaleXYZ(700.0, 0.0, 700.0);
		// this.m_rscene.addEntity(entity);
	}
	private m_urls: string[] = [];
	private initScene(): void {
		this.createDefaultEntity();
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initInteract(): void {
		if (this.m_rscene != null && this.m_interact == null && typeof CoMouseInteraction !== "undefined") {
			this.m_interact = CoMouseInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rscene);
			this.m_interact.setSyncLookAtEnabled(true);
		}
	}
	private initRenderer(): void {
		if (this.m_rscene == null) {

			let RendererDevice = CoRScene.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("#282828");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);
			this.m_rscene.setClearUint24Color(0x282828);
			this.m_rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_CLICK, this, this.mouseDownListener);
		}
	}
	private m_times = 0;
	private mouseDownListener(evt: any): void {
		// if(this.m_textLabel != null) {
		// 	this.m_textLabel.setText("Good-Day");
		// 	this.m_textLabel.update();
		// }
		if (this.m_times < 1) {
			this.m_uiScene.prompt.setPromptBGColor(CoRScene.createColor4(0.4, 0.4, 0.4));
			this.m_uiScene.prompt.showPrompt("Hi, body!");
		} else {
			this.m_uiScene.prompt.setPromptTextColor(CoRScene.createColor4(0.4, 1.0, 0.4));
			this.m_uiScene.prompt.showPrompt("Hi, body scene.setClearUint24Color(0x282828 !");
		}
		this.m_times++;

		if (this.m_promptLabel != null) {
			this.m_promptLabel.setPrompt("How are you?");
			this.m_promptLabel.open();
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
			if (this.m_uiScene != null) {
				this.m_uiScene.run();
			}
		}
	}
}

export default DemoUIPanel;
