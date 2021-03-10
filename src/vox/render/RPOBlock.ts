/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 用于对 RPOBlock 进行必要的组织, 例如 合批或者按照 shader不同来分类, 以及依据其他机制分类等等
// 目前一个block内的所有node 所使用的shader program 是相同的

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as IVertexRenderObjT from "../../vox/render/IVertexRenderObj";
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPONodeT from "../../vox/render/RPONode";
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RPONodeBuilderT from "../../vox/render/RPONodeBuilder";
import * as RPONodeLinkerT from "../../vox/render/RPONodeLinker";
import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RenderShaderT from '../../vox/render/RenderShader';
import * as ROVertexResourceT from "../../vox/render/ROVertexResource";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import IVertexRenderObj = IVertexRenderObjT.vox.render.IVertexRenderObj;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPONode = RPONodeT.vox.render.RPONode;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RPONodeBuilder = RPONodeBuilderT.vox.render.RPONodeBuilder;
import RPONodeLinker = RPONodeLinkerT.vox.render.RPONodeLinker;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RenderColorMask = RODrawStateT.vox.render.RenderColorMask;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RenderShader = RenderShaderT.vox.render.RenderShader;
import ROVertexResource = ROVertexResourceT.vox.render.ROVertexResource;

export namespace vox
{
    export namespace render
    {
        export class RPOBlock
        {
            private static __s_uid:number = 0;
            private m_uid:number = -1;                          // 用于唯一记录运行时的自己(RPOBlock实例)唯一id
            private m_nodeLinker:RPONodeLinker = new RPONodeLinker();
            index:number = -1;                                  // 记录自身在 RenderProcess blocks数组中的序号
            shdUid:number = -1;                                 // 记录 material 对应的 shader program uid
            procuid:number = -1;
            
            batchEnabled:boolean = true;
            fixedState:boolean = true;
            runMode:number = 0;

            rpoNodeBuilder:RPONodeBuilder = null;
            rpoUnitBuilder:RPOUnitBuilder = null;
            vtxResource:ROVertexResource = null;
            private m_shader:RenderShader = null;
            constructor(shader:RenderShader)
            {
                this.m_shader = shader;
                this.m_uid = RPOBlock.__s_uid++;
            }
            showInfo():void
            {
                this.m_nodeLinker.showInfo();
            }
            addNode(node:RPONode):void
            {
                this.m_nodeLinker.addNodeAndSort(node);
            }
            rejoinNode(node:RPONode):void
            {
                if(this.m_nodeLinker.containsNode(node))
                {
                    this.m_nodeLinker.removeNodeAndSort(node);
                    this.m_nodeLinker.addNodeAndSort(node);
                }
            }
            removeNode(node:RPONode):void
            {
                this.m_nodeLinker.removeNodeAndSort(node);
            }
            isEmpty():boolean
            {
                return this.m_nodeLinker.getBegin() == null;
            }
            run(rc:RenderProxy):void
            {
                switch(this.runMode)
                {
                    case 2:
                        this.run2(rc);
                    break;
                    case 1:
                        this.run1(rc);
                    break;
                    case 0:
                        this.run0(rc);
                    break;
                    default:
                    break;
                }
            }
            private run0(rc:RenderProxy):void
            {
                let nextNode:RPONode = this.m_nodeLinker.getBegin();
                if(nextNode != null)
                {
                    this.m_shader.bindToGpu(this.shdUid);
                    this.m_shader.resetUniform();
                    let unit:RPOUnit = null;
                    while(nextNode != null)
                    {
                        if(nextNode.drawEnabled)
                        {
                            unit = nextNode.unit;
                            if(unit.drawEnabled)
                            {
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
                        nextNode = nextNode.next;
                    }
                }

            }
            private run1(rc:RenderProxy):void
            {
                let nextNode:RPONode = this.m_nodeLinker.getBegin();
                if(nextNode != null)
                {
                    this.m_shader.bindToGpu(this.shdUid);
                    this.m_shader.resetUniform();

                    let unit:RPOUnit = null;
                    let vtxTotal:number = 0;
                    let texTotal:number = 0;
                    let flagVBoo:boolean = false;
                    let flagTBoo:boolean = false;
                    while(nextNode != null)
                    {
                        if(vtxTotal > 0)
                        {
                            vtxTotal--;
                        }
                        else
                        {
                            vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI) - 1;
                            flagVBoo = true;
                        }
                        if(texTotal > 0)
                        {
                            texTotal--;
                        }
                        else
                        {
                            texTotal = this.m_nodeLinker.getTexTotalAt(nextNode.rtroI) - 1;
                            flagTBoo = true;
                        }
                        if(nextNode.drawEnabled)
                        {
                            unit = nextNode.unit;
                            if(unit.drawEnabled)
                            {
                                if(flagVBoo)
                                {
                                    nextNode.vro.run();
                                    flagVBoo = false;
                                }
                                if(flagTBoo)
                                {
                                    nextNode.tro.run();
                                    flagTBoo = false;
                                }
                                unit.run2(rc);
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
                        nextNode = nextNode.next;
                    }
                }
            }
            private run2(rc:RenderProxy):void
            {
                let nextNode:RPONode = this.m_nodeLinker.getBegin();
                if(nextNode != null)
                {
                    this.m_shader.bindToGpu(this.shdUid);

                    this.m_shader.resetUniform();

                    let unit:RPOUnit = null;
                    let vtxTotal:number = 0;
                    let texTotal:number = 0;
                    let flagVBoo:boolean = false;
                    let flagTBoo:boolean = false;
                    RenderStateObject.UseRenderState(nextNode.unit.renderState);
                    RenderColorMask.UseRenderState(nextNode.unit.rcolorMask);
                    while(nextNode != null)
                    {
                        if(vtxTotal > 0)
                        {
                            vtxTotal--;
                        }
                        else
                        {
                            vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI) - 1;
                            flagVBoo = true;
                        }
                        if(texTotal > 0)
                        {
                            texTotal--;
                        }
                        else
                        {
                            texTotal = this.m_nodeLinker.getTexTotalAt(nextNode.rtroI) - 1;
                            flagTBoo = true;
                        }
                        
                        if(nextNode.drawEnabled)
                        {
                            unit = nextNode.unit;
                            if(unit.drawEnabled)
                            {
                                if(flagVBoo)
                                {
                                    nextNode.vro.run();
                                    flagVBoo = false;
                                }
                                if(flagTBoo)
                                {
                                    nextNode.tro.run();
                                    flagTBoo = false;
                                }
                                if(unit.ubo != null)
                                {
                                    unit.ubo.run(rc);
                                }
                                this.m_shader.useTransUniform(unit.transUniform);
                                this.m_shader.useUniform(unit.uniform);
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
                        nextNode = nextNode.next;
                    }
                }
            }
            runLockMaterial(rc:RenderProxy):void
            {
                let nextNode:RPONode = this.m_nodeLinker.getBegin();
                if(nextNode != null)
                {
                    this.m_shader.bindToGpu(this.shdUid);                    
                    this.m_shader.resetUniform();

                    let unit:RPOUnit = null;
                    let flagVBoo:boolean = false;
                    if(this.batchEnabled)
                    {
                        let vtxTotal:number = 0;
                        
                        while(nextNode != null)
                        {
                            if(vtxTotal > 0)
                            {
                                vtxTotal--;
                            }
                            else
                            {
                                vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI) - 1;
                                flagVBoo = true;
                            }
                            unit = nextNode.unit;
                            if(nextNode.drawEnabled && unit.drawEnabled)
                            {
                                if(flagVBoo)
                                {
                                    nextNode.vro.run();
                                    flagVBoo = false;
                                }
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
                            nextNode = nextNode.next;
                        }
                    }
                    else
                    {
                        while(nextNode != null)
                        {
                            unit = nextNode.unit;
                            if(nextNode.drawEnabled && unit.drawEnabled)
                            {
                                unit.runLockMaterial();
                                if(unit.partTotal < 1)
                                {
                                    unit.drawThis(rc);
                                }
                                else
                                {
                                    unit.drawPart(rc);
                                }
                            }
                            nextNode = nextNode.next;
                        }
                    }
                }
            }
            // 在锁定material的时候,直接绘制单个unit
            drawUnit(rc:RenderProxy,unit:RPOUnit,disp:IRODisplay):void
            {
                if(unit.drawEnabled)
                {
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
            // 在锁定material的时候,直接绘制单个unit
            drawLockMaterialByUnit(rc:RenderProxy,unit:RPOUnit,disp:IRODisplay,forceUpdateUniform:boolean):void
            {
                if(unit.drawEnabled)
                {
                    if(forceUpdateUniform)
                    {
                        this.m_shader.resetUniform();
                    }
                    if(RendererDeviece.IsMobileWeb())
                    {
                        // 如果不这么做，vro和shader attributes没有完全匹配的时候可能在某些设备上会有问题(例如ip6s上无法正常绘制)
                        // 注意临时产生的 vro 对象的回收问题
                        let vro:IVertexRenderObj = this.vtxResource.getVROByResUid(disp.vbuf.getUid(), this.m_shader.getCurrentShd(), true);
                        vro.run();
                    }
                    else
                    {
                        unit.vro.run();
                    }
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
            reset():void
            {
                let nextNode:RPONode = this.m_nodeLinker.getBegin();
                let node:RPONode = null;
                if(nextNode != null)
                {
                    let runit:RPOUnit;
                    while(nextNode != null)
                    {
                        node = nextNode;
                        nextNode = nextNode.next;
                        this.rpoUnitBuilder.setRPNodeParam(node.__$ruid, this.procuid, -1);
                        node.reset();
                        
                        runit = node.unit;
                        if(this.rpoNodeBuilder.restore(node))
                        {
                            this.rpoUnitBuilder.restore(runit);
                        }
                    }
                }
                this.index = -1;
                this.shdUid = -1;
                this.procuid = -1;
                this.m_nodeLinker.clear();
                this.rpoNodeBuilder = null;
                this.rpoUnitBuilder = null;
                this.vtxResource = null;
            }
            destroy():void
            {
                this.reset();
            }
            getUid():number
            {
                return this.m_uid;
            }
            toString():string
            {
                return "[RPOBlock(uid = "+this.m_uid+", index = "+this.index+", shdUid = "+this.shdUid+")]";
            }
        }
    }
}