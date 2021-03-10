/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// RenderProcess 实例实际上可以被外部功能块直接使用,以便实现具体渲染目的
// 只能在 RenderWorld 中创建

import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as RenderShaderT from '../../vox/render/RenderShader';
import * as RenderProxyT from "../../vox/render/RenderProxy";

import * as IPoolNodeT from "../../vox/utils/IPoolNode";
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPONodeT from "../../vox/render/RPONode";
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RPONodeBuilderT from "../../vox/render/RPONodeBuilder";
import * as ROVertexResourceT from "../../vox/render/ROVertexResource";
import * as RPOBlockT from "../../vox/render/RPOBlock";
import * as RenderSortBlockT from "../../vox/render/RenderSortBlock";
import * as IRenderProcessT from "../../vox/render/IRenderProcess";

import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import RenderShader = RenderShaderT.vox.render.RenderShader;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

import IPoolNode = IPoolNodeT.vox.utils.IPoolNode;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPONode = RPONodeT.vox.render.RPONode;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RPONodeBuilder = RPONodeBuilderT.vox.render.RPONodeBuilder;
import ROVertexResource = ROVertexResourceT.vox.render.ROVertexResource;
import RenderSortBlock = RenderSortBlockT.vox.render.RenderSortBlock;
import RPOBlock = RPOBlockT.vox.render.RPOBlock;
import IRenderProcess = IRenderProcessT.vox.render.IRenderProcess;

export namespace vox
{
    export namespace render
    {
        export class RenderProcess implements IRenderProcess,IPoolNode
        {
            private static s_max_shdTotal:number = 1024;
            // 记录自身所在的 rendererInstance id
            private m_rcuid:number = -1;
            // 记录自身所在 rendererInstance 中分配到的process index
            private m_rpIndex:number = -1;
            private m_rc:RenderProxy;

            private m_nodesLen:number = 0;
            private m_enabled:boolean = true;
            private m_blockList:RPOBlock[] = [];                                                        // 记录以相同shader的node为一个集合对象(RPOBlock) 的数组
            private m_blockListLen:number = 0;
            private m_blockFList:Int8Array = new Int8Array(RenderProcess.s_max_shdTotal);               // 记录以相同shader的node为一个集合对象(RPOBlock)的构建状态 的数组
            private m_blockFListLen:number = RenderProcess.s_max_shdTotal;                              // 假定引擎中同时存在的最多的shader 有1024种
            private m_shader:RenderShader = null;
            private m_rpoNodeBuilder:RPONodeBuilder = null;
            private m_rpoUnitBuilder:RPOUnitBuilder = null;
            private m_vtxResource:ROVertexResource = null;
            // 用于制定对象的绘制
            private m_fixBlock:RPOBlock = null;
            private m_sortBlock:RenderSortBlock = null;

            private m_batchEnabled:boolean = true;
            private m_fixedState:boolean = true;
            private m_sortEnabled:boolean = false;
            
            uid:number = -1;
            constructor(shader:RenderShader,rpoNodeBuilder:RPONodeBuilder,rpoUnitBuilder:RPOUnitBuilder,vtxResource:ROVertexResource, batchEnabled:boolean,processFixedState:boolean)
            {
                this.m_shader = shader;
                this.m_rpoNodeBuilder = rpoNodeBuilder;
                this.m_rpoUnitBuilder = rpoUnitBuilder;
                this.m_vtxResource = vtxResource;
                this.m_fixBlock = this.createBlock();

                this.m_batchEnabled = batchEnabled;
                this.m_fixedState = processFixedState;
                for(let k:number = 0; k < this.m_blockFListLen; ++k)
                {
                    this.m_blockFList[k] = -1;
                }
            }
            private createBlock():RPOBlock
            {
                let block:RPOBlock = new RPOBlock(this.m_shader);
                block.rpoNodeBuilder = this.m_rpoNodeBuilder;
                block.rpoUnitBuilder = this.m_rpoUnitBuilder;
                block.vtxResource = this.m_vtxResource;
                return block;
            }
            setRenderParam(batchEnabled:boolean,processFixedState:boolean):void
            {
                if(this.m_blockListLen < 1)
                {
                    this.m_batchEnabled = batchEnabled;
                    this.m_fixedState = processFixedState;
                }
            }
            setRendererParam(rc:RenderProxy, rpIndex:number):void
            {
                this.m_rc = rc;
                this.m_rcuid = rc.getRCUid();
                this.m_rpIndex = rpIndex;
            }
            getUid():number
            {
                return this.uid;
            }
            getRCUid():number
            {
                return this.m_rcuid;
            }
            getRPIndex():number
            {
                return this.m_rpIndex;
            }
            setSortEnabled(sortEnabled:boolean):void
            {
                if(this.m_nodesLen < 1)
                {
                    this.m_sortEnabled = sortEnabled;
                }
                else if(this.m_sortBlock != null)
                {
                    this.m_sortBlock.sortEnabled = sortEnabled;
                }
            }
            getSortEnabled():boolean
            {
                return this.m_sortEnabled;
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
                //console.log("RenderProcess::addDisp(),uid: "+this.m_rpIndex+" node.shdUid: "+node.shdUid+", index: "+this.uid);
                if(node.shdUid >= RenderProcess.s_max_shdTotal)
                {
                    throw Error("Shader uid >= "+RenderProcess.s_max_shdTotal);
                }
                if(this.m_blockFList[node.shdUid] < 0)
                {
                    block = this.createBlock();
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
                    block.procuid = this.m_rpIndex;
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
                let node:RPONode = this.m_rpoNodeBuilder.getNodeByUid(runit.__$rpuid) as RPONode;
                if(node != null)
                {
                    node.tro = runit.tro;
                    node.texMid = node.unit.texMid;
                    this.m_blockList[node.index].rejoinNode(node);
                }
            }
            rejoinRunitForVro(runit:RPOUnit):void
            {
                let node:RPONode = this.m_rpoNodeBuilder.getNodeByUid(runit.__$rpuid) as RPONode;
                if(node != null)
                {
                    node.drawMode = runit.drawMode;
                    node.ivsIndex = runit.ivsIndex;
                    node.ivsCount = runit.ivsCount;
                    node.insCount = runit.insCount;
                    runit.drawOffset = runit.ivsIndex * runit.ibufStep;
                    node.vtxUid = runit.vtxUid;
                    node.vro = runit.vro;
                    this.m_blockList[node.index].rejoinNode(node);
                }
            }
            addDisp(disp:IRODisplay):void
            {
                if(disp != null)
                {
                    if(disp.__$$runit != null && disp.__$$runit.getRPROUid() < 0)
                    {
                        //if(this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid,this.m_rpIndex))
                        if(disp.__$$runit.getRPROUid() != this.uid)
                        {
                            let node:RPONode = this.m_rpoNodeBuilder.create() as RPONode;
                            node.unit = this.m_rpoUnitBuilder.getNodeByUid( disp.__$ruid ) as RPOUnit;
                            node.unit.shader = this.m_shader;
                            node.unit.__$rprouid = this.uid;
                            
                            disp.__$rpuid = node.uid;
                            node.__$ruid = disp.__$ruid;
                            node.unit.__$rpuid = node.uid;
                            node.updateData();
                            
                            ++this.m_nodesLen;
                            
                            this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.m_rpIndex, node.uid);
                            if(this.m_sortEnabled)
                            {
                                console.log("sort process add a disp...");
                                if(this.m_sortBlock != null)
                                {
                                    this.m_sortBlock.addNode(node);
                                }
                                else
                                {
                                    this.m_sortBlock = new RenderSortBlock(this.m_shader);
                                    this.m_sortBlock.addNode(node);
                                }
                            }
                            else
                            {
                                this.addNodeToBlock(node);
                            }
                        }
                        else
                        {
                            console.log("RenderProcess::addDisp(), Warn: add entity repeat in processid("+this.m_rpIndex+").");
                        }
                    }
                }
            }
            updateDispMateiral(disp:IRODisplay):void
            {
                if(disp.__$$runit != null)
                {
                    let nodeUId:number = disp.__$$runit.getRPOUid();
                    let node:RPONode = this.m_rpoNodeBuilder.getNodeByUid( nodeUId ) as RPONode;
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
                    if(disp.__$$runit != null)
                    {
                        let nodeUId:number = disp.__$$runit.getRPOUid();
                        let node:RPONode = this.m_rpoNodeBuilder.getNodeByUid( nodeUId ) as RPONode;
                        //console.log("removeDisp(), node != null: "+(node != null));
                        if(node != null)
                        {
                            if(this.m_sortBlock == null)
                            {
                                let block:RPOBlock = this.m_blockList[node.index];
                                block.removeNode(node);
                            }
                            else
                            {
                                this.m_sortBlock.removeNode(node);
                            }

                            this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.m_rpIndex, -1);
                            
                            --this.m_nodesLen;

                            let runit:RPOUnit = node.unit;
                            if(this.m_rpoNodeBuilder.restore(node))
                            {
                                this.m_rpoUnitBuilder.restore(runit);
                            }
                            this.m_vtxResource.__$detachRes(disp.vbuf.getUid());
                            disp.__$$runit = null;
                            disp.__$ruid = -1;
                        }
                        else
                        {
                            console.error("There is no this display instance.");
                        }
                    }
                }
            }
            /**
             * remoev display unit from this render process
             */
            removeDispUnit(disp:IRODisplay):void
            {
                if(disp != null)
                {
                    if(disp.__$ruid > -1)
                    {
                        let nodeUId:number = disp.__$$runit.getRPOUid();
                        let node:RPONode = this.m_rpoNodeBuilder.getNodeByUid( nodeUId ) as RPONode;
                        if(node != null)
                        {
                            if(this.m_sortBlock == null)
                            {
                                let block:RPOBlock = this.m_blockList[node.index];
                                block.removeNode(node);
                            }
                            else
                            {
                                this.m_sortBlock.removeNode(node);
                            }
                            this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.m_rpIndex, -1);
                            node.unit.__$rprouid = -1;
                            --this.m_nodesLen;
                            this.m_rpoNodeBuilder.restore(node);
                        }
                    }
                }
            }

            run():void
            {
                if(this.m_enabled && this.m_nodesLen > 0)
                {
                    let rc:RenderProxy = this.m_rc;
                    if(this.m_sortBlock == null)
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
                    else
                    {
                        if(this.m_shader.isUnLocked())
                        {
                            this.m_sortBlock.run(rc);
                        }
                        else
                        {
                            this.m_sortBlock.runLockMaterial(rc);
                        }
                    }
                }
            }
            drawDisp(disp:IRODisplay):void
            {
                if(disp != null)
                {
                    let unit:RPOUnit = disp.__$$runit as RPOUnit;
                    if(unit != null)
                    {
                        this.m_fixBlock.drawUnit(this.m_rc,unit,disp);
                    }
                }
            }
            drawLockMaterialByDisp(disp:IRODisplay,forceUpdateUniform:boolean):void
            {
                if(disp != null)
                {
                    let unit:RPOUnit = disp.__$$runit as RPOUnit;
                    if(unit != null)
                    {
                        this.m_fixBlock.drawLockMaterialByUnit(this.m_rc,unit,disp,forceUpdateUniform);
                    }
                }
            }
            reset():void
            {
                this.m_sortEnabled = false;
                this.m_nodesLen = 0;
                this.uid = -1;
                this.m_rpIndex = -1;
                this.m_rcuid = -1;
                this.m_rpIndex = -1;
                let i:number = 0;
                for(; i < this.m_blockListLen; ++i)
                {
                    this.m_blockList[i].reset();
                }
                this.m_blockListLen = 0;
                this.m_blockList = [];
                
                this.m_rpoNodeBuilder = null;
                this.m_rpoUnitBuilder = null;
                this.m_vtxResource = null;
                this.m_rc = null;
                if(this.m_sortBlock != null)
                {
                    this.m_sortBlock.clear();
                    this.m_sortBlock = null;
                }
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
                return "[RenderProcess(uid = "+this.m_rpIndex+")]";
            }
        }
    }
}