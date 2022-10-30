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
import CanvasTexAtlas from "../../voxtexture/atlas/CanvasTexAtlas";
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

/**
 * cospace renderer
 */
export class DemoUIAtlas {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;
	
	constructor() { }

	initialize(): void {
		console.log("DemoUIAtlas::initialize() ...");

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
								this.initUIScene();
								this.initUISC();
							}).load(url5);
						}).load(url4);
					}).load(url3);
				}).load(url2);

			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private initUIScene(): void {
		this.initUISC();
	}

	private initUISC(): void {

		let texAtlasNearestFilter = false;
		let atlas = new CanvasTexAtlas();
		atlas.initialize(this.m_rscene, 512, 512, CoMaterial.createColor4(1.0,1.0,1.0,0.0), true, texAtlasNearestFilter);
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

		this.createCanvasClips();
	}
	private createCanvasClips(): void {
		console.log("createCanvasClips()................");
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
	private mouseDown(evt: any): void { }
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_interact != null) {
				this.m_interact.setLookAtPosition(null);
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoUIAtlas;
