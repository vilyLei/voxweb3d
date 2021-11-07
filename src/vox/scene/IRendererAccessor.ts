/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../vox/material/Color4";
import IRenderProcess from "../../vox/render/IRenderProcess";
import IRenderEntity from "../../vox/render/IRenderEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import IRenderer from "./IRenderer";

interface vIRendererAccessor {
    renderBegin(renderer: IRenderer): void;
    renderEnd(renderer: IRenderer): void;
}
export {vIRendererAccessor};
