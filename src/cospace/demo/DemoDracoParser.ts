import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { DracoGeomBuilder } from "../modules/draco/DracoGeomBuilder";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import { Axis3DEntity, DataMesh, DisplayEntity, RendererDevice, RendererParam, RendererScene, RendererState } from "../voxengine/CoEngine";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";
import { NormalUVViewerMaterial } from "./material/NormalUVViewerMaterial";

/**
 * draco 加载解析多线程示例
 */
export class DemoDracoParser {
	constructor() {}

	private m_threadSchedule: ThreadSchedule = new ThreadSchedule();
	private m_dracoGeomBuilder: DracoGeomBuilder;

	private m_rscene: RendererScene = null;

	private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();

	initialize(): void {
		console.log("DemoDracoParser::initialize()...");

		let dependencyGraphObj: object = {
			nodes: [
				{ uniqueName: "dracoGeomParser", path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js" },
				{ uniqueName: "dracoWasmWrapper", path: "static/cospace/modules/dracoLib/w2.js" },
				{ uniqueName: "ctmGeomParser", path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js" }
			],
			maps: [
				{ uniqueName: "dracoGeomParser", includes: [1] } // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
			]
		};
		let jsonStr: string = JSON.stringify(dependencyGraphObj);

		// 初始化多线程调度器
		// this.m_threadSchedule.initialize(1, "cospace/core/code/ThreadCore.umd.min.js");
		this.m_threadSchedule.setDependencyGraphJsonString(jsonStr);
		this.m_threadSchedule.initialize(1, "static/cospace/core/code/ThreadCore.umd.js");

		// 建立 draco 模型数据builder(包含加载和解析)
		this.m_dracoGeomBuilder = new DracoGeomBuilder("static/cospace/modules/draco/ModuleDracoGeomParser.js");

		this.m_dracoGeomBuilder.initialize(this.m_threadSchedule);
		this.m_dracoGeomBuilder.setListener(this);

		this.loadDraco01();
		// this.loadDraco();

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		//static/private/draco/geom.draco
		this.update();
		this.initScene();
	}
	
	private loadDraco01(): void {

		// draco 模型数据url
		let url = "static/private/draco/box_geom.drc";
		url = "static/private/draco/box01.obj.drc";
		url = "static/private/draco/building_001.obj.drc";
		url = "static/private/draco/ghz.obj.drc";
		url = "static/private/draco/sph_geom.drc";
		url = "static/private/draco/errorNormal.drc";
		url = "static/private/draco/sh202_4_ok.drc";
		url = "static/private/draco/sh202_4_ok2.drc";
		url = "static/private/draco/sh202/sh202_22.drc";
		// url = "static/private/draco/sh202_5.obj.drc";
		// draco模型数据字节分段信息
		let segRangeList: number[] = [0, 111111111580];

		this.m_dracoGeomBuilder.load(url, segRangeList);
	}
	private loadDraco(): void {
		// draco 模型数据url
		let url = "static/assets/modules/clothRoll.rawmd";
		// this.m_dracoGeomBuilder.load(url);
		this.loadDracoAndParseOnePartFile( url );
	}
	private loadDracoAndParseOnePartFile(dracoDataUrl: string): void {

        const reader = new FileReader();
        reader.onload = e => {
            //this.m_meshBuf = <ArrayBuffer>reader.result;
            // this.m_dracoTask.setParseSrcData(this.m_meshBuf, this.m_segRangeList);
			this.m_dracoGeomBuilder.parseBinaryData(<ArrayBuffer>reader.result)
        };
        const request = new XMLHttpRequest();
        request.open("GET", dracoDataUrl, true);
        request.responseType = "blob";
        request.onload = () => {
            reader.readAsArrayBuffer(request.response);
        };
        request.send(null);
    }

	// 单个draco segment 几何数据解析结束之后的回调
	dracoParse(model: GeometryModelDataType, index: number, total: number): void {

		let material = new NormalUVViewerMaterial();
		material.initializeByCodeBuf();

		let mesh: DataMesh = new DataMesh();
		mesh.setIVS(model.indices);
		mesh.setVS(model.vertices);
		mesh.setUVS(model.uvsList[0]);
		mesh.setNVS(model.normals);
		mesh.setBufSortFormat(material.getBufSortFormat());
		mesh.initialize();

		let entity: DisplayEntity = new DisplayEntity();
		entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMaterial(material);
		entity.setMesh(mesh);
		console.log("mesh vtx total: ",mesh.getVS().length/3);
		console.log("mesh.trisNumber: ",mesh.trisNumber);
		this.m_rscene.addEntity(entity);
	}
	// 所有 draco segment 几何数据解析结束之后的回调，表示本次加载解析任务结束
	dracoParseFinish(models: GeometryModelDataType[], total: number): void {

		console.log("dracoParseFinish models: ", models);

		if(total == 1) {
			this.dracoParse(models[0], 0, 1);
		}
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
		if (this.m_rscene != null) {
			this.m_stageDragSwinger.runWithYAxis();
			this.m_cameraZoomController.run(null, 30.0);

			this.m_rscene.run(true);
		}
	}
}

export default DemoDracoParser;
