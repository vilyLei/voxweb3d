/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MouseEvent from "../../vox/event/MouseEvent";
import RendererState from "../../vox/render/RendererState";
import IRendererScene from "../../vox/scene/IRendererScene";
import ColorRectImgButton from "../../orthoui/button/ColorRectImgButton";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import CanvasTextureTool, { CanvasTextureObject } from "../assets/CanvasTextureTool";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import SelectionEvent from "../../vox/event/SelectionEvent";
import Vector3D from "../../vox/math/Vector3D";
import UIBarTool from "./UIBarTool";
import Color4 from "../../vox/material/Color4";
import AABB2D from "../../vox/geom/AABB2D";

export class SelectionBarStyle {

    readonly fontColor = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly fontBgColor = new Color4(1.0, 1.0, 1.0, 0.3);
    alignType = "";
    alignPosValue = 0;
    distance = 2;
    nameVisible = true;
    bodyVisible = true;
    constructor() { }

    destroy(): void {
    }
}
export default SelectionBarStyle;
