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
import { IDragScaleController } from "../scale/IDragScaleController";
import { DragScaleController } from "../scale/DragScaleController";
import { IDragRotationController } from "../rotate/IDragRotationController";
import { DragRotationController } from "../rotate/DragRotationController";

import IRendererScene from "../../../vox/scene/IRendererScene";
import { IRendererSceneAccessor } from "../../../vox/scene/IRendererSceneAccessor";
import RendererSceneGraph from "../../../vox/scene/RendererSceneGraph";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoEdit: ICoEdit;


class SceneAccessor implements IRendererSceneAccessor {
	constructor() { }

	renderBegin(rendererScene: IRendererScene): void {
		let rproxyy = rendererScene.getRenderProxy();
		rproxyy.clearDepth(1.0);
	}
	renderEnd(rendererScene: IRendererScene): void {
	}
}
/**
 * cospace renderer
 */
export class DemoMoveObj {
	private m_rscene: ICoRendererScene = null;
	private m_rEditScene: ICoRendererScene = null;
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
		let url8 = "static/cospace/coMaterial/CoMaterial.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();

				this.initScene();
				new ModuleLoader(3, (): void => {

					console.log("math module loaded ...");
					this.testMath();

					new ModuleLoader(4, (): void => {
						console.log("ageom module loaded ...");
						this.createEditEntity();
					}).load(url3).load(url4).load(url6).load(url7);

				}).load(url2).load(url5).load(url8);

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
	private m_movedCtr: IDragMoveController;
	private m_scaleCtr: IDragScaleController;
	private m_rotatedCtr: IDragRotationController;
	private createEditEntity(): void {

		let rsc = this.m_rEditScene;
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
		/*
		this.m_movedCtr = new DragMoveController();
		// this.m_movedCtr = CoEdit.createDragMoveController();
		this.m_movedCtr.axisSize = 100;
		this.m_movedCtr.planeSize = 30;
		this.m_movedCtr.pickTestAxisRadius = 10;
		this.m_movedCtr.runningVisible = true;
		// this.m_movedCtr.initialize(this.m_rscene, 0);
		this.m_movedCtr.initialize(rsc, 0);
		// this.m_movedCtr.setVisible(true);
		//*/
		/*
		this.m_scaleCtr = new DragScaleController();
		this.m_scaleCtr.axisSize = 100;
		this.m_scaleCtr.planeSize = 30;
		this.m_scaleCtr.pickTestAxisRadius = 10;
		this.m_scaleCtr.runningVisible = true;
		this.m_scaleCtr.initialize(rsc, 1);
		//*/
		///*
		this.m_rotatedCtr = new DragRotationController();
		this.m_rotatedCtr.pickTestAxisRadius = 10;
		this.m_rotatedCtr.runningVisible = true;
		this.m_rotatedCtr.initialize(rsc, 1);
		//*/
	}
	private mouseUpListener(evt: any): void {
		console.log("DemoMoveObj::mouseUpListener() ...");
		if(this.getCtlVisible()) {
			if (this.m_movedCtr != null) {
				this.m_movedCtr.decontrol();
			}
			if (this.m_scaleCtr != null) {
				this.m_scaleCtr.decontrol();
			}
			if (this.m_rotatedCtr != null) {
				this.m_rotatedCtr.decontrol();
			}
		}
	}
	private mouseBgDownListener(evt: any): void {
		console.log("DemoMoveObj::mouseBgDownListener() ...");
		this.setCtlVisible(false);
	}
	private setCtlVisible(v: boolean): void {
		if (this.m_movedCtr != null) {
			this.m_movedCtr.setVisible(v);
		}
		if (this.m_scaleCtr != null) {
			this.m_scaleCtr.setVisible(v);
		}
		if (this.m_rotatedCtr != null) {
			this.m_rotatedCtr.setVisible(v);
		}
	}
	
	private getCtlVisible(): boolean {
		if (this.m_movedCtr != null) {
			return this.m_movedCtr.getVisible();
		}
		if (this.m_scaleCtr != null) {
			return this.m_scaleCtr.getVisible();
		}
		if (this.m_rotatedCtr != null) {
			return this.m_rotatedCtr.getVisible();
		}
		return false;
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
	//RendererSceneGraph
	private m_graph: RendererSceneGraph = new RendererSceneGraph();
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
			rscene.setClearRGBColor3f(0.23, 0.23, 0.23);
			// console.log("60/255: ", 60/255);
			// rscene.setClearUint24Color((60 << 16) + (60 << 8) + 60);

			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);
			this.m_rscene = rscene;

			let subScene = this.m_rscene.createSubScene(rparam, 3, false);
			subScene.enableMouseEvent(true);
			subScene.setAccessor(new SceneAccessor());
			// let rnode = subScene;
			// this.m_rscene.appendRenderNode(rnode);
			this.m_rEditScene = subScene;

			this.m_graph.addScene(this.m_rscene);
			this.m_graph.addScene(this.m_rEditScene);
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
	private m_entities: ITransformEntity[] = [];
	private createEntity(model: CoGeomDataType): ITransformEntity {
		// let rst = CoRenderer.RendererState;

		const MouseEvent = CoRScene.MouseEvent;
		// let material = new CoNormalMaterial().build().material;
		let material = CoRScene.createDefaultMaterial(true);
		material.initializeByCodeBuf(false);
		material.setRGB3f(0.7,0.7,0.7);

		let mesh = CoRScene.createDataMeshFromModel(model, material);
		let cv = mesh.bounds.center.clone();
		let vs = model.vertices;
		let tot = vs.length;
		for (let i = 0; i < tot;) {
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

		this.m_entities.push(entity);
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

		let pos = CoMath.createVec3();
		let entity = evt.target as ITransformEntity;
		entity.getPosition(pos);
		let wpos = evt.wpos as IVector3D;
		pos.subtractBy(wpos);
		this.setCtlVisible(true);
		this.applyMoveCtr(wpos, entity);
		this.applyScaleCtr(wpos, entity);
		this.applyRotatedCtr(wpos, entity);
	}
	private applyMoveCtr(wpos: IVector3D, target: ITransformEntity): void {
		if (this.m_movedCtr != null) {
			this.m_movedCtr.deselect();
			this.m_movedCtr.setPosition(wpos);
			this.m_movedCtr.update();
			// this.m_movedCtr.select( [evt.target] );
			let ls = this.m_entities;
			this.m_movedCtr.select([ls[0], ls[1], target]);
		}
	}

	private applyScaleCtr(wpos: IVector3D, target: ITransformEntity): void {
		if (this.m_scaleCtr != null) {
			console.log("applyScaleCtr() ....");
			this.m_scaleCtr.deselect();
			this.m_scaleCtr.setPosition(wpos);
			this.m_scaleCtr.update();
			// this.m_scaleCtr.select( [evt.target] );
			let ls = this.m_entities;
			this.m_scaleCtr.select([ls[0], ls[1], target]);
		}
	}
	private applyRotatedCtr(wpos: IVector3D, target: ITransformEntity): void {
		if (this.m_rotatedCtr != null) {
			console.log("applyRotatedCtr() ....");
			this.m_rotatedCtr.deselect();
			this.m_rotatedCtr.setPosition(wpos);
			this.m_rotatedCtr.update();
			// this.m_scaleCtr.select( [evt.target] );
			let ls = this.m_entities;
			this.m_rotatedCtr.select([ls[0], ls[1], target]);
		}
	}
	private mouseDown(evt: any): void { }
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_movedCtr != null) {
				this.m_movedCtr.run();
			}
			if (this.m_scaleCtr != null) {
				this.m_scaleCtr.run();
			}
			if (this.m_rotatedCtr != null) {
				this.m_rotatedCtr.run();
			}

			if (this.m_interact != null) {
				this.m_interact.run();
			}
			// this.m_rscene.run();

			this.m_graph.run();
			/*
			let pickFlag: boolean = true;

			let scene = this.m_rEditScene;
			scene.runBegin(true, true);
			scene.update(false, true);
			pickFlag = scene.isRayPickSelected();

			scene = this.m_rscene;
			scene.runBegin(false, true);
			scene.update(false, !pickFlag);
			pickFlag = pickFlag || scene.isRayPickSelected();

			//console.log("------------  ---------------------  -------------------");

			scene = this.m_rscene;
			scene.renderBegin(false);
			scene.run(false);
			scene.runEnd();

			scene = this.m_rEditScene;
			scene.renderBegin(false);
			scene.run(false);
			scene.runEnd();
			//*/
		}
	}
}

export default DemoMoveObj;
