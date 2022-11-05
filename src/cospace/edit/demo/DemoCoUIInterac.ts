import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoParticle } from "../../particle/ICoParticle";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

import { ICoUIInteraction } from "../../voxengine/ui/ICoUIInteraction";
import ViewerMaterialCtx from "../../demo/coViewer/ViewerMaterialCtx";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "../../demo/coViewer/ViewerCoSApp";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IVector3D from "../../../vox/math/IVector3D";
import { FloorLineGrid } from "../entity/FloorLineGrid";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;
declare var CoEntity: ICoEntity;
declare var CoMaterial: ICoMaterial;
declare var CoParticle: ICoParticle;

/**
 * cospace renderer
 */
export class DemoCoUIInterac {
	private m_rscene: IRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() { }

	initialize(): void {
		console.log("DemoCoUIInterac::initialize() ...");

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
		let url7 = "static/cospace/coentity/CoEntity.umd.js";
		let url8 = "static/cospace/particle/CoParticle.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();
				this.initScene();

				new ModuleLoader(1, (): void => {
					console.log("math module loaded ...");
					this.testMath();

					new ModuleLoader(3, (): void => {
						console.log("ageom module loaded ...");
						// this.testAGeom();

						new ModuleLoader(1, (): void => {
							console.log("CoMaterial module loaded ...");
							// this.testVoxMaterial();

							new ModuleLoader(1, (): void => {
								console.log("CoMesh module loaded ...");
								this.testVoxMaterial();
							}).load(url5);

						}).load(url4);
					}).load(url3).load(url7).load(url8);
				}).load(url2);
			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private testMath(): void {
		let v3 = CoMath.createVec3(10, 4, 0.5);
		console.log("math v3: ", v3);
	}

	private testVoxMaterial(): void {

		///*
		let v0 = CoMath.createVec3(-300,0,-300);
		let v1 = CoMath.createVec3(300,0,300);
		// let v0 = CoMath.createVec3(-300,-300,0);
		// let v1 = CoMath.createVec3(300,300,0);
		// let v0 = CoMath.createVec3(0,-300,-300);
		// let v1 = CoMath.createVec3(0,300,300);
		let grids = new FloorLineGrid();
		grids.initialize(this.m_rscene, 0, v0, v1, 20);
		let axis = CoEntity.createAxis3DEntity();
		axis.setPosition(v0);
		this.m_rscene.addEntity( axis );
		//*/
	}
	private mouseUpListener(evt: any): void {
	}
	private mouseBgDownListener(evt: any): void {
		console.log("DemoCoUIInterac::mouseBgDownListener() ...");
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
	private initScene(): void {
		this.createDefaultEntity();
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}

	private createTexByUrl(url: string = ""): IRenderTexture {
		let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);

		let img: HTMLImageElement = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img, 0, 0, 0, false);
		};
		img.src = url != "" ? url : "static/assets/box.jpg";
		return tex;
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
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("#888888");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			// rparam.setCamPosition(893, 1009, -1087);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);
			this.m_rscene.setClearRGBColor3f(0.23, 0.23, 0.23);
			this.m_rscene.updateCamera();
			// this.m_rscene.setClearRGBColor3f(60/255.0, 60/255.0, 60/255.0);
			let rscene = this.m_rscene;
			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);
		}
	}
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";
	}
	private mouseDown(evt: any): void { }
	private m_pv: IVector3D = null;
	run(): void {
		if (this.m_rscene != null) {
			if(this.m_pv == null) {
				this.m_pv = CoRScene.createVec3();
			}
			if (this.m_interact != null) {
				this.m_interact.setLookAtPosition( this.m_pv );
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoUIInterac;
