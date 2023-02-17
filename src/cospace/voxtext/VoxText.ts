import IRendererScene from "../../vox/scene/IRendererScene";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IH5Text } from "./base/IH5Text";
import { ITextEntity } from "./base/ITextEntity";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import { ICoText } from "./ICoText";
declare var CoText: ICoText;

interface I_CoText {
}
class T_CoText {

	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
		this.m_init = !this.isEnabled();
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
				url = "static/cospace/cotext/CoText.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

			return true;
		}
		return false;
	}
	isEnabled(): boolean {
		return typeof CoText !== "undefined";
	}
	/**
	 * create a h5 canvas text module
	 * @param rscene a IRendererScene instance
	 * @param canvasIdName canvas id name
	 * @param fontSize the defaule value is 10
	 * @param texWidth the defaule value is 512
	 * @param texHeight the defaule value is 512
	 */
	createH5Text(rscene: IRendererScene, canvasIdName: string, fontSize?: number, texWidth?: number, texHeight?: number): IH5Text {
		return CoText.createH5Text(rscene, canvasIdName, fontSize, texWidth, texHeight);
	}
	/**
	 * create a static text object
	 * @param text text string
	 * @param h5Text IH5Text instance
	 * @param texList IRenderTexture instance array, but the default value is null
	 */
	createStaticTextEntity(text: string, h5Text: IH5Text, texList?: IRenderTexture[]): ITextEntity {
		return CoText.createStaticTextEntity(text, h5Text, texList);
	}
}
let VoxText = new T_CoText();
export { VoxText };
