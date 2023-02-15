import IRendererScene from "../../vox/scene/IRendererScene";
import IColor4 from "../../vox/material/IColor4";
import IImageTexAtlas from "./atlas/IImageTexAtlas";
import ICanvasTexAtlas from "./atlas/ICanvasTexAtlas";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import { CoImageTexAtlas, ICoTexture } from "./ICoTexture";

declare var CoTexture: ICoTexture;

interface I_CoTexture {
}
class T_CoTexture {

	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
		this.m_init = !this.isEnabled();
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
				url = "static/cospace/cotexture/CoTexture.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

			return true;
		}
		return false;
	}
	isEnabled(): boolean {
		return typeof CoTexture !== "undefined";
	}

	get ImageTexAtlas(): CoImageTexAtlas {
		return CoTexture.ImageTexAtlas;
	}
	createCharsImage(chars: string, fontSize: number, fontColor?: IColor4, bgColor?: IColor4): HTMLCanvasElement | HTMLImageElement {
		return CoTexture.createCharsImage(chars, fontSize, fontColor, bgColor);
	}
	createCanvasTexAtlas(): ICanvasTexAtlas {
		return CoTexture.createCanvasTexAtlas();
	}
	createImageTexAtlas(
		rscene: IRendererScene,
		canvasWidth: number,
		canvasHeight: number,
		fillColor: IColor4,
		transparent?: boolean,
		nearestFilter?: boolean
	): IImageTexAtlas {
		return CoTexture.createImageTexAtlas(rscene, canvasWidth, canvasHeight, fillColor, transparent, nearestFilter);
	}
}
let VoxTexture = new T_CoTexture();
export { VoxTexture };
