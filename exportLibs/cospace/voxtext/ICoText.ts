import IRendererScene from "../../vox/scene/IRendererScene";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IH5Text } from "./base/IH5Text";
import { ITextEntity } from "./base/ITextEntity";

interface ICoText {
	/**
	 * create a h5 canvas text module
	 * @param rscene a IRendererScene instance
	 * @param canvasIdName canvas id name
	 * @param fontSize the defaule value is 10
	 * @param texWidth the defaule value is 512
	 * @param texHeight the defaule value is 512
	 */
	createH5Text(rscene: IRendererScene, canvasIdName: string, fontSize?: number, texWidth?: number, texHeight?: number): IH5Text;
	/**
	 * create a static text object
	 * @param text text string
	 * @param h5Text IH5Text instance
	 * @param texList IRenderTexture instance array, but the default value is null
	 */
	createStaticTextEntity(text: string, h5Text: IH5Text, texList?: IRenderTexture[]): ITextEntity;
}
export { ICoText };
