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
	applyFunction?(key: string): void;
	createCharsTexFixSize?(width: number, height: number, str: string, fontSize: number): IRenderTexture;
	/**
	 *
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @param tex the defualt value is null
	 * @param alignScreen the defualt value is false
	 */
	createXOYPlane(x: number, y: number, w: number, h: number, tex?: IRenderTexture, alignScreen?: boolean): IRenderEntity;
	createBtnEntity?(tex: IRenderTexture, downListener: (evt: any) => void): IRenderEntity;
	createTextBtnEntity?(btn_name: string, width: number, height: number, fontSize: number, downListener: (evt: any) => void): IRenderEntity;
	pid: number;
}
export {IAwardSceneParam};
