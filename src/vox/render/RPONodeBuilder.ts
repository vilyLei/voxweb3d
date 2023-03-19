/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPoolNode from "../../vox/base/IPoolNode";
import PoolNodeBuilder from "../../vox/base/PoolNodeBuilder";
import IRPONode from "../../vox/render/IRPONode";
import IRPOUnit from "../../vox/render/IRPOUnit";
import RPOUnit from "../../vox/render/RPOUnit";
import RPONode from "../../vox/render/RPONode";
import IRPONodeBuilder from "../../vox/render/IRPONodeBuilder";


/*
 * render process object node pool management
 */
export default class RPONodeBuilder extends PoolNodeBuilder implements IRPONodeBuilder {
    protected createNode(): IPoolNode {
        return new RPONode();
    }
	createRPONode(): IRPONode {
        return new RPONode();
    }
	createRPOUnit(): IRPOUnit {
        return new RPOUnit();
    }
}
