import Vector3D from "../../vox/math/Vector3D";
import MouseEvent from "../../vox/event/MouseEvent";
import RendererDevice from "../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import CameraTrack from "../../vox/view/CameraTrack";

import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import DebugFlag from "../../vox/debug/DebugFlag";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";

import DataMesh from "../../vox/mesh/DataMesh";
import DivLog from "../../vox/utils/DivLog";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import { CoSpace } from "../CoSpace";
import { DataFormat } from "../schedule/base/DataUnit";
import { GeometryDataUnit } from "../schedule/base/GeometryDataUnit";
import { NormalViewerMaterial } from "./material/NormalViewerMaterial";
import RendererState from "../../vox/render/RendererState";
import MeshBase from "../../vox/mesh/MeshBase";
import { FBXLoader } from "../modules/fbx/FBXLoader";
import { FBXBufferLoader } from "../modules/fbx/FBXBufferLoader";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import AABB from "../../vox/geom/AABB";

class GeomNormal {

	constructor() {

	}
	test(mesh: MeshBase): boolean {

		return false;
	}
}

export class RenderingVerifier {
	constructor() {}
	/**
	 * (引擎)数据协同中心实例
	 */
	private m_cospace: CoSpace = new CoSpace();

	private m_rscene: RendererScene = null;
	private m_camTrack: CameraTrack = null;
	private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_profileInstance: ProfileInstance = null;

	private m_scaleV: Vector3D = new Vector3D(1.0,1.0,1.0);

	private m_time: number = 0;
	initialize(): void {
		
		console.log("RenderingVerifier::initialize()......");

		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			DivLog.SetDebugEnabled(true);

			let rparam: RendererParam = new RendererParam();
			//rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45, 50.0, 10000.0);
			rparam.setAttriStencil(true);
			rparam.setAttriAntialias(true);
			rparam.setCamPosition(2000.0, 2000.0, 2000.0);
			rparam.setCamLookAtPos(this.m_lookV.x, this.m_lookV.y, this.m_lookV.z);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 5);
			this.m_rscene.updateCamera();
			
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());

			this.m_rscene.addEventListener(
				MouseEvent.MOUSE_DOWN,
				this,
				this.mouseDown
			);
			this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

			this.m_rscene.enableMouseEvent(true);
			this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
			this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
			this.m_cameraZoomController.syncLookAt = true;

			this.m_stageDragSwinger.initialize(
			this.m_rscene.getStage3D(),
			this.m_rscene.getCamera()
			);
			this.m_camTrack = new CameraTrack();
			this.m_camTrack.bindCamera(this.m_rscene.getCamera());

			this.m_statusDisp.initialize();
			//this.m_profileInstance.initialize(this.m_rscene.getRenderer());
			
			this.m_rscene.setClearRGBColor3f(0.5, 0.5, 0.5);

			//   DivLog.ShowLog("renderer inited.");
			//   DivLog.ShowLog(RendererDevice.GPU_RENDERER);
			
			// let axis: Axis3DEntity = new Axis3DEntity();
			// axis.initialize(300);
			// this.m_rscene.addEntity(axis);
			
			// // 初始化数据协同中心
			this.m_cospace.initialize( 3, "static/cospace/core/code/ThreadCore.umd.min.js", true );
			// this.m_cospace.initialize(4, "cospace/core/code/ThreadCore.umd.js", true);
			
			this.m_time = Date.now();
			this.loadFBX();
			// this.loadCTM();
		}
	}
	private m_entities: DisplayEntity[] = [];

	private fitToCenter(): void {
		
		let entities = this.m_entities;
        let aabb: AABB = new AABB();
        for (let k: number = 0; k < entities.length; ++k) {

            entities[k].update();
            if (k > 0) aabb.union(entities[k].getGlobalBounds());
            else aabb.copyFrom(entities[k].getGlobalBounds());
        }
        aabb.update();

        let cv = aabb.center;
        let offsetV: Vector3D = new Vector3D(-cv.x, -aabb.min.y, -cv.z);
		// console.log("XXXXXXXXXXXXXXXXXX offsetV: ",offsetV);
        for (let k: number = 0; k < entities.length; ++k) {
            entities[k].offsetPosition(offsetV);
            entities[k].update();
        }
	}
	private loadFBX(): void {

		let url: string = "static/assets/fbx/test01.fbx";
		// url = "static/assets/fbx/model_500W.fbx";
		// url = "static/assets/fbx/Samba_Dancing.fbx";

		let fbxBufLoader = new FBXBufferLoader();
		fbxBufLoader.load(
			url,
			(modelMap: Map<number, GeometryModelDataType>, url: string): void => {
				// this.m_scaleV.setXYZ(-2.0, -2.0, 2.0);
				this.m_scaleV.setXYZ(2.0, 2.0, 2.0);
				// console.log("loadFBX(), modelMap: ",modelMap);
					let partsTotal: number = 0;
				for(let [key, value] of modelMap) {
					partsTotal++;
					this.initCTMEntity(value);
				}
				console.log("partsTotal: ", partsTotal);
				this.fitToCenter();
			}
			);
	}
	private loadCTM(): void {

		this.m_scaleV.setXYZ(2.0,2.0,2.0);

		let baseUrl: string = window.location.href + "static/private/ctm/";

		let multi: boolean = true;
		multi = false;
		if(multi) {
			for (let i: number = 26; i >= 0; --i) {
				let url: string = baseUrl + "sh202/sh202_" + i + ".ctm";
				this.loadCTMByUrl(url);
			}
		}else {
			//this.loadCTMByUrl("static/private/ctm/errorNormal.ctm");
			this.loadCTMByUrl("static/private/ctm/ctm_500W.ctm");
		}
	}
	private loadCTMByUrl(url: string): void {
		this.m_cospace.geometry.getCPUDataByUrlAndCallback(
		url,
		DataFormat.CTM,
		(unit: GeometryDataUnit, status: number): void => {
			let model: GeometryModelDataType = unit.data.model;
			if (model.normals == null) {
				console.error("model.normals == null, url: ", url);
			}
			this.initCTMEntity(model);
		},
		true
		);
	}
	private m_vtxTotal: number = 0;
	private initCTMEntity(model: GeometryModelDataType): void {
		//console.log("lossTime: ", (Date.now() - this.m_time)+" ms");
		DivLog.ShowLogOnce( "lossTime: " + (Date.now() - this.m_time)+" ms");

		this.m_vtxTotal += model.vertices.length;
		let time = Date.now();

		let material = new NormalViewerMaterial();
		material.initializeByCodeBuf();
		let dataMesh: DataMesh = new DataMesh();
		dataMesh.vbWholeDataEnabled = false;
		dataMesh.setVS(model.vertices);
		dataMesh.setUVS(model.uvsList[0]);
		dataMesh.setNVS(model.normals);
		dataMesh.setIVS(model.indices);
		dataMesh.setVtxBufRenderData(material);

		dataMesh.initialize();

		// console.log("ctm dataMesh: ", dataMesh);

		console.log("build lossTime: ", (Date.now() - time)+" ms");
		console.log("this.m_vtxTotal: ", this.m_vtxTotal + "个顶点， tris: ",this.m_vtxTotal/3);
		// DivLog.ShowLog("三角面数量: " + dataMesh.trisNumber + "个");

		let entity: DisplayEntity = new DisplayEntity();
		// entity.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
		// entity.setRenderState(RendererState.NORMAL_STATE);
		entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMesh(dataMesh);
		entity.setMaterial(material);
		entity.setScale3( this.m_scaleV );
		this.m_rscene.addEntity(entity);
		this.m_entities.push( entity );

	}

  private m_runFlag: boolean = true;
  private mouseDown(evt: any): void {
    this.m_runFlag = true;
    DebugFlag.Flag_0 = 1;
  }
  private mouseUp(evt: any): void {}
  private update(): void {
    this.m_statusDisp.update(true);
  }
  private m_lookV: Vector3D = new Vector3D(0.0, 0.0, 0.0);
  run(): void {
    this.update();

    this.m_stageDragSwinger.runWithYAxis();
    this.m_cameraZoomController.run(this.m_lookV, 30.0);

    this.m_rscene.run(true);

	if (this.m_profileInstance != null) {
		this.m_profileInstance.run();
	}
  }
}

export default RenderingVerifier;
