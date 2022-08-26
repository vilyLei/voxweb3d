import { IImageTexture } from "../../../vox/render/texture/IImageTexture";
import IRendererScene from "../../../vox/scene/IRendererScene";
import ImageTexAtlas from "./ImageTexAtlas";

import IColor4 from "../../../vox/material/IColor4";
import IAABB2D from "../../../vox/geom/IAABB2D";

import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import ICanvasTexAtlas from "./ICanvasTexAtlas";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
// import { ICoMath } from "../../math/ICoMath";
// declare var CoMath: ICoMath;
declare var CoMaterial: ICoMaterial;

export class CanvasTexObject {
	constructor() {}

	uvs: Float32Array = null;
	texture: IRenderTexture = null;
	rect: IAABB2D = null;
	clampUVRect: IAABB2D = null;
	uniqueName: string = "";
	getWidth(): number {
		if (this.rect != null) return this.rect.width;
		return 0;
	}
	getHeight(): number {
		if (this.rect != null) return this.rect.height;
		return 0;
	}
	destroy(): void {
		this.uvs = null;
		this.texture = null;
		this.rect = null;
	}
}
export class CanvasTexAtlas implements ICanvasTexAtlas {
	private m_sc: IRendererScene = null;
	private m_atlasList: ImageTexAtlas[] = [null, null, null, null];
	private m_objMap: Map<string, CanvasTexObject> = new Map();
	constructor() {}
	initialize(sc: IRendererScene, canvasWidth: number, canvasHeight: number, fillColor: IColor4 = null, transparent: boolean = false): void {
		this.m_sc = sc;
		let atlas: ImageTexAtlas = null;
		if (fillColor == null) {
			fillColor = transparent ? CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0) : CoMaterial.createColor4();
		}
		if (this.m_atlasList[0] == null) {
			atlas = new ImageTexAtlas(this.m_sc, canvasWidth, canvasHeight, fillColor, transparent);
			this.m_atlasList[0] = atlas;
		}
	}

	getTexture(i: number = 0): IImageTexture {
		return this.m_atlasList[i].getTexture();
	}
	getAtlasAt(i: number = 0): ImageTexAtlas {
		return this.m_atlasList[i];
	}
	addcharsToAtlas(chars: string, size: number, fontColor: IColor4, bgColor: IColor4): CanvasTexObject {
		if (chars != "") {
			let image = ImageTexAtlas.CreateCharsCanvas(chars, size, fontColor, bgColor);
			return this.addImageToAtlas(chars, image);
		}
		return null;
	}
	getTextureObject(uniqueName: string): CanvasTexObject {
		let atlas: ImageTexAtlas = this.m_atlasList[0];
		let texArea = atlas.getAreaByName(uniqueName);
		if (texArea != null) {
			let texNode = new CanvasTexObject();
			texNode.texture = atlas.getTexture();
			texNode.uvs = texArea.uvs.slice(0);
			texNode.rect = texArea.texRect.clone();
			texNode.clampUVRect = texArea.texRect.clone();
			texNode.clampUVRect.x /= atlas.getWidth();
			texNode.clampUVRect.y /= atlas.getHeight();
			texNode.clampUVRect.width /= atlas.getWidth();
			texNode.clampUVRect.height /= atlas.getHeight();
			texNode.uniqueName = texArea.uniqueNS;

			return texNode;
		}
		return null;
	}
	addImageToAtlas(uniqueName: string, img: HTMLCanvasElement | HTMLImageElement): CanvasTexObject {
		let atlas = this.m_atlasList[0];
		let texArea = atlas.addSubImage(uniqueName, img);

		if (texArea != null) {
			let texNode = new CanvasTexObject();
			texNode.texture = atlas.getTexture();
			texNode.uvs = texArea.uvs;
			texNode.rect = texArea.texRect;
			texNode.clampUVRect = texArea.texRect.clone();
			texNode.clampUVRect.x /= atlas.getWidth();
			texNode.clampUVRect.y /= atlas.getHeight();
			texNode.clampUVRect.width /= atlas.getWidth();
			texNode.clampUVRect.height /= atlas.getHeight();
			texNode.uniqueName = texArea.uniqueNS;
			this.m_objMap.set(uniqueName, texNode);
			return texNode;
		} else {
			console.error("addImageToAtlas error!");
		}
		return null;
	}
	getTexObjFromAtlas(uniqueName: string): CanvasTexObject {
		return this.m_objMap.get(uniqueName);
	}
	createTexObjWithStr(chars: string, size: number, fontColor: IColor4 = null, bgColor: IColor4 = null): CanvasTexObject {
		if (fontColor == null) fontColor = CoMaterial.createColor4(0, 0, 0, 1);
		if (bgColor == null) bgColor = CoMaterial.createColor4();
		if (chars == null || chars == "" || size < 8) {
			return null;
		}
		let img = ImageTexAtlas.CreateCharsCanvas(chars, size, fontColor, bgColor);
		let keyStr = chars + "-" + size + "-" + fontColor.getCSSDecRGBAColor() + "-" + bgColor.getCSSDecRGBAColor();
		return this.addImageToAtlas(keyStr, img);
	}
	createCanvas(width: number, height: number, bgColor: IColor4 = null, transparent: boolean = true): HTMLCanvasElement {
		return ImageTexAtlas.CreateCanvas(width, height, bgColor, transparent);
	}
	createCharsCanvasFixSize(
		width: number,
		height: number,
		chars: string,
		fontSize: number,
		fontColor: IColor4 = null,
		bgColor: IColor4 = null
	): HTMLCanvasElement {
		return ImageTexAtlas.CreateCharsCanvasFixSize(width, height, chars, fontSize, fontColor, bgColor);
	}
	createCharsImage(chars: string, size: number, fontColor: IColor4 = null, bgColor: IColor4 = null): HTMLCanvasElement | HTMLImageElement {
		if (chars == null || chars == "" || size < 8) {
			return null;
		}
		return ImageTexAtlas.CreateCharsCanvas(chars, size, fontColor, bgColor);
	}

	private m_whiteTex: IRenderTexture = null;
	private m_whiteImg: HTMLCanvasElement = null;
	createWhiteTex(): IRenderTexture {
		if (this.m_whiteTex != null) {
			return this.m_whiteTex;
		}
		let size = 16;
		let canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		this.m_whiteImg = canvas;

		let ctx2D = canvas.getContext("2d");
		ctx2D.fillStyle = "white";
		ctx2D.fillRect(0, 0, size, size);

		let tex = this.m_sc.textureBlock.createImageTex2D(32, 32, false);
		tex.setDataFromImage(canvas, 0, 0, 0, false);
		this.m_whiteTex = tex;
		tex.premultiplyAlpha = true;
		return tex;
	}
}
export default CanvasTexAtlas;
