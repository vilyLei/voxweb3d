import IRendererScene from "../../vox/scene/IRendererScene";
import IColor4 from "../../vox/material/IColor4";
import ICanvasTexAtlas from "./atlas/ICanvasTexAtlas";
import CanvasTexAtlas from "./atlas/CanvasTexAtlas";
import IImageTexAtlas from "./atlas/IImageTexAtlas";
import ImageTexAtlas from "./atlas/ImageTexAtlas";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;


function createCanvasTexAtlas(): ICanvasTexAtlas {
	return new CanvasTexAtlas();
}
function createImageTexAtlas(rscene: IRendererScene, canvasWidth: number, canvasHeight: number, fillColor: IColor4, transparent: boolean = false, nearestFilter: boolean = false): IImageTexAtlas {
	return new ImageTexAtlas(rscene, canvasWidth, canvasHeight, fillColor, transparent, nearestFilter);
}
export {
	ImageTexAtlas,
	createCanvasTexAtlas,
	createImageTexAtlas
};
