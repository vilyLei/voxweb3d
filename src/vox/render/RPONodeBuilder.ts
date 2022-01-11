/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPoolNode from "../../vox/base/IPoolNode";
import PoolNodeBuilder from "../../vox/base/PoolNodeBuilder";
import RPONode from "../../vox/render/RPONode";


/*
 * render process object node pool management
 */
export default class RPONodeBuilder extends PoolNodeBuilder {
    protected createNode(): IPoolNode {
        return new RPONode();
    }
}