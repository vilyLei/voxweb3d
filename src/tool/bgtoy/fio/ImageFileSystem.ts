import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import AABB2D from "../../../vox/geom/AABB2D";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import RendererState from "../../../vox/render/RendererState";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UISystem } from "../ui/UISystem";
import RenderingImageBuilder from "../../base/RenderingImageBuilder";
import RendererParam from "../../../vox/scene/RendererParam";
import Color4 from "../../../vox/material/Color4";
import ImageTextureProxy from "../../../vox/texture/ImageTextureProxy";
import RemoveBlackBGMaterial2 from "../../material/RemoveBlackBGMaterial2";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import Vector3D from "../../../vox/math/Vector3D";

class ImageFileSystem {
	private m_rscene: IRendererScene = null;

	private m_savingImg = false;
	private m_rflag = false;
	private m_name = "";
	private m_currEntity: IRenderEntity = null;
	private m_currTexture: IRenderTexture = null;
	private m_loadingTex: IRenderTexture = null;

	private m_uiSys: UISystem = null;
	private m_imgBuilder: RenderingImageBuilder = null;
	constructor() {}

	initialize(sc: IRendererScene, uiSys: UISystem): void {
		if (this.m_rscene == null && sc != null) {
			this.m_rscene = sc;
			this.m_uiSys = uiSys;
			this.m_uiSys.setSavingListener((): void => {
				// this.m_savingImg = true;
				this.saveToImg();
			});
			this.init();
		}
	}

	private initImgBuilder(): void {
		if (this.m_imgBuilder == null) {
			this.m_imgBuilder = new RenderingImageBuilder();
			let rparam = new RendererParam();
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			rparam.setAttriAlpha(true);
			rparam.cameraPerspectiveEnabled = false;
			rparam.offscreenRenderEnabled = true;
			rparam.divW = 200;
			rparam.divH = 200;
			rparam.autoAttachingHtmlDoc = !rparam.offscreenRenderEnabled;
			rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.sysEvtReceived = false;
			rparam.syncBgColor = false;
			this.m_imgBuilder.initialize(rparam, new Color4(0, 0, 0, 0.0));
		}
	}
	run(): void {
		if (this.m_imgBuilder) {
			this.m_imgBuilder.run();
		}
		this.layoutEntity();
	}
	private saveToImg(): void {
		this.initImgBuilder();
		if (this.m_imgBuilder.isEnabled()) {
			if (this.m_currEntity) {
				let color = new Color4();
				this.m_rscene.getRenderProxy().getClearRGBAColor4f(color);
				this.m_imgBuilder.setClearColor(color);
				let srcMaterial = this.m_currEntity.getMaterial() as RemoveBlackBGMaterial2;
				let currTex = this.m_currTexture;
				let tex = this.m_rscene.textureBlock.createImageTex2D();
				tex.flipY = true;
				let img = (currTex as ImageTextureProxy).getTexData().data;

				tex.setDataFromImage(img);
				let material = new RemoveBlackBGMaterial2();
				material.fixScreen = true;
				material.setTextureList([tex]);
				material.paramCopyFrom(srcMaterial);
				let pl0 = new Plane3DEntity();
				pl0.transparentBlend = true;
				pl0.depthAlwaysFalse = true;
				pl0.setMaterial(material);
				pl0.initializeXOY(-1.0, -1.0, 2, 2, [tex]);
				// let pl0 = new ScreenFixedAlignPlaneEntity();
				// pl0.initialize(-1.0, -1.0, 2, 2, [tex]);
				this.m_imgBuilder.setName(this.m_name);
				this.m_imgBuilder.addEntity(pl0);
				this.m_imgBuilder.setSize(currTex.getWidth(), currTex.getHeight());
			}
		}
	}

	private init(): void {
		let sc = this.m_rscene;
	}
	private m_entityW = 100;
	private m_entityH = 100;
	private m_pixelData: Uint8ClampedArray = null;
	private m_color = new Color4();
	updateLayout(rect: AABB2D): void {
		this.layoutEntity();
	}
	setParams(name: string, currEntity: IRenderEntity, currTexture: IRenderTexture): void {
		this.m_name = name;
		this.m_currEntity = currEntity;
		this.m_loadingTex = this.m_currTexture = currTexture;
		this.m_pixelData = null;
	}
	getColorByXY(st_x: number, st_y: number): Color4 {
		this.createEntityImgData();

		let st = this.m_rscene.getStage3D();

		// console.log("st_x: ", st_x, ", st_y: ", st_y);
		console.log("this.m_entityW: ", this.m_entityW, ", this.m_entityH: ", this.m_entityH);
		st_x -= st.stageHalfWidth;
		st_y -= st.stageHalfHeight;
		// let data = (this.m_currTexture as ImageTextureProxy).getTexData().data;
		let epv = this.m_currEntity.getPosition();
		let pv = new Vector3D(st_x, st_y);
		pv.x -= epv.x;
		pv.y -= epv.y;
		pv.x = Math.round(pv.x + 0.5 * this.m_entityW);
		pv.y = Math.round(0.5 * this.m_entityH - pv.y);
		// pv.y += this.m_entityH;
		// pv.y = this.m_entityH - pv.y;
		// this.m_currEntity.globalToLocal(pv);
		// console.log("pv: ", pv, ", epv: ", epv);
		console.log("OOOO pv: ", pv);
		//m_color
		let r = Math.round(pv.y);
		let c = Math.round(pv.x);
		console.log("OOOO r,c: ", r,c);
		if (r >= 0 && r < this.m_entityH) {
			if (c >= 0 && c < this.m_entityW) {
				// r = this.m_entityH - 1 - r;
				let pixels = this.m_pixelData;
				let i = (r * this.m_entityW + c) * 4;
				let cr = pixels[i];
				let cg = pixels[i + 1];
				let cb = pixels[i + 2];
				console.log("cr, cg, cb: ", cr, cg, cb, ", pixels[i]: ", pixels[i]);
				let hex = (cr << 16) + (cg << 8) + cb;
				this.m_color.setRGBUint24(hex);
				console.log("color: ", this.m_color.r, this.m_color.g, this.m_color.b, ", pixels[i]: ", pixels[i]);
				// const c =
				// this.m_color.setRGB3Bytes()
				return this.m_color;
			}
		}
		return null;
	}

	private createEntityImgData(): void {
		if (this.m_pixelData == null) {
			let img: HTMLImageElement | HTMLCanvasElement = (this.m_currTexture as ImageTextureProxy).getTexData().data as any;
			const canvas = document.createElement("canvas");
			canvas.width = this.m_entityW;
			canvas.height = this.m_entityH;
			canvas.style.display = "bolck";

			const ctx2d = canvas.getContext("2d");
			console.log("createEntityImgData(), img.width, img.height: ", img.width, img.height);
			ctx2d.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.m_entityW, this.m_entityH);
			this.m_pixelData = ctx2d.getImageData(0, 0, this.m_entityW, this.m_entityH).data;
			console.log("this.m_pixelData.length: ", this.m_pixelData.length, ", ", 128 * 128 * 4);
			// let k = 1;
			// let ri = 1;
			// canvas.style.display = "bolck";
			// canvas.style.zIndex = "9999";
			// canvas.style.left = `${66 + k * 66}px`;
			// canvas.style.top = `${200 + ri * 66}px`;
			// canvas.style.position = "absolute";
			// document.body.appendChild(canvas);
		}
	}
	private layoutEntity(): void {
		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();
		if (this.m_currEntity) {
			let k = 1.0;
			let maxSize = Math.max(pw, ph);
			let baseSize = 512 - 12;
			if (maxSize > baseSize) {
				k = baseSize / maxSize;
			}
			pw *= k;
			ph *= k;
			// console.log("ooooo k: ", k);
			pw = Math.round(pw);
			ph = Math.round(ph);
			this.m_entityW = pw;
			this.m_entityH = ph;

			this.m_currEntity.setXYZ(-256, 0, 1.0);
			this.m_currEntity.setScaleXYZ(pw, ph, 1.0);
			this.m_currEntity.update();
		}
	}
	/*
	savingBegin(): void {
		if (this.m_loadingTex && this.m_loadingTex.isDataEnough()) {
			this.layoutEntity();
			this.m_loadingTex = null;
		}

		if (this.m_savingImg) {
			this.m_uiSys.disable();
			this.m_rflag = true;
			this.saveBegin();
		}
	}
	savingEnd(): void {
		if (this.m_rflag && this.m_savingImg) {
			this.saveImage();
			this.m_savingImg = false;
			this.m_uiSys.enable();
			this.m_rflag = false;
			this.saveEnd();
		}
	}
	private saveBegin(): void {
		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();
		let div = this.m_rscene.getRenderProxy().getDiv();
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		(this.m_rscene as any).updateRenderBufferSize(false);
		if (this.m_currEntity) {
			let factor = this.m_rscene.getRenderProxy().getDevicePixelRatio();
			this.m_currEntity.setScaleXYZ(pw * factor, ph * factor, 1.0);
			this.m_currEntity.update();
		}
	}
	private saveEnd(): void {
		let pw = 1024;
		let ph = 512;
		let div = this.m_rscene.getRenderProxy().getDiv();
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		(this.m_rscene as any).updateRenderBufferSize(true);
		this.layoutEntity();
	}
	private createCanvasData(): string {
		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();

		const srcCanvas = this.m_rscene.getRenderProxy().getCanvas();
		const canvas = document.createElement("canvas");
		canvas.width = pw;
		canvas.height = ph;
		canvas.style.display = "bolck";

		const ctx2d = canvas.getContext("2d");
		ctx2d.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, canvas.width, canvas.height);

		return canvas.toDataURL("image/png");
	}
	private saveImage(): void {
		const a = document.createElement("a");
		a.href = this.createCanvasData();
		a.download = this.m_name != "" ? this.m_name + "_new.png" : "pngfile.png";
		document.body.appendChild(a);
		(a as any).style = "display: none";
		a.click();
		a.remove();
	}
	//*/
}

export { ImageFileSystem };
