import { CoDataFormat } from "../../app/CoSpaceAppData";

import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

import { ICoMouseInteraction } from "../../voxengine/ui/ICoMouseInteraction";
import ViewerMaterialCtx from "../../demo/coViewer/ViewerMaterialCtx";
import { TextPackedLoader } from "../../modules/loaders/TextPackedLoader";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "../../demo/coViewer/ViewerCoSApp";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IPlane from "../../ageom/base/IPlane";

//import { DragMoveController } from "../../../../voxeditor/entity/DragMoveController";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;


/**
 * cospace renderer
 */
export class DemoMoveObj {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() { }

	initialize(): void {

		console.log("DemoMoveObj::initialize() ...");
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
		//  public\static\cospace\math\CoMath.umd.js
		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		let url2 = "static/cospace/math/CoMath.umd.js";
		let url3 = "static/cospace/ageom/CoAGeom.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();

				this.initScene();
				new ModuleLoader(1, (): void => {

					console.log("math module loaded ...");
					this.testMath();

					new ModuleLoader(1, (): void => {
						console.log("ageom module loaded ...");
						this.testAGeom();
					}).load(url3);

				}).load(url2)
				// this.m_vcoapp = new ViewerCoSApp();
				// this.m_vcoapp.initialize((): void => {
				// 	this.loadOBJ();
				// });

			}
		}).addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private testMath(): void {

		let v3 = CoMath.createVec3(10,4,0.5);
		console.log("math v3: ", v3);
	}
	private testAGeom(): void {

		let line = CoAGeom.createLine();
		let rayLine = CoAGeom.createRayLine();
		let segmentLine = CoAGeom.createSegmentLine();
		let plane = CoAGeom.createPlane();
		let outV = CoMath.createVec3();

		console.log("ageom line: ", line);
		console.log("ageom plane: ", plane);

	}
	
	private createDefaultEntity(): void {

		let axis = CoRScene.createAxis3DEntity();
		this.m_rscene.addEntity(axis);

		/*
		let texList = [this.createTexByUrl()];
		let material = CoRScene.createDefaultMaterial();
		material.setTextureList(texList);
		let entity = CoRScene.createDisplayEntity();
		entity.setMaterial(material);
		entity.copyMeshFrom(this.m_rscene.entityBlock.unitXOZPlane);
		entity.setScaleXYZ(700.0, 0.0, 700.0);
		this.m_rscene.addEntity(entity);
		//*/
	}
	private initScene(): void {

		this.createDefaultEntity();

	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}

	private createTexByUrl(url: string = ""): IRenderTexture {

		let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);

		// this.m_plane = new Plane3DEntity();
		// this.m_plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex]);
		// this.m_rscene.addEntity(this.m_plane);

		let img: HTMLImageElement = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img, 0, 0, 0, false);
		}
		img.src = url != "" ? url : "static/assets/box.jpg";
		return tex;
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
	private mouseDown(evt: any): void { }
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoMoveObj;
