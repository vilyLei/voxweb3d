/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IPassRItem, IPassRNode} from "./IPassRNode";
export default interface IPassGraph extends IPassRNode {
    addItem(item: IPassRItem): IPassGraph;
    addChild(node: IPassRNode): IPassGraph;
    initialize(): IPassGraph;
}