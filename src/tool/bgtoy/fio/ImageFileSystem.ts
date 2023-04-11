import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import AABB2D from "../../../vox/geom/AABB2D";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import RendererState from "../../../vox/render/RendererState";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UISystem } from "../ui/UISystem";

class ImageFileSystem {
	private m_rscene: IRendererScene = null;

	private m_savingImg = false;
	private m_rflag = false;
	private m_name = "";
	private m_currEntity: IRenderEntity = null;
	private m_currTexture: IRenderTexture = null;
	private m_loadingTex: IRenderTexture = null;

	private m_uiSys: UISystem = null;
	constructor() {}

	initialize(sc: IRendererScene, uiSys: UISystem): void {
		if (this.m_rscene == null && sc != null) {
			this.m_rscene = sc;
			this.m_uiSys = uiSys;
			this.m_uiSys.setSavingListener((): void => {
				this.m_savingImg = true;
			});
			this.init();
		}
	}
	private init(): void {
		let sc = this.m_rscene;
	}
	// toSave(): void {
	// }
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
			this.m_currEntity.setXYZ(0, 0, 0);
			let k = this.m_rscene.getRenderProxy().getDevicePixelRatio();
			this.m_currEntity.setScaleXYZ(pw * k, ph * k, 1.0);
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
			let dpr = this.m_rscene.getRenderProxy().getDevicePixelRatio();
			this.m_currEntity.setXYZ(-256 * dpr, 0.1, 0.0);
			this.m_currEntity.setScaleXYZ(pw, ph, 1.0);
			this.m_currEntity.update();
		}
	}
}

export { ImageFileSystem };
