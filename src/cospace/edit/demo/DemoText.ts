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
import { ICoText } from "../../voxtext/ICoText";
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
import { H5Text } from "../../voxtext/base/H5Text";
import { TextEntity } from "../../voxtext/base/TextEntity";

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
declare var CoText: ICoText;

/**
 * cospace renderer
 */
export class DemoText {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() { }

	initialize(): void {
		console.log("DemoText::initialize() ...");

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
		let url9 = "static/cospace/cotext/CoText.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");

				this.initRenderer();
				this.initScene();

				new ModuleLoader(1, (): void => {
					this.textModuleLoaded();
					}
				).load(url9);

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
	
	private testText(): void {
		///*

		let h5Text = new H5Text();
		h5Text.initialize(this.m_rscene, "text_cv_01", 18, 512, 512);
		let textObject = new TextEntity();
		textObject.initialize("Hello", h5Text);
		textObject.setXYZ(100, 50, -100);
		textObject.update();
		this.m_rscene.addEntity(textObject.getREntity());
		// textObject.setRGB3f(10.5, 0.0, 1.0);
		//*/
	}
	
	private testStaticText(): void {
		///*

		let h5Text = CoText.createH5Text(this.m_rscene, "text_cv_01", 18, 512, 512);
		// h5Text.initialize(this.m_rscene, "text_cv_01", 18, 512, 512);
		// let textObject = new TextEntity();
		let textObject = CoText.createStaticTextEntity("Hello", h5Text);
		// textObject.initialize("Hello", h5Text);
		textObject.setXYZ(100, 50, -100);
		textObject.update();
		this.m_rscene.addEntity(textObject.getREntity());
		// textObject.setRGB3f(10.5, 0.0, 1.0);
		//*/
	}
	private textModuleLoaded(): void {
		console.log("xxx textModuleLoaded() ...");
		// this.testStaticText();
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
		
	}
	private m_textLabel: ITextLabel = null;
	private m_promptLabel: PromptPanel = null;
	
	private createDefaultEntity(): void {

		let mesh = this.m_rscene.entityBlock.unitBox.getMesh();
		let material = CoRScene.createDefaultMaterial(true);
		material.initializeByCodeBuf(true);
		material.setTextureList([this.m_rscene.textureBlock.createRGBATex2D(32,32, CoRScene.createColor4())]);
		// console.log(material.getBufSortFormat(), material.getBufTypeList(), material.getBufSizeList());
		let entity = CoRScene.createDisplayEntity();
		entity.setMesh( mesh );
		// console.log("NNNNNNNNNNNN mesh.getNVS(): ", mesh.getNVS())
		entity.setMaterial( material );
		let scale = 100.0;
		entity.setScaleXYZ(scale, scale, scale);
		// entity.setXYZ(scale, scale, scale);
		this.m_rscene.addEntity(entity);
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
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
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
			this.m_uiScene.prompt.showPrompt("Hi, body!");
		} else {
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

export default DemoText;
