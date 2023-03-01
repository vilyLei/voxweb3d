/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IPassRItem, IPassRNode} from "./IPassRNode";
import PassRNode from "./PassRNode";
import IPassGraph from "./IPassGraph";
import IPassProcess from "./IPassProcess";
export default class PassGraph extends PassRNode implements IPassGraph {

    constructor(){super();}
    
    addItem(item: IPassRItem): IPassGraph {
        if(item) {
            this.m_items.push(item);
        }
        return this;
    }
    addChild(node: IPassRNode): IPassGraph {
        if(node) {
            this.m_nodes.push(node);
        }
        return this;
    }
    run(process: IPassProcess): void {
        if(this.m_enabled) {
            const items = this.m_items;
            // console.log("PassGraph::run() ...items.length: ", items.length);
            for(let i = 0, ln = items.length; i < ln; ++i) {
                items[i].run(process);
            }
            const nodes = this.m_nodes;
            for(let i = 0, ln = nodes.length; i < ln; ++i) {
                nodes[i].run(process);
            }
        }
    }
    
    initialize(): IPassGraph {
        this.m_enabled = true;
        return this;
    }
    destroy(): void {
        super.destroy();
    }
}
export { PassGraph }