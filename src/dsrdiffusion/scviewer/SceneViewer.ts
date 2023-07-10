import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import MouseEvent from "../../vox/event/MouseEvent";
import KeyboardEvent from "../../vox/event/KeyboardEvent";
import Keyboard from "../../vox/ui/Keyboard";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";

import { EntityLayouter } from "../../vox/utils/EntityLayouter";
import { CoModuleVersion, CoGeomDataType, CoModelTeamLoader } from "../../cospace/app/common/CoModelTeamLoader";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "../../tool/base/DropFileController";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import RendererState from "../../vox/render/RendererState";
import Matrix4 from "../../vox/math/Matrix4";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import MeshFactory from "../../vox/mesh/MeshFactory";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import Cone3DEntity from "../../vox/entity/Cone3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import URLFilter from "../../cospace/app/utils/URLFilter";
import { HttpFileLoader } from "../../cospace/modules/loaders/HttpFileLoader";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import IKeyboardEvent from "../../vox/event/IKeyboardEvent";
import ScreenFixedAlignPlaneEntity from "../../vox/entity/ScreenFixedAlignPlaneEntity";
import EventBase from "../../vox/event/EventBase";
import ImageResLoader from "../../vox/assets/ImageResLoader";

class VVF {
	isEnabled(): boolean {
		return true;
	}
}
let pwin: any = window;
pwin["VoxVerify"] = new VVF();

export class SceneViewer {
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
	private m_baseSize = 200;
	private m_camvs = [
		0.7071067690849304,
		-0.40824827551841736,
		0.5773502588272095,
		2.390000104904175,
		0.7071067690849304,
		0.40824827551841736,
		-0.5773502588272095,
		-2.390000104904175,
		0,
		0.8164965510368347,
		0.5773502588272095,
		2.390000104904175,
		0,
		0,
		0,
		1
	];
	private m_loadingCallback: (prog: number) => void;
	private m_mi: MouseInteraction = null;
	private m_rsceneCamVer = -10;
	filterUrl(purl: string): string {
		let host = URLFilter.getHostUrl("9090");
		if (this.m_debugDev) {
			host = "";
		}
		if (purl.indexOf("http:") < 0 && purl.indexOf("https:") < 0) {
			purl = host + purl;
		}
		return purl;
	}
	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		purl = this.filterUrl(purl);
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
	}
	private initSys(): void {
		this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
		this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
		this.m_rscene.addEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);

		// new RenderStatusDisplay(this.m_rscene, true);
		this.m_mi = new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true, 1);
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
	updateCameraWithF32Arr16(fs32Arr16: number[] | Float32Array): void {
		if (fs32Arr16.length == 16) {
			this.applyCamvs(fs32Arr16);
		}
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
	initialize(div: HTMLDivElement = null, initCallback: () => void = null, zAxisUp: boolean = false, debugDev: boolean = false): void {
		console.log("SceneViewer::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam(div ? div : this.createDiv(0, 0, 512 / 1.5, 512 / 1.5));
			rparam.autoSyncRenderBufferAndWindowSize = false;
			// rparam.syncBgColor = true;
			rparam.setCamProject(45, 10.0, 2000.0);
			// rparam.syncBgColor = true;
			// rparam.setCamPosition(800.0, -800.0, 800.0);
			rparam.setCamPosition(239.0, -239.0, 239.0);
			if (zAxisUp || div == null) {
				rparam.setCamUpDirect(0.0, 0.0, 1.0);
			} else {
				rparam.setCamUpDirect(0.0, 1.0, 0.0);
			}
			rparam.setAttriAntialias(true);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam).setAutoRunning(true);
			this.m_rscene.updateCamera();
			this.m_rscene.setClearRGBAColor4f(0,0,0,1);
			this.m_rsceneCamVer = this.m_rscene.getCamera().version;
			let delay = 30;
			this.m_rscene.addEventListener(EventBase.ENTER_FRAME, this, (evt): void => {
				// console.log("...");
				const cam = this.m_rscene.getCamera();
				if (this.m_rsceneCamVer != cam.version) {
					this.m_rsceneCamVer = cam.version;
					this.setViewImageAlpha(this.m_imageFakeAlpha);
				}
				if(delay > 0) {
					delay --;
					if(delay < 1) {
						delay = 30;
						// console.log("this.m_imgLoaded: ", this.m_imgLoaded, this.m_imgUrls.length);
						if(this.m_imgLoaded) {
							if(this.m_imgUrls.length > 0) {
								this.setViewImageUrl(this.m_imgUrls.shift());
							}
						}
					}
				}
			});
			// let unit = 100.0;

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
			axis.initialize(300);
			this.m_rscene.addEntity(axis);

			this.initSys();

			// let vs = this.getCameraData(1.0);
			// console.log("getCameraData(), vs: ", vs);
			this.m_layouter.locationEnabled = false;
			this.m_debugDev = debugDev;
			if (div && !debugDev) {
				this.m_dropController.initialize(this.m_rscene.getRenderProxy().getCanvas(), this);
				this.loadInfo(initCallback);
			} else {
				this.m_debugDev = true;
				this.m_teamLoader = new CoModelTeamLoader();
				this.initModels();
				// let imgUrls = [
				// 	"static/assets/modules/apple_01/mini.jpg",
				// 	"static/assets/box.jpg"
				// ]
				// this.setViewImageUrls(imgUrls);
				this.setViewImageUrl(this.m_viewImageUrl, true);
			}
			this.m_rscene.addEntity(this.m_entityContainer);
		}
	}
	private m_imgViewEntity: ScreenFixedAlignPlaneEntity = null;
	private m_imageAlpha = 1.0;
	private m_imageFakeAlpha = 0.2;
	private m_imageVisible = true;
	private m_viewImageUrl = "static/assets/modules/apple_01/mini.jpg";
	private m_imgResLoader = new ImageResLoader();
	private m_imgLoaded = true;
	private m_imgUrls: string[] = [];
	setViewImageUrls(urls: string[]): void {
		if(urls === null || urls === undefined) {
			urls = [];
		}
		this.m_imgUrls = urls;
	}
	setViewImageUrl(url: string, show = false, imgAlpha = 1.0): void {
		console.log("this.setViewImageUrl(), url: ", url);
		if (url != "") {
			this.m_imageAlpha = imgAlpha;
			console.log("this.setViewImageUrl(), ready load a new img B.");
			if (this.m_imgViewEntity != null) {
				console.log("this.setViewImageUrl(), ready load a new img C.");
				console.log("url A: ", this.m_viewImageUrl);
				console.log("url B: ", url);
				if (this.m_viewImageUrl != url) {
					console.log("this.setViewImageUrl(), ready load a new img.");
					if(this.m_imgLoaded) {
						this.m_viewImageUrl = url;
						this.m_imgLoaded = false;
						this.m_imgResLoader.load(this.filterUrl(url), (img: HTMLImageElement, imgUrl: string): void => {
							let tex = this.m_rscene.textureBlock.createImageTex2D();
							tex.flipY = true;
							tex.setDataFromImage(img);
							console.log("load a new tex res from an image.");
							this.m_imgViewEntity.setAlpha(this.m_imageAlpha);
							this.m_imgViewEntity.setTextureList([tex]);
							this.m_imgViewEntity.updateMaterialToGpu();
							this.m_imgLoaded = true;
						});
					}else {
						this.m_imgUrls.push(url);
					}
				}
			} else {
				this.m_viewImageUrl = url;
				this.initImgViewer();
			}
		}
	}
	setViewImageFakeAlpha(alpha: number): void {
		this.m_imageFakeAlpha = alpha;
	}
	setViewImageAlpha(alpha: number): void {
		this.m_imageAlpha = alpha;
		if (this.m_imgViewEntity != null) {
			this.m_imgViewEntity.setAlpha(this.m_imageAlpha);
		}
	}
	getViewImageAlpha(): number {
		return this.m_imageAlpha;
	}
	setViewImageVisible(v: boolean): void {
		this.m_imageVisible = v;
		if (this.m_imgViewEntity != null) {
			this.m_imgViewEntity.setVisible(v);
		}
	}
	getViewImageVisible(): boolean {
		return this.m_imageVisible;
	}
	private initImgViewer(): void {
		if (this.m_imgViewEntity == null) {
			console.log("this.initImgViewer(), this.m_viewImageUrl: ", this.m_viewImageUrl);
			let tex = this.getTexByUrl(this.m_viewImageUrl);
			tex.flipY = true;
			this.m_imgViewEntity = new ScreenFixedAlignPlaneEntity();
			this.m_imgViewEntity.transparentBlend = true;
			this.m_imgViewEntity.initialize(-1, -1, 2.0, 2.0, [tex]);
			this.m_imgViewEntity.setAlpha(this.m_imageAlpha);
			this.m_imgViewEntity.setVisible(this.m_imageVisible);
			this.m_rscene.addEntity(this.m_imgViewEntity, 1);
		} else {
			// this.m_imgViewEntity.setVisible( !this.m_imgViewEntity.isVisible() );
		}
	}
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
			this.m_modelDataUrl = urls[0] + "." + types[0];
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
	private fitEntitiesSize(forceRot90: boolean = false): void {
		forceRot90 = forceRot90 || this.m_forceRot90;
		this.m_layouter.layoutUpdate(this.m_baseSize, new Vector3D(0, 0, 0));
		let container = this.m_entityContainer;
		let format = URLFilter.getFileSuffixName(this.m_modelDataUrl, true, true);
		console.log("XXXXXX fitEntitiesSize() this.m_modelDataUrl: ", this.m_modelDataUrl);
		console.log("format: ", format);
		switch (format) {
			case "obj":
				container.setRotationXYZ(90, 0, 0);
				break;
			default:
				if (forceRot90) {
					container.setRotationXYZ(90, 0, 0);
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
		url0 = "http://localhost:9090/static/uploadFiles/rtTask/v1ModelRTask2001/draco/export_0.drc";
		let loader = this.m_teamLoader;
		let urls: string[] = [url0];
		this.m_forceRot90 = true;

		urls = [];
		for (let i = 0; i < 2; ++i) {
			let purl = "static/assets/modules/apple_01/export_" + i + ".drc";
			urls.push(purl);
		}
		console.log("xxxxxx urls: ", urls);
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

			entity.update();
			this.m_layouter.layoutAppendItem(entity, new Matrix4(transform));
			this.m_entityContainer.addChild(entity);
			return entity;
		}
	}
	private m_mouseDownCall: (evt: any) => void;
	setMouseDownListener(mouseDownCall: (evt: any) => void): void {
		this.m_mouseDownCall = mouseDownCall;
	}
	private applyCamvs(cdvs: number[] | Float32Array): void {
		if (cdvs == null) {
			cdvs = [
				0.7071067690849304,
				-0.40824827551841736,
				0.5773502588272095,
				2.390000104904175,
				0.7071067690849304,
				0.40824827551841736,
				-0.5773502588272095,
				-2.390000104904175,
				0.0,
				0.8164965510368347,
				0.5773502588272095,
				2.390000104904175,
				0,
				0,
				0,
				1
			];
		}

		let mat4 = new Matrix4(new Float32Array(cdvs));
		mat4.transpose();
		let camvs = mat4.getLocalFS32();
		let i = 0;
		// let vx = new Vector3D(camvs[i], camvs[i+1], camvs[i+2], camvs[i+3]);
		i = 4;
		let vy = new Vector3D(camvs[i], camvs[i + 1], camvs[i + 2], camvs[i + 3]);
		// i = 8;
		// let vz = new Vector3D(camvs[i], camvs[i+1], camvs[i+2], camvs[i+3]);
		i = 12;
		let pos = new Vector3D(camvs[i], camvs[i + 1], camvs[i + 2]);

		// console.log("		  vy: ", vy);
		let cam = this.m_rscene.getCamera();

		// console.log("cam.getUV(): ", cam.getUV());
		// console.log("");
		// console.log("cam.getNV(): ", cam.getNV());
		// vz.negate();
		// console.log("		  vz: ", vz);
		// console.log("		 pos: ", pos);
		if (pos.getLength() > 0.001) {
			let camPos = pos.clone().scaleBy(100.0);
			cam.lookAtRH(camPos, new Vector3D(), vy);
			cam.update();
		}
	}
	private keyDown(evt: IKeyboardEvent): void {
		console.log("key down, evt: ", evt.keyCode);
		switch (evt.keyCode) {
			case Keyboard.T:
				//m_camvs
				console.log("test t....");
				// this.applyCamvs(null);
				let url = "static/assets/box.jpg";
				this.setViewImageUrl(url);
				break;
			default:
				break;
		}
	}
	private mouseDown(evt: any): void {
		// console.log("mouse down, evt: ", evt);
		if (this.m_mouseDownCall != null) {
			this.m_mouseDownCall(evt);
		}
		// let camdvs = this.getCameraData(0.01, true);
		// console.log("	camdvs: ", camdvs);
		// this.initImgViewer();
	}
}
export default SceneViewer;
