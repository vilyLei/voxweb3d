/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPONodeT from "../../vox/render/RPONode";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RenderShaderT from '../../vox/render/RenderShader';

import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPONode = RPONodeT.vox.render.RPONode;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RenderShader = RenderShaderT.vox.render.RenderShader;

export namespace vox
{
    export namespace render
    {
        export class RenderSortBlock
        {
        	private m_begin:RPONode = null;
            private m_end:RPONode = null;
            private m_next:RPONode = null;
            private m_node:RPONode = null;
            private m_nodes:RPONode[] = [];
            private m_nodesTotal:number = 0;
            private m_shader:RenderShader = null;
			private m_renderTotal:number = 0;
			sortEnabled:boolean = true;
            constructor(shader:RenderShader)
            {
				this.m_shader = shader;
            }
			
            showInfo():void
            {
                let info:string = "";
				let next:RPONode = this.m_begin;
                while(next != null)
                {
                    //info += "("+next.unit.value+","+next.uid+"),";
                    info += next.unit.value+",";
					next = next.next;
                }
                console.log("RenderSortBlock info: \n",info);
				
            }       
        	clear():void
        	{
				if(this.m_shader != null)
				{
					this.m_nodes = [];
					let next:RPONode = this.m_begin;
					let curr:RPONode = null;
					while(next != null)
					{
						curr = next;
						next = next.next;
						curr.prev = null;
						curr.next = null;
					}
					this.m_begin = this.m_end = null;
					this.m_nodesTotal = 0;
					this.m_renderTotal = 0;
					this.sortEnabled = true;
					this.m_shader = null;
				}
        	}
            run(rc:RenderProxy):void
            {
				if(this.sortEnabled)this.sort();
                this.m_shader.resetUniform();
				
				let unit:RPOUnit = null;
				let nodes:RPONode[] = this.m_nodes;
				for(let i:number = 0; i < this.m_renderTotal; ++i)
				{
					unit = nodes[i].unit;
					this.m_shader.bindToGpu(unit.shdUid);
					unit.run(rc);
					if(unit.partTotal < 1)
					{
						unit.drawThis(rc);
					}
					else
					{
						unit.drawPart(rc);
					}
				}
			}
            runLockMaterial(rc:RenderProxy):void
            {
				if(this.sortEnabled)this.sort();
                this.m_shader.resetUniform();
				
				let unit:RPOUnit = null;
				let nodes:RPONode[] = this.m_nodes;
				for(let i:number = 0; i < this.m_renderTotal; ++i)
				{
					unit = nodes[i].unit;
					this.m_shader.bindToGpu(unit.shdUid);
					unit.vro.run();
					unit.runLockMaterial2();
					if(unit.partTotal < 1)
					{
						unit.drawThis(rc);
					}
					else
					{
						unit.drawPart(rc);
					}
				}
			}
            sort():void
            {
				if(this.m_nodesTotal > 0)
				{
					//console.log("this.m_nodesTotal: ",this.m_nodesTotal);
					// 整个sort执行过程放在渲染运行时渲染执行阶段是不妥的,但是目前还没有好办法
					// 理想的情况是运行时不会被复杂计算打断，复杂计算应该再渲染执行之前完成
					let next:RPONode = this.m_begin;					
					if(this.m_nodes.length < this.m_nodesTotal)
					{
						this.m_nodes = new Array( Math.round(this.m_nodesTotal * 1.1) + 1);
					}
					let i:number = 0;					
					while(next != null)
					{
						if(next.drawEnabled && next.unit.drawEnabled)
						{
							this.m_nodes[i] = next;
							++i;
						}
						next = next.next;
					}
					this.m_renderTotal = i;
					this.snsort(0, this.m_renderTotal - 1);					
				}
            }
            private sorting(low:number,high:number):number
            {
                let arr:RPONode[] = this.m_nodes;
                this.m_node = arr[low];                
                while(low < high)
                {
                    while(low < high && arr[high].unit.value >= this.m_node.unit.value)
                    {
                        --high;
                    }
                    arr[low] = arr[high];
                    while(low < high && arr[low].unit.value <= this.m_node.unit.value)
                    {
                        ++low;
                    }
                    arr[high] = arr[low];
                }
                arr[low] = this.m_node;
                return low;
            }
            private snsort(low:number,high:number):void
            {
                if(low < high)
                {
                    let pos:number = this.sorting(low, high);
                    this.snsort(low, pos - 1);
                    this.snsort(pos + 1, high);
                }
            }
            getNodesTotal():number
            {
                return this.m_nodesTotal;
            }
        	getBegin():RPONode
        	{
				this.m_next = this.m_begin;
        		return this.m_begin;
        	}
        	getNext():RPONode
        	{
				if(this.m_next != null)
				{
					this.m_next = this.m_next.next;
				}
        		return this.m_next;
        	}
            isEmpty():boolean
            {
                return this.m_nodesTotal < 1;
				// return this.m_begin == null;
            }
        	addNode(node:RPONode)
        	{
				//console.log("sort add node: ",node);
				if(node.prev == null && node.next == null)
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
					this.m_nodesTotal++;
					//console.log("sort add node,this.m_nodesTotal: ",this.m_nodesTotal);
				}
        	}
        
        	removeNode(node:RPONode):void
        	{
				//console.log("sort remove node: ",node);
				if(node.prev != null || node.next != null || node==this.m_begin)
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
					this.m_nodesTotal--;
					//console.log("sort remove node,this.m_nodesTotal: ",this.m_nodesTotal);
				}
        	}
        }
    }
}