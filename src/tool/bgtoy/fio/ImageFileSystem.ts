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
import RemoveBlackBGMaterial from "../../material/RemoveBlackBGMaterial";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import ScreenFixedAlignPlaneEntity from "../../../vox/entity/ScreenFixedAlignPlaneEntity";

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
				this.m_imgBuilder.rscene.setClearColor(color);
				let srcMaterial = this.m_currEntity.getMaterial() as RemoveBlackBGMaterial;
				let currTex = this.m_currTexture;
				let tex = this.m_rscene.textureBlock.createImageTex2D();
				tex.flipY = true;
				let img = (currTex as ImageTextureProxy).getTexData().data;

				tex.setDataFromImage(img);
				let material = new RemoveBlackBGMaterial();
				material.fixScreen = true;
				material.setTextureList([tex]);
				material.paramCopyFrom(srcMaterial);
				let pl0 = new Plane3DEntity();
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

	updateLayout(rect: AABB2D): void {
		this.layoutEntity();
	}
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
	setParams(name: string, currEntity: IRenderEntity, currTexture: IRenderTexture): void {
		this.m_name = name;
		this.m_currEntity = currEntity;
		this.m_loadingTex = this.m_currTexture = currTexture;
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
			let dpr = 1.0;
			this.m_currEntity.setXYZ(-256 * dpr, 0.1, 0.0);
			this.m_currEntity.setScaleXYZ(pw, ph, 1.0);
			this.m_currEntity.update();
		}
	}
}

export { ImageFileSystem };
