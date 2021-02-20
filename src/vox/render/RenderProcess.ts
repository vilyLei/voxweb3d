/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// RenderProcess 实例实际上可以被外部功能块直接使用,以便实现具体渲染目的
// 只能在 RenderWorld 中创建

import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as MaterialShaderT from '../../vox/material/MaterialShader';
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPONodeT from "../../vox/render/RPONode";
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RPONodeBuilderT from "../../vox/render/RPONodeBuilder";
import * as RPOBlockT from "../../vox/render/RPOBlock";

import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import MaterialShader = MaterialShaderT.vox.material.MaterialShader;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPONode = RPONodeT.vox.render.RPONode;

import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RPONodeBuilder = RPONodeBuilderT.vox.render.RPONodeBuilder;
import RPOBlock = RPOBlockT.vox.render.RPOBlock;

export namespace vox
{
    export namespace render
    {
        export class RenderProcess
        {
            private static s_max_shdTotal:number = 1024;
            // 记录自身所在的 RenderWorld 的id
            private m_wuid:number = -1;
            // 记录自身所在RenderWorld 中分配到的id -> index
            private m_weid:number = -1;
            
            private m_nodes:RPONode[] = [];
            private m_nodesLen:number = 0;
            private m_enabled:boolean = true;
            private m_blockList:RPOBlock[] = [];                                // 记录以相同shader的node为一个集合对象(RPOBlock) 的数组
            private m_blockListLen:number = 0;
            private m_blockFList:Int8Array = new Int8Array(RenderProcess.s_max_shdTotal);               // 记录以相同shader的node为一个集合对象(RPOBlock)的构建状态 的数组
            private m_blockFListLen:number = RenderProcess.s_max_shdTotal;                              // 假定shader 最多为1024种
            private m_shader:MaterialShader = null;
            // 用于特殊绘制
            private m_proBlock:RPOBlock = null;//new RPOBlock();

            private m_batchEnabled:boolean = true;
            private m_fixedState:boolean = true;
            private m_uid:number = -1;

            index:number = -1;
            rpoNodeBuilder:RPONodeBuilder = null;
            
            constructor(shader:MaterialShader, batchEnabled:boolean,processFixedState:boolean)
            {
                this.m_shader = shader;
                this.m_proBlock = new RPOBlock(shader);
                this.m_batchEnabled = batchEnabled;
                this.m_fixedState = processFixedState;
                for(let k:number = 0; k < this.m_blockFListLen; ++k)
                {
                    this.m_blockFList[k] = -1;
                }
            }
            setRenderParam(batchEnabled:boolean,processFixedState:boolean):void
            {
                if(this.m_blockListLen < 1)
                {
                    this.m_batchEnabled = batchEnabled;
                    this.m_fixedState = processFixedState;
                }
                /*
                let block:RPOBlock = null;
                for(let i:number = 0; i < this.m_blockListLen; ++i)
                {
                    block = this.m_blockList[i];
                    block.batchEnabled = this.m_batchEnabled;
                    block.fixedState = this.m_fixedState;
                    if(block.batchEnabled)
                    {
                        if(block.fixedState)
                        {
                            block.runMode = 2;
                        }
                        else
                        {
                            block.runMode = 1;
                        }
                    }
                    else
                    {
                        block.runMode = 0;
                    }
                }
                //*/
            }
            setWOrldParam(pwuid:number,pweid:number):void
            {
                this.m_wuid = pwuid;
                this.m_uid = this.m_weid = pweid;
            }
            getWUid():number
            {
                return this.m_wuid;
            }
            getWEid():number
            {
                return this.m_weid;
            }
            getUnitsTotal():number
            {
                return this.m_nodesLen;
            }
            private addNodeToBlock(node:RPONode):void
            {
                //  注意，这里可以管理组合方式, 例如可以做更多条件的排序
                //  这里依赖的是 shader program 和 vtx uid 来分类
                let block:RPOBlock = null;
                //console.log("RenderProcess::addDisp(),uid: "+this.m_uid+" node.shdUid: "+node.shdUid+", index: "+this.index);
                if(node.shdUid >= RenderProcess.s_max_shdTotal)
                {
                    console.error("Error: Shader uid >= "+RenderProcess.s_max_shdTotal);
                }
                if(this.m_blockFList[node.shdUid] < 0)
                {
                    block = new RPOBlock(this.m_shader);
                    block.rpoNodeBuilder = this.rpoNodeBuilder;
                    block.batchEnabled = this.m_batchEnabled;
                    block.fixedState = this.m_fixedState;
                    if(block.batchEnabled)
                    {
                        if(block.fixedState)
                        {
                            block.runMode = 2;
                        }
                        else
                        {
                            block.runMode = 1;
                        }
                    }
                    else
                    {
                        block.runMode = 0;
                    }
                    block.shdUid = node.shdUid;
                    block.index = this.m_blockListLen;
                    block.procuid = this.m_uid;
                    this.m_blockList.push(block);
                    this.m_blockFList[node.shdUid] = this.m_blockListLen;
                    ++this.m_blockListLen;
                    //console.log("RenderProcess::addDisp(), create a new RPOBlock instance: "+block);
                }
                else
                {
                    //console.log("RenderProcess::addDisp(), use old RPOBlock instance, m_blockFList["+node.shdUid+"]: "+this.m_blockFList[node.shdUid]);
                    block = this.m_blockList[this.m_blockFList[node.shdUid]];
                }
                node.index = block.index;
                block.addNode(node);
            }
            rejoinRunitForTro(runit:RPOUnit):void
            {
                let node:RPONode = this.rpoNodeBuilder.getNodeByUid(runit.__$rpuid) as RPONode;
                node.tro = runit.tro;
                node.texMid = node.unit.texMid;
                this.m_blockList[node.index].rejoinNodeForTro(node);
            }
            addDisp(rc:RenderProxy, disp:IRODisplay,deferred:boolean = true):void
            {
                if(disp != null)
                {
                    if(disp.__$ruid > -1)
                    {
                        if(RPOUnitBuilder.TestRPNodeNotExists(disp.__$ruid,this.m_uid))
                        {
                            let node:RPONode = this.rpoNodeBuilder.create() as RPONode;
                            node.unit = RPOUnitBuilder.GetNodeByUid( disp.__$ruid );
                            node.unit.shader = this.m_shader;
                            node.unit.__$rprouid = this.index;
                            
                            if(disp.getPartGroup() != null)
                            {
                                node.unit.partGroup = disp.getPartGroup().slice(0);
                                node.unit.partTotal = node.unit.partGroup.length;
                                let fs:Uint16Array = node.unit.partGroup;
                                for(let i:number = 0, len:number = node.unit.partTotal; i < len;)
                                {
                                    i++;
                                    fs[i++] *= node.unit.ibufStep;
                                }
                            }
                            
                            disp.__$rpuid = node.uid;
                            node.__$ruid = disp.__$ruid;
                            node.unit.__$rpuid = node.uid;
                            node.updateData();
                            //this.m_nodes.push( node );
                            ++this.m_nodesLen;
                            
                            RPOUnitBuilder.SetRPNodeParam(disp.__$ruid, this.m_uid, node.uid);
                            
                            this.addNodeToBlock(node);
                        }
                        else
                        {
                            console.log("RenderProcess::addDisp(), Warn: add entity repeat in processid("+this.m_uid+").");
                        }
                    }
                }
            }
            updateDispMateiral(disp:IRODisplay):void
            {
                if(disp.__$ruid > -1)
                {
                    let nodeUId:number = RPOUnitBuilder.GetRPONodeUid(disp.__$ruid,this.m_uid);
                    let node:RPONode = this.rpoNodeBuilder.getNodeByUid( nodeUId ) as RPONode;
                    // material info etc.
                    node.shdUid = node.unit.shdUid;
                    node.texMid = node.unit.texMid;
                    node.tro = node.unit.tro;
                    let block:RPOBlock = this.m_blockList[node.index];
                    block.removeNode(node);
                    this.addNodeToBlock(node);
                }
            }
            removeDisp(disp:IRODisplay):void
            {
                if(disp != null)
                {
                    if(disp.__$ruid > -1)
                    {
                        let nodeUId:number = RPOUnitBuilder.GetRPONodeUid(disp.__$ruid,this.m_uid);
                        let node:RPONode = this.rpoNodeBuilder.getNodeByUid( nodeUId ) as RPONode;
                        //console.log("removeDisp(), node != null: "+(node != null));
                        if(node != null)
                        {
                            let block:RPOBlock = this.m_blockList[node.index];
                            block.removeNode(node);
                            RPOUnitBuilder.SetRPNodeParam(disp.__$ruid, this.m_uid, -1);
                            
                            --this.m_nodesLen;

                            let runit:RPOUnit = node.unit;
                            if(this.rpoNodeBuilder.restore(node))
                            {
                                RPOUnitBuilder.Restore(runit);
                            }

                            disp.__$ruid = -1;
                            if(block.isEmpty())
                            {
                                
                            }
                        }
                    }
                }
            }
            run(rc:RenderProxy):void
            {
                if(this.m_enabled && this.m_nodesLen > 0)
                {
                    if(this.m_shader.isUnLocked())
                    {
                        for(let i:number = 0; i < this.m_blockListLen; ++i)
                        {
                            this.m_blockList[i].run(rc);
                        }
                    }
                    else
                    {
                        for(let i:number = 0; i < this.m_blockListLen; ++i)
                        {
                            this.m_blockList[i].runLockMaterial(rc);
                        }
                    }
                }
            }

            drawLockMaterialByDisp(rc:RenderProxy,disp:IRODisplay,forceUpdateUniform:boolean):void
            {
                if(disp != null)
                {
                    let unit:RPOUnit = RPOUnitBuilder.GetNodeByUid( disp.__$ruid );
                    if(unit != null)
                    {
                        this.m_proBlock.drawLockMaterialByUnit(rc,unit,disp,forceUpdateUniform);
                    }
                }
            }
            reset():void
            {
                this.m_nodesLen = 0;
                this.index = -1;
                this.m_uid = -1;
                this.m_wuid = -1;
                this.m_weid = -1;
                let i:number = 0;
                for(; i < this.m_blockListLen; ++i)
                {
                    this.m_blockList[i].reset();
                }
                this.m_blockListLen = 0;
                this.m_blockList = [];
            }
            
            showInfo():void
            {
                let i:number = 0;
                for(; i < this.m_blockListLen; ++i)
                {
                    this.m_blockList[i].showInfo();
                }
            }
            destroy():void
            {
                this.reset();
            }
            setEnabled(boo:boolean):void
            {
                this.m_enabled = boo;
            }
            getEnabled():boolean
            {
                return this.m_enabled;
            }
            toString():string
            {
                return "[RenderProcess(uid = "+this.m_uid+")]";
            }
        }
    }
}