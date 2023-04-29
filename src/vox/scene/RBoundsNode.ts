/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import AABB from "../../vox/geom/AABB";

export default class RBoundsNode
{
    uid:number = -1;
    rstatus:number = 0;
    bounds:AABB = null;
    prev:RBoundsNode = null;
    next:RBoundsNode = null;
    reset():void
    {
        this.uid = -1;
        this.rstatus = 0;
        this.prev = null;
        this.next = null;
        this.bounds = null;
    }

    private static s_FLAG_BUSY:number = 1;
    private static s_FLAG_FREE:number = 0;

    private static m_nodeListLen:number = 0;
    private static m_nodeList:RBoundsNode[] = [];
    private static m_nodeFlagList:number[] = [];
    private static m_freeIdList:number[] = [];
    //private static m_camVisiList:number[] = [];
    
    static GetFreeId():number
    {
        if(RBoundsNode.m_freeIdList.length > 0)
        {
            return RBoundsNode.m_freeIdList.pop();
        }
        return -1; 
    }

    static GetByUid(uid:number):RBoundsNode
    {
        if(uid > -1 && uid < RBoundsNode.m_nodeListLen)
        {
            return RBoundsNode.m_nodeList[uid];
        }
        return null;
    }
    static Create():RBoundsNode
    {
        let node:RBoundsNode = null;
        let index:number = RBoundsNode.GetFreeId();
        if(index >= 0)
        {
            node = RBoundsNode.m_nodeList[index];
            node.uid = index;
            RBoundsNode.m_nodeFlagList[index] = RBoundsNode.s_FLAG_BUSY;
        }
        else
        {
            // create a new nodeIndex
            node = new RBoundsNode();
            RBoundsNode.m_nodeList.push( node );
            //RBoundsNode.m_camVisiList.push(0);
            RBoundsNode.m_nodeFlagList.push(RBoundsNode.s_FLAG_BUSY);
            node.uid = RBoundsNode.m_nodeListLen;
            RBoundsNode.m_nodeListLen++;
        }
        return node;
    }
    static Restore(pnode:RBoundsNode):void
    {
        if(pnode != null && pnode.uid >= 0 && RBoundsNode.m_nodeFlagList[pnode.uid] == RBoundsNode.s_FLAG_BUSY)
        {
            RBoundsNode.m_freeIdList.push(pnode.uid);
            RBoundsNode.m_nodeFlagList[pnode.uid] = RBoundsNode.s_FLAG_FREE;
            pnode.reset();
        }
    }
}