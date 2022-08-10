import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { DracoSrcGeomObject, DracoGeomEncoder } from "../modules/draco/DracoGeomEncoder";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import { Axis3DEntity, DataMesh, DisplayEntity, RendererDevice, RendererParam, RendererScene } from "../voxengine/CoEngine";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import { IMeshBase } from "../../vox/mesh/IMeshBase";
import { NormalUVViewerMaterial } from "./material/NormalUVViewerMaterial";
import { FileIO } from "../../app/slickRoad/io/FileIO";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";

declare var draco3d: any;
declare var createEncoderModule: any;
declare var DracoEncoderModule: any;
/**
 * draco 编码多线程示例
 */
export class DemoDracoEncode {
	constructor() { }

	private m_threadSchedule: ThreadSchedule = new ThreadSchedule();
	private m_dracoGeomEncoder: DracoGeomEncoder;

	private m_rscene: RendererScene = null;
	private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();

	initialize(): void {
		console.log("DemoDracoEncode::initialize()...");

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

		// draco 模型数据url
		let url = "static/assets/modules/clothRoll.rawmd";
		this.m_dracoGeomEncoder.initialize(this.m_threadSchedule);
		this.m_dracoGeomEncoder.setListener(this);

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		this.update();
		this.initScene();
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
		f.downloadBinFile(buf, url, "drc");
	}
	private mouseDown(evt: any): void { }
	private encodeGeom(mesh: IMeshBase): void {
		console.log("mesh: ", mesh);

		let geomData: DracoSrcGeomObject = {
			vertices: mesh.getVS().slice(0),
			texcoords: mesh.getUVS().slice(0),
			normals: mesh.getNVS().slice(0),
			indices: mesh.getIVS().slice(0)
		};

		let multi_thread_encode = false;
		if (multi_thread_encode) {
			this.m_dracoGeomEncoder.setParseData(geomData, "box_geom", 0);
		} else {
			this.loadAppModule("static/cospace/modules/dracoLib/dEncoder.js", geomData);
		}
	}

	private encoder: any = null;
	private encoderObj: any = { wasmBinary: null };
	private encode(encoderModule: any, geomData: DracoSrcGeomObject): void {
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
		const encoder = new encoderModule.Encoder();
		const meshBuilder = new encoderModule.MeshBuilder();

		let speed: number = 10.0;
		console.log("speed: ", speed);

		encoder.SetSpeedOptions(speed, speed);
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
		const fsData = new Int8Array(new ArrayBuffer(encodedLen));
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
		codeLoader.onerror = function (err) {
			console.error("load error: ", err);
		};

		codeLoader.onprogress = e => { };
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

			//   DivLog.ShowLog("renderer inited.");
			//   DivLog.ShowLog(RendererDevice.GPU_RENDERER);
			// let k = this.calcTotal(9);
			// console.log("k: ",k);
			// k = this.calcTotal2(55);
			// console.log("k2: ",k);
			// return;

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
			let sphEntity = new Sphere3DEntity();
			sphEntity.setMaterial(material);
			sphEntity.initialize(100, 20, 20)
			this.m_rscene.addEntity(sphEntity);

			this.encodeGeom(sphEntity.getMesh());
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

export default DemoDracoEncode;
