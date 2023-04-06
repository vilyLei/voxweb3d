import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

interface IAwardSceneParam {
	getTexByUrl(url: string): IRenderTexture;
	createContainer(): IDisplayEntityContainer;
	createXOYPlane(x: number, y: number, w: number, h: number, tex: IRenderTexture): IRenderEntity;
	pid: number;
}
export {IAwardSceneParam};
