import AABB2D from "../../../vox/geom/AABB2D";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UISystem } from "../ui/UISystem";
import ImageTextureProxy from "../../../vox/texture/ImageTextureProxy";
import RemoveBlackBGMaterial2 from "../../material/RemoveBlackBGMaterial2";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "../../base/DropFileController";
import URLFilter from "../../../cospace/app/utils/URLFilter";
import { ImageFileSystem } from "./ImageFileSystem";
import TextureResLoader from "../../../vox/assets/TextureResLoader";

class ImageFileReader {
	private m_rscene: IRendererScene = null;
	private m_dropController = new DropFileController();
	private m_currMaterial: RemoveBlackBGMaterial2 = null;
	private m_currEntity: Plane3DEntity = null;
	private m_name: string = "";

	fileSys: ImageFileSystem = null;
	texLoader: TextureResLoader = null;
	uiSys: UISystem = null;

	constructor() { }

	getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {

		url = URLFilter.filterUrl(url);
		return this.texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}
	initialize(sc: IRendererScene): void {
		if (this.m_rscene == null && sc != null) {
			this.m_rscene = sc;
			let uiSys = this.uiSys;
			uiSys.setOpeningListener((): void => {
				this.openDir();
			});
			uiSys.setInitListener((): void => {
				this.uiInited();
			});
			this.createAEntityByTexUrl("static/assets/guangyun_40.jpg");
			this.m_dropController.initialize(document.body, this);
			this.initPaste();
		}
	}
	private initPaste(): void {
		let pwin: any = window;
		// let div = document.createElement("div");
		// div.style.position = "absolute";
		// div.innerHTML = "...";
		// document.body.appendChild(div);
		// console.log("##### pwin.clipboardData: ", pwin.clipboardData);
		// div.addEventListener('paste', (e: any) : void => {
		// 此事件监听添加在document上，该事件会有冒泡行为，则本页面上任何地方的粘贴操作都会触发
		document.addEventListener('paste', (e: any) : void => {

			console.log("##### ImageFileReader::initPaste(), e: ", e);

			let files = [];
			const items = (e.clipboardData || pwin.clipboardData).items;
			if (items && items.length) {
				for (var i = 0; i < items.length; i++) {
					const file = items[i].getAsFile();
					if(file) {
						files.push(file);
					}
				}
			}
			if (files) {
				console.log("##### pasting files: ", files);
				this.m_dropController.initFilesLoad(files);
			}
		});
	}

	openDir(): void {
		const input = document.createElement("input");
		input.type = "file";
		// input.accept = "image/png, image/jpeg";
		input.addEventListener("change", () => {
			let files = Array.from(input.files);
			this.m_dropController.initFilesLoad(files);
		});
		input.click();
	}
	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		console.log("initFileLoad(), files: ", files);
		for (let i = 0; i < files.length; ++i) {
			if (files[i].resType == "image") {
				this.loadedRes(files[i].url, files[i].name);
				break;
			}
		}
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}
	// private m_name = "";
	private loadedRes(url: string, name: string): void {
		// console.log("loadedRes A, url: ", url,", name: ", name);
		if (name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadedRes, url: ", url, ", name: ", name);
		if (this.uiSys.isInited()) {
			this.uiSys.hideSpecBtns();
			this.m_name = name;
			this.uiSys.background.enable();
			this.createAEntityByTexUrl(url);
		}
	}
	private createAEntityByTexUrl(url: string): void {
		let sc = this.uiSys.background.getRScene();
		if (this.m_currEntity != null) {
			sc.removeEntity(this.m_currEntity);
		}
		let tex = this.getTexByUrl(url);
		let material = new RemoveBlackBGMaterial2();
		material.fixScreen = false;
		material.setTextureList([tex]);
		if (this.m_currMaterial) {
			material.paramCopyFrom(this.m_currMaterial);
		}
		tex.flipY = true;
		let plane = new Plane3DEntity();
		plane.transparentBlend = true;
		plane.depthAlwaysFalse = true;
		plane.setMaterial(material);
		plane.initializeXOY(-0.5, -0.5, 1.0, 1.0);
		plane.intoRendererListener = (): void => {
			let img = (tex as ImageTextureProxy).getTexData().data;
			this.fileSys.imageMaxSize = Math.max(img.width, img.height);
		};
		sc.addEntity(plane, 2);
		this.uiSys.setCurrMaterial(material);
		this.fileSys.setParams(this.m_name, plane, tex);

		this.m_currEntity = plane;
		this.m_currEntity.setVisible(this.uiSys.isInited());
		this.m_currMaterial = material;
	}
	private uiInited(): void {
		if (this.m_currEntity) {
			this.m_currEntity.setVisible(true);
		}
	}
	run(): void {
	}
	updateLayout(rect: AABB2D): void {
	}

}

export { ImageFileReader };
