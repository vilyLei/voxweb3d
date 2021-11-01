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

export class UIBarTool {

    private static s_fontColor: Color4 = new Color4(1.0,1.0,1.0,1.0);
    private static s_bgColor: Color4 = new Color4(1.0,1.0,1.0,0.3);

    static CreateBtn(btn_name:string, fontSize: number, fontColor: Color4 = null, bgColor: Color4 = null): ColorRectImgButton {
        //string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"
        if(fontColor == null) {
            fontColor = UIBarTool.s_fontColor;
        }
        if(bgColor == null) {
            bgColor = UIBarTool.s_bgColor;
        }
        let texObj: CanvasTextureObject = CanvasTextureTool.GetInstance().getTextureObject(btn_name + "_" + fontSize);
        if(texObj == null) {
            let image = CanvasTextureTool.GetInstance().createCharsImage(btn_name, fontSize, fontColor.getCSSDecRGBAColor(), bgColor.getCSSDecRGBAColor());
            texObj = CanvasTextureTool.GetInstance().addImageToAtlas(btn_name, image);
        }
        let currBtn: ColorRectImgButton = new ColorRectImgButton();
        currBtn.uvs = texObj.uvs;
        currBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
        currBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
        currBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
        currBtn.initialize(0.0, 0.0, texObj.getWidth(), texObj.getHeight(), [texObj.texture]);
        currBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        currBtn.setSize(texObj.getWidth(), texObj.getHeight());
        
        return currBtn;
    }
    static InitializeBtn(currBtn: ColorRectImgButton, btn_name:string, fontSize: number, fontColor: Color4 = null, bgColor: Color4 = null): ColorRectImgButton {
        //string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"
        if(fontColor == null) {
            fontColor = UIBarTool.s_fontColor;
        }
        if(bgColor == null) {
            bgColor = UIBarTool.s_bgColor;
        }
        let texObj: CanvasTextureObject = CanvasTextureTool.GetInstance().getTextureObject(btn_name + "_" + fontSize);
        if(texObj == null) {
            let image = CanvasTextureTool.GetInstance().createCharsImage(btn_name, fontSize, fontColor.getCSSDecRGBAColor(), bgColor.getCSSDecRGBAColor());
            texObj = CanvasTextureTool.GetInstance().addImageToAtlas(btn_name, image);
        }
        //let currBtn: ColorRectImgButton = new ColorRectImgButton();
        currBtn.uvs = texObj.uvs;
        currBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
        currBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
        currBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
        console.log("texObj.getWidth(), texObj.getHeight(): ",texObj.getWidth(), texObj.getHeight());
        currBtn.initialize(0.0, 0.0, texObj.getWidth(), texObj.getHeight(), [texObj.texture]);
        currBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        currBtn.setSize(texObj.getWidth(), texObj.getHeight());
        
        return currBtn;
    }
}
export default UIBarTool;