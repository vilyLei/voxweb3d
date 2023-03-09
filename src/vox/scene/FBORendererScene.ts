/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRendererInstance from "../../vox/scene/IRendererInstance";
import IRendererScene from "../../vox/scene/IRendererScene";
import FBOInstance from "./FBOInstance";
import RendererSubScene from "./RendererSubScene";

export default class FBORendererScene extends RendererSubScene {
    private m_fboIns: FBOInstance = null;
    constructor(parent: IRendererScene, renderer: IRendererInstance, evtFlowEnabled: boolean) {
        super(parent, renderer, evtFlowEnabled);
    }
}