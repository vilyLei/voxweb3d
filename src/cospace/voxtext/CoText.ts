import IRendererScene from "../../vox/scene/IRendererScene";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { ICoRScene } from "../voxengine/ICoRScene";
import { H5Text } from "./base/H5Text";
import { IH5Text } from "./base/IH5Text";
import { ITextEntity } from "./base/ITextEntity";
import { TextEntity } from "./base/TextEntity";
declare var CoRScene: ICoRScene;
function createH5Text(rscene: IRendererScene, canvasIdName: string, fontSize: number = 10, texWidth: number = 512, texHeight: number = 512): IH5Text {
	let ht = new H5Text();
	ht.initialize(rscene, canvasIdName, fontSize, texWidth, texHeight);
	return ht; 
}
function createStaticTextEntity(text: string, h5Text: IH5Text, texList: IRenderTexture[] = null): ITextEntity {
	let et = new TextEntity();
	et.initialize(text, h5Text, texList);
	return et;
}
export {
	createH5Text
};
