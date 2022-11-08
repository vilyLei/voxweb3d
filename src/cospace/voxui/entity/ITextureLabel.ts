import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";

import { IUIEntity } from "./IUIEntity";

interface ITextureLabel extends IUIEntity {
	/**
	 * @param uiScene ICoUIScene instance
	 * @param tex IRenderTexture instance
	 * @param width the default value is 128
	 * @param height the default value is 128
	 */
	initialize(uiScene: ICoUIScene, tex: IRenderTexture, width?: number, height?: number): void;
}

export { ITextureLabel }
