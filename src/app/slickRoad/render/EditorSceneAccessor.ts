/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRendererScene from "../../../vox/scene/IRendererScene";
import {IRendererSceneAccessor} from "../../../vox/scene/IRendererSceneAccessor";
import IRenderProxy from "../../../vox/render/IRenderProxy";

class EditorSceneAccessor implements IRendererSceneAccessor{
    constructor(){}

    renderBegin(rendererScene: IRendererScene): void {
        let rproxyy: IRenderProxy = rendererScene.getRenderProxy();
        rproxyy.clearDepth(1.0);
    }
    renderEnd(rendererScene: IRendererScene): void {
    }
}
export {EditorSceneAccessor};
