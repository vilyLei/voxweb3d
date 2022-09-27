import { CoDataFormat } from "../../app/CoSpaceAppData";

import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoParticle } from "../../particle/ICoParticle";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

import { ICoMouseInteraction } from "../../voxengine/ui/ICoMouseInteraction";
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

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;
declare var CoEntity: ICoEntity;
declare var CoMaterial: ICoMaterial;
declare var CoParticle: ICoParticle;

/**
 * cospace renderer
 */
export class DemoCoBase {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;

	constructor() { }

	initialize(): void {
		console.log("DemoCoBase::initialize() ...");

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
		let grids = new FloorLineGrid();
		grids.initialize(this.m_rscene, 0, v0, v1, 20);
		let axis = CoEntity.createAxis3DEntity();
		axis.setPosition(v0);
		this.m_rscene.addEntity( axis );
		//*/
		this.test01();
	}
	private m_dragRCtr: DragRotationController = null;
	private m_dragMCtr: DragMoveController = null;
	private m_dragSCtr: DragScaleController = null;
	private m_axis: ITransformEntity = null;
	private m_currEntity: ITransformEntity = null;
	private m_plnv: IVector3D;

	private createLineEntity(mesh: IRawMesh, mBuilder: LineMeshBuilder): ITransformEntity {

		// let mBuilder = new LineMeshBuilder();
		// mBuilder.color.setRGB3f(0.1, 0.2, 0.3);
		// mBuilder.dynColorEnabled = true;
		// let mesh = mBuilder.createRectXOY(-100, -100, 200, 200);
		// let mesh = mBuilder.createRectXOZ(-100, -100, 200, 200);
		// let mesh = mBuilder.createRectYOZ(-100, -100, 200, 200);
		// let mesh = mBuilder.createCircleXOY(70, 10);
		// let mesh = mBuilder.createCircleXOZ(70, 10);

		// let mesh = mBuilder.createCircleXOY(70, 10, null, 0.1 * Math.PI, 0.8 * Math.PI);
		// this.m_plnv.setXYZ(0.0, 0.0, 1.0);
		// let mesh = mBuilder.createCircleXOZ(70, 10, null, 0.1 * Math.PI, 0.8 * Math.PI);
		// this.m_plnv.setXYZ(0.0, 1.0, 0.0);
		// let mesh = mBuilder.createCircleYOZ(70, 10, null, 0.1 * Math.PI, 0.8 * Math.PI);
		// this.m_plnv.setXYZ(1.0, 0.0, 0.0);

		// let mesh = mBuilder.createCircleXOZ(100,100);
		//let mesh = mBuilder.createCircleYOZ(100,100);
		// let mesh = mBuilder.createLine(CoMath.createVec3());
		console.log("test01(), mesh: ", mesh);

		// let material = CoMaterial.createLineMaterial(mBuilder.dynColorEnabled);
		// material.setRGB3f(1.0,0.0,0.0);

		// let billml = new BillboardLineMaterial();
		// let uniformData = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);
		// billml.brightnessEnabled = true;
		// billml.alphaEnabled = true;
		// billml.rotationEnabled = true;
		// // billml.fogEnabled = true;
		// billml.initialize(false);
		// let ml = billml.material;
		// ml.addUniformDataAt("u_billParam", uniformData);

		let material = new Line3DMaterial(mBuilder.dynColorEnabled);
		let rectLine = CoEntity.createDisplayEntity();
		rectLine.setMaterial(material);
		rectLine.setMesh(mesh);
		// rectLine.setRotationXYZ(30, 0.0, 0.0);
		// this.m_currEntity = rectLine;
		this.m_rscene.addEntity(rectLine);
		return rectLine;
	}
	private m_entities: ITransformEntity[] = null;
	private test01(): void {

		let RST = CoRScene.RendererState;
		this.m_plnv = CoMath.createVec3();
		/*
		let cirMat = CoMath.createMat4();
		cirMat.setRotationEulerAngle(Math.PI * 0.5, 0.0, Math.PI * 0.5);
		let plb = new PlaneMeshBuilder();
		plb.transMatrix = cirMat;
		let cirPlMaterial = CoMaterial.createDefaultMaterial(true);
		// cirPlMaterial.setTextureList([this.createTexByUrl()]);
		cirPlMaterial.initializeByCodeBuf(false);
		
		plb.setBufSortFormat( cirPlMaterial.getBufSortFormat() );
		let cirPlaneMesh = plb.createCircle(50, 25);

		let cirEntity = CoEntity.createDisplayEntity();		
		cirEntity.setMaterial(cirPlMaterial);
		cirEntity.setMesh(cirPlaneMesh);
		cirEntity.setRenderState( RST.NONE_CULLFACE_NORMAL_STATE );
		this.m_rscene.addEntity(cirEntity);
		// return;
		//*/
		//BoxMeshBuilder
		/*
		// let mat = CoMath.createMat4();
		// mat.rotationZ(-0.5 * Math.PI);
		//let pmaterial = CoMaterial.createQuadLineMaterial(true);
		let dynColorEnabled = true;
		let pmaterial = CoMaterial.createQuadLineMaterial(dynColorEnabled);
		pmaterial.initializeByCodeBuf(false);
		pmaterial.setColor(CoMaterial.createColor4(1.0,0.1,0.2));

		let build = new QuadLineMeshBuilder();
		build.thickness = 6.0;
		build.dynColorEnabled = dynColorEnabled;
		//let pmesh = build.createLine(CoMath.createVec3(), CoMath.createVec3(100,0,0));
		let V3F = CoMath.createVec3;
		// let pmesh = build.createCurveByPositions([
		// 	V3F(), V3F(100,0,0), V3F(100,100,0)
		// ]);
		let pmesh = build.createCircleXOY(80,10);
		// let mesh = mBuilder.create(30,100,20,-0.5);
		console.log("test01(), quad line pmesh: ", pmesh);

		let entity = CoEntity.createDisplayEntity();		
		entity.setMaterial(pmaterial);
		entity.setMesh(pmesh);
		this.m_rscene.addEntity(entity);
		return;
		//*/

		/*
		let mat = CoMath.createMat4();
		mat.rotationZ(-0.5 * Math.PI);
		let material = CoMaterial.createDefaultMaterial(true);
		material.initializeByCodeBuf(false);
		// let mBuilder = new ConeMeshBuilder();
		let mBuilder = CoMesh.cone;
		mBuilder.transMatrix = mat;
		mBuilder.setBufSortFormat(material.getBufSortFormat());
		// mBuilder.vbWholeDataEnabled = true;
		let mesh = mBuilder.create(30, 100, 20, 0.0);
		// let mesh = mBuilder.create(30,100,20,-0.5);
		console.log("test01(), mesh: ", mesh);

		let entity = CoEntity.createDisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		this.m_rscene.addEntity(entity);
		return;
		//*/
		/*
		let material = CoMaterial.createDefaultMaterial(true);
		material.initializeByCodeBuf(false);
		let mBuilder = new PlaneMeshBuilder();
		mBuilder.setBufSortFormat(material.getBufSortFormat());
		mBuilder.vbWholeDataEnabled = true;
		let mesh = mBuilder.createXOY(-100, -100, 200, 200);
		console.log("test01(), mesh: ", mesh);

		let entity = CoEntity.createDisplayEntity();
		entity.setMaterial( material );
		entity.setMesh(mesh);
		this.m_rscene.addEntity(entity);
		return;
		//*/
		/*
		let rad = 0.0;//0.1 * Math.PI;
		let radRange = Math.PI;//0.8 * Math.PI;
		let mBuilder = new LineMeshBuilder();
		mBuilder.color.setRGB3f(0.1, 0.2, 0.3);
		mBuilder.dynColorEnabled = true;
		let mesh = mBuilder.createCircleXOY(70, 20, null, rad, radRange);
		let la = this.createLineEntity(mesh, mBuilder);
		mesh = mBuilder.createCircleXOZ(70, 20, null, rad, radRange);
		let lb = this.createLineEntity(mesh, mBuilder);
		mesh = mBuilder.createCircleYOZ(70, 20, null, rad, radRange);
		let lc = this.createLineEntity(mesh, mBuilder);
		this.m_entities = [la, lb, lc];
		return;
		//*/
		/*
		let lmBuilder = new LineMeshBuilder();
		lmBuilder.color.setRGB3f(0.1, 0.2, 0.3);
		lmBuilder.dynColorEnabled = true;
		// let lmesh = lmBuilder.createRectXOY(-100, -100, 200, 200);
		// let lmesh = lmBuilder.createRectXOZ(-100, -100, 200, 200);
		// let lmesh = lmBuilder.createRectYOZ(-100, -100, 200, 200);
		// let lmesh = lmBuilder.createCircleXOY(70, 30);
		// let lmesh = lmBuilder.createCircleYOZ(70, 30);
		let posList = [
			CoMath.createVec3(),
			CoMath.createVec3(50,50,0),
			CoMath.createVec3(80,80,0),
			CoMath.createVec3(120,120,0)
		];
		let lmesh = lmBuilder.createLines(posList);
		// let lmesh = lmBuilder.createCircleXOZ(70, 10);

		// let lmesh = lmBuilder.createCircleXOY(70, 10, null, 0.1 * Math.PI, 0.8 * Math.PI);
		// this.m_plnv.setXYZ(0.0, 0.0, 1.0);
		// let lmesh = lmBuilder.createCircleXOZ(70, 10, null, 0.1 * Math.PI, 0.8 * Math.PI);
		// this.m_plnv.setXYZ(0.0, 1.0, 0.0);
		// let lmesh = lmBuilder.createCircleYOZ(70, 10, null, 0.1 * Math.PI, 0.8 * Math.PI);
		// this.m_plnv.setXYZ(1.0, 0.0, 0.0);

		// let lmesh = lmBuilder.createCircleXOZ(100,100);
		// let lmesh = lmBuilder.createCircleYOZ(100,100);
		// let lmesh = lmBuilder.createLine(CoMath.createVec3());
		console.log("test01(), lmesh: ", lmesh);


		// let material = CoMaterial.createLineMaterial(lmBuilder.dynColorEnabled);
		// material.setRGB3f(1.0,0.0,0.0);

		// let billml = new BillboardLineMaterial();
		// let uniformData = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);
		// billml.brightnessEnabled = true;
		// billml.alphaEnabled = true;
		// billml.rotationEnabled = true;
		// // billml.fogEnabled = true;
		// billml.initialize(false);
		// let ml = billml.material;
		// ml.addUniformDataAt("u_billParam", uniformData);

		let lmaterial = new Line3DMaterial(lmBuilder.dynColorEnabled);
		let rectLine = CoEntity.createDisplayEntity();
		rectLine.setMaterial(lmaterial);
		rectLine.setMesh(lmesh);
		// rectLine.setRotationXYZ(30, 0.0, 0.0);
		// this.m_currEntity = rectLine;

		// let cam = this.m_rscene.getCamera();
		// let mat4 = CoMath.createMat4();
		// let beginPos = CoMath.createVec3();
		// let atV = CoMath.createVec3().subVecsTo(beginPos, cam.getPosition());
		// let upV = CoMath.createVec3().copyFrom(cam.getUV());
		// mat4.pointAt(beginPos, atV, upV );
		// let trans = rectLine.getTransform();
		// trans.setParentMatrix(mat4);
		// rectLine.update();

		this.m_rscene.addEntity(rectLine);
		return;
		//*/
		/*
		let ring = new RotationRing();
		ring.initialize(this.m_rscene,1, 80, 30, 2);
		ring.setProgress(0.995);
		return;
		//*/
		/*
		let pv = CoMath.createVec3();
		let camPV = this.m_rscene.getCamera().getPosition();
		pv.copyFrom( camPV );
		let dis = pv.dot( this.m_plnv );
		pv.copyFrom(this.m_plnv);
		pv.scaleBy(-dis);
		pv.addBy(camPV);
		pv.scaleBy(0.3);

		let mc = CoMath.MathConst;
		let ang = mc.GetDegreeByXY(pv.y, pv.z);

		let axis0 = CoRScene.createAxis3DEntity(30);
		axis0.setPosition( pv );
		this.m_rscene.addEntity( axis0 );

		this.m_currEntity.setRotationXYZ(-ang, 0, 0);
		this.m_currEntity.update();
		return;
		//*/
		//*/
		/*
		let radius = 30.0;
		let segsTotal = Math.floor(radius * 0.5);
		let billLine = new BillboardLine();
		billLine.initializeCircleXOY(radius, segsTotal < 50 ? 50 : segsTotal);
		this.m_rscene.addEntity(billLine.entity);
		//*/
		// let circle = new RotationCircle();
		// circle.initialize(100,20,0, CoMaterial.createColor4(1.0,0.0,0.0));
		// this.m_rscene.addEntity(circle.getEntity());
		///*
		// let mat = CoMath.createMat4();
		// mat.rotationZ(-0.5 * Math.PI);
		let material = CoMaterial.createDefaultMaterial(true);
		material.initializeByCodeBuf(false);
		// let mBuilder = new BoxMeshBuilder();
		let mBuilder = CoMesh.box;
		// mBuilder.transMatrix = mat;
		mBuilder.setBufSortFormat(material.getBufSortFormat());
		// mBuilder.vbWholeDataEnabled = true;
		let mesh = mBuilder.createCube(30.0);
		// let mesh = mBuilder.create(30,100,20,-0.5);
		console.log("test01(), mesh: ", mesh);

		let box = CoEntity.createDisplayEntity();
		box.setMaterial(material);
		box.setMesh(mesh);
		this.m_currEntity = box;
		this.m_rscene.addEntity(box);
		//return;
		//*/
		///*
		let dragRCtr = new DragRotationController();
		dragRCtr.pickTestAxisRadius = 10.0;
		dragRCtr.initialize(this.m_rscene, 0);
		dragRCtr.select([box]);
		dragRCtr.enable();
		// dragRCtr.select([cirEntity]);
		this.m_dragRCtr = dragRCtr;
		//*/

		/*
		let dragSCtr = new DragScaleController();
		dragSCtr.initialize(this.m_rscene, 0);
		dragSCtr.select( [box] );
		this.m_dragSCtr = dragSCtr;
		//*/

		/*
		let dragMCtr = new DragMoveController();
		dragMCtr.initialize(this.m_rscene, 0);
		dragMCtr.select( [box] );
		this.m_dragMCtr = dragMCtr;
		//*/

		/*
		let bounds = CoEntity.createBoundsEntity();

		let radius = 30.0;
		let minV = CoMath.createVec3(radius,radius,radius).scaleBy(-1.0);
		let maxV = CoMath.createVec3(radius,radius,radius);
		bounds.setBounds(minV, maxV);
		bounds.setRayTester( new SphereRayTester(radius) );
		this.initializeEvent(bounds);
		this.m_rscene.addEntity( bounds );


		let par = CoParticle.createBillboard();
		par.initializeSquare(radius * 2, [this.createTexByUrl("static/assets/circle01.png")]);
		this.m_rscene.addEntity( par.entity, 1 );
		//*/
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
		console.log("DemoCoBase::mOverListener() ...");
	}
	private mOutListener(evt: any): void {
		console.log("DemoCoBase::mOutListener() ...");
	}
	private mDownListener(evt: any): void {
		console.log("DemoCoBase::mDownListener() ...");
	}
	private mouseUpListener(evt: any): void {
		console.log("DemoCoBase::mouseUpListener() ...");
		if (this.m_dragRCtr != null) {
			this.m_dragRCtr.decontrol();
		}
		if (this.m_dragMCtr != null) {
			this.m_dragMCtr.decontrol();
		}
		if (this.m_dragSCtr != null) {
			this.m_dragSCtr.decontrol();
		}
	}
	private mouseBgDownListener(evt: any): void {
		console.log("DemoCoBase::mouseBgDownListener() ...");
	}
	private createDefaultEntity(): void {

		let axis = CoRScene.createAxis3DEntity();
		this.m_rscene.addEntity(axis);
		this.m_axis = axis;

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
		if (this.m_rscene != null && this.m_interact == null && typeof CoMouseInteraction !== "undefined") {
			this.m_interact = CoMouseInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rscene);
			this.m_interact.setSyncLookAtEnabled(true);
			// this.m_interact.setSyncLookAtEnabled(false);
			// this.m_interact.enableSlide();
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
	private m_tempPv0: IVector3D = null;
	private m_tempPv1: IVector3D = null;
	private m_tempPv2: IVector3D = null;
	private m_tempPv3: IVector3D = null;
	private m_tempPv4: IVector3D = null;
	private m_tempPv5: IVector3D = null;
	private m_mat4: IMatrix4 = null;
	private m_mat4A: IMatrix4 = null;
	private m_tarPos: IVector3D = null;
	private rotateTest(): void {
		/*
		if (this.m_currEntity != null) {

			if (this.m_tempPv0 == null) {
				this.m_tempPv0 = CoMath.createVec3();
				this.m_tempPv1 = CoMath.createVec3();
				this.m_tempPv2 = CoMath.createVec3();
				this.m_tempPv3 = CoMath.createVec3(1.0, 0.0, 0.0);
				this.m_tempPv4 = CoMath.createVec3();
				this.m_tempPv5 = CoMath.createVec3();
				this.m_tarPos = CoMath.createVec3();
			}
			if (this.m_mat4 == null) {
				this.m_mat4 = CoMath.createMat4();
				this.m_mat4A = CoMath.createMat4();
			}

			let et = this.m_currEntity;
			let trans = et.getTransform();

			et.getPosition( this.m_tarPos );
			let cam = this.m_rscene.getCamera();

			let axis = this.m_tempPv0.subVecsTo( cam.getPosition(), this.m_tarPos );
			axis.normalize();
			
			let mat4 = this.m_mat4;
			mat4.identity();
			mat4.appendRotation(this.m_rad, axis);
			let ir = mat4.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
			let mat4A = this.m_mat4A;
			mat4A.identity();
			// mat4A.appendRotationEulerAngle(ir.x, ir.y, ir.z);
			mat4A.append(mat4);

			// trans.setParentMatrix(mat4);

			this.m_rad += 0.01;

			let rv = mat4A.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
			et.setRotation3(rv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));

			et.update();
		}
		//*/
		// this.rotLSDo(0);
		// this.rotLSDo(1);
		// this.rotLSDo(2);
	}

	private _dAng: number = 0;
	private m_outV: IVector3D = null;
	private m_direcV: IVector3D = null;
	private m_direcM: IMatrix4 = null;
	/**
	 * 使显示对象朝向某个方向
	 * @param				directV		将要变化到的朝向的方向矢量
	 * @param				maxAng		本次向目标朝向变化的最大变化角度,如果当前转向所需的角度大于这个值，则使用maxAng的值
	 * 									此参数用于实现朝向变化的平滑差值
	 * @param				bv			源朝向
	 * @param				enabled		是否启用朝向更改操作,默认true是启用的
	 * @return				返回本次直接计算出来的转向角度值,用户可以依据此值和maxAng值来判定后续的操作
	 * */
	directAt(directV: IVector3D, maxAng: number = 1000, bv: IVector3D = null, enabled: Boolean = true): number {
		if (this.m_direcV == null) {
			this.m_direcV = CoMath.createVec3();
			this.m_outV = CoMath.createVec3();
		}
		if (this.m_direcM == null) {
			this.m_direcM = CoMath.createMat4();
		}
		let direcV = this.m_direcV;
		if (enabled) {
			if (bv == null) {
				if (direcV == null) {
					direcV = CoMath.createVec3(1, 0, 0);
				} else {
					direcV.setTo(1, 0, 0);
				}
			} else {
				if (direcV == null) direcV = CoMath.createVec3();// bv;
				direcV.setTo(bv.x, bv.y, bv.z);
			}
			//
			const V3 = CoMath.Vector3D;
			var ang: number = V3.AngleBetween(direcV, directV);
			let _dAng = Math.abs(ang);
			let _direcM = this.m_direcM;
			if (_dAng > 0.01) {
				_direcM.identity();
				V3.Cross(direcV, directV, this.m_outV);
				if (_dAng > maxAng) {
					if (ang * maxAng < 0) {
						maxAng *= -1;
					}
				} else {
					maxAng = ang;
				}
				_direcM.appendRotation(CoMath.MathConst.DegreeToRadian(maxAng), this.m_outV);
				direcV.copyFrom(directV);
				// // direcV.changed = true;
				// _isChange = true;
			}
			return ang;
		} else {
			if (direcV) {
				direcV.setTo(1, 0, 0);
			}
			// if (_direcM != null) {
			// 	_isChange = true;
			// 	Mat3DCell.addMat(_direcM);
			// 	_direcM = null;
			// }
		}
		return 0;
	}
	private m_rad: number = 0.0;
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_dragRCtr != null) {
				this.m_dragRCtr.run();
			}
			if (this.m_dragMCtr != null) {
				this.m_dragMCtr.run();
			}
			if (this.m_dragSCtr != null) {
				this.m_dragSCtr.run();
			}
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.rotateTest();
			// if (this.m_tarPos != null) {
			// 	this.m_tarPos.y = 200;
			// 	this.m_tarPos.x = 300.0 * Math.cos(this.m_rad);
			// 	this.m_tarPos.z = 300.0 * Math.sin(this.m_rad);

			// 	this.m_rad += 0.01;
			// }

			this.m_rscene.run();
		}
	}
}

export default DemoCoBase;
