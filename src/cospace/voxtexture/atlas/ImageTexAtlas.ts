import { IImageTexture } from "../../../vox/render/texture/IImageTexture";
import TexArea from "./TexArea";
import TextureAtlas from "./TextureAtlas";
import IImageTexAtlas from "./IImageTexAtlas";
import IRendererScene from "../../../vox/scene/IRendererScene";
import ITexArea from "./ITexArea";

import IColor4 from "../../../vox/material/IColor4";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;

export default class ImageTexAtlas extends TextureAtlas implements IImageTexAtlas {
	private static s_imgMap: Map<string, HTMLCanvasElement> = new Map();
	private m_canvas: HTMLCanvasElement = null;
	private m_canvas2D: CanvasRenderingContext2D = null;
	private m_rscene: IRendererScene = null;
	private m_texture: IImageTexture = null;
	private m_transparent: boolean = false;
	private m_fillColor: IColor4 = null;
	constructor(
		rscene: IRendererScene,
		canvasWidth: number,
		canvasHeight: number,
		fillColor: IColor4,
		transparent: boolean = false,
		debugEnabled: boolean = false
	) {
		super(canvasWidth, canvasHeight);
		let canvas = document.createElement("canvas");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.display = "bolck";
		canvas.style.left = "0px";
		canvas.style.top = "0px";
		canvas.style.position = "absolute";
		canvas.style.pointerEvents = "none";
		this.m_transparent = transparent;
		if (transparent) {
			canvas.style.backgroundColor = "transparent";
		}
		this.m_fillColor = fillColor;
		this.m_rscene = rscene;
		this.m_canvas = canvas;
		this.m_canvas2D = canvas.getContext("2d");
		if (transparent) {
			this.m_canvas2D.fillStyle = fillColor.getCSSDecRGBAColor();
		} else {
			this.m_canvas2D.fillStyle = fillColor.getCSSHeXRGBColor();
		}
		this.m_canvas2D.fillRect(0, 0, canvasWidth, canvasHeight);

		this.m_uvFlipY = true;
		this.m_texture = this.m_rscene.textureBlock.createImageTex2D(32, 32, false);
		this.m_texture.__$setRenderProxy(this.m_rscene.getRenderProxy());
		this.m_texture.setDataFromImage(this.m_canvas, 0, 0, 0, false);
		this.m_texture.premultiplyAlpha = true;
		this.m_texture.__$attachThis();
	}
	clone(): ImageTexAtlas {
		let atlas: ImageTexAtlas = new ImageTexAtlas(this.m_rscene, this.m_width, this.m_height, this.m_fillColor, this.m_transparent);
		return atlas;
	}
	getTexture(): IImageTexture {
		return this.m_texture;
	}
	getCanvas(): HTMLCanvasElement {
		return this.m_canvas;
	}
	addSubImage(uniqueNS: string, image: HTMLCanvasElement | HTMLImageElement): TexArea {
		let area: TexArea = this.getAreaByName(uniqueNS);
		if (area != null) {
			return area;
		}
		area = this.addSubTexArea(uniqueNS, image.width, image.height);
		if (area != null) {
			let rect = area.texRect;
			this.m_canvas2D.drawImage(image, rect.x, rect.y, rect.width, rect.height);
			this.m_texture.setDataFromImage(this.m_canvas, 0, 0, 0, false);
			this.m_texture.updateDataToGpu(null, true);
		}
		return area;
	}
	// static CreateColorImage(width: number, height: number, fillStyle: string = "rgba(255,255,255,1.0)"): HTMLCanvasElement {
	// 	let canvas = ImageTexAtlas.CreateCanvas(width, height);
	// 	let ctx2D = canvas.getContext("2d");
	// 	ctx2D.fillStyle = fillStyle;
	// 	ctx2D.fillRect(0, 0, width, height);
	// 	return canvas;
	// }
	static CreateCanvas(width: number, height: number, bgColor: IColor4 = null, transparent: boolean = true): HTMLCanvasElement {
		let canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.style.display = "bolck";
		canvas.style.left = "0px";
		canvas.style.top = "0px";
		canvas.style.position = "absolute";
		if (transparent) {
			canvas.style.backgroundColor = "transparent";
		}
		if (bgColor != null) {
			let ctx2D = canvas.getContext("2d");
			ctx2D.fillStyle = bgColor.getCSSDecRGBAColor();
			ctx2D.fillRect(0, 0, width, height);
		}
		return canvas;
	}
	private static s_inputTF: HTMLInputElement = null;
	static CreateCharsCanvasFixSize(
		width: number,
		height: number,
		chars: string,
		fontSize: number,
		fontColor: IColor4 = null,
		bgColor: IColor4 = null
	): HTMLCanvasElement {
		if (fontColor == null) {
			fontColor = CoMaterial.createColor4(0, 0, 0, 1.0);
		}
		if (bgColor == null) {
			bgColor = CoMaterial.createColor4();
		}
		width = 0 | width;
		height = 0 | height;
		let texImg = ImageTexAtlas.CreateCharsCanvas(chars, fontSize, fontColor, bgColor);
		if (width == texImg.width && height == texImg.height) {
			return texImg;
		}
		if (width < texImg.width) {
			throw Error("width < texImg.width");
		}
		if (height < texImg.height) {
			throw Error("height < texImg.height");
		}
		let sx = Math.round((width - texImg.width) * 0.5);
		let sy = Math.round((height - texImg.height) * 0.5);
		let canvas = ImageTexAtlas.CreateCanvas(width, height, null);
		let ctx2D = canvas.getContext("2d");
		ctx2D.fillStyle = bgColor.getCSSDecRGBAColor();
		ctx2D.fillRect(0, 0, width, height);
		ctx2D.drawImage(texImg, sx, sy, texImg.width, texImg.height);
		return canvas;
	}
	static CreateCharsCanvas(chars: string, fontSize: number, fontColor: IColor4 = null, bgColor: IColor4 = null): HTMLCanvasElement {

		if (chars == null || chars == "" || fontSize < 8) {
			return null;
		}
		if (fontColor == null) {
			fontColor = CoMaterial.createColor4(0, 0, 0, 1.0);
		}
		if (bgColor == null) {
			bgColor = CoMaterial.createColor4();
		}
		console.log("bgColor: ",bgColor);
		let ftCStr = fontColor.getCSSDecRGBAColor();
		let bgCStr = bgColor.getCSSDecRGBAColor();
		let keyStr = chars + "_" + fontSize + "_" + ftCStr + "_" + bgCStr;

		let imgMap = ImageTexAtlas.s_imgMap;
		if (imgMap.has(keyStr)) {
			return imgMap.get(keyStr);
		}

		let width = fontSize;
		let height = fontSize + 2;
		if (chars.length > 1) {
			width = fontSize * chars.length;
		}

		let canvas = ImageTexAtlas.CreateCanvas(width, height);
		let ctx2D = canvas.getContext("2d");
		ctx2D.font = fontSize - 4 + "px Verdana";
		//ctx2D.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
		ctx2D.textBaseline = "top";

		var metrics: any = ctx2D.measureText(chars);
		let texWidth: number = metrics.width;

		if (chars.length > 1) {
			width = Math.round(texWidth + 8);
			canvas.width = width;
			ctx2D = canvas.getContext("2d");
			ctx2D.font = fontSize - 4 + "px Verdana";
			ctx2D.textBaseline = "top";
		}
		/*
		let input = ImageTexAtlas.s_inputTF;
		if(ImageTexAtlas.s_inputTF == null) {
			ImageTexAtlas.s_inputTF = document.createElement("input");
			input = ImageTexAtlas.s_inputTF;
			input.type = "text";
			input.id = "atlas_inputText";
			input.className = "atlas_inputTFClass";
			input.disabled = true;

			let style = input.style;
			style.left = "10px";
			style.top = "10px";
			style.zIndex = "9999";
			style.position = "absolute";
			style.borderWidth = "0";
			// style.visibility = visible ? "visible" : "hidden";
			style.visibility = "hidden";
			document.body.appendChild(input);
		}
		input.value = chars;
		let rect = input.getBoundingClientRect();
		height = Math.round(rect.height) + 8;
		//*/
		// console.log("rect.height: ", rect.height, "fontSize: ",fontSize);
		ctx2D.fillStyle = bgCStr;
		ctx2D.fillRect(0, 0, width, height);
		ctx2D.textAlign = "left";
		ctx2D.fillStyle = ftCStr;
		//ctx2D.fillText(chars, (fontSize - texWidth) * 0.5, fontSize - (fontSize - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent * 2.0) * 0.5);
		///*
		const RD = CoRScene.RendererDevice;
		if (RD.IsMobileWeb()) {
			if (RD.IsIOS()) {
				ctx2D.fillText(chars, (width - texWidth) * 0.5, -4);
			} else {
				ctx2D.fillText(chars, (width - texWidth) * 0.5, 4);
			}
		} else {
			ctx2D.fillText(chars, (width - texWidth) * 0.5, 4);
		}
		//*/
		// ctx2D.fillText(chars, (width - texWidth) * 0.5, 4);
		imgMap.set(keyStr, canvas);
		return canvas;
		/*
		actualBoundingBoxAscent: 22
		actualBoundingBoxDescent: -17
		actualBoundingBoxLeft: -4
		actualBoundingBoxRight: 24
		fontBoundingBoxAscent: 60
		fontBoundingBoxDescent: 13
		*/
	}
}
