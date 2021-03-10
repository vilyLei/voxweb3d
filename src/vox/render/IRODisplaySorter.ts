/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRPODisplayT from "../../vox/render/IRPODisplay";

import IRPODisplay = IRPODisplayT.vox.render.IRPODisplay;

export namespace vox
{
    export namespace render
    {
        /**
         * 在 renderer process 中 对可渲染对象渲染先后顺序的排序
         */
        export interface IRODisplaySorter
        {
            sortRODisplay(nodes:IRPODisplay[], nodesTotal:number):number;
        }
    }
}