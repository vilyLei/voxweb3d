import { IImageTexture } from "../../../vox/render/texture/IImageTexture";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IImageTexAtlas from "./IImageTexAtlas";
import IColor4 from "../../../vox/material/IColor4";

import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import ICanvasTexObject from "./ICanvasTexObject";

export interface ICanvasTexAtlas {

    initialize(sc: IRendererScene, canvasWidth: number, canvasHeight: number, fillColor?: IColor4, transparent?: boolean, nearestFilter?: boolean): void;
    setFontName(fontName: string): void;
    getTexture(i?: number): IImageTexture;
    getAtlasAt(i?: number): IImageTexAtlas;
    addcharsToAtlas(chars: string, size: number, fontColor: IColor4, bgColor: IColor4 ): ICanvasTexObject;
    getTextureObject(uniqueName: string): ICanvasTexObject;
    addImageToAtlas(uniqueName: string, img: HTMLCanvasElement | HTMLImageElement): ICanvasTexObject;
    getTexObjFromAtlas(uniqueName: string): ICanvasTexObject;
    createTexObjWithStr(chars: string, size: number, fontColor?: IColor4, bgColor?: IColor4): ICanvasTexObject;

	createCanvas(width: number, height: number, bgColor?: IColor4, transparent?: boolean): HTMLCanvasElement;

	createCharsCanvasWithSize(width: number,height: number,offsetW: number,offsetH: number,chars: string,fontSize: number,frontColor?: IColor4,bgColor?: IColor4): HTMLCanvasElement
	createCharsCanvasFixSize(width: number,height: number,chars: string,fontSize: number,frontColor?: IColor4,bgColor?: IColor4): HTMLCanvasElement

    createCharsImage(chars: string, size: number, fontColor?: IColor4, bgColor?: IColor4): HTMLCanvasElement | HTMLImageElement;
    createWhiteTex(): IRenderTexture;
}
export default ICanvasTexAtlas;
