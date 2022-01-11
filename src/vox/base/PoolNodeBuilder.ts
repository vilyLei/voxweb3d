/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPoolNode from "../../vox/base/IPoolNode";

export default class PoolNodeBuilder {
    private static S_BUSY: number = 1;
    private static S_FREE: number = 0;

    private m_nodesTotal: number = 0;
    private m_nodes: IPoolNode[] = [];
    private m_flags: number[] = [];

    private m_freeIdList: number[] = [];
    /**
     * the sub class override this function, for real implement.
     */
    protected createNode(): IPoolNode {
        return null;
    }
    /**
     * the sub class override this function, for real implement.
     */
    protected restoreUid(uid: number): void {
    }
    getFreeId() {
        if (this.m_freeIdList.length > 0) {
            return this.m_freeIdList.pop();
        }
        return -1;
    }
    getNodeByUid(uid: number): IPoolNode {
        return this.m_nodes[uid];
    }
    create(): IPoolNode {
        let node: IPoolNode = null;
        let index: number = this.getFreeId();
        if (index >= 0) {
            node = this.m_nodes[index];
            node.uid = index;
            this.m_flags[index] = PoolNodeBuilder.S_BUSY;
        }
        else {
            // create a new nodeIndex
            node = this.createNode();
            this.m_nodes.push(node);
            this.m_flags.push(PoolNodeBuilder.S_BUSY);
            node.uid = this.m_nodesTotal;
            this.m_nodesTotal++;
        }
        return node;
    }
    restore(pnode: IPoolNode): boolean {
        if (pnode != null && pnode.uid >= 0 && this.m_flags[pnode.uid] == PoolNodeBuilder.S_BUSY) {
            this.restoreUid(pnode.uid);
            this.m_freeIdList.push(pnode.uid);
            this.m_flags[pnode.uid] = PoolNodeBuilder.S_FREE;
            pnode.reset();
            return true;
        }
        return false;
    }
    restoreByUid(uid: number): boolean {
        if (uid >= 0 && uid < this.m_nodesTotal && this.m_flags[uid] == PoolNodeBuilder.S_BUSY) {
            this.restoreUid(uid);
            this.m_freeIdList.push(uid);
            this.m_flags[uid] = PoolNodeBuilder.S_FREE;
            this.m_nodes[uid].reset();
            return true;
        }
        return false;
    }
}