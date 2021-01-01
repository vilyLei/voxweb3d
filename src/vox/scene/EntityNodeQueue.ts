/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderEntityT from "../../vox/entity/IRenderEntity";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";
import IRenderEntity = IRenderEntityT.vox.entity.IRenderEntity;
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
                let index:number = this.getFreeId();//Entity3DNode.GetFreeId();
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
                    this.m_nodeFlagList.push(1);
                    this.m_nodeIdList.push(index);
                    this.m_nodeFlagList.push(1);
                    this.m_nodeListLen++;
                    return node;
                }
            }
            private restoreId(id:number):void
            {
                if(id >= 0 && this.m_nodeFlagList[id] == 1)
                {
                    //Entity3DNode.Restore(this.m_nodeList[id]);
                    this.m_freeIdList.push(id);
                    this.m_nodeFlagList[id] = 0;
                    this.m_entityList[id] = null;
                }
            }
            // 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)
            addEntity(entity:IRenderEntity):Entity3DNode
            {
                if(entity.__$spaceId < 0)
                {
                    let node:Entity3DNode = this.createNode();
                    this.m_entityList[node.spaceId] = entity;
                    node.entity = entity;
                    entity.__$spaceId = node.spaceId;
                    return node;                        
                }
            }
            getNodeByEntity(entity:IRenderEntity):Entity3DNode
            {
                if(entity.__$spaceId > -1 && this.m_entityList[entity.__$spaceId] == entity)
                {
                    return this.m_nodeList[entity.__$spaceId];
                }
                return null;
            }
            removeEntity(entity:IRenderEntity):void
            {
                if(entity.__$spaceId > -1 && this.m_entityList[entity.__$spaceId] == entity)
                {
                    this.m_nodeList[entity.__$spaceId].entity = null;                    
                    this.restoreId(entity.__$spaceId);
                    entity.__$spaceId = -1;                    
                }
            }
            toString():string
            {
                return "[EntityNodeQueue()]";
            }
        }
    }
}