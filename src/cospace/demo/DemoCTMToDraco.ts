import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { DracoSrcGeomObject, DracoGeomEncoder } from "../modules/draco/DracoGeomEncoder";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import { Axis3DEntity, DataMesh, DisplayEntity, RendererDevice, RendererParam, RendererScene } from "../voxengine/CoEngine";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import MeshBase from "../../vox/mesh/MeshBase";
import { NormalUVViewerMaterial } from "./material/NormalUVViewerMaterial";
import { FileIO } from "../../app/slickRoad/io/FileIO";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import BinaryLoader from "../../vox/assets/BinaryLoader";

declare var draco3d: any;
declare var createEncoderModule: any;
declare var DracoEncoderModule: any;
/**
 * ctm to draco 多线程示例
 */
export class DemoCTMToDraco {
	constructor() {}

	private m_threadSchedule: ThreadSchedule = new ThreadSchedule();

	private m_ctmParseTask: CTMParseTask;

	private m_dracoGeomEncoder: DracoGeomEncoder;

	private m_rscene: RendererScene = null;
	private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();

	initialize(): void {
		console.log("DemoCTMToDraco::initialize()...");

		let dependencyGraphObj: object = {
			nodes: [
				{ uniqueName: "dracoGeomParser", path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js" },
				{ uniqueName: "dracoWasmWrapper", path: "static/cospace/modules/dracoLib/w2.js" },
				{ uniqueName: "dracoGeomEncoder", path: "static/cospace/modules/dracoEncode/ModuleDracoGeomEncoder.umd.js" },
				{ uniqueName: "dracoWasmEncodeWrapper", path: "static/cospace/modules/dracoLib/ew.js" },
				{ uniqueName: "ctmGeomParser", path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js" }
			],
			maps: [
				{ uniqueName: "dracoGeomParser", includes: [1] }, // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
				{ uniqueName: "dracoGeomEncoder", includes: [3] } // 这里[1]表示 dracoGeomEncoder 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
			]
		};
		let jsonStr: string = JSON.stringify(dependencyGraphObj);

		// 初始化多线程调度器
		// this.m_threadSchedule.initialize(1, "cospace/core/code/ThreadCore.umd.min.js");
		this.m_threadSchedule.setDependencyGraphJsonString(jsonStr);
		this.m_threadSchedule.initialize(1, "static/cospace/core/code/ThreadCore.umd.js");

		// 建立 draco 模型数据builder(包含加载和解析)
		this.m_dracoGeomEncoder = new DracoGeomEncoder("static/cospace/modules/draco/ModuleDracoGeomEncoder.js");


		// 创建 ctm 加载解析任务
		let ctmParseTask = new CTMParseTask("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js");
		// 绑定当前任务到多线程调度器
		this.m_threadSchedule.bindTask(ctmParseTask);
		// 设置一个任务完成的侦听器
		ctmParseTask.setListener(this);
		this.m_ctmParseTask = ctmParseTask;

		this.m_dracoGeomEncoder.initialize(this.m_threadSchedule);
		this.m_dracoGeomEncoder.setListener(this);

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		this.update();
		this.initScene();

		// let baseUrl: string = this.m_baseUrl;
		// let urls: string[] = [];
		// for (let i = 0; i <= 26; ++i) {
		// 	this.m_ctmName = "sh202_" + i;
		// 	urls.push(baseUrl + "sh202/" + this.m_ctmName + ".ctm");
		// }
		// urls = [baseUrl + "errorNormal.ctm"];

		// this.parseCTMData( urls[0] );

		this.parseNext();
	}

	private m_baseUrl: string = "static/private/ctm/";
	private m_ctmName: string = "";
	private m_index: number = 0;
	private m_total: number = 27;

	private parseNext(): void {

		if(this.m_index < this.m_total) {

			this.m_ctmName = "sh202_" + this.m_index;
			this.m_ctmName = "errorNormal";
			this.m_index++;

			//let url = this.m_baseUrl + "sh202/" + this.m_ctmName + ".ctm";
			let url = this.m_baseUrl + this.m_ctmName + ".ctm";
			this.parseCTMData( url );
		}
	}
	private setBinaryDataToTask(ctmDataBuffer: ArrayBuffer, url: string): void {

		let data = new Uint8Array( ctmDataBuffer );
		// 发送一份任务处理数据，一份数据一个子线程处理一次
		this.m_ctmParseTask.addBinaryData(data, url);
	}

	private parseCTMData(ctmUrl: string): void {
		let ctmLoader: BinaryLoader = new BinaryLoader();
		ctmLoader.uuid = ctmUrl;
		ctmLoader.load(ctmUrl, this);
	}

	loaded(buffer: ArrayBuffer, uuid: string): void {
		this.setBinaryDataToTask(buffer, uuid);
	}
	loadError(status: number, uuid: string): void {}
	// 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
	ctmParseFinish(model: GeometryModelDataType, url: string): void {
		console.log("DemoCTMToDraco::ctmParseFinish(), model: ", model, ", url: ", url);

		let geomData: DracoSrcGeomObject = {
			vertices: model.vertices.buffer.slice(0),
			texcoords: model.uvsList[0].buffer.slice(0),
			normals: model.normals.buffer.slice(0),
			indices: model.indices.buffer.slice(0)
		};
		this.m_dracoGeomEncoder.setParseData(geomData, "ctm_geom", 0);
	}
	// draco 编码结束后回调
	dracoEncodeFinish(buf: ArrayBuffer, url: string, index: number): void {
		console.log("dracoEncodeFinish buf: ", buf);

		let material = new NormalUVViewerMaterial();
		material.initializeByCodeBuf();

		// let mesh = new DataMesh();
		// mesh.setIVS();
		// let boxEntity = new DisplayEntity();
		// boxEntity.setMaterial(material);
		// this.m_rscene.addEntity(boxEntity);

		let f = new FileIO();
		f.downloadBinFile(buf, this.m_ctmName, "drc");
	}
	private mouseDown(evt: any): void {}
	private encodeGeom(mesh: MeshBase): void {
		console.log("mesh: ", mesh);

		let geomData: DracoSrcGeomObject = {
			vertices: mesh.getVS().buffer.slice(0),
			texcoords: mesh.getUVS().buffer.slice(0),
			normals: mesh.getNVS().buffer.slice(0),
			indices: mesh.getIVS().buffer.slice(0)
		};
		//this.m_dracoGeomEncoder.setParseData(geomData, "box_geom", 0);
	}
	private initScene(): void {
		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

			let rparam: RendererParam = new RendererParam();
			//rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45, 50.0, 10000.0);
			rparam.setAttriStencil(true);
			rparam.setAttriAntialias(true);
			rparam.setCamPosition(2000.0, 2000.0, 2000.0);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 5);
			this.m_rscene.updateCamera();

			this.m_rscene.enableMouseEvent(true);
			this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
			this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
			this.m_cameraZoomController.syncLookAt = true;

			this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

			this.m_statusDisp.initialize();
			//this.m_profileInstance.initialize(this.m_rscene.getRenderer());

			this.m_rscene.setClearRGBColor3f(0.5, 0.5, 0.5);

			let axis: Axis3DEntity = new Axis3DEntity();
			axis.initialize(300);
			this.m_rscene.addEntity(axis);

			let material = new NormalUVViewerMaterial();
			material.initializeByCodeBuf();

			/*
			let boxEntity = new Box3DEntity();
			boxEntity.setMaterial(material);
			boxEntity.initializeCube(100);
			this.m_rscene.addEntity(boxEntity);

			this.encodeGeom(boxEntity.getMesh());
			//*/

			/*
			let sphEntity = new Sphere3DEntity();
			sphEntity.setMaterial(material);
			sphEntity.initialize(100,20,20)
			this.m_rscene.addEntity(sphEntity);

			this.encodeGeom(sphEntity.getMesh());
			//*/
		}
	}
	private m_timeoutId: any = -1;
	/**
	 * 定时调度
	 */
	private update(): void {
		this.m_threadSchedule.run();
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 50); // 20 fps
	}
	run(): void {
		this.m_stageDragSwinger.runWithYAxis();
		this.m_cameraZoomController.run(null, 30.0);

		this.m_rscene.run(true);
	}
}

export default DemoCTMToDraco;
