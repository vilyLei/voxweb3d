import IRendererScene from "../../vox/scene/IRendererScene";
import { ICoRScene } from "../voxengine/ICoRScene";
import { H5Text } from "./base/H5Text";
import { IH5Text } from "./base/IH5Text";
declare var CoRScene: ICoRScene;
function createH5Text(rscene: IRendererScene, canvasIdName: string, fontSize: number = 10, texWidth: number = 512, texHeight: number = 512): IH5Text {
	let ht = new H5Text();
	ht.initialize(rscene, canvasIdName, fontSize, texWidth, texHeight);
	return ht; 
}
export {
	createH5Text
};
