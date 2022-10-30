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
	private m_rscene: ICoRendererScene = null;
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
	private m_dragRCtr: DragRotationController = null;
	private m_dragMCtr: DragMoveController = null;
	private m_dragSCtr: DragScaleController = null;
	private m_axis: ITransformEntity = null;
	private m_currEntity: ITransformEntity = null;
	private m_plnv: IVector3D;

	private m_entities: ITransformEntity[] = null;
	
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
		console.log("DemoCoUIInterac::mOverListener() ...");
	}
	private mOutListener(evt: any): void {
		console.log("DemoCoUIInterac::mOutListener() ...");
	}
	private mDownListener(evt: any): void {
		console.log("DemoCoUIInterac::mDownListener() ...");
	}
	private mouseUpListener(evt: any): void {
		console.log("DemoCoUIInterac::mouseUpListener() ...");
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
		console.log("DemoCoUIInterac::mouseBgDownListener() ...");
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
		// if (this.m_rscene != null && this.m_interact == null && typeof CoUIInteraction !== "undefined") {
		// 	this.m_interact = CoUIInteraction.createMouseInteraction();
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

export default DemoCoUIInterac;
