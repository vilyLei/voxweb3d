import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { DracoSrcGeomObject, DracoGeomEncoder } from "../modules/draco/DracoGeomEncoder";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import { Axis3DEntity, DataMesh, DisplayEntity, RendererDevice, RendererParam, RendererScene, RendererState, Vector3D } from "../voxengine/CoEngine";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import MeshBase from "../../vox/mesh/MeshBase";
import { NormalUVViewerMaterial } from "./material/NormalUVViewerMaterial";
import { FileIO } from "../../app/slickRoad/io/FileIO";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import BinaryLoader from "../../vox/assets/BinaryLoader";
import { DracoGeomBuilder } from "../modules/draco/DracoGeomBuilder";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

declare var DracoEncoderModule: any;
/**
 * ctm to draco 多线程示例
 */
export class DemoCTMToDraco {
	constructor() {}

	private m_threadSchedule: ThreadSchedule = new ThreadSchedule();

	private m_ctmParseTask: CTMParseTask;

	private m_dracoGeomEncoder: DracoGeomEncoder;
	private m_dracoGeomBuilder: DracoGeomBuilder;

	private m_rscene: RendererScene = null;
	private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();

	private m_profileInstance: ProfileInstance = null;

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
		this.m_threadSchedule.setParams(false, 0)
		this.m_threadSchedule.initialize(1, "static/cospace/core/code/ThreadCore.umd.js");

		// 建立 draco 模型数据builder(包含加载和解析)
		this.m_dracoGeomEncoder = new DracoGeomEncoder("static/cospace/modules/draco/ModuleDracoGeomEncoder.js");
		this.m_dracoGeomEncoder.initialize(this.m_threadSchedule);
		this.m_dracoGeomEncoder.setListener(this);
		this.m_dracoGeomEncoder.setCompressParams(10,11,10,10);

		// 创建 ctm 加载解析任务
		let ctmParseTask = new CTMParseTask("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js");
		// 绑定当前任务到多线程调度器
		this.m_threadSchedule.bindTask(ctmParseTask);
		// 设置一个任务完成的侦听器
		ctmParseTask.setListener(this);
		this.m_ctmParseTask = ctmParseTask;


		// 建立 draco 模型数据builder(包含加载和解析)
		this.m_dracoGeomBuilder = new DracoGeomBuilder("static/cospace/modules/draco/ModuleDracoGeomParser.js");
		this.m_dracoGeomBuilder.initialize(this.m_threadSchedule);
		this.m_dracoGeomBuilder.setListener(this);

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		this.update();
		this.initScene();

		this.parseCTMNext();
	}

	private m_baseUrl: string = "static/private/ctm/";
	private m_ctmName: string = "";
	private m_index: number = 0;
	private m_total: number = 27;//this.m_index + 1;
	private m_dracoFileBuf: ArrayBuffer = null;

	private parseCTMNext(): void {

		// console.log("#####@@@@ A parseCTMNext(), index: ", this.m_index);
		if (this.m_index < this.m_total) {
			this.m_ctmName = "sh202_" + this.m_index;
			let url = this.m_baseUrl + "sh202/" + this.m_ctmName + ".ctm";

			this.m_index++;

			// this.m_ctmName = "errorNormal";
			// url = this.m_baseUrl + this.m_ctmName + ".ctm";

			this.parseCTMData(url);
		}
	}
	private setBinaryDataToTask(ctmDataBuffer: ArrayBuffer, url: string): void {
		let data = new Uint8Array(ctmDataBuffer);
		// 发送一份任务处理数据，一份数据一个子线程处理一次
		this.m_ctmParseTask.addBinaryData(data, url);
	}

	private parseCTMData(ctmUrl: string): void {
		console.log("	>>> parseCTMData() ctmUrl: ", ctmUrl);
		let ctmLoader: BinaryLoader = new BinaryLoader();
		ctmLoader.uuid = ctmUrl;
		ctmLoader.load(ctmUrl, this);
	}
	private showModel(model: GeometryModelDataType, offset: number = 0): DisplayEntity {

		let material = new NormalUVViewerMaterial();
		material.initializeByCodeBuf();

		let mesh: DataMesh = new DataMesh();
		mesh.setIVS(model.indices);
		// mesh.setVS(model.vertices.subarray(offset));
		// mesh.setUVS(model.uvsList[0].subarray(offset));
		// mesh.setNVS(model.normals.subarray(offset));
		mesh.setVS(model.vertices);
		mesh.setUVS(model.uvsList[0]);
		mesh.setNVS(model.normals);
		mesh.setBufSortFormat(material.getBufSortFormat());
		mesh.initialize();

		let entity: DisplayEntity = new DisplayEntity();
		entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMaterial(material);
		entity.setMesh(mesh);
		this.m_rscene.addEntity(entity);

		return entity;
	}
	// 单个draco segment 几何数据解析结束之后的回调
	dracoParse(model: GeometryModelDataType, index: number, total: number): void {

		let vtxTotal: number = (model.vertices.length - 0) / 3;
		let trisNumber: number = model.indices.length / 3;
		// if(vtxTotal == 803937) {
			let entity = this.showModel( model, 0 );
			entity.setScaleXYZ(1.0, 1.0, -1.0);
			entity.setXYZ(0, 0, 100.0);
			entity.update();

			if(this.m_dracoFileBuf != null) {
				// if(vtxTotal == 803937) {
					// let f = new FileIO();
					// f.downloadBinFile(this.m_dracoFileBuf, this.m_ctmName, "drc");
				// }
				this.m_dracoFileBuf = null;
			}
		// }

		console.log("dracoParse mesh vtx total: ", vtxTotal);
		console.log("dracoParse mesh trisNumber: ", trisNumber);
	}
	// 所有 draco segment 几何数据解析结束之后的回调，表示本次加载解析任务结束
	dracoParseFinish(models: GeometryModelDataType[], total: number): void {
		console.log("dracoParseFinish models: ", models);

		if (total == 1) {
			this.dracoParse(models[0], 0, 1);
		}

		console.log("#####@@@@ B dracoParseFinish()...");
		this.parseCTMNext();
	}
	// 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
	ctmParseFinish(model: GeometryModelDataType, url: string): void {
		console.log("DemoCTMToDraco::ctmParseFinish(), model: ", model, ", url: ", url);
		let vtxTotal: number = model.vertices.length  / 3;
		let trisNumber: number = model.indices.length / 3;
		console.log("ctmParseFinish mesh vtx total: ", vtxTotal);
		console.log("ctmParseFinish mesh trisNumber: ", trisNumber);


		let entity = this.showModel( model, 0 );
		entity.setXYZ(0, 0, -100.0);

		let geomData: DracoSrcGeomObject = {
			vertices: model.vertices.slice(0),
			texcoords: model.uvsList[0].slice(0),
			normals: model.normals.slice(0),
			indices: model.indices.slice(0)
		};
		// return;
		let multi_thread_encode = true;
		if (multi_thread_encode) {
			this.m_dracoGeomEncoder.setParseData(geomData, "ctm_geom", 0);
		} else {
			this.loadAppModule("static/cospace/modules/dracoLib/dEncoder.js", geomData);
		}
	}
	loaded(buffer: ArrayBuffer, uuid: string): void {
		console.log("	>>> loaded() loaded bytes total: ", buffer.byteLength);
		this.setBinaryDataToTask(buffer, uuid);
	}
	loadError(status: number, uuid: string): void {}
	// draco 编码结束后回调
	dracoEncodeFinish(buf: ArrayBuffer, url: string, index: number): void {
		console.log("	>>> dracoEncodeFinish buf bytes total: ", buf.byteLength);
		this.m_dracoFileBuf = buf;
		this.m_dracoGeomBuilder.parseBinaryData(buf.slice(0));

		// let gBuilder = new DracoGeomBuilder("static/cospace/modules/draco/ModuleDracoGeomParser.js");
		// gBuilder.initialize(this.m_threadSchedule);
		// gBuilder.setListener(this);
		// gBuilder.parseBinaryData(buf.slice(0));

		// let f = new FileIO();
		// f.downloadBinFile(buf, this.m_ctmName, "drc");
	}
	private mouseDown(evt: any): void {}

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

			// this.m_profileInstance = new ProfileInstance();
			// this.m_profileInstance.initialize(this.m_rscene.getRenderer());

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

        // this.m_statusDisp.render();
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 50); // 20 fps
	}
	run(): void {
		this.m_statusDisp.update(true);

		this.m_stageDragSwinger.runWithYAxis();
		this.m_cameraZoomController.run(null, 30.0);

		this.m_rscene.run(true);

		if (this.m_profileInstance != null) {
			this.m_profileInstance.run();
		}
		const st = this.m_rscene.getRenderProxy().status;
        this.m_statusDisp.statusInfo = "/" + st.drawCallTimes;
	}
	// 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
	private showGeom(model: any): void {
		let material = new NormalUVViewerMaterial();
		material.initializeByCodeBuf();

		let dataMesh: DataMesh = new DataMesh();
		// dataMesh.wireframe = true;
		dataMesh.vbWholeDataEnabled = false;
		dataMesh.setVS(model.vertices);
		dataMesh.setUVS(model.texcoords);
		dataMesh.setNVS(model.normals);
		dataMesh.setIVS(model.indices);
		dataMesh.setVtxBufRenderData(material);

		dataMesh.initialize();

		let entity: DisplayEntity = new DisplayEntity();
		// entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMesh(dataMesh);
		entity.setMaterial(material);
		this.m_rscene.addEntity(entity);
	}

	private encoder: any = null;
	private encoderObj: any = { wasmBinary: null };
	private encode(encoderModule: any, geomData: DracoSrcGeomObject): void {
		// let u16Arr = new Uint16Array(geomData.indices);
		const geomMesh: {
			indices: Uint16Array | Uint32Array;
			vertices: Float32Array;
			normals: Float32Array;
			colors: Float32Array;
			texcoords: Float32Array;
		} = {
			indices: (geomData.indices),
			vertices: (geomData.vertices),
			texcoords: (geomData.texcoords),
			normals: (geomData.normals),
			colors: null
		};
		// geomMesh.indices.set(u16Arr);
		// this.showGeom(geomMesh);

		const encoder = new encoderModule.Encoder();

		let speed: number = 0;
		console.log("encode to draco speed: ", speed);

		encoder.SetSpeedOptions(speed, speed);
		encoder.SetAttributeQuantization(encoderModule.POSITION, 11);
		encoder.SetAttributeQuantization(encoderModule.TEX_COORD, 10);
		encoder.SetAttributeQuantization(encoderModule.NORMAL, 8);
		encoder.SetAttributeQuantization(encoderModule.GENERIC, 8);

		const meshBuilder = new encoderModule.MeshBuilder();
		const dracoMesh = new encoderModule.Mesh();
		const numFaces = geomMesh.indices.length / 3;
		const numPoints = geomMesh.vertices.length / 3;
		meshBuilder.AddFacesToMesh(dracoMesh, numFaces, geomMesh.indices);

		meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.POSITION, numPoints, 3, geomMesh.vertices);
		meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.NORMAL, numPoints, 3, geomMesh.normals);
		meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.TEX_COORD, numPoints, 2, geomMesh.texcoords);
		// draco encode
		const encodedData = new encoderModule.DracoInt8Array();
		const encodedLen = encoder.EncodeMeshToDracoBuffer(dracoMesh, encodedData);
		encoderModule.destroy(dracoMesh);
		if (encodedLen === 0) {
			throw Error("illgel operations");
		}
		// use encoded data
		const fsData = new Int8Array(encodedLen);
		for (let i = 0; i < encodedLen; i++) {
			fsData[i] = encodedData.GetValue(i);
		}
		encoderModule.destroy(encodedData);

		this.dracoEncodeFinish(fsData, "geom", 0);
	}
	private initAppCode(geomData: DracoSrcGeomObject): void {
		// const encoderModule = createEncoderModule({});
		// const encoder = new encoderModule.Encoder();
		// const meshBuilder = new encoderModule.MeshBuilder();
		// this.encoderObj["wasmBinary"] = null;

		this.encoderObj["onModuleLoaded"] = (module: any): void => {
			this.encoder = module;
			// console.log("build ok");
			this.encode(module, geomData);
			// this.dracoParser.encoder = module;
			// ThreadCore.setCurrTaskClass(this.m_currTaskClass);
			// ThreadCore.transmitData(this, data, CMD.THREAD_TRANSMIT_DATA, [bin]);
			// ThreadCore.initializeExternModule(this);
			// ThreadCore.resetCurrTaskClass();
		};
		DracoEncoderModule(this.encoderObj);
	}
	private loadAppModule(purl: string, geomData: DracoSrcGeomObject): void {
		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", purl, true);
		codeLoader.onerror = function(err) {
			console.error("load error: ", err);
		};

		codeLoader.onprogress = e => {};
		codeLoader.onload = evt => {
			console.log("module js file loaded.");
			let scriptEle: HTMLScriptElement = document.createElement("script");
			scriptEle.onerror = evt => {
				console.error("module script onerror, e: ", evt);
			};
			scriptEle.type = "text/javascript";
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);
			this.initAppCode(geomData);
		};
		codeLoader.send(null);
	}
}

export default DemoCTMToDraco;
