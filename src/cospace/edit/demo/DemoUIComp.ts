import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../voxengine/ICoRScene";

import { ICoUIInteraction } from "../../voxengine/ui/ICoUIInteraction";
import ViewerMaterialCtx from "../../demo/coViewer/ViewerMaterialCtx";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "../../demo/coViewer/ViewerCoSApp";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { ClipLabel } from "../../voxui/entity/ClipLabel";
import { Button } from "../../voxui/button/Button";
import { ClipColorLabel } from "../../voxui/entity/ClipColorLabel";
import { CoUIScene } from "../../voxui/scene/CoUIScene";
import { ColorLabel } from "../../voxui/entity/ColorLabel";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMaterial: ICoMaterial;

/**
 * cospace renderer
 */
export class DemoUIComp {
	private m_rscene: IRendererScene = null;
	private m_interact: IMouseInteraction = null;

	constructor() { }

	initialize(): void {
		console.log("DemoUIComp::initialize() ...");

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		this.initEngineModule();
	}

	private initEngineModule(): void {
		let url = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
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
				this.init3DScene();

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
										// new ModuleLoader(1, (): void => {
											this.initUIScene();
											this.initUIObjs();
										// }).load(url8);
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
		console.log("create the CoUIScene instance...");
		let uisc = new CoUIScene();
		uisc.texAtlasNearestFilter = true;
		this.m_uiScene = uisc;
		uisc.initialize(this.m_rscene, 512);
		console.log("uisc: ", uisc);
		console.log("uisc.rscene: ", uisc.rscene);
	}

	private initUIObjs(): void {
		this.createBtns();
	}
	private createBtns(): void {
		console.log("createBtns()................");

		let uisc = this.m_uiScene;
		let texAtlas = uisc.texAtlas;
		let transparentTexAtlas = uisc.transparentTexAtlas;
		let urls: string[];
		let img: HTMLCanvasElement;

		let ta = texAtlas;
		let tta = transparentTexAtlas;
		
		let colorLabel = new ColorLabel();
		colorLabel.initialize(200, 130);
		colorLabel.setXY(330, 400);
		this.m_uiScene.addEntity(colorLabel, 1);

		let pw = 60;
		let ph = 30;
		let colorClipLabel2 = new ClipColorLabel();
		colorClipLabel2.initializeWithoutTex(pw, ph, 4);
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
		console.log("create file label...");
		urls = ["File", "Global", "Color", "BBB-3"];
		img = tta.createCharsCanvasFixSize(pw, ph, urls[0], 20, fontColor, bgColor);
		tta.addImageToAtlas(urls[0], img);
		img = tta.createCharsCanvasFixSize(pw, ph, urls[1], 20, fontColor, bgColor);
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
		this.m_uiScene.addEntity(colorBtn2, 0);

		let layouter = uisc.layout.createLeftTopLayouter();
		layouter.addUIEntity(colorBtn2);
		//*/
	}
	private createDefaultEntity(): void {
		let axis = CoRScene.createAxis3DEntity();
		this.m_rscene.addEntity(axis);
	}
	private m_urls: string[] = [];
	private init3DScene(): void {
		this.createDefaultEntity();
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initInteract(): void {

		let r = this.m_rscene;
		if (r != null && this.m_interact == null && typeof CoUIInteraction !== "undefined") {

			this.m_interact = CoUIInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rscene, 2, true);
			this.m_interact.setSyncLookAtEnabled(true);
		}
	}
	private initRenderer(): void {
		if (this.m_rscene == null) {
			let RD = CoRScene.RendererDevice;
			RD.SHADERCODE_TRACE_ENABLED = false;
			RD.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RD.SetWebBodyColor("#888888");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RD.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);
			this.m_rscene.setClearUint24Color(0x888888);
		}
	}
	private mouseDown(evt: any): void { }
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_interact != null) {
				this.m_interact.setLookAtPosition(null);
				this.m_interact.run();
			}
			this.m_rscene.run();
			if (this.m_uiScene != null) {
				this.m_uiScene.run();
			}
		}
	}
}

export default DemoUIComp;
