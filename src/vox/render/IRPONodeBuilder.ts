/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRPONode from "../../vox/render/IRPONode";
import IRPOUnit from "../../vox/render/IRPOUnit";

import IPoolNodeBuilder from "../../vox/base/IPoolNodeBuilder";

/*
 * render process object node pool management
 */
export default interface IRPONodeBuilder extends IPoolNodeBuilder {
    createRPONode(): IRPONode;
    createRPOUnit(): IRPOUnit;
}
