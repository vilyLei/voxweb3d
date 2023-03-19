/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPODisplay from "../../vox/render/IRPODisplay";
import IPoolNode from "../../vox/base/IPoolNode";
import IVertexRenderObj from "../../vox/render/IVertexRenderObj";
import ITextureRenderObj from "../../vox/render/ITextureRenderObj";
import IRenderProxy from "./IRenderProxy";
import IRenderShader from "./IRenderShader";
import IRenderEntity from "./IRenderEntity";
export default interface IRPOUnit extends IPoolNode, IRPODisplay {
    
    renderState: number;
    rcolorMask: number;
    drawing: boolean;

    shader: IRenderShader;
    vro: IVertexRenderObj;
    tro: ITextureRenderObj;
    rentity: IRenderEntity;
    /**
     * 是否在渲染过程中可见, the default value is true
     */
    visible: boolean;
    /**
     * @param force the default value is false
     */
    applyShader(force?: boolean): void;
    copyMaterialFrom(unit: IRPOUnit): void;
    run2(rc: IRenderProxy): void;
    draw(rc: IRenderProxy): void;
}
