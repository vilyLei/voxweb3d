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
import { TextPackedLoader } from "../../modules/loaders/TextPackedLoader";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "../../demo/coViewer/ViewerCoSApp";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IPlane from "../../ageom/base/IPlane";
import { BillboardLineMaterial } from "../../particle/entity/BillboardLineMaterial";
import CanvasTexAtlas from "../../voxtexture/atlas/CanvasTexAtlas";
import { LineMeshBuilder } from "../../voxmesh/build/LineMeshBuilder";
import Line3DMaterial from "../../../vox/material/mcase/Line3DMaterial";
import { RotationCircle } from "../rotate/RotationCircle";
import { DragRotationController } from "../rotate/DragRotationController";
import { DragMoveController } from "../move/DragMoveController";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { SphereRayTester } from "../base/SphereRayTester";
import { BillboardLine } from "../../particle/entity/BillboardLine";
// import TextGeometryBuilder from "../../voxtext/base/TextGeometryBuilder";
import { PlaneMeshBuilder } from "../../voxmesh/build/PlaneMeshBuilder";
import { ConeMeshBuilder } from "../../voxmesh/build/ConeMeshBuilder";
import { BoxMeshBuilder } from "../../voxmesh/build/BoxMeshBuilder";
import { DragScaleController } from "../scale/DragScaleController";
import { QuadLineMeshBuilder } from "../../voxmesh/build/QuadLineMeshBuilder";
import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import IMatrix4 from "../../../vox/math/IMatrix4";
import { RotationRing } from "../rotate/RotationRing";
import { FloorLineGrid } from "../entity/FloorLineGrid";
import { BoxLine3D } from "../entity/BoxLine3D";

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
export class DemoCoMesh {
	private m_rscene: IRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() { }

	initialize(): void {
		console.log("DemoCoMesh::initialize() ...");

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
				this.m_vcoapp = new ViewerCoSApp();
				this.m_vcoapp.initialize((): void => {
					this.loadModel();
				});
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

		/*
		let color4 = CoMaterial.createColor4();
		console.log("color4: ", color4);
		let texAtlas = new CanvasTexAtlas();
		texAtlas.initialize(this.m_rscene, 512, 512, null, true);
		let texObj = texAtlas.createTexObjWithStr("Vily", 58, CoMaterial.createColor4(0, 0, 0, 1), CoMaterial.createColor4(1, 1, 1, 0));

		CoMesh.planeMeshBuilder.uvs = texObj.uvs;
		let mesh = CoMesh.planeMeshBuilder.createXOY(0, 0, texObj.getWidth(), texObj.getHeight());

		let texList = [texObj.texture];
		// let texList = [this.createTexByUrl()];
		let material = CoRScene.createDefaultMaterial(false);
		material.setTextureList(texList);
		material.initializeByCodeBuf(true);
		let entity = CoRScene.createDisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setRenderState(CoRScene.RendererState.NONE_TRANSPARENT_ALWAYS_STATE);

		this.m_rscene.addEntity(entity);
		//*/

		///*
		let v0 = CoMath.createVec3(-300,0,-300);
		let v1 = CoMath.createVec3(300,0,300);
		// let v0 = CoMath.createVec3(-300,-300,0);
		// let v1 = CoMath.createVec3(300,300,0);
		// let v0 = CoMath.createVec3(0,-300,-300);
		// let v1 = CoMath.createVec3(0,300,300);
		// let grids = new FloorLineGrid();
		// grids.initialize(this.m_rscene, 0, v0, v1, 20);
		// let axis = CoEntity.createAxis3DEntity();
		// axis.setPosition(v0);
		// this.m_rscene.addEntity( axis );

		v0.setXYZ(-100, -100, -100);
		v1.setXYZ(100, 100, 100);
		let boxLine = new BoxLine3D();
		boxLine.initialize(this.m_rscene, 0, v0, v1);
		
	}
	private initializeEvent(entity: ITransformEntity): void {

		const me = CoRScene.MouseEvent;
		let p = CoRScene.createMouseEvt3DDispatcher();
		p.addEventListener(me.MOUSE_OVER, this, this.mOverListener);
		p.addEventListener(me.MOUSE_OUT, this, this.mOutListener);
		p.addEventListener(me.MOUSE_DOWN, this, this.mDownListener);
		entity.setEvtDispatcher(p);
		entity.mouseEnabled = true;
	}
	private mOverListener(evt: any): void {
		console.log("DemoCoMesh::mOverListener() ...");
	}
	private mOutListener(evt: any): void {
		console.log("DemoCoMesh::mOutListener() ...");
	}
	private mDownListener(evt: any): void {
		console.log("DemoCoMesh::mDownListener() ...");
	}
	private mouseUpListener(evt: any): void {
		console.log("DemoCoMesh::mouseUpListener() ...");
		
	}
	private mouseBgDownListener(evt: any): void {
		console.log("DemoCoMesh::mouseBgDownListener() ...");
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
	private initInteract(): void {
		// if (this.m_rscene != null && this.m_interact == null && typeof CoMouseInteraction !== "undefined") {
		// 	this.m_interact = CoMouseInteraction.createMouseInteraction();
		// 	this.m_interact.initialize(this.m_rscene);
		// 	this.m_interact.setSyncLookAtEnabled(true);
		// 	// this.m_interact.setSyncLookAtEnabled(false);
		// 	// this.m_interact.enableSlide();
		// }
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
	private loadModel(): void {
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
		}
	}
}

export default DemoCoMesh;
