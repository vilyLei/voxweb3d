/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../vox/render/RendererState";
import ColorRectImgButton from "../../orthoui/button/ColorRectImgButton";
import CanvasTextureTool, { CanvasTextureObject } from "../assets/CanvasTextureTool";
import Color4 from "../../vox/material/Color4";
import IColor4 from "../../vox/material/IColor4";
import IVector3D from "../../vox/math/IVector3D";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

export class UIBarTool {

    private static s_fontColor = new Color4(1.0,1.0,1.0,1.0);
    private static s_bgColor = new Color4(1.0,1.0,1.0,0.3);
	static TexPool: CanvasTextureTool = CanvasTextureTool.GetInstance();
	static CreateImageCanvasFixSize(
		width: number,
		height: number,
		imageWidth: number,
		imageHeight: number,
		img: HTMLCanvasElement | HTMLImageElement,
		bgColor: IColor4 = null,
		offsetV: IVector3D = null
	): HTMLCanvasElement {
		return CanvasTextureTool.GetInstance().createImageCanvasFixSize(width, height, imageWidth, imageHeight, img, bgColor, offsetV,);
	}
	static CreateCharsCanvasFixSize(
		width: number,
		height: number,
		chars: string,
		fontSize: number,
		fontColor: IColor4 = null,
		bgColor: IColor4 = null,
		offsetV: IVector3D = null
	): HTMLCanvasElement {
		return CanvasTextureTool.GetInstance().createCharsCanvasFixSize(width, height, chars, fontSize, fontColor, bgColor, offsetV);
	}
    static AddImageToAtlas(keyStr: string, image: HTMLCanvasElement | HTMLImageElement): CanvasTextureObject {
		return CanvasTextureTool.GetInstance().addImageToAtlas(keyStr, image);
	}
    static CreateBtnWithKeyStr(keyStr: string, currBtn: ColorRectImgButton = null): ColorRectImgButton {
		let texObj = CanvasTextureTool.GetInstance().getTextureObject(keyStr);

        if(currBtn == null)currBtn = new ColorRectImgButton();
        currBtn.uvs = texObj.uvs;
        currBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
        currBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
        currBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
        currBtn.initialize(0.0, 0.0, texObj.getWidth(), texObj.getHeight(), [texObj.texture]);
        currBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        currBtn.setSize(texObj.getWidth(), texObj.getHeight());

		return currBtn;
	}

    static CreateBtnWithTex(tex: IRenderTexture, currBtn: ColorRectImgButton = null): ColorRectImgButton {
		if(tex.isDataEnough()) {
			if(currBtn == null)currBtn = new ColorRectImgButton();
			currBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
			currBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
			currBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
			currBtn.initialize(0.0, 0.0, tex.getWidth(), tex.getHeight(), [tex]);
			currBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
			currBtn.setSize(tex.getWidth(), tex.getHeight());
		}
		return currBtn;
	}
    static CreateBtn(btn_name:string, fontSize: number, fontColor: Color4 = null, fontBgColor: Color4 = null, fixWidth: number = 0): ColorRectImgButton {
        //string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"
        if(fontColor == null) {
            fontColor = UIBarTool.s_fontColor;
        }
        if(fontBgColor == null) {
            fontBgColor = UIBarTool.s_bgColor;
        }
        const ctt = CanvasTextureTool.GetInstance();
        let keyStr = btn_name +"-"+fontSize+"-"+fontColor.getCSSDecRGBAColor() +"-"+ fontBgColor.getCSSDecRGBAColor() + "-" + fixWidth;
        let texObj = ctt.getTextureObject(keyStr);
        if(texObj == null) {
            texObj = ctt.createCharsImageToAtlas("", btn_name, fontSize, fontColor, fontBgColor, fixWidth);
        }
        return UIBarTool.CreateBtnWithKeyStr(keyStr);
    }
    static InitializeBtn(currBtn: ColorRectImgButton, btn_name:string, fontSize: number, fontColor: Color4 = null, fontBgColor: Color4 = null, fixWidth: number = 0): ColorRectImgButton {

        if(fontColor == null) {
            fontColor = UIBarTool.s_fontColor;
        }
        if(fontBgColor == null) {
            fontBgColor = UIBarTool.s_bgColor;
        }
        const ctt = CanvasTextureTool.GetInstance();
        let keyStr = btn_name +"-"+fontSize+"-"+fontColor.getCSSDecRGBAColor() +"-"+ fontBgColor.getCSSDecRGBAColor() +"-" + fixWidth;
        let texObj = ctt.getTextureObject( keyStr );
        if(texObj == null) {
            texObj = ctt.createCharsImageToAtlas("", btn_name, fontSize, fontColor, fontBgColor, fixWidth);
        }
        return UIBarTool.CreateBtnWithKeyStr(keyStr, currBtn);

        // return currBtn;
    }
}
export default UIBarTool;
