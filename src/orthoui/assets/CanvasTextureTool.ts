import IRendererScene from "../../vox/scene/IRendererScene";
import ImageTextureAtlas from "../../vox/texture/ImageTextureAtlas";
import Color4 from "../../vox/material/Color4";
import AABB2D from "../../vox/geom/AABB2D";
import { TexArea } from "../../vox/texture/TexAreaNode";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IColor4 from "../../vox/material/IColor4";
import IVector3D from "../../vox/math/IVector3D";
import TextureConst from "../../vox/texture/TextureConst";

export class CanvasTextureObject {
constructor() {}

	uvs: Float32Array = null;
	texture: IRenderTexture = null;
	rect: AABB2D = null;
	clampUVRect: AABB2D = null;
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
export class CanvasTextureTool {
	private m_sc: IRendererScene = null;
	private static s_ins: CanvasTextureTool = null;
	private static s_imgMap: Map<string, HTMLImageElement | HTMLCanvasElement> = new Map();
	private static s_texMap: Map<string, IRenderTexture> = new Map();
	private static s_atlasList: ImageTextureAtlas[] = [null, null, null, null];
	constructor() {
		if (CanvasTextureTool.s_ins != null) {
			throw Error("class CanvasTextureTool is a singleton class.");
		}
		CanvasTextureTool.s_ins = this;
	}
	static GetInstance(): CanvasTextureTool {
		if (CanvasTextureTool.s_ins != null) {
			return CanvasTextureTool.s_ins;
		}
		return new CanvasTextureTool();
	}

	initialize(sc: IRendererScene): void {
		if (this.m_sc == null) {
			this.m_sc = sc;
		}
	}

	initializeAtlas(canvasWidth: number, canvasHeight: number, fillColor: Color4, transparent: boolean = false): void {
		let atlas: ImageTextureAtlas = null;
		if (CanvasTextureTool.s_atlasList[0] == null) {
			atlas = new ImageTextureAtlas(this.m_sc, canvasWidth, canvasHeight, fillColor, transparent);
			let tex = atlas.getTexture();
			tex.minFilter = TextureConst.NEAREST;
			tex.magFilter = TextureConst.NEAREST;
			tex.mipmapEnabled = false;
			CanvasTextureTool.s_atlasList[0] = atlas;

			/*
			// for test
			let canvas0 = atlas.getCanvas();
			// canvas0.width = 512;
			// canvas0.height = 512;
			canvas0.style.width = 512 + "px";
			canvas0.style.height = 512 + "px";
			canvas0.style.left = 0 + "px";
			canvas0.style.top = 0 + "px";
			let debugEnabled = true;
			if (debugEnabled) {
				document.body.appendChild(canvas0);
			}
			//*/
		}
	}
	getAtlasAt(i: number): ImageTextureAtlas {
		return CanvasTextureTool.s_atlasList[i];
	}
	addcharsToAtlas(
		chars: string,
		size: number,
		fontStyle: string = "rgba(255,255,255,1.0)",
		bgStyle: string = "rgba(255,255,255,0.3)"
	): CanvasTextureObject {
		if (chars != "") {
			let atlas: ImageTextureAtlas = CanvasTextureTool.s_atlasList[0];
			let image: HTMLImageElement | HTMLCanvasElement = ImageTextureAtlas.CreateCharsTexture(chars, size, fontStyle, bgStyle);
			return this.addImageToAtlas(chars, image);
		}
		return null;
	}
	getTextureObject(uniqueName: string): CanvasTextureObject {
		let atlas: ImageTextureAtlas = CanvasTextureTool.s_atlasList[0];
		let texArea: TexArea = atlas.getAreaByName(uniqueName);
		if (texArea != null) {
			let texNode = new CanvasTextureObject();
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
	createImageCanvasFixSize(
		width: number,
		height: number,
		imageWidth: number,
		imageHeight: number,
		img: HTMLCanvasElement | HTMLImageElement,
		bgColor: IColor4 = null,
		offsetV: IVector3D = null
	): HTMLCanvasElement {
		return CanvasTextureTool.s_atlasList[0].createImageCanvasFixSize(width, height, imageWidth, imageHeight, img, bgColor, offsetV);
	}
	createCharsCanvasFixSize(
		width: number,
		height: number,
		chars: string,
		fontSize: number,
		fontColor: IColor4 = null,
		bgColor: IColor4 = null,
		offsetV: IVector3D = null
	): HTMLCanvasElement {
		return CanvasTextureTool.s_atlasList[0].createCharsCanvasFixSize(width, height, chars, fontSize, fontColor, bgColor, offsetV);
	}
	addImageToAtlas(uniqueName: string, img: HTMLCanvasElement | HTMLImageElement): CanvasTextureObject {
		let atlas: ImageTextureAtlas = CanvasTextureTool.s_atlasList[0];
		let texArea: TexArea = atlas.addSubImage(uniqueName, img);

		if (texArea) {
			// console.log("XXXXXXXX image size: ",img.width, img.height);
			// console.log("XXXXXXXX texArea.texRect: ",texArea.texRect);
			let texNode: CanvasTextureObject = new CanvasTextureObject();
			texNode.texture = atlas.getTexture();
			texNode.uvs = texArea.uvs;
			texNode.rect = texArea.texRect;
			texNode.clampUVRect = texArea.texRect.clone();
			texNode.clampUVRect.x /= atlas.getWidth();
			texNode.clampUVRect.y /= atlas.getHeight();
			texNode.clampUVRect.width /= atlas.getWidth();
			texNode.clampUVRect.height /= atlas.getHeight();
			texNode.uniqueName = texArea.uniqueNS;

			return texNode;
		} else {
			console.error("addImageToAtlas error!");
		}
		return null;
	}
	getTextureObjectFromAtlas(uniqueName: string): CanvasTextureObject {
		return null;
	}

	createCharsImage(
		chars: string,
		size: number,
		frontStyle: string = "",
		bgStyle: string = "",
		fixWidth: number = 0
	): HTMLCanvasElement | HTMLImageElement {
		if (chars == null || chars == "" || size < 8) {
			return null;
		}
		return ImageTextureAtlas.CreateCharsTexture(chars, size, frontStyle, bgStyle, fixWidth);
	}
	heightOffset = 0;
	createCharsImageToAtlas(
		keyStr: string,
		chars: string,
		size: number,
		frontColor: Color4 = null,
		bgColor: Color4 = null,
		fixWidth: number = 0
	): CanvasTextureObject {
		if (keyStr != "") {
			let obj = this.getTextureObject(keyStr);
			if (obj) {
				return obj;
			}
		}
		let img = this.createCharsImage(
			chars,
			size,
			frontColor ? frontColor.getCSSDecRGBAColor() : "",
			bgColor ? bgColor.getCSSDecRGBAColor() : "",
			fixWidth
		);

		img = this.createCharsCanvasFixSize(img.width, img.height + this.heightOffset, chars, size, frontColor, bgColor);
		if (!img) {
			return null;
		}
		if (keyStr == "") {
			keyStr = this.getCurrentKeyStr();
		}
		// this.heightOffset = 0;
		return this.addImageToAtlas(keyStr, img);
	}
	getCurrentKeyStr(): string {
		return ImageTextureAtlas.GetCurrentKeyStr();
	}

	private m_whiteTex: IRenderTexture = null;
	createWhiteTex(): IRenderTexture {
		if (this.m_whiteTex != null) {
			return this.m_whiteTex;
		}
		let size = 16;
		let canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;

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
export default CanvasTextureTool;
