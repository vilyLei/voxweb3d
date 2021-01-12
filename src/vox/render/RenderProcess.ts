/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// RenderProcess 实例实际上可以被外部功能块直接使用,以便实现具体渲染目的
// 只能在 RenderWorld 中创建

import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as MaterialProgramT from "../../vox/material/MaterialProgram";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPOUnitBuiderT from "../../vox/render/RPOUnitBuider";
import * as RPONodeBuiderT from "../../vox/render/RPONodeBuider";
import * as RPOBlockT from "../../vox/render/RPOBlock";

import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import MaterialProgram = MaterialProgramT.vox.material.MaterialProgram;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;

import RPOUnitBuider = RPOUnitBuiderT.vox.render.RPOUnitBuider;
import RPONode = RPONodeBuiderT.vox.render.RPONode;
import RPONodeBuider = RPONodeBuiderT.vox.render.RPONodeBuider;
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
        
            private m_uid:number = -1;
            index:number = -1;
            private m_batchEnabled:boolean = true;
            private m_fixedState:boolean = true;
            constructor(batchEnabled:boolean,processFixedState:boolean)
            {
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
                    block = new RPOBlock();
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
            addDisp(rc:RenderProxy, disp:IRODisplay,deferred:boolean = true):void
            {
                if(disp != null)
                {
                    if(disp.__$ruid > -1)
                    {
                        if(RPOUnitBuider.TestRPNodeNotExists(disp.__$ruid,this.m_uid))
                        {
                            let node:RPONode = RPONodeBuider.Create();
                            node.unit = RPOUnitBuider.GetRPOUnit( disp.__$ruid );
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
                            //node.disp = disp;
                            disp.__$rpuid = node.uid;
                            node.__$ruid = disp.__$ruid;
                            node.updateData();
                            //this.m_nodes.push( node );
                            ++this.m_nodesLen;
                            //
                            RPOUnitBuider.SetRPNodeParam(disp.__$ruid, this.m_uid, node.uid);
                            //
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
                    let nodeUId:number = RPOUnitBuider.GetRPONodeUid(disp.__$ruid,this.m_uid);
                    let node:RPONode = RPONodeBuider.GetNodeByUid( nodeUId );
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
                        let nodeUId:number = RPOUnitBuider.GetRPONodeUid(disp.__$ruid,this.m_uid);
                        let node:RPONode = RPONodeBuider.GetNodeByUid( nodeUId );
                        //console.log("removeDisp(), node != null: "+(node != null));
                        if(node != null)
                        {
                            let block:RPOBlock = this.m_blockList[node.index];
                            block.removeNode(node);
                            RPOUnitBuider.SetRPNodeParam(disp.__$ruid, this.m_uid, -1);
                            //this.m_nodes.splice(node.index, 1);
                            --this.m_nodesLen;
                            RPONodeBuider.Restore(node);
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
                    if(MaterialProgram.IsUnLocked())
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
            // 用于特殊绘制
            private m_proBlock:RPOBlock = new RPOBlock();
            drawLockMaterialByDisp(rc:RenderProxy,disp:IRODisplay,forceUpdateUniform:boolean):void
            {
                if(disp != null)
                {
                    let unit:RPOUnit = RPOUnitBuider.GetRPOUnit( disp.__$ruid );
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
                //  let node:RPONode = null;
                //  for(i = 0; i < this.m_nodesLen; ++i)
                //  {
                //      node = this.m_nodes.pop();
                //      RPOUnitBuider.SetRPNodeParam(node.disp.__$ruid, this.m_uid, -1);
                //      node.reset();
                //      RPONodeBuider.Restore(node);
                //  }
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