/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IPoolNodeT from "../../vox/utils/IPoolNode";
import * as PoolNodeBuilderT from "../../vox/utils/PoolNodeBuilder";
import * as RPONodeT from "../../vox/render/RPONode";

import IPoolNode = IPoolNodeT.vox.utils.IPoolNode;
import PoolNodeBuilder = PoolNodeBuilderT.vox.utils.PoolNodeBuilder;
import RPONode = RPONodeT.vox.render.RPONode;

export namespace vox
{
    export namespace render
    {
        /*
         * render process object node pool management
         */
        export class RPONodeBuilder extends PoolNodeBuilder
        {
            protected createNode():IPoolNode
            {
                return new RPONode();
            }
        }
    }
}