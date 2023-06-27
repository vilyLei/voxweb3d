import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";

import { EntityLayouter } from "../vox/utils/EntityLayouter";
import { CoModuleVersion, CoGeomDataType, CoModelTeamLoader } from "../cospace/app/common/CoModelTeamLoader";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "../tool/base/DropFileController";

import DisplayEntity from "../vox/entity/DisplayEntity";
import RendererState from "../vox/render/RendererState";
import Matrix4 from "../vox/math/Matrix4";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import MeshFactory from "../vox/mesh/MeshFactory";
import IRenderTexture from "../vox/render/texture/IRenderTexture";

import Cone3DEntity from "../vox/entity/Cone3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import URLFilter from "../cospace/app/utils/URLFilter";
import { HttpFileLoader } from "../cospace/modules/loaders/HttpFileLoader";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";

class VVF {
	isEnabled(): boolean {
		return true;
	}
}
let pwin: any = window;
pwin["VoxVerify"] = new VVF();

export class RModelSCViewer {
	constructor() {}

	protected m_dropController = new DropFileController();
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_teamLoader: CoModelTeamLoader = null; //new CoModelTeamLoader();
	private m_layouter = new EntityLayouter();
	private m_entityContainer = new DisplayEntityContainer();
	private m_entities: DisplayEntity[] = [];
	private m_modelDataUrl = "";
	private m_forceRot90 = false;
	private m_debugDev = false;
	private m_loadingCallback: (prog: number) => void;
	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		let host = URLFilter.getHostUrl("9090");
		if(this.m_debugDev) {
			host = "";
		}
		if (purl.indexOf("http:") < 0 && purl.indexOf("https:") < 0) {
			purl = host + purl;
		}
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
	}
	private initSys(): void {
		this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
		this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

		// new RenderStatusDisplay(this.m_rscene, true);
		new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true, 1);
		// this.m_teamLoader.verTool = new CoModuleVersion(null);
	}

	private loadInfo(initCallback: () => void): void {
		let host = URLFilter.getHostUrl("9090");
		let url = host + "static/cospace/info.json";
		console.log("url: ", url);
		url = URLFilter.filterUrl(url);
		let httpLoader = new HttpFileLoader();
		httpLoader.load(
			url,
			(data: object, url: string): void => {
				console.log("loadInfo loaded data: ", data);
				this.m_teamLoader = new CoModelTeamLoader();
				this.m_teamLoader.verTool = new CoModuleVersion(data);
				this.m_teamLoader.verTool.forceFiltering = true;
				if (initCallback) {
					initCallback();
				}
			},
			null,
			null,
			"json"
		);
	}
	private createDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {
		let div: HTMLDivElement = document.createElement("div");
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		document.body.appendChild(div);
		div.style.display = "bolck";
		div.style.left = px + "px";
		div.style.top = py + "px";
		div.style.position = "absolute";
		div.style.display = "bolck";
		div.style.position = "absolute";
		return div;
	}
	initialize(div: HTMLDivElement = null, initCallback: () => void = null, zAxisUp: boolean = false): void {
		console.log("RModelSCViewer::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam(div ? div : this.createDiv(0, 0, 512, 512));
			rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.setCamProject(45, 0.1, 2000.0);
			rparam.setCamPosition(800.0, 800.0, 800.0);
			if (zAxisUp || div == null) {
				rparam.setCamUpDirect(0.0, 0.0, 1.0);
			} else {
				rparam.setCamUpDirect(0.0, 1.0, 0.0);
			}
			rparam.setAttriAntialias(true);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam).setAutoRunning(true);

			let unit = 100.0;

			// let cube = new Box3DEntity();
			// cube.normalEnabled = true;
			// cube.initializeCube(2 * unit);
			// this.m_rscene.addEntity(cube);

			// let cone = new Cone3DEntity();
			// cone.normalEnabled = true;
			// cone.initialize(1.0 * unit, 2.0 * unit, 30, null, 0);
			// cone.setRotationXYZ(90,0,0);
			// cone.setXYZ(-0.8 * unit, 0, 1.6 * unit)
			// this.m_rscene.addEntity(cone);

			let axis = new Axis3DEntity();
			axis.initialize(300)
			this.m_rscene.addEntity(axis);

			// let cam = this.m_rscene.getCamera()
			// console.log("cam.getViewMatrix(): ")
			// console.log(cam.getViewMatrix().toString())
			// let mat = cam.getViewMatrix().clone();
			// mat.invert()
			// console.log("mat: ")
			// mat.transpose();
			// let vs = mat.getLocalFS32()
			// console.log(vs)

			this.initSys();

			// let vs = this.getCameraData(1.0);
			// console.log("getCameraData(), vs: ", vs);
			this.m_layouter.locationEnabled = false;
			if (div) {
				this.m_dropController.initialize(this.m_rscene.getRenderProxy().getCanvas(), this);
				this.loadInfo(initCallback);
			} else {
				this.m_debugDev = true;
				this.m_teamLoader = new CoModelTeamLoader();
				this.initModels();
			}
			this.m_rscene.addEntity(this.m_entityContainer);
		}
	}
	private m_baseSize = 200;
	initSceneByFiles(files: any[], loadingCallback: (prog: number) => void, size: number = 200): void {
		this.m_baseSize = size;
		this.m_loadingCallback = loadingCallback;
		this.m_dropController.initFilesLoad(files);
	}

	initSceneByUrls(urls: string[], types: string[], loadingCallback: (prog: number) => void, size: number = 200): void {
		this.m_baseSize = size;
		this.m_loadingCallback = loadingCallback;
		let loader = this.m_teamLoader;
		loader.loadWithTypes(urls, types, (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			this.m_layouter.layoutReset();
			for (let i = 0; i < models.length; ++i) {
				this.createEntity(models[i], transforms != null ? transforms[i] : null, 2.0);
			}
			this.m_modelDataUrl = urls[0]+"."+types[0];
			console.log("XXXXXX initSceneByUrls() this.m_modelDataUrl: ", this.m_modelDataUrl);
			this.fitEntitiesSize();
			if (this.m_loadingCallback) {
				this.m_loadingCallback(1.0);
			}
		});
	}
	setForceRotate90(force: boolean): void {
		this.m_forceRot90 = force;
	}
	private fitEntitiesSize(forceRot90: boolean = false): void{
		forceRot90 = forceRot90 || this.m_forceRot90;
		this.m_layouter.layoutUpdate(this.m_baseSize, new Vector3D(0, 0, 0));
		let container = this.m_entityContainer;
		let format = URLFilter.getFileSuffixName(this.m_modelDataUrl, true, true);
		console.log("XXXXXX fitEntitiesSize() this.m_modelDataUrl: ", this.m_modelDataUrl);
		console.log("format: ", format);
		switch(format) {
			case "obj":
				container.setRotationXYZ(90,0,0);
				break;
			default:
				if(forceRot90){
					container.setRotationXYZ(90,0,0);
				}
				break;
		}
		container.update();
	}
	getCameraData(posScale: number, transpose: boolean = false): Float32Array {
		let cam = this.m_rscene.getCamera();
		let mat = cam.getViewMatrix().clone();
		mat.invert();
		if (transpose) {
			mat.transpose();
		}
		let vs = mat.getLocalFS32().slice(0);
		vs[3] *= posScale;
		vs[7] *= posScale;
		vs[11] *= posScale;
		return vs;
	}

	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		let urls: string[] = [];
		let types: string[] = [];
		for (let i = 0; i < files.length; ++i) {
			console.log("files[i].url: ", files[i].url);
			console.log("files[i].type: ", files[i].type);
			urls.push(files[i].url);
			types.push(files[i].type);
		}
		this.initSceneByUrls(urls, types, this.m_loadingCallback, this.m_baseSize);
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}

	private initModels(): void {
		let url0 = "static/private/fbx/soleBig01_unwrapuv.fbx";
		url0 = "static/private/obj/box01.obj";
		url0 = "static/assets/obj/scene01.obj";
		url0 = "static/assets/fbx/scene03.fbx";
		url0 = "static/private/obj/scene01/export_0.obj.drc";
		url0 = "http://localhost:9090/static/uploadFiles/rtTask/v1ModelRTask2001/draco/export_0.drc"
		let loader = this.m_teamLoader;
		let urls: string[] = [url0];
		this.m_forceRot90 = true;
		urls = [];
		for(let i = 0; i < 2; ++i) {
			let purl = "http://localhost:9090/static/uploadFiles/rtTask/v1ModelRTask2001/draco/export_"+i+".drc";
			urls.push( purl );
		}
		/*
		urls = [];
		for(let i = 0; i < 51; ++i) {
			let purl = "static/private/obj/model02/export_" + i + ".drc";
			urls.push( purl );
		}
		//*/
		/*
		urls = [];
		for(let i = 0; i < 6; ++i) {
			let purl = "static/private/obj/scene03/export_" + i + ".drc";
			urls.push( purl );
		}
		//*/
		/*
		urls = [];
		for(let i = 0; i < 8; ++i) {
			let purl = "static/private/ply/scene01_ply/export_" + i + ".drc";
			urls.push( purl );
		}
		//*/
		loader.load(urls, (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			this.m_layouter.layoutReset();
			for (let i = 0; i < models.length; ++i) {
				this.createEntity(models[i], transforms != null ? transforms[i] : null, 2.0);
			}
			this.m_modelDataUrl = urls[0];
			this.fitEntitiesSize();
		});
	}

	protected createEntity(model: CoGeomDataType, transform: Float32Array = null, uvScale: number = 1.0): DisplayEntity {
		if (model != null) {
			console.log("createEntity(), model: ", model);

			let material = new Default3DMaterial();
			material.normalEnabled = true;
			material.setUVScale(uvScale, uvScale);
			material.setTextureList([this.getTexByUrl("static/assets/white.jpg")]);

			let mesh = MeshFactory.createDataMeshFromModel(model, material);
			let entity = new DisplayEntity();
			entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
			entity.setMesh(mesh);
			entity.setMaterial(material);

			// this.m_rscene.addEntity(entity);
			entity.update();
			// this.m_entities.push( entity );
			this.m_layouter.layoutAppendItem(entity, new Matrix4(transform));
			this.m_entityContainer.addChild( entity );
			return entity;
		}
	}
	private m_mouseDownCall: ((evt: any) => void)
	setMouseDownListener(mouseDownCall: ((evt: any) => void)):void {
		this.m_mouseDownCall = mouseDownCall;
	}
	private mouseDown(evt: any): void {
		console.log("mouse down.");
		if(this.m_mouseDownCall != null) {
			this.m_mouseDownCall(evt);
		}
		// let camdvs = this.getCameraData(0.01, true);
		// console.log("	camdvs: ", camdvs);
	}
}
export default RModelSCViewer;
