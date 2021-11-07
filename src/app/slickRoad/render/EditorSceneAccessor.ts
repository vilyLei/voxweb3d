/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRendererScene from "../../../vox/scene/IRendererScene";
import {IRendererSceneAccessor} from "../../../vox/scene/IRendererSceneAccessor";
import RenderProxy from "../../../vox/render/RenderProxy";

class EditorSceneAccessor implements IRendererSceneAccessor{
    constructor(){}

    renderBegin(rendererScene: IRendererScene): void {
        let rproxyy: RenderProxy = rendererScene.getRenderProxy();
        rproxyy.adapter.clearDepth(1.0);
    }
    renderEnd(rendererScene: IRendererScene): void {
    }
}
export {EditorSceneAccessor};
