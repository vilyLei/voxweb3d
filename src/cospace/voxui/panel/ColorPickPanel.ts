import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoEntity } from "../../voxentity/ICoEntity";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { IButton } from "../button/IButton";
import { ICoUIScene } from "../scene/ICoUIScene";
import { TextLabel } from "../entity/TextLabel";
import { UIPanel } from "./UIPanel";
import IColor4 from "../../../vox/material/IColor4";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { TextureLabel } from "../entity/TextureLabel";
import { IColorPickPanel } from "./IColorPickPanel";

declare var CoRScene: ICoRScene;
declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;

class ColorPickPanel extends UIPanel implements IColorPickPanel {

	/**
	 * 边距留白尺寸
	 */
	private m_marginWidth: number = 15;

	constructor() { super(); }

	initialize(scene: ICoUIScene, rpi: number, panelW: number = 260, panelH: number = 260, marginWidth: number = 3): void {
		if (this.isIniting()) {
			this.init();

			this.m_marginWidth = marginWidth;
			this.m_scene = scene;
			this.m_rpi = rpi;

			this.m_panelW = panelW;
			this.m_panelH = panelH;

			if (this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
		}
	}
	destroy(): void {
		super.destroy();

	}
	private m_callback: (color: IColor4)=>void = null;
	setSelectColorCallback(callback: (color: IColor4)=>void): void {
		this.m_callback = callback;
	}

	protected buildPanel(pw: number, ph: number): void {

		this.buildItems();
	}
	private m_initing: boolean = true;
	protected buildItems(): void {
		if (this.m_initing) {
			this.m_initing = false;
			let sc = this.getScene();
			let cplUrl = "static/assets/colors.png";

			let dis = this.m_marginWidth;
			let pw = this.m_panelW - 2.0 * dis;
			let ph = this.m_panelH - 2.0 * dis;
			let tex = this.createTexByUrl(cplUrl);
			let texLabel = new TextureLabel()
			texLabel.initialize(sc, tex, pw, ph);
			texLabel.setXY(dis, dis);
			this.addEntity(texLabel);
		}
	}
	private m_pixelsW = 256;
	private m_pixelsH = 256;
	private m_pixels: Uint8ClampedArray;
	private m_color: IColor4;
	private getRGBAByXY(px: number, py: number): IColor4 {
		px = px | 0;
		py = py | 0;
		// if(px < 0 || px > 255 || py < 0 || py > 255) {
		// 	return null;
		// }
		if (px < 0) px = 0;
		if (py < 0) py = 0;
		if (px > 255) px = 255;
		if (py > 255) py = 255;
		py = 255 - py;
		if (this.m_color == null) {
			this.m_color = CoMaterial.createColor4();
		}
		let ls = this.m_pixels;
		if (this.m_pixels != null) {
			let i = (py * this.m_pixelsW + px) * 4;
			let r = ls[i];
			let g = ls[i + 1];
			let b = ls[i + 2];
			console.log("getRGBAByXY(), px,py: ", px, py);
			console.log("getRGBAByXY(), r,g,b: ", r, g, b);
			this.m_color.setRGB3Bytes(r, g, b);
		}
		return this.m_color;
	}
	private createColorData(img: HTMLImageElement): void {

		let canvas = document.createElement("canvas");
		// canvas.style.width = img.width + "px";
		// canvas.style.height = img.height + "px";
		canvas.style.display = "bolck";
		canvas.style.overflow = "hidden";
		canvas.style.left = "0px";
		canvas.style.top = "0px";
		canvas.style.position = "absolute";
		canvas.width = img.width;
		canvas.height = img.height;
		let ctx2D = canvas.getContext("2d");
		ctx2D.drawImage(img, 0, 0);
		document.body.appendChild(canvas);

		let imgData = ctx2D.getImageData(0, 0, img.width, img.height);
		this.m_pixels = imgData.data;
		let len = this.m_pixels.length;
		console.log("len / 4 : ", len / 4);
		// canvas.style.backgroundColor = "transparent";
		// canvas.style.pointerEvents = "none";
	}
	private createTexByUrl(url: string = ""): IRenderTexture {
		let sc = this.getScene();

		let tex = sc.rscene.textureBlock.createImageTex2D(64, 64, false);
		let img = new Image();
		img.onload = (evt: any): void => {
			this.createColorData(img);
			tex.setDataFromImage(img, 0, 0, 0, false);
		};
		img.src = url != "" ? url : "static/assets/box.jpg";
		return tex;
	}
	protected openThis(): void {

		let ME = CoRScene.MouseEvent;
		if (this.m_scene != null) {
			this.m_scene.addEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);

			// this.layoutItems();
		}
	}
	protected closeThis(): void {
		let ME = CoRScene.MouseEvent;
		if (this.m_scene != null) {
			this.m_scene.removeEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);
		}
		this.m_callback = null;
	}
	private stMouseDownListener(evt: any): void {

		console.log("color pick stMouseDownListener...");

		let px = evt.mouseX;
		let py = evt.mouseY;
		let pv = this.m_v0;
		pv.setXYZ(px, py, 0);

		this.globalToLocal(pv);

		if (pv.x < 0 || pv.x > this.m_panelW || pv.y < 0 || pv.y > this.m_panelH) {
			this.close();
		} else {
			let dis = this.m_marginWidth;
			pv.x -= dis;
			pv.y -= dis;
			let color = this.getRGBAByXY(pv.x, pv.y);
			if(this.m_callback != null) {
				this.m_callback(color);
			}
		}
	}
	protected layout(): void {
	}
}
export { ColorPickPanel };
