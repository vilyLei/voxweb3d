import IRendererScene from "../../vox/scene/IRendererScene";
import IColor4 from "../../vox/material/IColor4";
import ICanvasTexAtlas from "./atlas/ICanvasTexAtlas";
import CanvasTexAtlas from "./atlas/CanvasTexAtlas";
import IImageTexAtlas from "./atlas/IImageTexAtlas";
import ImageTexAtlas from "./atlas/ImageTexAtlas";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;


function createCharsImage(chars: string, fontSize: number, fontColor: IColor4 = null, bgColor: IColor4 = null): HTMLCanvasElement | HTMLImageElement {
	if (chars == null || chars == "" || fontSize < 8) {
		return null;
	}
	return ImageTexAtlas.CreateCharsCanvas(chars, fontSize, fontColor, bgColor);
}
function createCanvasTexAtlas(): ICanvasTexAtlas {
	return new CanvasTexAtlas();
}
function createImageTexAtlas(rscene: IRendererScene, canvasWidth: number, canvasHeight: number, fillColor: IColor4, transparent: boolean = false, nearestFilter: boolean = false): IImageTexAtlas {
	return new ImageTexAtlas(rscene, canvasWidth, canvasHeight, fillColor, transparent, nearestFilter);
}
export {
	ImageTexAtlas,
	createCharsImage,
	createCanvasTexAtlas,
	createImageTexAtlas
};
