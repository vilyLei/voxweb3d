/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IPassRItem, IPassRNode} from "./IPassRNode";
import DefaultPassRItem from "./DefaultPassRItem";
import PassRNode from "./PassRNode";
import PassGraph from "./PassGraph";
export default class DefaultPassGraph extends PassGraph {

    constructor(){
        super();
    }
    createItem(): IPassRItem {
        return new DefaultPassRItem();
    }
    createNode(): IPassRNode {
        return new PassRNode();
    }
    initialize(): DefaultPassGraph {
        this.m_enabled = true;
        return this;
    }
    destroy(): void {
        super.destroy();
    }
}
export { PassGraph }