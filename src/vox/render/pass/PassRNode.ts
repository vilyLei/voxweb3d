/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPassProcess from "./IPassProcess";
import { IPassRItem, IPassRNode } from "./IPassRNode";

export default class PassRNode implements IPassRNode {

    protected m_enabled = false;
    protected m_items: IPassRItem[] = [];
    protected m_nodes: IPassRNode[] = [];
    constructor() {
    }
    addItem(item: IPassRItem): IPassRNode {
        if (item) {
            this.m_items.push(item);
        }
        return this;
    }
    addChild(node: IPassRNode): IPassRNode {
        if (node) {
            this.m_nodes.push(node);
        }
        return this;
    }
    run(process: IPassProcess): void {
        if (this.m_enabled) {
            const items = this.m_items;
            for (let i = 0, ln = items.length; i < ln; ++i) {
                items[i].run(process);
            }
            const nodes = this.m_nodes;
            for (let i = 0, ln = nodes.length; i < ln; ++i) {
                nodes[i].run(process);
            }
        }
    }
    enable(): IPassRNode {
        this.m_enabled = true;
        return this;
    }
    disable(): IPassRNode {
        this.m_enabled = false;
        return this;
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }
    destroy(): void {
        if(this.m_items.length > 0) {
            this.m_enabled = false;
            const items = this.m_items;
            for (let i = 0, ln = items.length; i < ln; ++i) {
                items[i].destroy();
            }
            this.m_items = [];
            const nodes = this.m_nodes;
            for (let i = 0, ln = nodes.length; i < ln; ++i) {
                nodes[i].destroy();
            }
            this.m_nodes = []
        };
    }
}

export { IPassRItem, IPassRNode, PassRNode }