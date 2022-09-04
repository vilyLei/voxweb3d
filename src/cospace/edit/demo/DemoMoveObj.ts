import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoEdit } from "../../edit/ICoEdit";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

import { ICoMouseInteraction } from "../../voxengine/ui/ICoMouseInteraction";
import ViewerMaterialCtx from "../../demo/coViewer/ViewerMaterialCtx";
import { TextPackedLoader } from "../../modules/loaders/TextPackedLoader";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "../../demo/coViewer/ViewerCoSApp";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IPlane from "../../ageom/base/IPlane";
import DragAxis from "../../edit/move/DragAxis";
import DragPlane from "../../edit/move/DragPlane";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { CoNormalMaterial } from "../../voxengine/material/CoNormalMaterial";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import { IDragMoveController } from "../../edit/move/IDragMoveController";
import { DragMoveController } from "../../edit/move/DragMoveController";
import IVector3D from "../../../vox/math/IVector3D";
import { LineMeshBuilder } from "../../voxmesh/build/LineMeshBuilder";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoEdit: ICoEdit;


/**
 * cospace renderer
 */
export class DemoMoveObj {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;
	private m_scale = 20.0;

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

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		let url2 = "static/cospace/math/CoMath.umd.js";
		let url3 = "static/cospace/ageom/CoAGeom.umd.js";
		let url4 = "static/cospace/coedit/CoEdit.umd.js";
		let url5 = "static/cospace/comesh/CoMesh.umd.js";
		let url6 = "static/cospace/coentity/CoEntity.umd.js";
		let url7 = "static/cospace/particle/CoParticle.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();

				this.initScene();
				new ModuleLoader(2, (): void => {

					console.log("math module loaded ...");
					this.testMath();

					new ModuleLoader(4, (): void => {
						console.log("ageom module loaded ...");
						this.createEditEntity();
					}).load(url3).load(url4).load(url6).load(url7);

				}).load(url2).load(url5);

				this.m_vcoapp = new ViewerCoSApp();
				this.m_vcoapp.initialize((): void => {
					this.loadOBJ();
				});

			}
		}).addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private testMath(): void {

		let v3 = CoMath.createVec3(10, 4, 0.5);
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
	private m_dragCtr: IDragMoveController;
	private createEditEntity(): void {

		/*
		let moveAxis = new DragAxis();
		moveAxis.initialize(80.0);
		moveAxis.setXYZ(50,30,-200);
		this.m_rscene.addEntity(moveAxis.getEntity());

		let movePlane = new DragPlane();
		// movePlane.offsetPos.setXYZ(50.0,0.0,50.0);
		movePlane.initialize(0, 100, 0.5);
		this.m_rscene.addEntity(movePlane.getEntity());
		movePlane = new DragPlane();
		// movePlane.offsetPos.setXYZ(50.0,50.0,0.0);
		movePlane.initialize(1, 100, 0.5);
		this.m_rscene.addEntity(movePlane.getEntity());
		movePlane = new DragPlane();
		// movePlane.offsetPos.setXYZ(0.0,50.0,50.0);
		movePlane.initialize(2, 100, 0.5);
		this.m_rscene.addEntity(movePlane.getEntity());
		//*/

		this.m_dragCtr = new DragMoveController();
		// this.m_dragCtr = CoEdit.createDragMoveController();
		this.m_dragCtr.axisSize = 200;
		this.m_dragCtr.planeSize = 60;
		this.m_dragCtr.pickTestAxisRadius = 5;
		this.m_dragCtr.runningVisible = true;
		this.m_dragCtr.initialize(this.m_rscene, 1);
		// this.m_dragCtr.setVisible(true);
	}
	private mouseUpListener(evt: any): void {
		console.log("DemoMoveObj::mouseUpListener() ...");
		if (this.m_dragCtr != null) {
			this.m_dragCtr.deselect();
		}
	}
	private mouseBgDownListener(evt: any): void {
		console.log("DemoMoveObj::mouseBgDownListener() ...");
	}
	private createDefaultEntity(): void {

		// let axis = CoRScene.createAxis3DEntity();
		// this.m_rscene.addEntity(axis);

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

		let img = new Image();
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
			let rscene = CoRScene.createRendererScene(rparam, 3);
			rscene.setClearUint24Color(0x888888);

			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);
			this.m_rscene = rscene;
		}
	}
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";
		console.log("loadOBJ() init...");
		this.loadGeomModel(url, CoDataFormat.OBJ);
	}

	loadGeomModel(url: string, format: CoDataFormat): void {
		let ins = this.m_vcoapp.coappIns;
		if (ins != null) {

			ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					this.createEntityFromUnit(unit, status);
				},
				true
			);
		}
	}
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {

		let len = unit.data.models.length;
		let m_scale = this.m_scale;

		for (let i = 0; i < len; ++i) {
			let entity = this.createEntity(unit.data.models[i]);
			entity.setScaleXYZ(m_scale, m_scale, m_scale);
		}
	}
	private createEntity(model: CoGeomDataType): ITransformEntity {
		// let rst = CoRenderer.RendererState;

		const MouseEvent = CoRScene.MouseEvent;
		let material = new CoNormalMaterial().build().material;

		let mesh = CoRScene.createDataMeshFromModel(model, material);
		let cv = mesh.bounds.center.clone();
		let vs = model.vertices;
		let tot = vs.length;
		for(let i = 0; i < tot;) {
			vs[i++] -= cv.x;
			vs[i++] -= cv.y;
			vs[i++] -= cv.z;
		}

		
		cv.scaleBy(this.m_scale);
		mesh = CoRScene.createDataMeshFromModel(model, material);
		let entity = CoRScene.createMouseEventEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setPosition(cv);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_rscene.addEntity(entity);

		entity.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownTargetListener);

		return entity;
	}

	private mouseOverTargetListener(evt: any): void {
		// console.log("mouseOverTargetListener() mouse over...");
	}
	private mouseOutTargetListener(evt: any): void {
		// console.log("mouseOutTargetListener() mouse out...");
	}
	private mouseDownTargetListener(evt: any): void {
		console.log("mouseDownTargetListener() mouse down...");
		if (this.m_dragCtr != null) {

			let pos = CoMath.createVec3();
			let entity = evt.target as ITransformEntity;
			entity.getPosition(pos);
			
			let wpos = evt.wpos as IVector3D;
			pos.subtractBy(wpos);
			
			this.m_dragCtr.setTarget(evt.target);
			this.m_dragCtr.setTargetPosOffset(pos);
			this.m_dragCtr.setPosition(wpos);
			this.m_dragCtr.update();
		}
	}

	private mouseDown(evt: any): void { }
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_dragCtr != null) {
				this.m_dragCtr.run();
			}
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoMoveObj;
