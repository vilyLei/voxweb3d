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
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

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
// import { ClipLabel } from "../../voxui/entity/ClipLabel";
// import { Button } from "../../voxui/entity/Button";
import { ClipColorLabel } from "../../voxui/entity/ClipColorLabel";
// import TextGeometryBuilder from "../../voxtext/base/TextGeometryBuilder";
// import { PlaneMeshBuilder } from "../../voxmesh/build/PlaneMeshBuilder";
//CanvasTexAtlas
//import { DragMoveController } from "../../../../voxeditor/entity/DragMoveController";

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
export class DemoUIScene {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() {}

	initialize(): void {
		console.log("DemoUIScene::initialize() ...");

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

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
	private m_uisc: ICoUIScene = null;
	private initUIScene(): void {
		let uisc = CoUI.createUIScene(); //new CoUIScene();
		this.m_uisc = uisc;
		uisc.initialize();
		console.log("uisc: ", uisc);
		console.log("uisc.rscene: ", uisc.rscene);

		//this.testUIEntity(uisc);
	}

	private initUISC(): void {
		let uisc = this.m_uisc;

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

		this.loadImgs();
		this.createCanvasClips();
	}
	private createCanvasClips(): void {
		console.log("createCanvasClips()................");

		let uisc = this.m_uisc;
		let texAtlas = uisc.texAtlas;
		let canvas = texAtlas.createCharsCanvasFixSize(100, 40, "ABC", 30);
		document.body.appendChild(canvas);
		// canvas = texAtlas.createCharsCanvasFixSize(100, 40, "ABCD", 30);
		// canvas.style.top = "40px";
		// document.body.appendChild(canvas);

		texAtlas.addImageToAtlas("ABC", canvas);
		let clipColorLabel = new ClipColorLabel();
		// let clipColorLabel = CoUI.createClipColorLabel();
		// clipColorLabel.initialize(texAtlas, "ABC", 4);
		clipColorLabel.initializeWithoutTex(50, 32, 4);
		clipColorLabel.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		clipColorLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		clipColorLabel.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		// this.m_uisc.addEntity(clipColorLabel);
		// clipColorLabel.setClipIndex(0);
		let btn01 = CoUI.createButton();
		btn01.initializeWithLable(clipColorLabel);
		this.m_uisc.addEntity(btn01);
		return;

		let urls: string[] = ["AAA-0", "AAA-1", "AAA-2", "AAA-3"];
		let img = texAtlas.createCharsCanvasFixSize(90, 40, urls[0], 30);
		texAtlas.addImageToAtlas(urls[0], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[1], 30);
		texAtlas.addImageToAtlas(urls[1], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[2], 30);
		texAtlas.addImageToAtlas(urls[2], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[3], 30);
		texAtlas.addImageToAtlas(urls[3], img);

		let lable = CoUI.createClipLabel();
		lable.initialize(texAtlas, urls);
		lable.setClipIndex(2);
		lable.setXY(300, 200);
		this.m_uisc.addEntity(lable);

		let lable01 = CoUI.createClipLabel();
		lable01.initializeWithLable(lable);
		lable01.setClipIndex(1);
		lable01.setXY(200, 300);
		this.m_uisc.addEntity(lable01);

		let btnUrls = [urls[0], urls[1], urls[2], urls[1]];
		btnUrls = urls;
		let btn = CoUI.createButton(); //new Button();
		btn.initialize(texAtlas, btnUrls);
		// btn.initializeWithLable(lable01);
		this.m_uisc.addEntity(btn);
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
			let uisc = this.m_uisc;
			let texAtlas = uisc.texAtlas;
			texAtlas.addImageToAtlas(url, img);
			this.m_urls.push(url);
			if (this.m_urls.length == 31) {
				let urls = this.m_urls;
				let lable = CoUI.createClipLabel(); //new ClipLabel();
				lable.initialize(texAtlas, this.m_urls);
				lable.setClipIndex(2);
				lable.setXY(300, 200);
				this.m_uisc.addEntity(lable);

				let lable01 = CoUI.createClipLabel(); //new ClipLabel();
				lable01.initializeWithLable(lable);
				lable01.setClipIndex(1);
				lable01.setXY(200, 300);
				this.m_uisc.addEntity(lable01);

				let btnUrls = [urls[0], urls[1], urls[2], urls[1]];
				let btn = CoUI.createButton(); //new Button();
				btn.initialize(texAtlas, btnUrls);
				// btn.initializeWithLable(lable01);
				this.m_uisc.addEntity(btn);
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
	private mouseDown(evt: any): void {}
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
			if (this.m_uisc != null) {
				this.m_uisc.run();
			}
		}
	}
}

export default DemoUIScene;
