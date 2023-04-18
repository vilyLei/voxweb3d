import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import TextureResLoader from "../../../vox/assets/TextureResLoader";
import MouseEvent from "../../../vox/event/MouseEvent";
import IRendererScene from "../../../vox/scene/IRendererScene";

import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import { IAwardSceneParam } from "../../base/award/IAwardSceneParam";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import RendererState from "../../../vox/render/RendererState";
import { UISystem } from "./UISystem";

import ColorRectImgButton from "../../../orthoui/button/ColorRectImgButton";
import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import { UIBuilder } from "./UIBuilder";
import Color4 from "../../../vox/material/Color4";
import TextureConst from "../../../vox/texture/TextureConst";

class BGToyAwardSceneParam implements IAwardSceneParam {
	texLoader: TextureResLoader = null;
	uiBuilder: UIBuilder = null;
	uiSys: UISystem = null;
	sc: IRendererScene = null;
	constructor() { }
	// private getAssetTexByUrl(pns: string): IRenderTexture {
	// 	return this.getTexByUrl("static/assets/" + pns);
	// }

	createCharsTexFixSize?(width: number, height: number, str: string, fontSize: number): IRenderTexture {

		let fontColor = new Color4(1.0, 1.0, 1.0, 1.0);
		let bgColor = new Color4(1.0, 1.0, 1.0, 0.1);
		let img = this.uiBuilder.createCharsCanvasFixSize(width, height, str, fontSize, null, fontColor, bgColor);
		let tex = this.sc.textureBlock.createImageTex2D();
		tex.setDataFromImage(img);
		return tex;
	}
	applyFunction(key: string): void {
		this.uiSys.applyFunction(key);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		// url = URLFilter.filterUrl(url);
		let tex = this.texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
		tex.mipmapEnabled = false;
		tex.minFilter = tex.magFilter = TextureConst.NEAREST;
		return tex;
	}
	createContainer(): IDisplayEntityContainer {
		return new DisplayEntityContainer(true, true);
	}
	createXOYPlane(x: number, y: number, w: number, h: number, tex: IRenderTexture = null, alignScreen: boolean = false): IRenderEntity {
		if (alignScreen) {
			let pl = new ScreenAlignPlaneEntity();
			// pl.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
			pl.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
			pl.initialize(x, y, w, h, tex ? [tex] : null);
			return pl;
		} else {
			let pl = new Plane3DEntity();
			// pl.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
			// pl.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
			pl.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
			pl.initializeXOY(x, y, w, h, tex ? [tex] : null);
			return pl;
		}
	}

	createBtnEntity(tex: IRenderTexture, downListener: (evt: any) => void): IRenderEntity {
		let btn = new ColorRectImgButton();
		btn.overColor.setRGBA4f(1.2, 1.2, 1.2, 1.0);
		btn.outColor.setRGBA4f(0.75, 0.75, 0.75, 1.0);
		btn.downColor.setRGBA4f(0.95, 0.8, 0.95, 1.0);
		btn.initialize(0, 0, tex.getWidth(), tex.getHeight(), [tex]);
		btn.setSize(tex.getWidth(), tex.getHeight());
		btn.addEventListener(MouseEvent.MOUSE_DOWN, this, downListener);
		btn.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		// pl.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
		return btn;
	}
	createTextBtnEntity(btn_name: string, width: number, height: number, fontSize: number, downListener: (evt: any) => void): IRenderEntity {

		let fontColor = new Color4(1.0, 1.0, 1.0, 1.0);
		let bgColor = new Color4(1.0, 1.0, 1.0, 0.6);
		let btn: ColorRectImgButton = null;
		if (btn_name != "") {
			btn = this.uiBuilder.createBtnWithIcon(btn_name + "awardTextBgKStr" + width + "_" + height, null, width, height, btn_name, fontSize, null, null, fontColor, bgColor);
			btn.overColor.setRGBA4f(1.0, 1.0, 1.0, 1.0);
			btn.outColor.setRGBA4f(0.75, 0.75, 0.75, 1.0);
			btn.downColor.setRGBA4f(0.95, 0.5, 0.95, 1.0);
		} else {
			btn = new ColorRectImgButton();
			btn.initialize(0, 0, width, height);
			btn.overColor.setRGBA4f(0.0, 0.0, 0.0, 0.9);
			btn.outColor.copyFrom(btn.overColor);
			btn.downColor.copyFrom(btn.overColor);
		}
		btn.setSize(width, height);
		btn.addEventListener(MouseEvent.MOUSE_DOWN, this, downListener);
		btn.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		// pl.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
		return btn;
	}
	pid = 3;
}

export { BGToyAwardSceneParam };
