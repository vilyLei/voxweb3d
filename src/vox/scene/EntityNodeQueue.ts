/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RSEntityFlagT from '../../vox/scene/RSEntityFlag';
import * as IRenderEntityT from "../../vox/render/IRenderEntity";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";

import RSEntityFlag = RSEntityFlagT.vox.scene.RSEntityFlag;
import IRenderEntity = IRenderEntityT.vox.render.IRenderEntity;
import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;

export namespace vox
{
    export namespace scene
    {
        export class EntityNodeQueue
        {
            private m_nodeListLen:number = 0;
            private m_nodeIdList:number[] = [];
            private m_nodeList:Entity3DNode[] = [];
            private m_entityList:IRenderEntity[] = [];
            private m_nodeFlagList:number[] = [];
            private m_freeIdList:number[] = [];
            constructor()
            {
            }
            private getFreeId():number
            {
                if(this.m_freeIdList.length > 0)
                {
                    return this.m_freeIdList.pop();
                }
                return -1; 
            }
            
            private createNode():Entity3DNode
            {
                let index:number = this.getFreeId();
                if(index >= 0)
                {
                    this.m_nodeFlagList[index] = 1;
                    return this.m_nodeList[index];
                }
                else
                {
                    // create a new nodeIndex
                    index = this.m_nodeListLen;
                    let node:Entity3DNode = Entity3DNode.Create();
                    this.m_nodeList.push(node);
                    this.m_entityList.push(null);
                    node.spaceId = index;
                    node.distanceFlag = false;
                    this.m_nodeFlagList.push(1);
                    this.m_nodeIdList.push(index);
                    this.m_nodeFlagList.push(1);
                    this.m_nodeListLen++;
                    return node;
                }
            }
            private restoreId(id:number):void
            {
                if(id > 0 && this.m_nodeFlagList[id] == 1)
                {
                    this.m_freeIdList.push(id);
                    this.m_nodeFlagList[id] = 0;
                    this.m_entityList[id] = null;
                }
            }
            // 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)
            addEntity(entity:IRenderEntity):Entity3DNode
            {
                let node:Entity3DNode = this.createNode();
                this.m_entityList[node.spaceId] = entity;
                node.entity = entity;
                node.distanceFlag = RSEntityFlag.TestSortEnabled(entity.__$rseFlag);
                console.log("Queue node.distanceFlag: ",node.distanceFlag);
                entity.__$rseFlag = RSEntityFlag.AddSpaceUid(entity.__$rseFlag, node.spaceId);
                return node;
            }
            initialize(total:number):void
            {
                if(total > 0)
                {
                    for(let i:number = 0; i < total; i++)
                    {
                        let node:Entity3DNode = this.createNode();
                        this.m_entityList[node.spaceId] = null;
                    }
                }
            }
            getNodeByEntity(entity:IRenderEntity):Entity3DNode
            {
                if(RSEntityFlag.TestSpaceContains(entity.__$rseFlag))
                {
                    let uid:number = RSEntityFlag.GetSpaceUid(entity.__$rseFlag);
                    
                    if(this.m_entityList[uid] == entity)
                    {
                        return this.m_nodeList[uid];
                    }
                }
                return null;
            }
            removeEntity(entity:IRenderEntity):void
            {
                if(RSEntityFlag.TestSpaceContains(entity.__$rseFlag))
                {
                    let uid:number = RSEntityFlag.GetSpaceUid(entity.__$rseFlag);
                    if(this.m_entityList[uid] == entity)
                    {
                        this.m_nodeList[uid].entity = null;
                        this.restoreId(uid);
                        entity.__$rseFlag = RSEntityFlag.RemoveSpaceUid(entity.__$rseFlag);
                    }
                }
            }
            toString():string
            {
                return "[EntityNodeQueue()]";
            }
        }
    }
}