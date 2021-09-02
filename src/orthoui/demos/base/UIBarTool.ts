/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../../vox/render/RendererState";
import ColorRectImgButton from "../../../orthoui/button/ColorRectImgButton";
import CanvasTextureTool, { CanvasTextureObject } from "./CanvasTextureTool";
import Color4 from "../../../vox/material/Color4";

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
        let nameBtn: ColorRectImgButton = new ColorRectImgButton();
        nameBtn.uvs = texObj.uvs;
        nameBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
        nameBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
        nameBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
        nameBtn.initialize(0.0, 0.0, texObj.getWidth(), texObj.getHeight(), [texObj.texture]);
        nameBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        nameBtn.setSize(texObj.getWidth(), texObj.getHeight());
        
        return nameBtn;
    }
}
export default UIBarTool;