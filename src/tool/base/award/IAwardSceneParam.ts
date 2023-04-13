import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

interface IAwardSceneParam {
	/**
	 * @param url url string
	 * @param preAlpha the default value is false
	 * @param wrapRepeat the default value is true
	 * @param mipmapEnabled the default value is true
	 */
	getTexByUrl(url: string, preAlpha?: boolean, wrapRepeat?: boolean, mipmapEnabled?: boolean): IRenderTexture;
	createContainer(): IDisplayEntityContainer;
	createXOYPlane(x: number, y: number, w: number, h: number, tex: IRenderTexture): IRenderEntity;
	createBtnEntity?(tex: IRenderTexture, downListener: (evt: any) => void): IRenderEntity;
	pid: number;
}
export {IAwardSceneParam};
