/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderConstT from "../../vox/render/RenderConst";
import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ShaderDataT from "../../vox/material/ShaderData";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as IRenderEntityT from "../../vox/entity/IRenderEntity";
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RODispBuilderT from "../../vox/render/RODispBuilder";

import * as RenderProcessT from "../../vox/render/RenderProcess";
import * as RenderProcessBuiderT from "../../vox/render/RenderProcessBuider";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";
import * as Entity3DNodeLinkerT from "../../vox/scene/Entity3DNodeLinker";

import DisplayRenderState = RenderConstT.vox.render.DisplayRenderState;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ShaderData = ShaderDataT.vox.material.ShaderData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import IRenderEntity = IRenderEntityT.vox.entity.IRenderEntity;
import RODispBuilder = RODispBuilderT.vox.render.RODispBuilder;
import RCRPObj = RPOUnitBuilderT.vox.render.RCRPObj;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;

import RenderProcess = RenderProcessT.vox.render.RenderProcess;
import RenderProcessBuider = RenderProcessBuiderT.vox.render.RenderProcessBuider;
import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;
import Entity3DNodeLinker = Entity3DNodeLinkerT.vox.scene.Entity3DNodeLinker;

export namespace vox
{
    export namespace scene
    {
        export class DispEntity3DManager
        {
            private m_nodeLinker:Entity3DNodeLinker = new Entity3DNodeLinker();
            private m_rpoUnitBuilder:RPOUnitBuilder = null;
            private m_processBuider:RenderProcessBuider = null;
            private m_waitList:IRenderEntity[] = [];
            private m_processUidList:number[] = [];
            private m_wuid:number = -1;            
            private m_dispBuilder:RODispBuilder = null;
            entityManaListener:any = null;
            constructor(__$wuid:number, dispBuilder:RODispBuilder, rpoUnitBuilder:RPOUnitBuilder, processBuider:RenderProcessBuider)
            {
                this.m_wuid = __$wuid;
                this.m_dispBuilder = dispBuilder;
                this.m_rpoUnitBuilder = rpoUnitBuilder;
                this.m_processBuider = processBuider;
            }

            isEmpty():boolean
            {
                return this.m_nodeLinker.isEmpty();
            }
            removeEntity(entity:IRenderEntity):void
            {
                if(entity.__$wuid == this.m_wuid && entity.__$weid > -1)
                {
                    let node:Entity3DNode = Entity3DNode.GetByUid(entity.__$weid);
                    if(node != null && entity == node.entity)
                    {
                        this.m_nodeLinker.removeNode(node);
                        // 从所有相关process中移除这个display
                        let display:IRODisplay = entity.getDisplay();
                        if(display != null && display.__$ruid > -1)
                        {
                            let puid:number = display.__$ruid;
                            let po:RCRPObj = this.m_rpoUnitBuilder.getRCRPObj(puid);
                            let list:Int16Array = po.rcids;
                            let len:number = RCRPObj.RenerProcessMaxTotal;
                            //console.log("list: "+list);
                            for(let i:number = 0; i < len; ++i)
                            {
                                if(list[i] > -1)
                                {
                                    //the value of list[i] is the uid of a node;
                                    this.m_rprocess = this.m_processBuider.getNodeByUid(i) as RenderProcess;
                                    this.m_rprocess.removeDisp(display);
                                }
                            }
                            if(po.count == 0)
                            {
                                //console.log("DispEntity3DManager::removeEntity(), remove a entity from all processes.");
                                if(display.__$$rsign != DisplayRenderState.LIVE_IN_WORLD)
                                {
                                    // error!!!
                                    console.log("DispEntity3DManager::removeEntity(), Error: display.__$$rsign != RODisplay.LIVE_IN_WORLD.");
                                }
                                display.__$$rsign = DisplayRenderState.NOT_IN_WORLD;
                                // 准备移除和当前 display 对应的 RPOUnit
                                this.m_rpoUnitBuilder.restoreByUid(puid);
                            }
                            else
                            {
                                console.log("Error: DispEntity3DManager::removeEntity(), remove a entity from all processes failed.");
                            }
                        }
                        Entity3DNode.Restore(node);
                    }
                    entity.__$wuid = -1;
                    entity.__$weid = -1;

                    if(this.entityManaListener != null)
                    {
                        this.entityManaListener.removeFromWorld(entity,this.m_wuid,-1);
                    }
                }
            }
            addEntity(rc:RenderProxy, entity:IRenderEntity, processUid:number,deferred:boolean = false):boolean
            {
                if(entity != null)
                {
                    let disp:IRODisplay = entity.getDisplay();
                    if(disp != null)
                    {
                        if(disp.__$$rsign == DisplayRenderState.LIVE_IN_WORLD)
                        {
                            if(!this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid,processUid))
                            {
                                //console.log("DispEntity3DManager::addEntity(), A, this display("+disp.__$ruid+") has existed in processid("+processUid+").");
                                return;
                            }                
                        }
                        if(deferred)
                        {
                            if(disp.__$$rsign == DisplayRenderState.NOT_IN_WORLD)
                            {
                                disp.__$$rsign = DisplayRenderState.GO_TO_WORLD;
                            }
                            //entity.update();
                            entity.__$weid = 999999;
                            entity.__$wuid = this.m_wuid;
                            this.m_waitList.push(entity);
                            this.m_processUidList.push(processUid);
                            //console.log("DispEntity3DManager::addEntity(), B, this display("+disp+") has existed in processid("+processUid+").");
                        }
                        else
                        {
                            // 检查数据完整性
                            if(this.testValidData(entity))
                            {
                                entity.update();
                                entity.__$wuid = this.m_wuid;
                                let node:Entity3DNode = Entity3DNode.Create();
                                node.entity = entity;
                                entity.__$weid = node.uid;
                                this.m_nodeLinker.addNode(node);
                                if(disp.__$$rsign == DisplayRenderState.NOT_IN_WORLD)
                                {
                                    disp.__$$rsign = DisplayRenderState.GO_TO_WORLD;
                                }
                                this.m_rprocess = this.m_processBuider.getNodeByUid(processUid) as RenderProcess;
                                //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
                                //this.m_rprocess.addDisp(rc, disp,false);
                                if(disp.__$ruid > -1)
                                {
                                    this.m_rprocess.addDisp(rc, disp,false);
                                }
                                else
                                {
                                    this.m_dispBuilder.addDispToProcess(rc, disp, this.m_rprocess.uid);
                                }
                                
                                if(this.entityManaListener != null)
                                {
                                    this.entityManaListener.addToWorld(entity,this.m_wuid,processUid);
                                }
                            }
                            else
                            {
                                //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
                                if(disp.__$$rsign == DisplayRenderState.NOT_IN_WORLD)
                                {
                                    disp.__$$rsign = DisplayRenderState.GO_TO_WORLD;
                                }
                                entity.__$weid = 999999;
                                this.m_waitList.push(entity);
                                this.m_processUidList.push(processUid);
                            }
                        }
                    }
                    else
                    {
                        entity.__$wuid = this.m_wuid;
                    }
                }
                return false;
            }
            private m_material:MaterialBase = null;
            private m_shdData:ShaderData = null;
            private m_rprocess:RenderProcess = null;
            testValidData(entity:IRenderEntity):boolean
            {
                this.m_material = entity.getMaterial();
                if(this.m_material != null && entity.getMesh() != null)
                {
                    this.m_shdData = this.m_material.getShaderData();
                    if(this.m_shdData != null)
                    {
                        if(this.m_shdData.haveTexture())
                        {
                            if(this.m_material.texDataEnabled())
                            {
                                return true;
                            }
                        }
                        else
                        {
                            return true;
                        }
                    }
                    else if(this.m_material.getCodeBuf() != null)
                    {
                        entity.activeDisplay();
                    }
                }
                return false;
            }
            update(rc:RenderProxy):void
            {
                let len:number = this.m_waitList.length;
                let entity:IRenderEntity = null;
                let node:Entity3DNode = null;
                let disp:IRODisplay = null;
                for(let i:number = 0; i < len; ++i)
                {
                    entity = this.m_waitList[i];
                    if(entity.__$weid == 999999)
                    {
                        if(this.testValidData(entity))
                        {
                            disp = entity.getDisplay();
                            if(disp.__$$rsign == DisplayRenderState.LIVE_IN_WORLD)
                            {
                                if(!this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid,this.m_processUidList[i]))
                                {
                                    //console.log("DispEntity3DManager::update(), this display("+disp.__$ruid+") has existed in processid("+m_processUidList[i]+").");
                                    this.m_waitList.splice(i,1);
                                    this.m_processUidList.splice(i,1);
                                    --len;
                                    --i;
                                    continue;
                                }
                            }
                            entity.update();
                            entity.__$wuid = this.m_wuid;
                            node = Entity3DNode.Create();
                            node.entity = entity;
                            entity.__$weid = node.uid;
                            this.m_nodeLinker.addNode(node);
                            
                            let prouid = this.m_processUidList[i];
                            this.m_rprocess = this.m_processBuider.getNodeByUid(prouid) as RenderProcess;
                            //console.log("DispEntity3DManager::update(), add a ready ok entity("+entity+") to processid("+prouid+")");
                            if(disp.__$ruid > -1)
                            {
                                this.m_rprocess.addDisp(rc, disp,false);
                            }
                            else
                            {
                                this.m_dispBuilder.addDispToProcess(rc, disp, this.m_rprocess.uid);
                            }
                            
                            this.m_waitList.splice(i,1);
                            this.m_processUidList.splice(i,1);
                            --len;
                            --i;
                            if(this.entityManaListener != null)
                            {
                                this.entityManaListener.addToWorld(entity,this.m_wuid,prouid);
                            }
                        }
                    }
                    else
                    {
                        disp = entity.getDisplay();
                        if(disp != null && disp.__$$rsign == DisplayRenderState.GO_TO_WORLD)
                        {
                            disp.__$$rsign = DisplayRenderState.NOT_IN_WORLD;
                        }
                        console.log("DispEntity3DManager::update(), remove a ready entity.");
                        entity.__$weid = -1;
                        entity.__$wuid = -1;
                        this.m_waitList.splice(i,1);
                        this.m_processUidList.splice(i,1);
                        --len;
                        --i;
                        if(this.entityManaListener != null)
                        {
                            this.entityManaListener.removeFromWorld(entity,this.m_wuid,-1);
                        }
                    }
                }                
                this.m_dispBuilder.update(rc);
            }    
        }
    }
}