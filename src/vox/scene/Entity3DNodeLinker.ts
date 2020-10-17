/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";

import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;

export namespace vox
{
    export namespace scene
    {
        export class Entity3DNodeLinker
        {
        	private m_begin:Entity3DNode = null;
            private m_end:Entity3DNode = null;
            constructor()
            {
            }        
        	destroy():void
        	{
        		this.clear();
        	}
        
        	clear():void
        	{
        		this.m_begin = this.m_end = null;
        	}
        
        	getBegin():Entity3DNode
        	{
        		return this.m_begin;
        	}
            isEmpty():boolean
            {
                return this.m_begin == this.m_end && this.m_end == null;
            }
        	addNode(node:Entity3DNode)
        	{
        		if (this.m_begin == null)
        		{
        			this.m_end = this.m_begin = node;
        		}
        		else
        		{
        			if (this.m_end.prev != null)
        			{
        				this.m_end.next = node;
        				node.prev = this.m_end;
        				this.m_end = node;
        			}
        			else
        			{
        				this.m_begin.next = node;
        				node.prev = this.m_end;
        				this.m_end = node;
        			}
        		}
        		this.m_end.next = null;
        	}
        
        	removeNode(node:Entity3DNode):void
        	{
        		if (node == this.m_begin)
        		{
        			if (node == this.m_end)
        			{
        				this.m_begin = this.m_end = null;
        			}
        			else
        			{
        				this.m_begin = node.next;
        				this.m_begin.prev = null;
        			}
        		}
        		else if (node == this.m_end)
        		{
        			this.m_end = node.prev;
        			this.m_end.next = null;
        		}
        		else
        		{
        			node.next.prev = node.prev;
        			node.prev.next = node.next;
        		}            
        		node.prev = null;
        		node.next = null;
        	}
        }
    }
}