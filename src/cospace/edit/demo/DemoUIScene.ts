import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoTexture } from "../../voxtexture/ICoTexture";
import { ICoUI } from "../../voxui/ICoUI";
import { ICoRScene } from "../../voxengine/ICoRScene";

import { ICoUIInteraction } from "../../voxengine/ui/ICoUIInteraction";
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
import IColor4 from "../../../vox/material/IColor4";
import { FlagButton } from "../../voxui/button/FlagButton";
// import TextGeometryBuilder from "../../voxtext/base/TextGeometryBuilder";
// import { PlaneMeshBuilder } from "../../voxmesh/build/PlaneMeshBuilder";
//CanvasTexAtlas
//import { DragMoveController } from "../../../../voxeditor/entity/DragMoveController";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoTexture: ICoTexture;
declare var CoUI: ICoUI;

/**
 * cospace renderer
 */
export class DemoUIScene {
	private m_rscene: IRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() { }

	initialize(): void {
		console.log("DemoUIScene::initialize() ...");

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
		console.log("create the CoUIScene instance...");
		let uisc = new CoUIScene();
		uisc.texAtlasNearestFilter = true;
		this.m_uiScene = uisc;
		uisc.initialize(this.m_rscene, 512);
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
		this.createCanvasClips();
		// this.createFlagBtn();
	}
	private selectLic(evt: any): void {
		console.log("select, evt: ", evt);
	}
	private createFlagBtn(): void {

		let uisc = this.m_uiScene;
		let texAtlas = uisc.texAtlas;

		let flagBtn = new FlagButton();
		flagBtn.initializeWithSize(texAtlas);
		flagBtn.setXY(200,30);
		this.m_uiScene.addEntity(flagBtn);
		flagBtn.addEventListener(CoRScene.SelectionEvent.SELECT, this, this.selectLic);
		/*
		let borderColor = CoMaterial.createColor4(0.7, 0.7, 0.7);
		let bgColor = CoMaterial.createColor4(0.3, 0.3, 0.3);
		let canvas = this.createFlagImg(borderColor, bgColor);
		// document.body.append(canvas);
		
		texAtlas.addImageToAtlas("flagBtn_01", canvas);

		borderColor = CoMaterial.createColor4(0.7, 0.7, 0.7);
		bgColor = CoMaterial.createColor4(0.3, 0.3, 0.3);
		let flagColor = CoMaterial.createColor4(1.0,1.0,1.0);
		canvas = this.createFlagImg(borderColor, bgColor, flagColor, 4);
		// document.body.append(canvas);
		texAtlas.addImageToAtlas("flagBtn_02", canvas);

		let urls = ["flagBtn_01", "flagBtn_02"];
		let csLable = new ClipLabel();
		csLable.initialize(texAtlas, urls);

		let colorClipLabel = new ColorClipLabel();
		colorClipLabel.initialize(csLable, 4);
		colorClipLabel.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		colorClipLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		colorClipLabel.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		colorClipLabel.setLabelClipIndex( 1 );
		// colorClipLabel.setXY(200,0);
		// colorClipLabel.setClipIndex(2);
		// this.m_uiScene.addEntity(colorClipLabel);
		// let colorBtn = CoUI.createButton(); //new Button();

		let colorBtn = new Button();
		colorBtn.initializeWithLable(colorClipLabel);
		colorBtn.setXY(200,0);
		this.m_uiScene.addEntity(colorBtn);

		// let csLable2 = new ClipLabel();
		// csLable2.initialize(texAtlas, urls);
		//*/
	}
	private createFlagImg(borderColor: IColor4, bgColor: IColor4, flagColor: IColor4 = null, dis: number = 2): HTMLCanvasElement | HTMLImageElement {

		let uisc = this.m_uiScene;
		let texAtlas = uisc.texAtlas;
		let pw = 32;
		let ph = 32;
		let borderWidth = 4;
		// let borderColor = CoMaterial.createColor4(0.7,0.7,0.7);
		// let bgColor = CoMaterial.createColor4(0.3,0.3,0.3);
		let canvas = texAtlas.createCanvas(pw, ph, borderColor, false);
		let ctx2D = canvas.getContext("2d");
		ctx2D.fillStyle = bgColor.getCSSDecRGBAColor();
		ctx2D.fillRect(borderWidth, borderWidth, pw - 2 * borderWidth, ph - 2 * borderWidth);
		// texAtlas.addImageToAtlas("selectR_01", canvas);
		if (flagColor != null) {
			ctx2D.fillStyle = flagColor.getCSSDecRGBAColor();
			ctx2D.fillRect(borderWidth + dis, borderWidth + dis, pw - 2 * (borderWidth + dis), ph - 2 * (borderWidth + dis));
		}

		return canvas;
	}
	private createCanvasClips(): void {
		console.log("createCanvasClips()................");

		let uisc = this.m_uiScene;
		let texAtlas = uisc.texAtlas;
		let transparentTexAtlas = uisc.transparentTexAtlas;
		let urls: string[];
		let img: HTMLCanvasElement;

		let ta = texAtlas;
		let tta = transparentTexAtlas;
		/*
		let fontColor = CoMaterial.createColor4(0,1,0,1);
		let bgColor = CoMaterial.createColor4(1,1,1,0);
		urls = ["BBB-0", "BBB-1", "BBB-2", "BBB-3"];
		img = tta.createCharsCanvasFixSize(90, 40, urls[0], 30, fontColor,bgColor);
		tta.addImageToAtlas(urls[0], img);
		img = tta.createCharsCanvasFixSize(90, 40, urls[1], 30, fontColor,bgColor);
		tta.addImageToAtlas(urls[1], img);
		
		let iconLable = new ClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [urls[1]]);
		iconLable.setClipIndex(1);
		iconLable.setXY(500, 70);
		// iconLable.setScaleXY(1.5, 1.5);
		// iconLable.update();
		this.m_uiScene.addEntity(iconLable);
		//*/
		//return;
		/*
		let canvas = texAtlas.createCharsCanvasFixSize(100, 40, "ABC", 30);
		document.body.appendChild(canvas);
		// canvas = texAtlas.createCharsCanvasFixSize(100, 40, "ABCD", 30);
		// canvas.style.top = "40px";
		// document.body.appendChild(canvas);

		texAtlas.addImageToAtlas("ABC", canvas);
		let clipColorLabel = new ClipColorLabel();
		// let clipColorLabel = CoUI.createClipColorLabel();
		// clipColorLabel.initialize(texAtlas, "ABC", 4);
		// clipColorLabel.initializeWithoutTex(50, 32, 4);
		clipColorLabel.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		clipColorLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		clipColorLabel.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		// this.m_uiScene.addEntity(clipColorLabel);
		// clipColorLabel.setClipIndex(0);
		let btn01 = CoUI.createButton();
		btn01.initializeWithLable(clipColorLabel);
		this.m_uiScene.addEntity(btn01);
		return;
		//*/
		/*
		let pw = 32;
		let ph = 32;
		let borderWidth = 4;
		let borderColor = CoMaterial.createColor4(0.7, 0.7, 0.7);
		let bgColor = CoMaterial.createColor4(0.3, 0.3, 0.3);
		let canvas = texAtlas.createCanvas(pw, ph, borderColor, false);
		let ctx2D = canvas.getContext("2d");
		ctx2D.fillStyle = bgColor.getCSSDecRGBAColor();
		ctx2D.fillRect(borderWidth, borderWidth, pw - 2 * borderWidth, ph - 2 * borderWidth);
		document.body.append(canvas);
		texAtlas.addImageToAtlas("selectR_01", canvas);


		//*/
		/*
		urls = ["AAA-0", "AAA-1", "AAA-2", "AAA-3"];
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[0], 30);
		texAtlas.addImageToAtlas(urls[0], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[1], 30);
		texAtlas.addImageToAtlas(urls[1], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[2], 30);
		texAtlas.addImageToAtlas(urls[2], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[3], 30);
		texAtlas.addImageToAtlas(urls[3], img);
		
		// let lable = CoUI.createClipLabel();
		let lable = new ClipLabel();
		lable.initialize(texAtlas, urls);
		lable.setClipIndex(1);
		lable.setXY(50, 600);
		this.m_uiScene.addEntity(lable);
		lable.setColor(CoMaterial.createColor4(0.1, 1.0, 0.4));
		let layouter = uisc.layout.createLeftTopLayouter();
		layouter.addUIEntity(lable);
		
		// lable = new ClipLabel();
		// lable.initialize(texAtlas, urls);
		// lable.setClipIndex(1);
		// lable.setXY(850, 600);
		// this.m_uiScene.addEntity(lable);
		// lable.setColor(CoMaterial.createColor4(0.1, 1.0, 0.4));
		// layouter = uisc.layout.createRightTopLayouter();
		// layouter.addUIEntity(lable);
		// //createRightBottomLayouter
		// lable = new ClipLabel();
		// lable.initialize(texAtlas, urls);
		// lable.setClipIndex(1);
		// lable.setXY(600, 100);
		// this.m_uiScene.addEntity(lable);
		// lable.setColor(CoMaterial.createColor4(0.1, 1.0, 0.4));
		// layouter = uisc.layout.createRightBottomLayouter();
		// layouter.addUIEntity(lable);
		// //return;

		// // let lable01 = CoUI.createClipLabel();
		// let lable01 = new ClipLabel();
		// lable01.initializeWithLable(lable);
		// lable01.setClipIndex(1);
		// lable01.setXY(200, 200);
		// this.m_uiScene.addEntity(lable01);

		let btnUrls = [urls[0], urls[1], urls[2], urls[1]];
		btnUrls = urls;
		// let btn = CoUI.createButton(); //new Button();
		let btn = new Button();
		btn.initialize(texAtlas, btnUrls);
		btn.setXY(50,0);
		// btn.initializeWithLable(lable01);
		this.m_uiScene.addEntity(btn);
		//*/
		/*
		let csLable = new ClipLabel();
		csLable.initialize(texAtlas, urls);

		let colorClipLabel = new ColorClipLabel();
		colorClipLabel.initialize(csLable, 4);
		colorClipLabel.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		colorClipLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		colorClipLabel.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		colorClipLabel.setLabelClipIndex( 1 );
		// colorClipLabel.setXY(200,0);
		// colorClipLabel.setClipIndex(2);
		// this.m_uiScene.addEntity(colorClipLabel);
		// let colorBtn = CoUI.createButton(); //new Button();

		let colorBtn = new Button();
		colorBtn.initializeWithLable(colorClipLabel);
		colorBtn.setXY(200,0);
		this.m_uiScene.addEntity(colorBtn);

		// let csLable2 = new ClipLabel();
		// csLable2.initialize(texAtlas, urls);
		//*/

		///*
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
	private loadedImg(img: HTMLImageElement, url: string): void {
		if (url != "") {
			console.log("XXX loadedImg(), url: ", url);
			let uisc = this.m_uiScene;
			let texAtlas = uisc.texAtlas;
			texAtlas.addImageToAtlas(url, img);
			this.m_urls.push(url);
			if (this.m_urls.length == 31) {
				let urls = this.m_urls;
				let lable = CoUI.createClipLabel(); //new ClipLabel();
				lable.initialize(texAtlas, this.m_urls);
				lable.setClipIndex(2);
				lable.setXY(300, 200);
				this.m_uiScene.addEntity(lable);

				let lable01 = CoUI.createClipLabel(); //new ClipLabel();
				lable01.initializeWithLable(lable);
				lable01.setClipIndex(1);
				lable01.setXY(200, 300);
				this.m_uiScene.addEntity(lable01);

				let btnUrls = [urls[0], urls[1], urls[2], urls[1]];
				let btn = CoUI.createButton(); //new Button();
				btn.initialize(texAtlas, btnUrls);
				// btn.initializeWithLable(lable01);
				this.m_uiScene.addEntity(btn);
			}
		}
	}
	private loadImgs(): void {
		let url0 = "static/assets/flare_core_01.jpg";
		let url1 = "static/assets/flare_core_02.jpg";
		let url2 = "static/assets/flare_core_03.jpg";
		this.loadImgByUrl(url0, (img: HTMLImageElement, url: string): void => {
			this.loadedImg(img, url);
		});
		this.loadImgByUrl(url1, (img: HTMLImageElement, url: string): void => {
			this.loadedImg(img, url);
		});
		this.loadImgByUrl(url2, (img: HTMLImageElement, url: string): void => {
			this.loadedImg(img, url);
		});
	}
	private createTexByUrl(url: string = ""): IRenderTexture {
		let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);

		// this.m_plane = new Plane3DEntity();
		// this.m_plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex]);
		// this.m_rscene.addEntity(this.m_plane);

		let img: HTMLImageElement = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img, 0, 0, 0, false);
		};
		img.src = url != "" ? url : "static/assets/box.jpg";
		return tex;
	}
	private loadImgByUrl(url: string, loaded: (img: HTMLImageElement, url: string) => void): void {
		let img: HTMLImageElement = new Image();
		img.onload = (evt: any): void => {
			loaded(img, url);
		};
		img.src = url != "" ? url : "static/assets/box.jpg";
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
			let RendererDevice = CoRScene.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("#888888");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);
			this.m_rscene.setClearUint24Color(0x888888);
		}
	}
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";
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

export default DemoUIScene;
