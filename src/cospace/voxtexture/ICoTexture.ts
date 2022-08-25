import IRendererScene from "../../vox/scene/IRendererScene";
import IColor4 from "../../vox/material/IColor4";
import IImageTexAtlas from "./atlas/IImageTexAtlas";
import ICanvasTexAtlas from "./atlas/ICanvasTexAtlas";

interface CoImageTexAtlas {
	/**
	 * create a canvas onject
	 * @param width canvas width
	 * @param height canvas height
	 * @param bgColor bg color object
	 * @param transparent the default is true
	 */
	CreateCanvas(width: number, height: number, bgColor?: IColor4, transparent?: boolean): HTMLCanvasElement;
	CreateCharsCanvasFixSize(width: number, height: number, chars: string, fontSize: number, frontStyle?: string, bgStyle?: string): HTMLCanvasElement;
    CreateCharsCanvas(chars: string, fontSize: number, frontStyle?: string, bgStyle?: string): HTMLCanvasElement;
}

interface ICoTexture {
	ImageTexAtlas: CoImageTexAtlas;
	createCanvasTexAtlas(): ICanvasTexAtlas;
	createImageTexAtlas(rscene: IRendererScene, canvasWidth: number, canvasHeight: number, fillColor: IColor4, transparent?: boolean, debugEnabled?: boolean): IImageTexAtlas
}
export { ICoTexture };
