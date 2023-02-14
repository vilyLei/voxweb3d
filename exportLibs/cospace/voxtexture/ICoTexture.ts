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
	/**
	 * create a canvas onject
	 * @param width canvas width
	 * @param height canvas height
	 * @param chars text string
	 * @param fontSize text font size
	 * @param fontSize font color object, the default is null
	 * @param bgColor bg color object, the default is null
	 */
	CreateCharsCanvasFixSize(
		width: number,
		height: number,
		chars: string,
		fontSize: number,
		fontColor?: IColor4,
		bgColor?: IColor4
	): HTMLCanvasElement;
	CreateCharsCanvas(chars: string, fontSize: number, frontStyle?: string, bgStyle?: string): HTMLCanvasElement;
}

interface ICoTexture {
	ImageTexAtlas: CoImageTexAtlas;
	createCharsImage(chars: string, fontSize: number, fontColor?: IColor4, bgColor?: IColor4): HTMLCanvasElement | HTMLImageElement;
	createCanvasTexAtlas(): ICanvasTexAtlas;
	createImageTexAtlas(
		rscene: IRendererScene,
		canvasWidth: number,
		canvasHeight: number,
		fillColor: IColor4,
		transparent?: boolean,
		nearestFilter?: boolean
	): IImageTexAtlas;
}
export { CoImageTexAtlas, ICoTexture };
