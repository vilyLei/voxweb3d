import { IImageTexture } from "../../../vox/render/texture/IImageTexture";
import ITexArea from "./ITexArea";
import ITextureAtlas from "./ITextureAtlas";
import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

export default interface IImageTexAtlas extends ITextureAtlas {

    clone(): IImageTexAtlas;
    getTexture(): IImageTexture;
    getCanvas(): HTMLCanvasElement;
    addSubImage(uniqueNS: string, image: HTMLCanvasElement | HTMLImageElement): ITexArea;
}
