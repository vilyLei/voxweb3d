import IRendererScene from "../../vox/scene/IRendererScene";
import { IH5Text } from "./base/IH5Text";

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
}
export { ICoText };
