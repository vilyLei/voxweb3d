/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IPassRItem, IPassRNode} from "./IPassRNode";

export default class PassRNode {

    private m_enabled = false;
    private m_items: IPassRItem[] = [];
    private m_nodes: IPassRNode[] = [];
    constructor() {
    }
    addItem(item: IPassRItem): void {
        if(item) {
            this.m_items.push(item);
        }
    }
    addChild(node: IPassRNode): void {
        if(node) {
            this.m_nodes.push(node);
        }
    }
    run(func: () => void): void {
        if(this.m_enabled) {
            const items = this.m_items;
            for(let i = 0, ln = items.length; i < ln; ++i) {
                items[i].run(func);
            }
            const nodes = this.m_nodes;
            for(let i = 0, ln = nodes.length; i < ln; ++i) {
                nodes[i].run(func);
            }
        }
    }
    
    isEnabled(): boolean {
        return this.m_enabled;
    }
    destroy(): void {

    }
}

export {IPassRItem, IPassRNode, PassRNode}